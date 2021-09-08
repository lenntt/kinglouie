import { Model } from './Model';
import { State } from './State';
import { Trace } from './Trace';
import { Transition } from './Transition';

export class ModelBuilder {
    /**
     * Preconditions:
     * - all traces start from the same state
     */
    static fromTraces(traces:Array<Trace>):Model {
        let currentState:State = traces[0].model.initialState
        const model = new Model(currentState)

        for(let traceIndex = 0; traceIndex < traces.length; traceIndex++) {
            const trace = traces[traceIndex]
            for(let i = 0; i < trace.model.transitions.length; i++) {
                let transition = trace.model.transitions[i]
                transition = new Transition(currentState, transition.to, transition.input)
                currentState = model.addTransition(transition, (i==0)).to
            }
        }

        return model
    }
}
