
export class Scene{
    constructor(id, name){
        this.id = id;
        this.name = name;
        this._entitySet = new SparseSet();
        this.entities = this._entitySet.values;

    }
}