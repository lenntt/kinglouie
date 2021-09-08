import { State } from "./State"
import { Input } from "./Labels"

type Guard = {
    [key: string] : unknown
}

export class Transition {
    private _start: State
    private _end: State
    private _label: Input

    get from():State {
        return this._start
    }

    get to():State {
        return this._end
    }

    get input():Input {
        return this._label
    }

    constructor(from:State, to:State, input:Input) {
        this._start = from
        this._end = to
        this._label = input
    }

    mergeTo(state:State):void {
        this.to.addMeta(state.meta)
        this.to.addErrors(state.errors)
    }
}
