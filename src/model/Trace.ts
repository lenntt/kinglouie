import { Input } from './Labels'
import { Model } from './Model'
import { State } from './State'
import { Transition } from './Transition'

export class Trace {
    private _model:Model
    private _currentState:State

    get size():number {
        return this._model.transitions.length
    }

    get model():Model {
        return this._model
    }

    constructor() {
        this._currentState = State.generate()
        this._model = new Model(this._currentState)
    }

    do(input:Input):void {
        const newState = State.generate()
        const transition = this._model.addTransition(new Transition(this._currentState, newState, input))
        this._currentState = transition.to
    }

    observe(meta:Record<string, unknown>):void {
        this._currentState.addMeta(meta)
    }

    fail(errors:Array<string>):void {
        this._currentState.addErrors(errors)
    }
}
