import { expect, use } from 'chai'
// import { stub } from 'sinon'
import * as sinonChai from 'sinon-chai'
import { BrowserAdapter } from "../src/adapters"

use(sinonChai)

declare var global;

describe('browser-adapter', function () {
    it('should create redirectUri', function () {
        const adapter = new BrowserAdapter()
        expect(adapter.redirectUri("http://localhost:8080")).to.equal('http://localhost:8080')
    })
    it('should figure out the redirectUri from browser location', function () {
        const adapter = new BrowserAdapter()
        let location = {
            href: 'http://test'
        }
        // NodeJs test fake workaround
        global.location = location
        expect(adapter.redirectUri(null)).to.equal(location.href)
    })

    it('should encode hash in redirectUri', function() {
        const adapter = new BrowserAdapter()
        let location = {
            href: 'http://test#bla',
            hash: '#bla'
        }
        // NodeJs test fake workaround
        global.location = location
        expect(adapter.redirectUri(null)).to.equal('http://test?redirect_fragment=bla')
    })
})
