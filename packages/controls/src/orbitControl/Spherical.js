import { glMatrix, mat4, vec3 } from "@poly-engine/math";

// Prevent gimbal lock.
const ESP = glMatrix.EPSILON;

// Spherical.
export class Spherical {
    static _xAxis = vec3.create();//new Vector3();
    static _yAxis = vec3.create();//new Vector3();
    static _zAxis = vec3.create();//new Vector3();
    _matrix = mat4.create();// new Matrix();
    _matrixInv = mat4.create();//new Matrix();
    constructor(radius, phi, theta) {
        this.radius = radius ?? 1.0;
        this.phi = phi ?? 0;
        this.theta = theta ?? 0;
    }
    clear(){
        this.radius = 0;
        this.phi = 0;
        this.theta = 0;
        mat4.identity(this._matrix);
        mat4.identity(this._matrixInv);
    }
    makeSafe() {
        const count = Math.floor(this.phi / Math.PI);
        this.phi = glMatrix.clamp(this.phi, count * Math.PI + ESP, (count + 1) * Math.PI - ESP);
        return this;
    }

    set(radius, phi, theta) {
        this.radius = radius;
        this.phi = phi;
        this.theta = theta;
        return this;
    }

    setYAxis(up) {
        const { _xAxis: xAxis, _yAxis: yAxis, _zAxis: zAxis } = Spherical;
        // if (Vector3.equals(xAxis.set(1, 0, 0), yAxis.copyFrom(up).normalize())) {
        //     xAxis.set(0, 1, 0);
        // }
        vec3.copy(yAxis, up);
        vec3.normalize(yAxis, yAxis);
        if (vec3.equals(vec3.set(xAxis, 1, 0, 0), yAxis)) {
            vec3.set(xAxis, 0, 1, 0);
        }
        // Vector3.cross(xAxis, yAxis, zAxis);
        vec3.cross(zAxis, xAxis, yAxis);
        // zAxis.normalize();
        vec3.normalize(zAxis, zAxis);
        // Vector3.cross(yAxis, zAxis, xAxis);
        vec3.cross(xAxis, yAxis, zAxis);
        // const { elements: es } = this._matrix;
        const es = this._matrix;
        (es[0] = xAxis[0]), (es[1] = xAxis[1]), (es[2] = xAxis[2]);
        (es[4] = yAxis[0]), (es[5] = yAxis[1]), (es[6] = yAxis[2]);
        (es[8] = zAxis[0]), (es[9] = zAxis[1]), (es[10] = zAxis[2]);

        // const { elements: eInv } = this._matrixInv;
        const eInv = this._matrixInv;
        (eInv[0] = xAxis[0]), (eInv[4] = xAxis[1]), (eInv[8] = xAxis[2]);
        (eInv[1] = yAxis[0]), (eInv[5] = yAxis[1]), (eInv[9] = yAxis[2]);
        (eInv[2] = zAxis[0]), (eInv[6] = zAxis[1]), (eInv[10] = zAxis[2]);
    }

    setFromVec3(value, atTheBack = false) {
        // value.transformNormal(this._matrixInv);
        vec3.transformNormal(value, value, this._matrixInv);
        // this.radius = value.length();
        this.radius = vec3.length(value);
        if (this.radius === 0) {
            this.theta = 0;
            this.phi = 0;
        } else {
            if (atTheBack) {
                this.phi = 2 * Math.PI - Math.acos(glMatrix.clamp(value[1] / this.radius, -1, 1));
                this.theta = Math.atan2(-value[0], -value[2]);
            } else {
                this.phi = Math.acos(glMatrix.clamp(value[1] / this.radius, -1, 1));
                this.theta = Math.atan2(value[0], value[2]);
            }
        }
        return this;
    }

    setToVec3(value) {
        const { radius, phi, theta } = this;
        const sinPhiRadius = Math.sin(phi) * radius;
        this.phi -= Math.floor(this.phi / Math.PI / 2) * Math.PI * 2;
        // value.set(sinPhiRadius * Math.sin(theta), radius * Math.cos(phi), sinPhiRadius * Math.cos(theta));
        vec3.set(value, sinPhiRadius * Math.sin(theta), radius * Math.cos(phi), sinPhiRadius * Math.cos(theta));
        // value.transformNormal(this._matrix);
        vec3.transformNormal(value, value, this._matrix);
        return this.phi > Math.PI;
    }
}