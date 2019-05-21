package com.ming.demo.modules.user.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

public class UserLogin implements Serializable {
    private String userLoginId;

    private String currentPassword;

    private String passwordHint;

    private String isSystem;

    private String enabled;

    private String hasLoggedOut;

    private String requirePasswordChange;

    private String lastCurrencyUom;

    private String lastLocale;

    private String lastTimeZone;

    private Date disabledDateTime;

    private BigDecimal successiveFailedLogins;

    private String externalAuthId;

    private String userLdapDn;

    private String disabledBy;

    private Date lastUpdatedStamp;

    private Date lastUpdatedTxStamp;

    private Date createdStamp;

    private Date createdTxStamp;

    private String partyId;

    private static final long serialVersionUID = 1L;

    public String getUserLoginId() {
        return userLoginId;
    }

    public void setUserLoginId(String userLoginId) {
        this.userLoginId = userLoginId;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getPasswordHint() {
        return passwordHint;
    }

    public void setPasswordHint(String passwordHint) {
        this.passwordHint = passwordHint;
    }

    public String getIsSystem() {
        return isSystem;
    }

    public void setIsSystem(String isSystem) {
        this.isSystem = isSystem;
    }

    public String getEnabled() {
        return enabled;
    }

    public void setEnabled(String enabled) {
        this.enabled = enabled;
    }

    public String getHasLoggedOut() {
        return hasLoggedOut;
    }

    public void setHasLoggedOut(String hasLoggedOut) {
        this.hasLoggedOut = hasLoggedOut;
    }

    public String getRequirePasswordChange() {
        return requirePasswordChange;
    }

    public void setRequirePasswordChange(String requirePasswordChange) {
        this.requirePasswordChange = requirePasswordChange;
    }

    public String getLastCurrencyUom() {
        return lastCurrencyUom;
    }

    public void setLastCurrencyUom(String lastCurrencyUom) {
        this.lastCurrencyUom = lastCurrencyUom;
    }

    public String getLastLocale() {
        return lastLocale;
    }

    public void setLastLocale(String lastLocale) {
        this.lastLocale = lastLocale;
    }

    public String getLastTimeZone() {
        return lastTimeZone;
    }

    public void setLastTimeZone(String lastTimeZone) {
        this.lastTimeZone = lastTimeZone;
    }

    public Date getDisabledDateTime() {
        return disabledDateTime;
    }

    public void setDisabledDateTime(Date disabledDateTime) {
        this.disabledDateTime = disabledDateTime;
    }

    public BigDecimal getSuccessiveFailedLogins() {
        return successiveFailedLogins;
    }

    public void setSuccessiveFailedLogins(BigDecimal successiveFailedLogins) {
        this.successiveFailedLogins = successiveFailedLogins;
    }

    public String getExternalAuthId() {
        return externalAuthId;
    }

    public void setExternalAuthId(String externalAuthId) {
        this.externalAuthId = externalAuthId;
    }

    public String getUserLdapDn() {
        return userLdapDn;
    }

    public void setUserLdapDn(String userLdapDn) {
        this.userLdapDn = userLdapDn;
    }

    public String getDisabledBy() {
        return disabledBy;
    }

    public void setDisabledBy(String disabledBy) {
        this.disabledBy = disabledBy;
    }

    public Date getLastUpdatedStamp() {
        return lastUpdatedStamp;
    }

    public void setLastUpdatedStamp(Date lastUpdatedStamp) {
        this.lastUpdatedStamp = lastUpdatedStamp;
    }

    public Date getLastUpdatedTxStamp() {
        return lastUpdatedTxStamp;
    }

    public void setLastUpdatedTxStamp(Date lastUpdatedTxStamp) {
        this.lastUpdatedTxStamp = lastUpdatedTxStamp;
    }

    public Date getCreatedStamp() {
        return createdStamp;
    }

    public void setCreatedStamp(Date createdStamp) {
        this.createdStamp = createdStamp;
    }

    public Date getCreatedTxStamp() {
        return createdTxStamp;
    }

    public void setCreatedTxStamp(Date createdTxStamp) {
        this.createdTxStamp = createdTxStamp;
    }

    public String getPartyId() {
        return partyId;
    }

    public void setPartyId(String partyId) {
        this.partyId = partyId;
    }
}