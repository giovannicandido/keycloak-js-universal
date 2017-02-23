import { LoginOptions, LogoutOptions } from "./interfaces"
export interface Adapter {
    redirectUri(uri: string, encodeHash?: boolean): string
    login(options?: LoginOptions)
    logout(options?: LogoutOptions)
    register(options?: LoginOptions)
    accountManagement()
}
export class BrowserAdapter implements Adapter {
    redirectUri(uri: string, encodeHash = true): string {
        if(uri) {
            return uri
        }
        var redirectUri = location.href;
        if (location.hash && encodeHash) {
            redirectUri = redirectUri.substring(0, location.href.indexOf('#'));
            redirectUri += (redirectUri.indexOf('?') == -1 ? '?' : '&') + 'redirect_fragment=' + encodeURIComponent(location.hash.substring(1));
        }
        return redirectUri;
    }
    // TODO test and login logic
    login(options?: LoginOptions) {

    }
    logout(options?: LogoutOptions) {}
    register(options?: LoginOptions) {}
    accountManagement(){}

}

export class NativescriptAdapter extends BrowserAdapter {

}
