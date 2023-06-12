import pkg from "./package.json";

function glsl() {
	return {
		transform(code, id) {
			if (/\.glsl$/.test(id) === false) return;

			var transformedCode = 'export default ' + JSON.stringify(
				code
					.trim()
					.replace(/\r/g, '')
					.replace(/[ \t]*\/\/.*\n/g, '') // remove //
					.replace(/[ \t]*\/\*[\s\S]*?\*\//g, '') // remove /* */
					.replace(/\n{2,}/g, '\n') // # \n+ to \n
			) + ';';
			return {
				code: transformedCode,
				map: { mappings: '' }
			};
		}
	};
}

export default {
    input: 'src/index.js',
    output: [
        { format: "umd", file: pkg.main, name: "render" },
        { format: "es", file: pkg.module, sourcemap: true },
    ],
    plugins: [
        glsl(),
    ],
}

