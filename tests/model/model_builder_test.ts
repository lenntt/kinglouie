import { expect } from "chai"
import { Trace } from '../../src/model/Trace'
import { ModelBuilder } from '../../src/model/ModelBuilder'
import { Input } from '../../src/model/Labels'

describe('ModelBuilder', () => {
    describe('combining traces into one model', () => {
        it('merges two empty traces, into an empty model', () => {
            const trace1 = new Trace()
            const trace2 = new Trace()

            const model = ModelBuilder.fromTraces([trace1, trace2])
            expect(model.transitions).to.have.lengthOf(0)
            expect(model.states).to.have.lengthOf(1)
            expect(model.inputs).to.have.lengthOf(0)
        })

        describe('with no meta data', () => {
            it('merges two identical traces', () => {
                const trace1 = new Trace()
                const trace2 = new Trace()

                trace1.do(new Input('foo'))
                trace2.do(new Input('foo'))

                const model = ModelBuilder.fromTraces([trace1, trace2])
                expect(model.transitions).to.have.lengthOf(1)
                expect(model.states).to.have.lengthOf(1)
                expect(model.inputs).to.have.lengthOf(1)
            })

            it('does not merge states with different inputs and metadata', () => {
                const trace1 = new Trace()
                const trace2 = new Trace()

                trace1.observe({meta: 'bazstate'})
                trace2.observe({meta: 'bazstate'})

                trace1.do(new Input('foo'))
                trace2.do(new Input('bar'))

                trace1.observe({meta: 'foostate'})
                trace2.observe({meta: 'barstate'})

                const model = ModelBuilder.fromTraces([trace1, trace2])
                expect(model.transitions).to.have.lengthOf(2)
                expect(model.states).to.have.lengthOf(3)
                expect(model.inputs).to.have.lengthOf(2)
            })

            it('detects loops when all meta data is the same and rolls up the trace', () => {
                const trace1 = new Trace()
                // No observations, no meta data, no unique states
                trace1.do(new Input('foo'))
                const model = ModelBuilder.fromTraces([trace1])
                expect(model.states).to.have.lengthOf(1)

            })

            it('always merges the initial states of traces (even if metadata isnt the same)', () => {
                const trace1 = new Trace()
                const trace2 = new Trace()

                trace1.observe({meta: 'bazstate'})
                trace2.observe({meta: 'barstate'})

                trace1.do(new Input('foo'))
                trace2.do(new Input('bar'))

                trace1.observe({meta: 'foostate'})
                trace2.observe({meta: 'foostate'})

                const model = ModelBuilder.fromTraces([trace1, trace2])
                expect(model.transitions).to.have.lengthOf(2)
                expect(model.states).to.have.lengthOf(2)
                expect(model.getTransitionsOut(model.initialState)).to.have.lengthOf(2)
                expect(model.initialState.meta.meta).to.equal('bazstate')
            })
        })
    })
})



