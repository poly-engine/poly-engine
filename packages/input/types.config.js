module.exports = {
    // JSDoc config
    source: {
        include: [
            "./src",
        ]
    },
    opts: {
        destination: "./dist/",
        template: "./node_modules/tsd-jsdoc/dist",
        outputSourceFiles: false,
        recurse: true,
        // access: "private",
        private: false
    },
    // replace-in-file config
    files: "dist/types.d.ts",
    from: [/^\s*declare /gm, /^(\s*)(function|type) /mg],
    to: ["export ", '$1export $2 ']
    // from: [/\/\*\*[\s\S]*?\*\/\s*/g, /^\s*declare /gm, /^(\s*)(function|type) /mg],
    // to: ['', "export ", '$1export $2 ']
};