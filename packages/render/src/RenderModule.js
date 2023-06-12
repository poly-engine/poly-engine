import { Module } from "@poly-engine/core";
import { CameraSystem } from "./camera/CameraSystem.js";
// import { GlStateInitSystem } from "./webgl/GlStateInitSystem.js";
// import { GlStateReleaseSystem } from "./webgl/GlStateReleaseSystem.js";
import { GeometryDef, GeometryStateDef } from "./geometry/Geometry.js";
import { GeometrySystem } from "./geometry/GeometrySystem.js";
import { BoxGeometryDef } from "./geometry/BoxGeometry.js";
import { BoxGeometrySystem } from "./geometry/BoxGeometrySystem.js";
import { SphereGeometryDef } from "./geometry/SphereGeometry.js";
import { SphereGeometrySystem } from "./geometry/SphereGeometrySystem.js";
import { RenderStateDef } from "./render/RenderState.js";
import { ShaderSystem } from "./shader/ShaderSystem.js";
import { RenderSystem } from "./render/RenderSystem.js";
import { MeshRendererSystem } from "./renderer/MeshRendererSystem.js";
import { TextureSystem } from "./texture/TextureSystem.js";
import { Texture2DSystem } from "./texture/Texture2DSystem.js";
import { CameraDef, CameraStateDef } from "./camera/Camera.js";
import { ShaderDef } from "./shader/Shader.js";
import { ShaderProgramDef } from "./shader/ShaderProgram.js";
import { ShaderDataDef } from "./shader/ShaderData.js";
import { MeshRendererDef, MeshRendererStateDef } from "./renderer/MeshRenderer.js";
import { LightDef } from "./light/Light.js";
import { DirectLightDef } from "./light/DirectLight.js";
import { DirectLightSystem } from "./light/DirectLightSystem.js";
import { Texture2DLoader } from "./loader1/Texture2DLoader.js";
import { TextureDef, TextureStateDef } from "./texture/Texture.js";
import { Texture2DDef, Texture2DStateDef } from "./texture/Texture2D.js";
import { GLTFLoader } from "./loader1/GLTFLoader.js";

import { MaterialDef, MaterialStateDef } from "./material/Material.js";
import { MaterialSystem } from "./material/MaterialSystem.js";
import { BaseMaterialDef, BaseMaterialStateDef } from "./material/BaseMaterial.js";
import { BaseMaterialSystem } from "./material/BaseMaterialSystem.js";
import { UnlitMaterialDef, UnlitMaterialStateDef } from "./material/UnlitMaterial.js";
import { UnlitMaterialSystem } from "./material/UnlitMaterialSystem.js";
import { PhongBaseMaterialDef, PhongBaseMaterialStateDef } from "./material/PhongBaseMaterial.js";
import { PhongBaseMaterialSystem } from "./material/PhongBaseMaterialSystem.js";
import { PhongMaterialDef, PhongMaterialStateDef } from "./material/PhongMaterial.js";
import { PhongMaterialSystem } from "./material/PhongMaterialSystem.js";
import { PBRBaseMaterialDef, PBRBaseMaterialStateDef } from "./material/PBRBaseMaterial.js";
import { PBRBaseMaterialSystem } from "./material/PBRBaseMaterialSystem.js";
import { PBRMaterialDef, PBRMaterialStateDef } from "./material/PBRMaterial.js";
import { PBRMaterialSystem } from "./material/PBRMaterialSystem.js";
import { PBRSpecularMaterialDef, PBRSpecularMaterialStateDef } from "./material/PBRSpecularMaterial.js";
import { PBRSpecularMaterialSystem } from "./material/PBRSpecularMaterialSystem.js";
import { GLManager } from "./webgl/GLManager.js";

