// import { ImageLoader, AssetLoader } from "@poly-engine/asset";

// export class Texture2DLoader extends AssetLoader {

// 	constructor(assetManager, manager) {
// 		super(assetManager, manager);
// 	}

// 	load(url, onLoad, onProgress, onError) {
// 		// const texture = new Texture2D();
// 		let data = this.am.createAssetData(url, "Texture2D", "Texture", "Texture2D");
// 		let texture = data.Texture;
// 		let texture2D = data.Texture2D;

// 		const loader = new ImageLoader(this.manager);
// 		loader.setCrossOrigin(this.crossOrigin);
// 		loader.setPath(this.path);

// 		loader.load(url, function(image) {
// 			texture2D.image = image;

// 			if (onLoad) onLoad(data);
// 		}, onProgress, onError);

// 		return data;
// 	}

// }
