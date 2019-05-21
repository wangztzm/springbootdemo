package com.ming.demo;

import com.ming.demo.modules.user.entity.UserLogin;
import com.ming.demo.modules.user.service.UserService;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

public class MyRealm extends AuthorizingRealm {

    @Autowired
    private UserService userService;

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        UsernamePasswordToken upToken = (UsernamePasswordToken) token;
        String userMame = upToken.getUsername();

        if (userMame == null) {
            throw new AccountException("Null usernames are not allowed by this realm.");
        }

        UserLogin user = userService.findUserByName(userMame);


        if (user == null) {
            throw new UnknownAccountException("No account found for admin [" + userMame + "]");
        }

        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(user, user.getCurrentPassword(), getName());
        String salt = this.getSaltForUser(user.getUserLoginId());
        if (salt != null) {
            info.setCredentialsSalt(ByteSource.Util.bytes(salt));
        }

        return info;
    }

    @Override
    public AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        if (principals == null) {
            throw new AuthorizationException("PrincipalCollection method argument cannot be null.");
        }

        UserLogin user = (UserLogin) getAvailablePrincipal(principals);

        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        return info;
    }

    protected String getSaltForUser(String username) {
        return username;
    }

}
