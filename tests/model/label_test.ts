import { expect } from "chai"
import {Input} from '../../src/model/Labels'

describe('Input', () => {
    it('has a name', () => {
        const label = new Input('name')
        expect(label.name).to.equal('name')
    })
})
