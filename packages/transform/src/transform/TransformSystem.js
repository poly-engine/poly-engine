import { SystemGroupType, System } from "@poly-engine/core";
import { mat4 } from "@poly-engine/math";

const rootDirtyEntities = [];
export class TransformSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.LateUpdate;
        this.index = 1000;

        // this.em = this.world.entityManager;
        // // this.compManager = this.world.componentManager;
        // this.qm = this.world.queryManager;

        this.com_transform = this.em.getComponentId('Transform');
        this.com_transformDirty = this.em.getComponentId('TransformDirty');
        this.com_localToWorld = this.em.getComponentId('LocalToWorld');
        this.com_children = this.em.getComponentId('Children');
        this.com_parent = this.em.getComponentId('Parent');
        this.com_parentDirty = this.em.getComponentId('ParentDirty');
        this.com_ltwChanged = this.em.getComponentId('LtwChanged');

        this.que_initLtw = this.qm.createQuery({ all: [this.com_transform], not: [this.com_localToWorld] });
        this.que_ltwChanged = this.qm.createQuery({ all: [this.com_localToWorld, this.com_ltwChanged] });
        this.que_transformDirty = this.qm.createQuery({ all: [this.com_transform, this.com_localToWorld], any: [this.com_transformDirty, this.com_parentDirty] });
    }
    init() {
    }
    _update(delta) {
        const em = this.em;
        this.que_ltwChanged.forEach(entity => {
            this.que_ltwChanged.defer(() => {
                em.removeComponent(entity, this.com_ltwChanged);
            });
        });

        this.que_initLtw.forEach(entity => {
            this.que_initLtw.defer(() => {
                em.setComponent(entity, this.com_localToWorld);
                em.setComponent(entity, this.com_transformDirty);
            });
        });

        this.que_transformDirty.forEach(entity => {
            let transform = em.getComponent(entity, this.com_transform);
            if (em.hasComponent(entity, this.com_transformDirty)) {
                let ltw = em.getComponent(entity, this.com_localToWorld);
                mat4.fromRotationTranslationScale(
                    ltw.localMat,
                    transform.rotation,
                    transform.position,
                    transform.scale
                );
                // Matrix.invert(localToWorld.worldMat, localToWorld.worldInvMat);
                this.que_transformDirty.defer(() => {
                    em.removeComponent(entity, this.com_transformDirty);
                });
            }
            if (em.hasComponent(entity, this.com_parentDirty)) {
                this.que_transformDirty.defer(() => {
                    em.removeComponent(entity, this.com_parentDirty);
                });
            }
            if (!this._hasParentDirty(entity))
                rootDirtyEntities.push(entity);
        });

        for (let i = 0, l = rootDirtyEntities.length; i < l; i++) {
            let entity = rootDirtyEntities[i];
            let parentEntity = em.getComponent(entity, this.com_parent)?.entity;
            this._updateTransform(entity, parentEntity);
        }
        rootDirtyEntities.length = 0;
    }

    _hasParentDirty(entity) {
        const em = this.em;
        let parent = em.getComponent(entity, this.com_parent);
        if (!parent || parent.entity < 0)
            return false;
        let parentEntity = parent.entity;
        if (em.hasComponent(parentEntity, this.com_transformDirty)
            || em.hasComponent(parentEntity, this.com_parentDirty))
            return true;
        return this._hasParentDirty(parentEntity);
    }
    _updateTransform(entity, parentEntity) {
        const em = this.em;
        const com_localToWorld = this.com_localToWorld;
        let ltw = em.getComponent(entity, com_localToWorld);
        if (parentEntity !== undefined && parentEntity >= 0 && em.hasComponent(parentEntity, this.com_transform)) {
            let parentLtw = em.getComponent(parentEntity, com_localToWorld);
            mat4.multiply(ltw.worldMat, parentLtw.worldMat, ltw.localMat);
            // Matrix.multiply(parentLtw.worldMat, ltw.localMat, ltw.worldMat);
        }
        else {
            mat4.copy(ltw.worldMat, ltw.localMat);
            // ltw.worldMat.copyFrom(ltw.localMat);
        }
        mat4.invert(ltw.worldInvMat, ltw.worldMat);
        em.setComponent(entity, this.com_ltwChanged);

        let children = em.getComponent(entity, this.com_children);
        if (!children) return;
        for (let i = 0; i < children.length; i++) {
            let childEntity = children.get(i).entity;
            if (em.hasComponent(childEntity, com_localToWorld)) {
                this._updateTransform(childEntity, entity);
            }
        }
    }

    // /**
    //  * 
    //  * @param {Entity} entity 
    //  * @param {?Entity} parentEntity 
    //  * @returns {void}
    //  */
    // setParent(entity, parentEntity) {
    //     const em = this.em;
    //     const com_parent = this.com_parent;
    //     const com_parentDirty = this.com_parentDirty;
    //     const com_children = this.com_children;

    //     let oldParentEntity = -1;
    //     let parent = em.getComponent(entity, com_parent);
    //     if (parent && parent.entity === parentEntity)
    //         return;
    //     if (!parent && parentEntity === -1)
    //         return;
    //     em.setComponent(entity, com_parentDirty);
    //     if (parent) {
    //         oldParentEntity = parent.entity;
    //         if (oldParentEntity !== -1) {
    //             let children = em.getComponent(oldParentEntity, com_children);
    //             let index = children.findIndex((item) => item.entity === entity);
    //             if (index >= 0) children.removeAt(index);
    //         }
    //     }
    //     if (parentEntity === -1) {
    //         em.removeComponent(entity, com_parent);
    //         return;
    //     }
    //     if (!parent) {
    //         parent = em.setComponent(entity, com_parent);
    //     }
    //     let children = em.getComponent(parentEntity, com_children);
    //     if (!children)
    //         children = em.setComponent(parentEntity, com_children);
    //     children.add(em.createComponent(com_children, entity));

    //     parent.entity = parentEntity;
    // }
    // /**
    //  * 
    //  * @param {Entity} entity 
    //  * @returns {Entity}
    //  */
    // getRootEntity(entity) {
    //     const em = this.em;
    //     const parent = em.getComponent(entity, this.com_parent);
    //     if (parent == null || parent.entity < 0)
    //         return entity;
    //     const parentEntity = parent.entity;
    //     if (!em.hasComponent(parentEntity, this.com_transform))
    //         return entity;
    //     return this.getTransformRoot(parentEntity);
    // }
    // getPosition(entity, position) {
    //     const em = this.em;
    //     let ltw = em.getComponent(entity, this.com_localToWorld);
    //     position ??= [0, 0, 0];
    //     return mat4.getTranslation(position, ltw.worldMat);
    // }
    // getRotation(entity, rotation) {
    //     const em = this.em;
    //     let ltw = em.getComponent(entity, this.com_localToWorld);
    //     rotation ??= [0, 0, 0, 1];//quat.create();
    //     return mat4.getRotation(rotation, ltw.worldMat);
    // }
    // forEachChild(entity, callback) {
    //     const em = this.em;
    //     let children = em.getComponent(entity, this.com_children);
    //     if (!children)
    //         return false;
    //     for (let i = 0, l = children.length; i < l; i++) {
    //         let childEntity = children.get(i).entity;
    //         if (childEntity < 0)
    //             continue;
    //         callback(childEntity);
    //         this.forEachChild(childEntity, callback);
    //     }
    //     return false;
    // }
    // hierachyToJson(entities, context) {
    //     // let ents = new Array(entities);
    //     let entSet = new SparseSet();
    //     entities.forEach((entity) => {
    //         entSet.add(entity);
    //     });
    //     entities.forEach((entity) => {
    //         this.forEachChild(entity, (ent) => {
    //             entSet.add(ent);
    //         });
    //     });
    //     return this.em.createPrefab(entSet.values, context);
    // }
}
