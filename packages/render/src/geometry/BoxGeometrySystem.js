import { System, SystemGroupType } from "@poly-engine/core";
import { VertexElementType } from "../constants.js";
import { GeometryUtil } from "./GeometryUtil.js";

export class BoxGeometrySystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 400;

        // this.em = this.world.entityManager;
        // this.qm = this.world.queryManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.boxGeometryCom = this.em.getComponentId('BoxGeometry');
        this.com_geometry = this.em.getComponentId('Geometry');

        this.que_boxGeometryInit = this.qm.createQuery({
            all: [this.boxGeometryCom],
            none: [this.com_geometry]
        });
    }
    init() {
    }
    _update() {
        const em = this.em;
        // const com_glState = this.com_glState;
        this.que_boxGeometryInit.forEach(entity => {
            let boxGeometry = em.getComponent(entity, this.boxGeometryCom);
            this.que_boxGeometryInit.defer(() => {
                let boxData = GeometryUtil.createBoxData(
                    boxGeometry.width, boxGeometry.height, boxGeometry.depth,
                    boxGeometry.wSegments, boxGeometry.hSegments, boxGeometry.dSegments);
                let geometry = em.createComponent(this.com_geometry);
                // geometry.vertexBuffers.push({
                //     data: boxData.vertices,
                //     elements: [{ name: 'POSITION', size: 3 }]
                // });
                // geometry.vertexBuffers.push({
                //     data: boxData.normals,
                //     elements: [{ name: 'NORMAL', size: 3 }]
                // });
                // geometry.vertexBuffers.push({
                //     data: boxData.uvs,
                //     elements: [{ name: 'TEXCOORD_0', size: 2 }]
                // });
                // geometry.indexBuffer = boxData.indices;

                geometry.vertexBuffers.push({
                    data: boxData.vertices,
                });
                geometry.vertexBuffers.push({
                    data: boxData.normals,
                });
                geometry.vertexBuffers.push({
                    data: boxData.uvs,
                });
                geometry.vertexElements.push({ name: 'POSITION', index: 0, type: VertexElementType.Float, size: 3, offset: 0, normalize: false });
                geometry.vertexElements.push({ name: 'NORMAL', index: 1, type: VertexElementType.Float, size: 3, offset: 0, normalize: false });
                geometry.vertexElements.push({ name: 'TEXCOORD_0', index: 2, type: VertexElementType.Float, size: 2, offset: 0, normalize: false });
                geometry.indexBuffer = { data: boxData.indices };
                em.setComponent(entity, this.com_geometry, geometry);
            });
        })
    }
}


