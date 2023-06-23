import { InputControl } from "../input/InputControl.js";
import { InputControlType } from "../input/InputControlType.js";
import { InputDevice } from "../input/InputDevice.js";

export const TouchControl = {
    Pointer0: 0,
    Pointer0_Move: 1,
    Pointer0_Pos: 2,
    Pointer0_Scoll: 3,

    Pointer1: 4,
    Pointer1_Move: 5,
    Pointer1_Pos: 6,
    Pointer1_Scoll: 7,

    Pointer2: 8,
    Pointer2_Move: 9,
    Pointer2_Pos: 10,
    Pointer2_Scoll: 11,

    Group0: 12,
    Group0_Move: 13,
    Group0_Pos: 14,
    Group0_Scoll: 15,

    Group1: 16,
    Group1_Move: 17,
    Group1_Pos: 18,
    Group1_Scoll: 19,

    Group2: 20,
    Group2_Move: 21,
    Group2_Pos: 22,
    Group2_Scoll: 23,
};
const MaxTouchNum = 3;
const TouchControlNum = 4;

export class TouchDevice extends InputDevice {
    constructor(world) {
        super(world);

        for (let i = 0; i < MaxTouchNum * 2; i++) {
            this.controlDatas[i * TouchControlNum + 0] = new InputControl(InputControlType.Button);
            this.controlDatas[i * TouchControlNum + 1] = new InputControl(InputControlType.Axis2D);
            this.controlDatas[i * TouchControlNum + 2] = new InputControl(InputControlType.Axis2D);
            this.controlDatas[i * TouchControlNum + 3] = new InputControl(InputControlType.Axis3D);

        }

        this._onTouchStartEvent = this._onTouchStartEvent.bind(this);
        // this._onTouchCancelEvent = this._onTouchCancelEvent.bind(this);
        this._onTouchEndEvent = this._onTouchEndEvent.bind(this);
        this._onTouchMoveEvent = this._onTouchMoveEvent.bind(this);
        // this._onWheelEvent = this._onWheelEvent.bind(this);

        this._onFocus();

        this.pointers = [null, null, null];
        this.pointerNum = 0;
        // this.pointerPositions = {};
        this._tempTouches = [];
    }
    _getGroupControlId(groupId) {
        return (groupId + MaxTouchNum) * TouchControlNum;
    }
    _getTouchControlId(pointerId) {
        return (pointerId) * TouchControlNum;
    }

    // _addPointer(evt){
    //     this.pointers.push(evt);

    // }
    // _removePointer(evt){
    //     delete this.pointerPositions[evt.pointerId];

