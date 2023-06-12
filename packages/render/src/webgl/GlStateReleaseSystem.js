// import { System, SystemGroupType } from "@poly-engine/core";

// export class GlStateReleaseSystem extends System {
//     constructor(world) {
//         super(world);
//         this.groupId = SystemGroupType.LateUpdate;
//         this.index = 1000;

//         // this.em = this.world.entityManager;
//         // this.qm = this.world.queryManager;

//         this.com_glState = this.em.getComponentId('GlState');
//         this.com_canvas = this.em.getComponentId('Canvas');
//         // this.que_glStateRelease = this.qm.que_glStateRelease;
//         this.que_glStateRelease = this.qm.createQuery({
//             all: [this.com_glState],
//             none: [this.com_canvas]
//         });
//     }
//     init() {
//     }
//     _update() {
//         const em = this.em;
//         const com_glState = this.com_glState;
    
//         this.que_glStateRelease.forEach(entity => {
//             this.que_glStateRelease.defer(() => {
//                 em.removeComponent(entity, com_glState);
//             });
//         });
//     }
// }
