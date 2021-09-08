A `Trace` consists of `Steps`.

A `Step` consists of:
1. Observe state
    - e.g. the entire DOM
2. Rulecheck
    - e.g. "At all times, no uncaught errors"
3. Transition (Action)
    - e.g. Clicking an element

When trace(s) are generated and executed, they can be transformed to a `Model`.

The state observations are used to detect which states are the same.
That way, we can find the shortest path to an error and have a more visual reference of our application.

