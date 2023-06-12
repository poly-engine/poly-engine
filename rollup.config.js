import pkg from "./package.json";
export default {
    input: 'src/index.ts',
    output: [
        { format: "umd", file: pkg.main, name: "Poly" },
        { format: "es", file: pkg.module, sourcemap: true },
    ],
    plugins: [
    ],
}