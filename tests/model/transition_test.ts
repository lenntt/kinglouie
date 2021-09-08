import { expect } from "chai"
import { Transition } from '../../src/model/Transition'
import { Input } from '../../src/model/Labels'
import { State } from '../../src/model/State'

describe('Transition', () => {
    it('has a start state, a label and an end state', () => {
        const start = new State('start')
        const stop = new State('stop')
        const label = new Input('out')
        const transition = new Transition(start, stop, label)
        expect(transition.from).to.equal(start)
        expect(transition.to).to.equal(stop)
        expect(transition.input).to.equal(label)
    })
})
