import backgroundTextureFs from "../shaderlib/extra/background-texture.fs.glsl";
import backgroundTextureVs from "../shaderlib/extra/background-texture.vs.glsl";
import blinnPhongFs from "../shaderlib/extra/blinn-phong.fs.glsl";
import blinnPhongVs from "../shaderlib/extra/blinn-phong.vs.glsl";
import particleFs from "../shaderlib/extra/particle.fs.glsl";
import particleVs from "../shaderlib/extra/particle.vs.glsl";
import pbrSpecularFs from "../shaderlib/extra/pbr-specular.fs.glsl";
import pbrFs from "../shaderlib/extra/pbr.fs.glsl";
import pbrVs from "../shaderlib/extra/pbr.vs.glsl";
import shadowMapFs from "../shaderlib/extra/shadow-map.fs.glsl";
import shadowMapVs from "../shaderlib/extra/shadow-map.vs.glsl";
import skyboxFs from "../shaderlib/extra/skybox.fs.glsl";
import skyboxVs from "../shaderlib/extra/skybox.vs.glsl";
import skyProceduralFs from "../shaderlib/extra/SkyProcedural.fs.glsl";
import skyProceduralVs from "../shaderlib/extra/SkyProcedural.vs.glsl";
import spriteMaskFs from "../shaderlib/extra/sprite-mask.fs.glsl";
import spriteMaskVs from "../shaderlib/extra/sprite-mask.vs.glsl";
import spriteFs from "../shaderlib/extra/sprite.fs.glsl";
import spriteVs from "../shaderlib/extra/sprite.vs.glsl";
import unlitFs from "../shaderlib/extra/unlit.fs.glsl";
import unlitVs from "../shaderlib/extra/unlit.vs.glsl";


export class ShaderManager {
    constructor(world) {
        this.world = world;

        this.assetManager = this.world.assetManager;
        this._init();
    }

    _init() {
        this.assetManager.addAssetData({
            Asset: { id: 'sha_unlit', type: 'Shader', },
            Shader: { id: 'sha_unlit', vSource: unlitVs, fSource: unlitFs, }
        });
        this.assetManager.addAssetData({
            Asset: { id: 'sha_phong', type: 'Shader', },
            Shader: { id: 'sha_phong', vSource: blinnPhongVs, fSource: blinnPhongFs, }
        });
        this.assetManager.addAssetData({
            Asset: { id: 'sha_pbr', type: 'Shader', },
            Shader: { id: 'sha_pbr', vSource: pbrVs, fSource: pbrFs, }
        });
        this.assetManager.addAssetData({
            Asset: { id: 'sha_pbrSpecular', type: 'Shader', },
            Shader: { id: 'sha_pbrSpecular', vSource: pbrVs, fSource: pbrSpecularFs, }
        });

        // Shader.create("skybox", [new ShaderPass(skyboxVs, skyboxFs, forwardPassTags)]);
        this.assetManager.addAssetData({
            Asset: { id: 'skybox', type: 'Shader', },
            Shader: { id: 'skybox', vSource: skyboxVs, fSource: skyboxFs, }
        });
        // Shader.create("SkyProcedural", [new ShaderPass(skyProceduralVs, skyProceduralFs, forwardPassTags)]);
        this.assetManager.addAssetData({
            Asset: { id: 'SkyProcedural', type: 'Shader', },
            Shader: { id: 'SkyProcedural', vSource: skyProceduralVs, fSource: skyProceduralFs, }
        });

        // Shader.create("background-texture", [new ShaderPass(backgroundTextureVs, backgroundTextureFs, forwardPassTags)]);
        this.assetManager.addAssetData({
            Asset: { id: 'background-texture', type: 'Shader', },
            Shader: { id: 'background-texture', vSource: backgroundTextureVs, fSource: backgroundTextureFs, }
        });
    
    }
}