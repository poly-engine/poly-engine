import { CompMode, CompType } from "@poly-engine/core"


export const InputActionDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        controlType: { type: 'number', default: 0 },
        defaultValue: { type: 'bin', default: [0, 0, 0, 0] },
    }
};

export const InputActionStateDef = {
    // mode: CompMode.State,
    schema: {
        value: { type: 'bin', default: null },
        phase: { type: 'number', default: 0 },
        frame: { type: 'number', default: 0 },
        performed: { type: 'boolean', default: false },
    }
};

export const BaseControlBindingDef = {
    type: CompType.Buffered,
    schema: {
        deviceType: { type: 'number', default: 0 },
        controlId: { type: 'number', default: 0 },
        buttonState: { type: 'number', default: 0 },

        controls: {
            type: 'array', default: null, value: {
                type: 'object', default: null, schema: {
                    deviceType: { type: 'number', default: 0 },
                    controlId: { type: 'number', default: 0 },
                    isHeld: { type: 'boolean', default: false },
                }
            }
        },
    }
};