    //     for (let i = 0; i < this.pointers.length; i++) {
    //         if (this.pointers[i].pointerId == evt.pointerId) {
    //             this.pointers.splice(i, 1);
    //             return;
    //         }
    //     }
    // }
    _onTouchStartEvent(evt) {
        if (this.pointerNum >= MaxTouchNum)
            return;
        // const touches = evt.touches;
        let lastGroupId = this.pointerNum - 1;
        let curGroupId = lastGroupId;

        // let emptyNum = MaxTouchNum - this.pointerNum;
        const touches1 = evt.changedTouches;
        for (let i = 0; i < touches1.length; i++) {
            if (this.pointerNum >= MaxTouchNum)
                break;
            const touch = touches1[i];
            let index = this.pointers.findIndex((v) => v == null);
            this.pointers[index] = touch.identifier;
            this._onButtonDown(this._getTouchControlId(index));

            this.pointerNum++;
            curGroupId++;
        }
        if (curGroupId !== lastGroupId) {
            let gcid = this._getGroupControlId(lastGroupId);
            let gscroll = null;
            if (lastGroupId > 0) {
                this._onButtonUp(gcid);
                gscroll = this.controlDatas[gcid + 3];
                gscroll.reset();
                // gscroll.value[3] = 0;
            }

            gcid = this._getGroupControlId(curGroupId);
            this._onButtonDown(gcid);
            this._updateTouches(evt.touches);
            gscroll = this.controlDatas[gcid + 3];
            gscroll.value[3] = gscroll.value[1];

            // console.log(lastGroupId, curGroupId, evt.touches, touches1, this.pointers);
        }
    }
    _onPointerCancelEvent(evt) {
        // this._removePointer(evt);
        // this.canvasElement.releasePointerCapture(evt.pointerId);
    }
    _onTouchEndEvent(evt) {
        if (this.pointerNum === 0)
            return;
        let lastGroupId = this.pointerNum - 1;
        let curGroupId = lastGroupId;

        // let emptyNum = MaxTouchNum - this.pointerNum;
        const touches1 = evt.changedTouches;
        for (let i = 0; i < touches1.length; i++) {
            if (this.pointerNum === 0)
                break;
            const touch = touches1[i];
            let index = this.pointers.findIndex((v) => v === touch.identifier);
            if (index < 0)
                continue;
            this.pointers[index] = null;
            this._onButtonUp(this._getTouchControlId(index));

            this.pointerNum--;
            curGroupId--;
        }
        if (curGroupId !== lastGroupId) {
            let gcid = this._getGroupControlId(lastGroupId);
            let gscroll = null;
            this._onButtonUp(gcid);
            gscroll = this.controlDatas[gcid + 3];
            gscroll.reset();

            if (curGroupId > 0) {
                gcid = this._getGroupControlId(curGroupId);
                this._onButtonDown(gcid);
                this._updateTouches(evt.touches);
                gscroll = this.controlDatas[gcid + 3];
                gscroll.value[3] = gscroll.value[1];
            }
            // console.log(lastGroupId, curGroupId, evt.touches, touches1, this.pointers);
        }
    }
    _updateTouches(touches) {
        let curGroupId = this.pointerNum - 1;
        const gcid = this._getGroupControlId(curGroupId);
        const gpos = this.controlDatas[gcid + 2];
        const gmove = this.controlDatas[gcid + 1];
        const gscroll = this.controlDatas[gcid + 3];
        let gposX = 0;
        let gposY = 0;
        let tscroll = 0;

        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            let index = this.pointers.findIndex((v) => v === touch.identifier);
            if (index < 0)
                continue;
            // this.pointers[index] = null;
            // this._onButtonUp(this._getTouchControlId(index));

            const cid = this._getTouchControlId(index);
            const pos = this.controlDatas[cid + 2];
            const move = this.controlDatas[cid + 1];

            move.value[0] = touch.pageX - pos.value[0];
            move.value[1] = touch.pageY - pos.value[1];
            pos.value[0] = touch.pageX;
            pos.value[1] = touch.pageY;

            gposX += touch.pageX;
            gposY += touch.pageY;

            pos.frame = move.frame = this.timeManager.frameCount;
            // console.log(cid, pos, move, gposX, gposY, pos.value[0]);

            this._tempTouches.push(cid);
        }

        gposX /= this.pointerNum;
        gposY /= this.pointerNum;
        gmove.value[0] = gposX - gpos.value[0];
        gmove.value[1] = gposY - gpos.value[1];
        gpos.value[0] = gposX;
        gpos.value[1] = gposY;
        gpos.frame = gmove.frame = this.timeManager.frameCount;

        for (let i = 0; i < this.pointerNum; i++) {
            const cid = this._tempTouches[i];
            const pos = this.controlDatas[cid + 2];
            let tx = (pos.value[0] - gposX);
            let ty = (pos.value[1] - gposY);
            tscroll += Math.sqrt(tx * tx + ty * ty);
        }
        // console.log(curGroupId, tscroll, gscroll.value[1], tscroll - gscroll.value[1]);
        gscroll.value[1] = -(tscroll - gscroll.value[3]);
        gscroll.value[3] = tscroll;
        gscroll.frame = this.timeManager.frameCount;
        // console.log(curGroupId, gpos, touches, this._tempTouches, gpos.frame, gscroll.value[1]);

