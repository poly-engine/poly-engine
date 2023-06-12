import pkg from "./package.json";
export default {
    input: 'src/index.js',
    output: [
        { format: "umd", file: pkg.main, name: "math" },
        { format: "es", file: pkg.module, sourcemap: true },
    ],
    plugins: [
    ],
}