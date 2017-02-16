export interface Adapter {
    redirectUri(uri: string, encodeHash?: boolean): string
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
}

export class NativescriptAdapter extends BrowserAdapter {

}
