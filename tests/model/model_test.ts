import { expect } from "chai"
import { Model } from '../../src/model/Model'
import { State } from '../../src/model/State'
import { Input } from "../../src/model/Labels"
import { Transition } from '../../src/model/Transition'

describe('Model (Input Output Labeled Transition System)', () => {
    describe('when empty', () => {
        let initialState:State
        let model:Model
        beforeEach(() => {
            initialState = new State('initial')
            model = new Model(initialState)
        })

        it('has only an initial state, but no other inputs or transitions', () => {
            expect(model.initialState).to.equal(initialState)
            expect(model.states).to.eql([initialState])
            expect(model.inputs).to.be.empty
            expect(model.transitions).to.be.empty
        })

        it('can add inputs', () => {
            const input = new Input('input')
            model.addInput(input)

            expect(model.inputs).to.eql([input])
        })

        describe('adding transitions', () => {
            it('can add transitions', () => {
                const transition = new Transition(initialState, initialState, new Input('input'))
                model.addTransition(transition)

                expect(model.transitions).to.eql([transition])
            })

            it('adds the states and labels from the transitions', () => {
                const input = new Input('input')
                const state1 = new State('state1', {foo: 'bar'})
                const transition = new Transition(initialState, state1, input)
                model.addTransition(transition)

                expect(model.states).to.eql([initialState, state1])
                expect(model.inputs).to.eql([input])
            })

            it('does not add the same transition twice (neither the labels or states)', () => {
                const input = new Input('input')
                const state1 = new State('state1', {foo: 'bar'})
                const transition = new Transition(initialState, state1, input)
                model.addTransition(transition)
                model.addTransition(transition)

                expect(model.transitions).to.have.lengthOf(1)
                expect(model.states).to.eql([initialState, state1])
                expect(model.inputs).to.eql([input])
            })

            it('does not add duplicate states or labels (by similar appearance)', () => {
                const input = new Input('input')
                const state1 = new State('state1', {foo: 'bar'})
                model.addTransition(new Transition(initialState, state1, input))
                model.addTransition(new Transition(initialState, new State(state1.name, state1.meta), new Input(input.name)))

                expect(model.transitions).to.have.lengthOf(1)
                expect(model.states).to.eql([initialState, state1])
                expect(model.inputs).to.eql([input])
            })

            it('throws when start state is not known to model', () => {
                const input = new Input('input')
                const state1 = new State('state1', {foo: 'bar'})
                expect(() => {
                    model.addTransition(new Transition(state1, state1, input))
                }).to.throw('from state must be in model')
            })
        })
    })

    describe('converting to DOT', () => {
        describe('an empty model', () => {
            it('results in a digraph with just the start state', () => {
                const initialState = new State('initial')
                const model = new Model(initialState)
                const dot = model.toDot()

                // somewhat rough, I TDD-d this visually
                expect(dot.split("\n").map((line) => {return line.trim()})).to.eql([
                    'digraph {',
                    '"_initialState" [style="invisible"]',
                    '"initial" [label=<<BR/>> fontcolor=blue]',
                    '"_initialState" -> "initial"',
                    '',
                    "}"
                ])
            })

            it('sanitizes strings for dot', () => {
                const initialState = new State('initial')
                const model = new Model(initialState)
                const input = new Input('dont do <img> "tag" and\n\'stuff\'')
                model.addTransition(new Transition(initialState, initialState, input))

                const dot = model.toDot()
                expect(dot).to.have.string('dont do [img] \\"tag\\" and, \\\'stuff\\\'')
            })
        })
    })
})
