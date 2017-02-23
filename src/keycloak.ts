import { KeycloakType, InitOptions, LoginOptions, LogoutOptions } from "./interfaces";
import { Adapter, BrowserAdapter, NativescriptAdapter } from "./adapters"
import { flowToResponseType, validateAndParseMode, validateAndParseFlow } from "./utils"

export class Keycloak implements KeycloakType {
    token: string
    authenticated: boolean
    flow: string
    onAuthSuccess: () => void
    onReady: (authenticated) => void
    onAuthError: () => void
    onAuthRefreshSuccess: () => void
    onAuthRefreshError: () => void
    onAuthLogout: () => void
    onTokenExpired: () => void

    private loginRequired = false
    private responseType: string
    private responseMode: string

    constructor(private initOptions: InitOptions, private adapter: Adapter = null) {
        this.parseOptions(initOptions)
    }

    parseOptions(options: InitOptions) {
        this.authenticated = false
        if(this.adapter == null) {
            if (options.adapter === 'nativescript') {
                this.adapter = new NativescriptAdapter()
            } else { // Default adapter
                this.adapter = new BrowserAdapter()
            }
        }

        // if (typeof initOptions.checkLoginIframe !== 'undefined') {
        //     loginIframe.enable = initOptions.checkLoginIframe;
        // }
        //
        // if (initOptions.checkLoginIframeInterval) {
        //     loginIframe.interval = initOptions.checkLoginIframeInterval;
        // }

        if (options.onLoad === 'login-required') {
            this.loginRequired = true
        }
        this.flow = validateAndParseFlow(options.flow)
        this.responseType = flowToResponseType(this.flow)
        this.responseMode = validateAndParseMode(options.responseMode)
    }

    /**
     * Initialize Keycloak Auth Flow
     * @param options If options is not provided, the constructor options will be used instead
     * @returns {Promise<boolean>}
     */
    init(options?: InitOptions): Promise<boolean> {
        if (options) {
            return this.initImpl(options)
        } else {
            return this.initImpl(this.initOptions)
        }

    }

    private initImpl(options: InitOptions): Promise<boolean> {

        return Promise.reject('not implemented')
    }

    login(options?: LoginOptions) {
    }

    createLoginUrl(options?: LoginOptions) {
        let state = this.createUUID()
        let nonce = this.createUUID()
        let uri = null;
        if(options){
           uri = options.redirectUri
        }else {
            uri = this.initOptions.redirectUri
        }
        let redirectUri = this.adapter.redirectUri(uri)

        // let callbackState = {
        //     state: state,
        //     nonce: nonce,
        //     redirectUri: encodeURIComponent(redirectUri),
        //     prompt: null
        // }
        //
        // if (options && options.prompt) {
        //     callbackState.prompt = options.prompt;
        // }
        //
        // callbackStorage.add(callbackState);

        let action = 'auth';
        if (options && options.action === 'register') {
            action = 'registrations'
        }

        let scope = (options && options.scope) ? "openid " + options.scope : "openid"

        let url = this.getRealmUrl()
            + '/protocol/openid-connect/' + action
            + '?client_id=' + encodeURIComponent(this.initOptions.clientId)
            + '&redirect_uri=' + encodeURIComponent(redirectUri)
            + '&state=' + encodeURIComponent(state)
            + '&nonce=' + encodeURIComponent(nonce)
            + '&response_mode=' + encodeURIComponent(this.responseMode)
            + '&response_type=' + encodeURIComponent(this.responseType)
            + '&scope=' + encodeURIComponent(scope)

        if (options && options.prompt) {
            url += '&prompt=' + encodeURIComponent(options.prompt)
        }

        if (options && options.maxAge) {
            url += '&max_age=' + encodeURIComponent(options.maxAge.toString())
        }

        if (options && options.loginHint) {
            url += '&login_hint=' + encodeURIComponent(options.loginHint)
        }

        if (options && options.idpHint) {
            url += '&this_idp_hint=' + encodeURIComponent(options.idpHint)
        }

        if (options && options.locale) {
            url += '&ui_locales=' + encodeURIComponent(options.locale)
        }

        return url
    }

    createLogoutUrl(options?: LogoutOptions): string {
        let uri;
        if(options) {
            uri = options.redirectUri
        }else {
            uri = this.initOptions.redirectUri
        }
        const url = this.getRealmUrl()
            + '/protocol/openid-connect/logout'
            + '?redirect_uri=' + encodeURIComponent(this.adapter.redirectUri(uri, false));

        return url;
    }

    logout(options?: LogoutOptions) {
    }

    updateToken(minValue?: number): Promise<string> {
        return undefined
    }

    register(options?: LoginOptions) {
    }

    createRegisterUrl(options?: LoginOptions): string {
        if (!options) {
            options = this.initOptions;
        }
        options.action = 'register';
        return this.createLoginUrl(options);
    }

    accountManagement() {
    }

    createAccountUrl(): string {
        const url = this.getRealmUrl()
            + '/account'
            + '?referrer=' + encodeURIComponent(this.initOptions.clientId)
            + '&referrer_uri=' + encodeURIComponent(this.adapter.redirectUri(this.initOptions.redirectUri));

        return url;
    }

    hasRealmRole(role: string): boolean {
        return undefined
    }

    hasResourceRole(role: string, resource?: string): boolean {
        return undefined
    }

    loadUserProfile(): Promise<any> {
        return undefined
    }

    isTokenExpired(minValidity?: number): boolean {
        return undefined
    }

    clearToken() {
    }

    private createUUID() {
        let s = [];
        let hexDigits = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';
        let uuid = s.join('');
        return uuid;
    }

    getRealmUrl() {
        if (this.initOptions.url.charAt(this.initOptions.url.length - 1) === '/') {
            return this.initOptions.url + 'realms/' + encodeURIComponent(this.initOptions.realm)
        } else {
            return this.initOptions.url + '/realms/' + encodeURIComponent(this.initOptions.realm)
        }
    }

}
