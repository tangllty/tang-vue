package com.tang.framework.security.expression;

import org.springframework.stereotype.Component;

import com.tang.commons.utils.SecurityUtils;

/**
 * 认证表达式
 *
 * @author Tang
 */
@Component("auth")
public class AuthenticationExpression {

    /**
     * 验证用户是否有该角色
     *
     * @param role 角色
     * @return 结果
     */
    public boolean hasRole(String role) {
        return hasAnyRole(role);
    }

    /**
     * 验证用户是否有任意角色
     *
     * @param roles 角色列表
     * @return 结果
     */
    public boolean hasAnyRole(String... roles) {
        if (SecurityUtils.isAdmin()) {
            return true;
        }
        var roleSet = SecurityUtils.getRoles();
        for (String role : roles) {
            if (roleSet.contains(role)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 验证用户是否有该权限
     *
     * @param permission 权限
     * @return 结果
     */
    public boolean hasPermission(String permission) {
        return hasAnyPermission(permission);
    }

    /**
     * 验证用户是否有任意权限
     *
     * @param permissions 权限列表
     * @return 结果
     */
    public boolean hasAnyPermission(String... permissions) {
        if (SecurityUtils.isAdmin()) {
            return true;
        }
        var permissionSet = SecurityUtils.getPermissions();
        for (String permission : permissions) {
            if (permissionSet.contains(permission)) {
                return true;
            }
        }
        return false;
    }

}