        this._tempTouches.length = 0;
    }
    _onTouchMoveEvent(evt) {
        const touches = evt.touches;
        if (touches.length !== this.pointerNum) {
            console.warn(`touch num error!${touches.length}!=${this.pointerNum}`);
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();

        this._updateTouches(touches);
        // let curGroupId = this.pointerNum - 1;
        // const gcid = this._getGroupControlId(curGroupId);
        // const gpos = this.controlDatas[gcid + 2];
        // const gmove = this.controlDatas[gcid + 1];
        // const gscroll = this.controlDatas[gcid + 3];
        // let gposX = 0;
        // let gposY = 0;
        // let tscroll = 0;

        // for (let i = 0; i < touches.length; i++) {
        //     const touch = touches[i];
        //     let index = this.pointers.findIndex((v) => v === touch.identifier);
        //     if (index < 0)
        //         continue;
        //     // this.pointers[index] = null;
        //     // this._onButtonUp(this._getTouchControlId(index));

        //     const cid = this._getTouchControlId(index);
        //     const pos = this.controlDatas[cid + 2];
        //     const move = this.controlDatas[cid + 1];

        //     move.value[0] = touch.pageX - pos.value[0];
        //     move.value[1] = touch.pageY - pos.value[1];
        //     pos.value[0] = touch.pageX;
        //     pos.value[1] = touch.pageY;

        //     gposX += touch.pageX;
        //     gposY += touch.pageY;

        //     pos.frame = move.frame = this.timeManager.frameCount;
        //     // console.log(cid, pos, move, gposX, gposY, pos.value[0]);

        //     this._tempTouches.push(cid);
        // }

        // gposX /= this.pointerNum;
        // gposY /= this.pointerNum;
        // gmove.value[0] = gposX - gpos.value[0];
        // gmove.value[1] = gposY - gpos.value[1];
        // gpos.value[0] = gposX;
        // gpos.value[1] = gposY;
        // gpos.frame = gmove.frame = this.timeManager.frameCount;

        // for (let i = 0; i < this.pointerNum; i++) {
        //     const cid = this._tempTouches[i];
        //     const pos = this.controlDatas[cid + 2];
        //     let tx = (pos.value[0] - gposX);
        //     let ty = (pos.value[1] - gposY);
        //     tscroll += Math.sqrt(tx * tx + ty * ty);
        // }
        // gscroll.value[1] = tscroll;
        // gscroll.frame = this.timeManager.frameCount;
        // // console.log(curGroupId, gpos, touches, this._tempTouches, gpos.frame, gscroll.value[1]);

        // this._tempTouches.length = 0;
    }
    _onContextMenu(evt) {
        //禁掉鼠标右键菜单
        evt.preventDefault()
    }
    _onFocus() {
        if (!this._isFocus) {
            this.canvasElement.addEventListener('contextmenu', this._onContextMenu);

            // this.canvasElement.addEventListener('wheel', this._onWheelEvent, false);
            this.canvasElement.addEventListener('touchstart', this._onTouchStartEvent, false);
            this.canvasElement.addEventListener('touchend', this._onTouchEndEvent, false);
            this.canvasElement.addEventListener('touchmove', this._onTouchMoveEvent, false);
            // this.canvasElement.addEventListener('mouseup', this._onMouseUpEvent, false);
            this._isFocus = true;
        }
    }
    _onBlur() {
        if (this._isFocus) {
            this.canvasElement.removeEventListener('contextmenu', this._onContextMenu);

            // this.canvasElement.removeEventListener('wheel', this._onWheelEvent, false);
            this.canvasElement.removeEventListener('touchstart', this._onTouchStartEvent, false);
            this.canvasElement.removeEventListener('touchend', this._onTouchEndEvent, false);
            this.canvasElement.removeEventListener('touchmove', this._onTouchMoveEvent, false);
            // this.canvasElement.removeEventListener('mouseup', this._onMouseUpEvent, false);
            this._reset();
            this._isFocus = false;
        }
    }
}