import { vec3 } from "@poly-engine/math";

export class TransformUtil {

    static getForward(out, mat) {
        const e = mat;
        vec3.set(out, -e[8], -e[9], -e[10]);
        return vec3.normalize(out, out);
    }
}
