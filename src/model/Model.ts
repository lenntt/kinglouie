import { State } from './State'
import { Input } from './Labels'
import { Transition } from './Transition'

export class Model {
    private _inputs: Array<Input> = []
    private _states: Array<State> = []
    private _transitions: Array<Transition> = []

    get inputs(): Array<Input> {
        return this._inputs
    }

    get states(): Array<State> {
        return this._states
    }

    get transitions(): Array<Transition> {
        return this._transitions
    }

    get initialState(): State {
        return this._states[0]
    }

    constructor(initialState: State) {
        this._states = [initialState]
    }

    addInput(input:Input):Input {
        const exists = this._inputs.find((i) => {return i.isSimilarTo(input)})
        if (!exists) {
            this._inputs.push(input)
            return input
        } else {
            return exists
        }
    }

    addState(state:State):State {
        const exists = this.lookupState(state)
        if (!exists) {
            this._states.push(state)
            return state
        } else {
            return exists
        }
    }

    private lookupState(state:State):State {
        return this._states.find((s) => {return s.isSimilarTo(state)})
    }

    getTransitionsOut(state:State):Transition[] {
        return this._transitions.filter((transition) => {
            return state === transition.from
        })
    }

    addTransition(transition:Transition, isInitial = false):Transition {
        const startState = isInitial ? this.initialState : this.lookupState(transition.from)
        if (!startState) {
            // meta data mismatch
            throw new Error('from state must be in model')
        }

        const input = this.addInput(transition.input)

        // Same input and start state, should result in same out (unless non-deterministic)
        // We assume determinism
        const existingTransition = this.getTransitionsOut(transition.from).find((out:Transition) => {
            return transition.input.isSimilarTo(out.input)
        })

        if (existingTransition) {
            existingTransition.mergeTo(transition.to)
            return existingTransition
        } else {
            const endState = this.addState(transition.to)
            const newTransition = new Transition(startState, endState, input)
            this._transitions.push(newTransition)
            return newTransition
        }
    }

    toDot():string {
        function sanitizeForDot(str) {
            return (str || "")
                .replace(/"/g, '\\"')
                .replace(/'/g, '\\\'')
                .replace(/\n/g, ', ')
                // .replaceAll('/', '\\/')
                .replace(/<(\w+)>/g, "[$1]");
        }

        const dotStates = this.states.map((state) => {
            const stateErrors = state.errors.map((error) => {
                return sanitizeForDot(error)
            })
            return `"${state.name}" [label=<<B>${sanitizeForDot(state.meta.url)}</B><BR/>${stateErrors.join("<BR/>")}> fontcolor=blue]`
        })
        const dotTransitions = this.transitions.map((transition) => {
            return `"${transition.from.name}" -> "${transition.to.name}" [label="${sanitizeForDot(transition.input.name)}"]`
        })
        return `digraph {
            "_initialState" [style="invisible"]
            ${dotStates.join("\n")}
            "_initialState" -> "${this.initialState.name}"
            ${dotTransitions.join("\n")}
        }`
    }
}
