package com.tang.framework.security.authentication.email;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import com.tang.commons.constants.LoginType;
import com.tang.commons.core.model.UserModel;
import com.tang.framework.web.service.AuthenticationService;
import com.tang.system.service.SysUserService;

/**
 * 邮箱密码身份验证
 *
 * @author Tang
 */
@Component
public class EmailAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private SysUserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (!supports(authentication.getClass())) {
            return null;
        }
        var authenticationToken = (EmailAuthenticationToken) authentication;
        var email = authenticationToken.getPrincipal().toString();
        var password = authenticationToken.getCredentials().toString();

        var user = userService.selectUserByEmail(email);

        UserModel userModel = authenticationService.createUserModel(user, password, LoginType.EMAIL);

        authenticationToken = new EmailAuthenticationToken(userModel, Collections.emptyList());

        return authenticationToken;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return EmailAuthenticationToken.class.isAssignableFrom(authentication);
    }

}
