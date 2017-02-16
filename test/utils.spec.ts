import { expect } from 'chai'
import * as utils from '../src/utils'


describe('utils', () => {
    describe('validateAndParseMode', () => {
        it('should return default fragment', () => {
            expect(utils.validateAndParseMode(null)).to.equal('fragment')
        })
        it('should return the valid value', () => {
            expect(utils.validateAndParseMode('fragment')).to.equal('fragment')
            expect(utils.validateAndParseMode('query')).to.equal('query')
        })
        it('should throw if invalid mode is passed', () => {
            expect(() => utils.validateAndParseMode('invalid')).to.throw('Invalid response mode')
        })
    })

    describe('validateAndParseFlow', function () {
        it('should return default flow', function () {
            expect(utils.validateAndParseFlow(null)).to.equal('standard')
        })
        it('should return a valid flow', function () {
            expect(utils.validateAndParseFlow('implicit')).to.equal('implicit')
            expect(utils.validateAndParseFlow('hybrid')).to.equal('hybrid')
        })
        it('should throw if invalid flow is passed', () => {
            expect(() => utils.validateAndParseFlow('invalid')).to.throw('Invalid value for flow')
        })
    })

    describe('flowToResponseType', function () {
        it('should parse standard type', function () {
            expect(utils.flowToResponseType('standard')).to.equal('code')
        })
        it('should parse implicit type', function () {
            expect(utils.flowToResponseType('implicit')).to.equal('id_token token')
        })
        it('should parse hybrid type', function () {
            expect(utils.flowToResponseType('hybrid')).to.equal('code id_token token')
        })
        it('should throw if invalid flow is passed', () => {
            expect(() => utils.flowToResponseType('invalid')).to.throw('Invalid value for flow')
        })
    })
})
