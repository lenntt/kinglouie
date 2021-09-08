import { expect } from "chai"
import { Input } from '../../src/model/Labels'
import { Trace } from '../../src/model/Trace'

describe('Trace', () => {
    it('is empty intially', () => {
        expect((new Trace()).size).to.equal(0)
    })

    describe('when adding actions and observations', () => {
        it('the size represents the number of actions done', () => {
            const trace = new Trace()
            trace.do(new Input('stimulus'))
            trace.fail(['error'])
            trace.do(new Input('stimulus2'))

            expect(trace.size).to.equal(2)
        })

        it('converts to a model (with one state, if there are no observations)', () => {
            const trace = new Trace()
            trace.do(new Input('stimulus'))
            trace.observe({})
            trace.fail([])
            trace.do(new Input('stimulus2'))
            trace.do(new Input('stimulus2'))

            expect(trace.model.transitions).to.have.lengthOf(2)
            expect(trace.model.states).to.have.lengthOf(1)
            expect(trace.model.inputs).to.have.lengthOf(2)
        })
    })
})