export class RenderModule extends Module {
    init() {
        const world = this.world;
        // const compManager = world.componentManager;
        const em = world.entityManager;
        const qm = world.queryManager;
        const sm = world.systemManager;

        //component
        const com_ltwChanged = em.getComponentId('LtwChanged');

        //#region camera
        const com_camera = em.registerComponent('Camera', CameraDef);
        const com_cameraState = em.registerComponent('CameraState', CameraStateDef);
        //#endregion

        //#region webgl
        // const com_canvas = em.registerComponent('Canvas', {
        //     schema: {
        //         id: { type: 'string', default: 'canvas' },
        //         element: { type: 'object', default: null }
        //     }
        // });
        // const com_resized = em.registerComponent('Resized', {
        //     type: CompType.Tag,
        //     mode: CompMode.Flag
        // });
        // const com_glState = em.registerComponent('GlState', GlContextDef);
        //#endregion

        //#region geometry
        const com_geometry = em.registerComponent('Geometry', GeometryDef);
        const com_geometryState = em.registerComponent('GeometryState', GeometryStateDef);
        const boxGeometryCom = em.registerComponent('BoxGeometry', BoxGeometryDef);
        const sphereGeometryCom = em.registerComponent('SphereGeometry', SphereGeometryDef);
        //#endregion

        //#region material
        const com_material = em.registerComponent('Material', MaterialDef);
        const com_materialState = em.registerComponent('MaterialState', MaterialStateDef);
        const baseMaterialCom = em.registerComponent('BaseMaterial', BaseMaterialDef);
        const baseMaterialStateCom = em.registerComponent('BaseMaterialState', BaseMaterialStateDef);
        const unlitMaterialCom = em.registerComponent('UnlitMaterial', UnlitMaterialDef);
        const unlitMaterialStateCom = em.registerComponent('UnlitMaterialState', UnlitMaterialStateDef);
        const phongBaseMaterialCom = em.registerComponent('PhongBaseMaterial', PhongBaseMaterialDef);
        const phongBaseMaterialStateCom = em.registerComponent('PhongBaseMaterialState', PhongBaseMaterialStateDef);
        const phongMaterialCom = em.registerComponent('PhongMaterial', PhongMaterialDef);
        const phongMaterialStateCom = em.registerComponent('PhongMaterialState', PhongMaterialStateDef);
        const pbrBaseMaterialCom = em.registerComponent('PBRBaseMaterial', PBRBaseMaterialDef);
        const pbrBaseMaterialStateCom = em.registerComponent('PBRBaseMaterialState', PBRBaseMaterialStateDef);
        const pbrMaterialCom = em.registerComponent('PBRMaterial', PBRMaterialDef);
        const pbrMaterialStateCom = em.registerComponent('PBRMaterialState', PBRMaterialStateDef);
        const pbrSpecularMaterialCom = em.registerComponent('PBRSpecularMaterial', PBRSpecularMaterialDef);
        const pbrSpecularMaterialStateCom = em.registerComponent('PBRSpecularMaterialState', PBRSpecularMaterialStateDef);
        const com_renderState = em.registerComponent('RenderState', RenderStateDef);
        //#endregion

        //#region texture
        // {
        //     type: CompType.Shared,
        //     schema: {
        //         id: { type: 'string', default: null },
        //         mipmaps: { type: 'array', default: [] },

        //         border: { type: 'number', default: 0 },
        //         format: { type: 'number', default: PIXEL_FORMAT.RGBA },
        //         internalformat: { type: 'number', default: null },
        //         type: { type: 'number', default: PIXEL_TYPE.UNSIGNED_BYTE },
        //         magFilter: { type: 'number', default: TEXTURE_FILTER.LINEAR },
        //         minFilter: { type: 'number', default: TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR },
        //         wrapS: { type: 'number', default: TEXTURE_WRAP.CLAMP_TO_EDGE },
        //         wrapT: { type: 'number', default: TEXTURE_WRAP.CLAMP_TO_EDGE },
        //         anisotropy: { type: 'number', default: 1 },
        //         generateMipmaps: { type: 'boolean', default: true },
        //         encoding: { type: 'string', default: TEXEL_ENCODING_TYPE.LINEAR },
        //         flipY: { type: 'boolean', default: true },
        //         premultiplyAlpha: { type: 'boolean', default: false },
        //         unpackAlignment: { type: 'number', default: 4 },
        //     }
        // }
        const com_texture = em.registerComponent('Texture', TextureDef);
        // {
        //     mode: CompMode.State,
        //     schema: {
        //         // id: { type: 'string', default: 'default' },
        //         texture: { type: 'object', default: null },
        //     }
        // }
        const com_textureState = em.registerComponent('TextureState', TextureStateDef);
        // {
        //     type: CompType.Shared,
        //     schema: {
        //         id: { type: 'string', default: null },
        //         image: { type: 'object', default: null },
        //     }
        // }
        const com_texture2D = em.registerComponent('Texture2D', Texture2DDef);
        const com_texture2DState = em.registerComponent('Texture2DState', Texture2DStateDef);
        //#endregion

        //#region shader
        const com_shader = em.registerComponent('Shader', ShaderDef);
        // const com_shaderState = em.registerComponent('ShaderState', {
        //     mode: CompMode.State,
        //     schema: {
        //         programs: { type: 'array', default: [] },
        //         // program: { type: 'object', default: null },
        //         // vertexShader: { type: 'object', default: null },
        //         // fragmentShader: { type: 'object', default: null },

        //         // attributeMap: { type: 'object', default: {} },
        //         // uniformMap: { type: 'object', default: {} },
        //     }
        // });
        const com_shaderProgram = em.registerComponent('ShaderProgram', ShaderProgramDef);
        const com_shaderData = em.registerComponent('ShaderData', ShaderDataDef);
        //#endregion

        //#region light
        const lightCom = em.registerComponent('Light', LightDef);
        const directLightCom = em.registerComponent('DirectLight', DirectLightDef);

        //#endregion

        //#region mesh renderer
        const com_meshRenderer = em.registerComponent('MeshRenderer', MeshRendererDef);
        const com_meshRendererState = em.registerComponent('MeshRendererState', MeshRendererStateDef);
        //#endregion

        //query

        //manager
        world.glManager = new GLManager(world);
        
        //system
        // const canvasSys = sm.addSystem(CanvasSystem);
        // const sys_glStateInit = sm.addSystem(GlStateInitSystem);
        //LateUpdate: 200
        const sys_camera = sm.addSystem(CameraSystem);
        // const sys_glStateRelease = sm.addSystem(GlStateReleaseSystem);

        //RenderUpdate: 100-200
        // const sys_shaderState = sm.addSystem(ShaderStateSystem);
        const shaderSys = sm.addSystem(ShaderSystem);

        //RenderUpdate: 200-300
        const textureSys = sm.addSystem(TextureSystem);
        const texture2DSys = sm.addSystem(Texture2DSystem);

        //RenderUpdate: 300-400
        //300
        const materialSys = sm.addSystem(MaterialSystem);
        //301
        const baseMaterialSys = sm.addSystem(BaseMaterialSystem);
        //302
        const phongBaseMaterialSys = sm.addSystem(PhongBaseMaterialSystem);
        //303
        const pbrBaseMaterialSys = sm.addSystem(PBRBaseMaterialSystem);
        //330
        const unlitMaterialSys = sm.addSystem(UnlitMaterialSystem);
        //331
        const phoneMaterialSys = sm.addSystem(PhongMaterialSystem);
        //332
        const pbrMaterialSys = sm.addSystem(PBRMaterialSystem);
        //333
        const pbrSpecularMaterialSys = sm.addSystem(PBRSpecularMaterialSystem);

        //RenderUpdate: 400-500
        const boxGeometrySys = sm.addSystem(BoxGeometrySystem);
        const sphereGeometrySys = sm.addSystem(SphereGeometrySystem);
        //450
        const geometrySys = sm.addSystem(GeometrySystem);

        //RenderUpdate: 500-600
        //500
        const meshRendererSys = sm.addSystem(MeshRendererSystem);

        //RenderUpdate: 600-700
        //600
        const directLightSys = sm.addSystem(DirectLightSystem);

        //RenderUpdate: 1000
        const renderSys = sm.addSystem(RenderSystem);

        // canvasSys.init();
        // sys_glStateInit.init();
        sys_camera.init();
        // sys_glStateRelease.init();
        shaderSys.init();

        textureSys.init();
        texture2DSys.init();

        materialSys.init();
        baseMaterialSys.init();
        phongBaseMaterialSys.init();
        pbrBaseMaterialSys.init();
        unlitMaterialSys.init();
        phoneMaterialSys.init();
        pbrMaterialSys.init();
        pbrSpecularMaterialSys.init();

        boxGeometrySys.init();
        sphereGeometrySys.init();
        geometrySys.init();
        meshRendererSys.init();

        directLightSys.init();

        renderSys.init();

        //register loader
        const lm = world.loadManager;

        lm.addLoader("Texture2D", new Texture2DLoader(true), ["png", "jpg", "webp", "jpeg"]);
        lm.addLoader("Prefab", new GLTFLoader(false), ["gltf", "glb"]);
    }
}