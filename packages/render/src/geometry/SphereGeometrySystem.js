import { System, SystemGroupType } from "@poly-engine/core";
import { GeometryUtil } from "./GeometryUtil.js";

export class SphereGeometrySystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 401;

        // this.em = this.world.entityManager;
        // this.qm = this.world.queryManager;

        this.boxGeometryCom = this.em.getComponentId('SphereGeometry');
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
        this.que_boxGeometryInit.forEach(entity => {
            let boxGeometry = em.getComponent(entity, this.boxGeometryCom);
            this.que_boxGeometryInit.defer(() => {
                let boxData = GeometryUtil.createSphereData(
                    boxGeometry.radius, boxGeometry.wSegments, boxGeometry.hSegments);
                let geometry = em.createComponent(this.com_geometry);
                geometry.vertexBuffers.push({
                    data: boxData.vertices,
                    elements: [{ name: 'POSITION', size: 3 }]
                });
                geometry.vertexBuffers.push({
                    data: boxData.normals,
                    elements: [{ name: 'NORMAL', size: 3 }]
                });
                geometry.vertexBuffers.push({
                    data: boxData.uvs,
                    elements: [{ name: 'TEXCOORD_0', size: 2 }]
                });
                geometry.indexBuffer = boxData.indices;
                em.setComponent(entity, this.com_geometry, geometry);
            });
        })
    }
}


