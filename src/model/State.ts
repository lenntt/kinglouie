export class State {
    private _name: string
    private _errors: Array<string> = []
    private _meta: Record<string, unknown> = {}

    get name():string {
        return this._name
    }

    get errors():Array<string> {
        return this._errors
    }

    get meta(): Record<string, unknown> {
        return this._meta
    }

    constructor(name: string, meta = {}, errors = []) {
        this._name = name
        this.addMeta(meta)
        this.addErrors(errors)
    }

    static generate():State {
        return new State(`_${Math.random().toString(36).substr(2, 5)}`)
    }

    addErrors(errors:string[]):void {
        errors.forEach((error) => {
            this.addError(error)
        })
    }

    addError(error:string):void {
        if(this._errors.indexOf(error) === -1) {
            this._errors.push(error)
        }
    }

    addMeta(meta: Record<string, unknown>):void {
        this._meta = Object.assign(this._meta, meta);
    }

    isSimilarTo(other:State): boolean {
        function isObject(object) {
            return object != null && typeof object === 'object';
        }
        function deepEqual(object1, object2) {
            const keys1 = Object.keys(object1);
            const keys2 = Object.keys(object2);

            if (keys1.length !== keys2.length) {
              return false;
            }

            for (const key of keys1) {
              const val1 = object1[key];
              const val2 = object2[key];
              const areObjects = isObject(val1) && isObject(val2);
              if (
                areObjects && !deepEqual(val1, val2) ||
                !areObjects && val1 !== val2
              ) {
                return false;
              }
            }

            return true;
          }

        return deepEqual(this.meta, other.meta)
    }
}
