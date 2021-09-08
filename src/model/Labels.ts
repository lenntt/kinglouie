export interface ILabel {
    name:string
}

export class Input implements ILabel {
    private _name: string

    get name():string {
        return this._name
    }

    constructor(name: string) {
        this._name = name
    }

    isSimilarTo(label:Input):boolean {
        return this._name == label.name
    }
}
