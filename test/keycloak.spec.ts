import { expect, use } from 'chai'
import { stub } from 'sinon'
import * as sinonChai from 'sinon-chai'

use(sinonChai)

import { Keycloak } from '../src/keycloak'
import { InitOptions, LoginOptions, LogoutOptions } from "../src/interfaces"
import { BrowserAdapter } from "../src/adapters"


describe('Keycloak', () => {
    const initOptions: InitOptions = <InitOptions> {
        url: 'http://localhost:8990',
        clientId: 'test',
        realm: 'master',
        redirectUri: 'http://localhost'
    }


    describe('createLoginUrl', function () {
        it('should use redirect_uri from initOption', function () {
            const browserAdapter = new BrowserAdapter()

            let mock = stub(browserAdapter, 'redirectUri').returns("http://browser")

            const keycloak1 = new Keycloak(initOptions, browserAdapter)
            keycloak1.createLoginUrl()

            expect(mock).to.have.been.calledWith(initOptions.redirectUri)

        })

        it('should use redirect_uri from LoginOptions if provided', function () {
            const loginOptions: LoginOptions = {
                redirectUri: 'https://localhost'
            }
            const browserAdapter = new BrowserAdapter()

            let mock = stub(browserAdapter, 'redirectUri').returns("http://browser")

            const keycloak1 = new Keycloak(initOptions, browserAdapter)
            keycloak1.createLoginUrl(loginOptions)

            expect(mock).to.have.been.calledWith(loginOptions.redirectUri)

        })

        it('should create url without loginOptions', () => {
            let adapter = new BrowserAdapter()
            let redirectUri = encodeURIComponent(adapter.redirectUri(initOptions.redirectUri))

            const keycloak = new Keycloak(initOptions)
            stub(keycloak, 'createUUID').returns('bla')

            keycloak.init()

            let url = `http://localhost:8990/realms/master/protocol/openid-connect/` +
                `auth?client_id=test&redirect_uri=${redirectUri}` +
                `&state=bla&nonce=bla&response_mode=fragment&response_type=code&scope=openid`

            expect(keycloak.createLoginUrl()).to.equal(url)
        })


        it('should createLoginUrl with LoginOptions', function () {
            const loginOptions: LoginOptions = {
                redirectUri: "http://localhost"
            }

            const keycloak = new Keycloak(initOptions)
            stub(keycloak, 'createUUID').returns('bla')

            keycloak.init()
            let adapter = new BrowserAdapter()

            let redirectUri = encodeURIComponent(adapter.redirectUri(loginOptions.redirectUri))

            let url = `http://localhost:8990/realms/master/protocol/openid-connect/` +
                `auth?client_id=test&redirect_uri=${redirectUri}` +
                `&state=bla&nonce=bla&response_mode=fragment&response_type=code&scope=openid`

            expect(keycloak.createLoginUrl(loginOptions)).to.equal(url)

        })

        it('should createLogoutUrl', function () {
            const keycloak = new Keycloak(initOptions)
            let adapter = new BrowserAdapter()
            let redirectUri = encodeURIComponent(adapter.redirectUri(initOptions.redirectUri))
            const url = `http://localhost:8990/realms/master/protocol/openid-connect/` +
                `logout?redirect_uri=${redirectUri}`
            expect(keycloak.createLogoutUrl()).to.equal(url)
        })

        it('should createLogoutUrl with LogoutOptions', function () {
            const keycloak = new Keycloak(initOptions)
            const logoutOptions: LogoutOptions = {
                redirectUri: "http://localhost/newredirect"
            }
            let adapter = new BrowserAdapter()
            let redirectUri = encodeURIComponent(adapter.redirectUri(logoutOptions.redirectUri))
            const url = `http://localhost:8990/realms/master/protocol/openid-connect/` +
                `logout?redirect_uri=${redirectUri}`
            expect(keycloak.createLogoutUrl(logoutOptions)).to.equal(url)
        })
    })

    it('should override options with init', function () {
        const newOptions: InitOptions = <InitOptions>{
            url: 'https://localhost',
            clientId: 'test',
            realm: 'master'
        }
        newOptions.url = 'https://localhost'

        const keycloak = new Keycloak(initOptions)
        let initImplSpy = stub(keycloak, 'initImpl')

        keycloak.init(newOptions)
        expect(initImplSpy).to.have.been.calledWith(newOptions)
    })

    it('should getRealmUrl', function () {
        const keycloak = new Keycloak(initOptions)
        expect(keycloak.getRealmUrl()).to.equal("http://localhost:8990/realms/master")
    })

    it('should strip / from getRealmUrl ', function () {
        const options: InitOptions = <InitOptions> {
            url: 'http://localhost:8990/',
            clientId: 'test',
            realm: 'master',
        }
        const keycloak = new Keycloak(options)
        expect(keycloak.getRealmUrl()).to.equal("http://localhost:8990/realms/master")
    })

})
