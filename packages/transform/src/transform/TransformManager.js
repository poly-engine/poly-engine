import { SparseSet } from "@poly-engine/core";
import { mat4, vec3 } from "@poly-engine/math";

export class TransformManager {
    constructor(world) {
        this.world = world;
        this.em = this.world.entityManager;

        this.com_transform = this.em.getComponentId('Transform');
        this.com_transformDirty = this.em.getComponentId('TransformDirty');
        this.com_localToWorld = this.em.getComponentId('LocalToWorld');
        this.com_children = this.em.getComponentId('Children');
        this.com_parent = this.em.getComponentId('Parent');
        this.com_parentDirty = this.em.getComponentId('ParentDirty');
        this.com_ltwChanged = this.em.getComponentId('LtwChanged');

    }

    /**
     * 
     * @param {Entity} entity 
     * @param {?Entity} parentEntity 
     * @returns {void}
     */
    setParent(entity, parentEntity) {
        const em = this.em;
        const com_parent = this.com_parent;
        const com_parentDirty = this.com_parentDirty;
        const com_children = this.com_children;

        let lastEnt = -1;
        let parent = em.getComponent(entity, com_parent);
        if (parent && parent.entity === parentEntity)
            return;
        if (!parent && parentEntity === -1)
            return;
        if (parent) {
            lastEnt = parent.entity;
            if (lastEnt !== -1) {
                let children = em.getComponent(lastEnt, com_children);
                let index = children.findIndex((item) => item.entity === entity);
                if (index >= 0) children.removeAt(index);
            }
        }
        em.setComponentByArgs(entity, com_parentDirty, lastEnt, parentEntity);
        if (parentEntity === -1) {
            em.removeComponent(entity, com_parent);
            return;
        }
        if (!parent) {
            parent = em.setComponent(entity, com_parent);
        }
        let children = em.getComponent(parentEntity, com_children);
        if (!children)
            children = em.setComponent(parentEntity, com_children);
        children.add(em.createComponent(com_children, entity));

        parent.entity = parentEntity;
    }
    /**
     * 
     * @param {Entity} entity 
     * @returns {boolean}
     */
    isRootEntity(entity) {
        const em = this.em;
        const parent = em.getComponent(entity, this.com_parent);
        if (parent == null || parent.entity < 0)
            return true;
        const parentEntity = parent.entity;
        //TODO temporary check for something like sceneroot
        if (!em.hasComponent(parentEntity, this.com_transform))
            return true;
        return false;
    }
    /**
     * 
     * @param {Entity} entity 
     * @returns {Entity}
     */
    getRootEntity(entity) {
        const em = this.em;
        const parent = em.getComponent(entity, this.com_parent);
        if (parent == null || parent.entity < 0)
            return entity;
        const parentEntity = parent.entity;
        if (!em.hasComponent(parentEntity, this.com_transform))
            return entity;
        return this.getRootEntity(parentEntity);
    }
    hasParent(entity){
        const em = this.em;
        const parent = em.getComponent(entity, this.com_parent);
        if (parent == null || parent.entity < 0)
            return false;
        return true;
    }
    getParentEntity(entity){
        const em = this.em;
        const parent = em.getComponent(entity, this.com_parent);
        if (parent == null || parent.entity < 0)
            return -1;
        return parent.entity;
    }
    getPosition(entity, position) {
        const em = this.em;
        let ltw = em.getComponent(entity, this.com_localToWorld);
        position ??= [0, 0, 0];
        return mat4.getTranslation(position, ltw.worldMat);
    }
    getRotation(entity, rotation) {
        const em = this.em;
        let ltw = em.getComponent(entity, this.com_localToWorld);
        rotation ??= [0, 0, 0, 1];//quat.create();
        return mat4.getRotation(rotation, ltw.worldMat);
    }
    setWorldPosition(entity, position){
        const em = this.em;
        let transform = em.getComponent(entity, this.com_transform);
        let ltw = em.getComponent(entity, this.com_localToWorld);
        vec3.transformCoordinate(transform.position, position, ltw.worldInvMat);
        em.setComponent(entity, this.com_transformDirty);
    }
    setWorldMatrix(entity, matrix){
        const em = this.em;
        let transform = em.getComponent(entity, this.com_transform);
        let ltw = em.getComponent(entity, this.com_localToWorld);
        if(ltw == null)
            return;
        if(mat4.equals(matrix, ltw.worldMat))
            return;
        const parentEnt = this.getParentEntity(entity);
        if(parentEnt === -1){
            mat4.copy(ltw.worldMat, matrix);
            mat4.copy(ltw.localMat, matrix);
            mat4.decompose(transform.rotation, transform.position, transform.scale, matrix);
        }
        else{
            mat4.copy(ltw.worldMat, matrix);
            const parentLtw = em.getComponent(parentEnt, this.com_localToWorld);
            mat4.multiply(ltw.localMat, parentLtw.worldInvMat, matrix);
            mat4.decompose(transform.rotation, transform.position, transform.scale, ltw.localMat);
        }
        em.setComponent(entity, this.com_transformDirty);
    }
    forEachChild(entity, callback) {
        const em = this.em;
        let children = em.getComponent(entity, this.com_children);
        if (!children)
            return false;
        for (let i = 0, l = children.length; i < l; i++) {
            let childEntity = children.get(i).entity;
            if (childEntity < 0)
                continue;
            callback(childEntity);
            this.forEachChild(childEntity, callback);
        }
        return false;
    }
    
    hierachyToJson(entities, context) {
        // let ents = new Array(entities);
        let entSet = new SparseSet();
        entities.forEach((entity) => {
            // if(!entSet.has(entity))
            entSet.add(entity);
        });
        entities.forEach((entity) => {
            this.forEachChild(entity, (ent) => {
                // if(!entSet.has(ent))
                entSet.add(ent);
            });
        });
        return this.em.entitiesToJson(entSet.values, context);
    }

    destroyHierachy(entity){
        this.forEachChild(entity, (ent) => {
            this.em.destroyEntity(ent);
        });
    }
}
