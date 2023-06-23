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
import { DirectLightDef, SceneDirectLightDef } from "./light/DirectLight.js";
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
import { SceneFogSystem } from "./scene/SceneFogSystem.js";
import { PointLightDef, ScenePointLightDef } from "./light/PointLight.js";
import { PointLightSystem } from "./light/PointLightSystem.js";
import { SpotLightSystem } from "./light/SpotLightSystem.js";
import { SceneSpotLightDef, SpotLightDef } from "./light/SpotLight.js";
import { ShaderManager } from "./shader/ShaderManager.js";
import { FogDef, FogStateDef } from "./scene/Fog.js";
import { AmbientLightDef, AmbientLightStateDef } from "./scene/AmbientLight.js";
import { BackgroundDef, BackgroundStateDef } from "./scene/Background.js";
import { AmbientLightSystem } from "./scene/AmbientLightSystem.js";
import { BackgroundSystem } from "./scene/BackgroundSystem.js";
import { TextureCubeDef, TextureCubeStateDef } from "./texture/TextureCube.js";
import { TextureCubeSystem } from "./texture/TextureCubeSystem.js";
import { TextureCubeLoader } from "./loader1/TextureCubeLoader.js";
import { EnvLoader } from "./loader1/EnvLoader.js";
import { SkyBoxMaterialDef, SkyBoxMaterialStateDef } from "./material/SkyBoxMaterial.js";
import { SkyBoxMaterialSystem } from "./material/SkyBoxMaterialSystem.js";
import { SkyDef, SkyStateDef } from "./scene/Sky.js";
import { SkySystem } from "./scene/SkySystem.js";

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

        const skyMaterialCom = em.registerComponent('SkyBoxMaterial', SkyBoxMaterialDef);
        const skyMaterialStateCom = em.registerComponent('SkyBoxMaterialState', SkyBoxMaterialStateDef);

        const renderStateCom = em.registerComponent('RenderState', RenderStateDef);
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
        const com_textureState = em.registerComponent('TextureState', TextureStateDef);
        const com_texture2D = em.registerComponent('Texture2D', Texture2DDef);
        const com_texture2DState = em.registerComponent('Texture2DState', Texture2DStateDef);
        const com_textureCube = em.registerComponent('TextureCube', TextureCubeDef);
        const com_textureCubeState = em.registerComponent('TextureCubeState', TextureCubeStateDef);
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
        const sceneDirectLightCom = em.registerComponent('SceneDirectLight', SceneDirectLightDef);

        const pointLightCom = em.registerComponent('PointLight', PointLightDef);
        const scenePointLightCom = em.registerComponent('ScenePointLight', ScenePointLightDef);

        const spotLightCom = em.registerComponent('SpotLight', SpotLightDef);
        const sceneSpotLightCom = em.registerComponent('SceneSpotLight', SceneSpotLightDef);

        //#endregion

        //#region scene
        const fogCom = em.registerComponent('Fog', FogDef);
        const fogStateCom = em.registerComponent('FogState', FogStateDef);

        const ambientLightCom = em.registerComponent('AmbientLight', AmbientLightDef);
        const ambientLightStateCom = em.registerComponent('AmbientLightState', AmbientLightStateDef);

        const backgroundCom = em.registerComponent('Background', BackgroundDef);
        const backgroundStateCom = em.registerComponent('BackgroundState', BackgroundStateDef);

        const skyCom = em.registerComponent('Sky', SkyDef);
        const skyStateCom = em.registerComponent('SkyState', SkyStateDef);
        //#endregion

        //#region mesh renderer
        const com_meshRenderer = em.registerComponent('MeshRenderer', MeshRendererDef);
        const com_meshRendererState = em.registerComponent('MeshRendererState', MeshRendererStateDef);
        //#endregion

        //query

        //manager
        world.glManager = new GLManager(world);
        world.shaderManager = new ShaderManager(world);
        
        //system
        // const canvasSys = sm.addSystem(CanvasSystem);
        // const sys_glStateInit = sm.addSystem(GlStateInitSystem);
        //LateUpdate: 1200
        const sys_camera = sm.addSystem(CameraSystem);
        // const sys_glStateRelease = sm.addSystem(GlStateReleaseSystem);

        //RenderUpdate: 100-200
        // const sys_shaderState = sm.addSystem(ShaderStateSystem);
        const shaderSys = sm.addSystem(ShaderSystem);

        //RenderUpdate: 200-300
        //200
        const textureSys = sm.addSystem(TextureSystem, true);
        //201
        const texture2DSys = sm.addSystem(Texture2DSystem, true);
        //202
        const textureCubeSys = sm.addSystem(TextureCubeSystem, true);

        //RenderUpdate: 300-400
        //300
        const materialSys = sm.addSystem(MaterialSystem);
        //301
        const baseMaterialSys = sm.addSystem(BaseMaterialSystem);
        const skyMaterialSys = sm.addSystem(SkyBoxMaterialSystem, true);
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
        //610
        const sceneFogSys = sm.addSystem(SceneFogSystem, true);
        //650
        const directLightSys = sm.addSystem(DirectLightSystem, true);
        //660
        const pointLightSys = sm.addSystem(PointLightSystem, true);
        //660
        const spotLightSys = sm.addSystem(SpotLightSystem, true);
        //630
        const ambientLightSys = sm.addSystem(AmbientLightSystem, true);
        //620
        const backgroundSys = sm.addSystem(BackgroundSystem, true);
        //620
        const skySys = sm.addSystem(SkySystem, true);

        //RenderUpdate: 5000
        const renderSys = sm.addSystem(RenderSystem);

        // canvasSys.init();
        // sys_glStateInit.init();
        sys_camera.init();
        // sys_glStateRelease.init();
        shaderSys.init();

        // textureSys.init();
        // texture2DSys.init();

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

        // directLightSys.init();

        renderSys.init();

        //register loader
        const lm = world.loadManager;

        lm.addLoader("Texture2D", new Texture2DLoader(true), ["png", "jpg", "webp", "jpeg"]);
        lm.addLoader("TextureCube", new TextureCubeLoader(true), [""]);
        lm.addLoader("AmbientLight", new EnvLoader(true), ["env"]);
        lm.addLoader("Prefab", new GLTFLoader(false), ["gltf", "glb"]);
    }
}