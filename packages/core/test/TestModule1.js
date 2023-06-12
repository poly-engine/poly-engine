import { CompType, CompMode, System, Module } from "../src";

class Remove3System extends System {
    constructor(world){
        super(world);

        this.em = this.world.entityManager;
        // this.com_3 = this.world.componentManager.com_3;
        this.com_3 = this.em.getComponentId('com_3');
        this.com_2 = this.em.getComponentId('com_2');
        // this.que_3__2 = this.world.queryManager.que_3__2;
        this.que_3__2 = this.world.queryManager.createQuery({ all: [this.com_3], none: [this.com_2] });
    }
    init() {
    }
    _update() {
        this.que_3__2.forEach(entity => {
            this.defer(() => {
                this.em.removeComponent(entity, this.com_3);
            })
        })
    }
}

export class TestModule extends Module {
    init() {
        let entityManager = this.world.entityManager;
        // let compManager = this.world.componentManager;
        let queryManager = this.world.queryManager;
        let systemManager = this.world.systemManager;

        //compnent
        const com_1 = entityManager.registerComponent("com_1", {
            schema: {
                value: { type: 'number', default: 5 },
                entity: { type: 'entity', default: -1 },
            },
        });
        const com_2 = entityManager.registerComponent("com_2", {
            type: CompType.Buffered,
            schema: {
                str: { type: 'string', default: 'huo' },
            },
        });
        const com_3 = entityManager.registerComponent("com_3", {
            type: CompType.Tag,
            mode: CompMode.State
        });
        const com_4 = entityManager.registerComponent("com_4", {
            type: CompType.Shared,
            schema: {
                id: { type: 'string', default: '' },
                array: { type: 'array', default: [0, 0, 0] },
            },
        });
        const com_5 = entityManager.registerComponent("com_5", {
            type: CompType.Tag,
        });
        // const com_group = entityManager.registerComponent("com_group", {
        //     type: CompType.Group,
        // });
        const com_groupData1 = entityManager.registerComponent("com_groupData1", {
            group: com_5,
            schema: {
                data1: { type: 'string', default: '' },
            },
        });
        const com_groupData2 = entityManager.registerComponent("com_groupData2", {
            group: com_5,
            schema: {
                data2: { type: 'string', default: '' },
            },
        });
        const testEventCom = entityManager.registerComponent("TestEvent0", {
            type: CompType.Tag,
            mode: CompMode.Event,
        });

        //query
        // const que_1 = queryManager.createQuery("que_1", { all: [com_1] });
        // const que_12 = queryManager.createQuery("que_12", { all: [com_1, com_2] });
        // const que_123 = queryManager.createQuery("que_123", { all: [com_1, com_2, com_3] });
        const que_12__3 = queryManager.createQuery({ all: [com_1, com_2], none: [com_3] });
        // const que_3__2 = queryManager.createQuery("que_3__2", { all: [com_3], none: [com_2] });

        //system
        const sys_add3 = systemManager.addSystem({
            name: "Add3System",
            update: (delta) => {
                que_12__3.forEach(entity => {
                    sys_add3.defer(() => {
                        entityManager.setComponent(entity, com_3);
                    })
                })
            }
        });
        const sys_remove3 = systemManager.addSystem(Remove3System);

        sys_remove3.init();
    }
}