package com.tang.framework.web.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.tang.commons.core.autoconfigure.TokenProperties;
import com.tang.commons.core.model.UserModel;
import com.tang.commons.utils.IdUtils;
import com.tang.commons.utils.IpUtils;
import com.tang.commons.utils.RedisUtils;
import com.tang.commons.utils.ServletUtils;

import cn.hutool.http.useragent.UserAgent;
import cn.hutool.http.useragent.UserAgentUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

/**
 * token 验证处理
 *
 * @author Tang
 */
@Component
public class TokenService {

    private static final String LOGIN_USER_KEY = "login_user_key";

    private static final String LOGIN_TOKEN_KEY = "login_tokens:";

    public static final String TOKEN_PREFIX = "Bearer ";

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private TokenProperties tokenProperties;

    /**
     * 获取登陆用户身份信息
     *
     * @param request request
     * @return 登陆用户信息
     */
    public UserModel get(@NonNull HttpServletRequest request) {
        // 获取请求携带的令牌
        String token = getToken(request);
        if (StringUtils.isNotEmpty(token)) {
            Claims claims = parseToken(token);
            // 解析对应的权限以及登陆用户信息
            String uuid = (String) claims.get(LOGIN_USER_KEY);
            String userKey = getTokenKey(uuid);
            Object userModel = redisUtils.get(userKey);
            return (UserModel) userModel;
        }
        return null;
    }

    /**
     * 删除登陆用户身份信息
     *
     * @param token 令牌
     */
    public void delete(String token) {
        if (StringUtils.isNotEmpty(token)) {
            String userKey = getTokenKey(token);
            redisUtils.delete(userKey);
        }
    }

    /**
     * 创建令牌
     *
     * @param userModel 登陆用户信息
     * @return 令牌
     */
    public String createToken(UserModel userModel) {
        String token = IdUtils.getUUID();
        userModel.setToken(token);
        setUserAgent(userModel);
        set(userModel);
        Map<String, Object> claims = new HashMap<>(16);
        claims.put(LOGIN_USER_KEY, token);
        return createToken(claims);
    }

    /**
     * 设置登陆用户身份信息
     *
     * @param userModel 登陆用户信息
     */
    public void set(UserModel userModel) {
        if (userModel != null && StringUtils.isNotEmpty(userModel.getToken())) {
            refreshToken(userModel);
        }
    }

    /**
     * 验证令牌有效期
     *
     * @param userModel 登陆用户信息
     */
    public void verifyToken(UserModel userModel) {
        refreshToken(userModel);
    }

    /**
     * 刷新令牌有效期
     *
     * @param userModel 登陆用户信息
     */
    public void refreshToken(UserModel userModel) {
        userModel.setExpireTime(new Date(System.currentTimeMillis() + tokenProperties.getExpireTimeLong()));
        // 缓存登陆信息
        String userKey = getTokenKey(userModel.getToken());
        redisUtils.set(userKey, userModel, tokenProperties.getExpireTime(), tokenProperties.getTimeUnit());
    }

    /**
     * 设置登陆用户代理信息
     *
     * @param userModel 登陆用户信息
     */
    public void setUserAgent(UserModel userModel) {
        UserAgent userAgent = UserAgentUtil.parse(ServletUtils.getRequest().getHeader("User-Agent"));
        userModel.setIp(IpUtils.getIpAddr(ServletUtils.getRequest()));
        userModel.setLocation(IpUtils.getCity(userModel.getIp()));
        userModel.setMobile(userAgent.isMobile());
        userModel.setBrowser(userAgent.getBrowser().getName());
        userModel.setVersion(userAgent.getVersion());
        userModel.setPlatform(userAgent.getPlatform().getName());
        userModel.setOs(userAgent.getOs().getName());
        userModel.setOsVersion(userAgent.getOsVersion());
        userModel.setEngine(userAgent.getEngine().getName());
        userModel.setEngineVersion(userAgent.getEngineVersion());
        userModel.setLoginTime(new Date(System.currentTimeMillis()));
    }

    /**
     * 从数据声明生成令牌
     *
     * @param claims 数据
     * @return 令牌
     */
    private String createToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .signWith(getSecretKey())
                .compact();
    }

    /**
     * 从令牌中获取数据声明
     *
     * @param token 令牌
     * @return 数据声明
     */
    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 生成密钥
     *
     * @return 密钥
     */
    private SecretKey getSecretKey() {
        byte[] secretBytes = Decoders.BASE64.decode(tokenProperties.getSecret());
        return Keys.hmacShaKeyFor(secretBytes);
    }

    /**
     * 获取请求token
     *
     * @param request request
     * @return 令牌
     */
    private String getToken(@NonNull HttpServletRequest request) {
        String token = request.getHeader(tokenProperties.getHeader());
        if (StringUtils.isNotEmpty(token) && token.startsWith(TOKEN_PREFIX)) {
            token = token.replace(TOKEN_PREFIX, "");
        }
        return token;
    }

    /**
     * 获取 redis 键
     *
     * @param uuid 唯一标识
     * @return 键
     */
    private String getTokenKey(String uuid) {
        return LOGIN_TOKEN_KEY + uuid;
    }

}
