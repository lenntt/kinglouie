import { expect } from "chai"
import { State } from '../../src/model/State'

describe('State', () => {
    it('has the given name', () => {
        const state = new State('name')
        expect(state.name).to.equal('name')
    })

    it('has initially no errors', () => {
        const state = new State('')
        expect(state.errors).to.be.empty
    })

    it('has initially empty meta', () => {
        const state = new State('')
        expect(state.meta).to.eql({})
    })

    describe('adding errors', () => {
        it('adds an error, only once', () => {
            const error = 'message'
            const state = new State('')

            state.addError(error)
            state.addError(error)
            expect(state.errors).to.eql([error])
        })
    })

    describe('adding meta', () => {
        it('merges with previous meta', () => {
            const state = new State('')
            state.addMeta({foo:3, bar: 2})
            state.addMeta({foo:4, baz: 'a'})
            expect(state.meta).to.eql({foo:4, bar:2, baz:'a'})
        })
    })

    describe('generating states', () => {
        it('has an underscore (_) as a prefix in their name', () => {
            const state = State.generate()
            expect(state.name).to.be.a('string').and.satisfy(msg => msg.startsWith('_'));
        })
    })

    describe('comparing states', () => {
        describe('isSimilarTo', () => {
            it('returns true if both states have empty meta', () => {
                const state1 = new State('')
                const state2 = new State('')
                expect(state1.isSimilarTo(state2)).to.be.true
            })

            it('returns true if meta is deeply equal', () => {
                const state1 = new State('', {foo: {bar: true}})
                const state2 = new State('', {foo: {bar: true}})
                expect(state1.isSimilarTo(state2)).to.be.true
            })

            it('returns false if meta is not deeply equal', () => {
                const state1 = new State('', {foo: {bar: false}})
                const state2 = new State('', {foo: {bar: true}})
                expect(state1.isSimilarTo(state2)).to.be.false
            })
        })
    })
})
