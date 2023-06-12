// import { CompType, CompMode, System, Module } from "../src";

// export const settings = {};

// export function init(world, _settings) {
//     // Object.assign(settings, _settings);

//     //compnent
//     let compManager = world.componentManager;
//     const com_1 = compManager.registerComponent("com_1", {
//         schema: {
//             value: { type: 'number', default: 5 },
//             entity: { type: 'entity', default: -1 },
//         },
//     });
//     const com_2 = compManager.registerComponent("com_2", {
//         type: CompType.Buffered,
//         schema: {
//             str: { type: 'string', default: 'huo' },
//         },
//     });
//     const com_3 = compManager.registerComponent("com_3", {
//         type: CompType.Tag,
//         mode: CompMode.State
//     });
//     const com_4 = compManager.registerComponent("com_4", {
//         type: CompType.Shared,
//         schema: {
//             id: { type: 'string', default: '' },
//             array: { type: 'array', default: [0, 0, 0] },
//         },
//     });
//     const com_5 = compManager.registerComponent("com_5", {
//         type: CompType.Tag,
//     });

//     //query
//     let queryManager = world.queryManager;
//     const que_1 = queryManager.createQuery("que_1", { all: [com_1] });
//     const que_12 = queryManager.createQuery("que_12", { all: [com_1, com_2] });
//     const que_123 = queryManager.createQuery("que_123", { all: [com_1, com_2, com_3] });
//     const que_12__3 = queryManager.createQuery("que_12__3", { all: [com_1, com_2], none: [com_3] });
//     const que_3__2 = queryManager.createQuery("que_3__2", { all: [com_3], none: [com_2] });

//     //system
//     let systemManager = world.systemManager;
//     const sys_add3 = systemManager.addSystem("sys_add3", {
//         update: (delta) => {
//             que_12__3.forEach(entity => {
//                 sys_add3.defer(() => {
//                     world.entityManager.setComponent(entity, com_3);
//                 })
//             })
//         }
//     });
//     const sys_remove3 = systemManager.addSystem("sys_remove3", Remove3System);

//     // const sys_remove3 = systemManager.addSystem("sys_remove3", {
//     //     update: (delta) => {
//     //         que_3__2.forEach(entity => {
//     //             sys_remove3.defer(() => {
//     //                 world.entityManager.removeComponent(entity, com_3);
//     //             })
//     //         })
//     //     }
//     // });
// }

// export function release(world) {

// }

// class Remove3System extends System {
//     init() {
//         this.com_3 = this.world.componentManager.com_3;
//         this.que_3__2 = this.world.queryManager.que_3__2;
//     }
//     release() {

//     }
//     _update() {
//         this.que_3__2.forEach(entity => {
//             this.defer(() => {
//                 this.world.entityManager.removeComponent(entity, this.com_3);
//             })
//         })
//     }
// }