export class InputControl {

    constructor(type, defaulValue) {
        this.type = type;

        this.value = [0, 0, 0, 0];
        this.defaultValue = defaulValue ?? [0, 0, 0, 0];
        this.frame = 0;
    }
    reset() {
        for (let i = 0; i < this.defaultValue.length; i++) {
            this.value[i] = this.defaultValue[i];
        }
    }
    isDefault() {
        for (let i = 0; i < this.defaultValue.length; i++) {
            if (this.value[i] !== this.defaultValue[i])
                return false;
        }
        return true;
    }
    copyValue(v){
        for (let i = 0; i < v.length; i++) {
            this.value[i] = v[i];
        }
    }
}
