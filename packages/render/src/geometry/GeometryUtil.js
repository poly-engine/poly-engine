import { vec3 } from "@poly-engine/math";


export class GeometryUtil {
    // static createBoxData(width = 1, height = 1, depth = 1) {
    //     const w2 = width / 2;
    //     const h2 = height / 2;
    //     const d2 = depth / 2;

    //     const positions = [
    //         // Up
    //         -w2, h2, -d2,
    //         w2, h2, -d2,
    //         w2, h2, d2,
    //         -w2, h2, d2,
    //         // Down
    //         -w2, -h2, -d2,
    //         w2, -h2, -d2,
    //         w2, -h2, d2,
    //         -w2, -h2, d2,
    //         // Left
    //         -w2, h2, -d2,
    //         -w2, h2, d2,
    //         -w2, -h2, d2,
    //         -w2, -h2, -d2,
    //         // Right
    //         w2, h2, -d2,
    //         w2, h2, d2,
    //         w2, -h2, d2,
    //         w2, -h2, -d2,
    //         // Front
    //         -w2, h2, d2,
    //         w2, h2, d2,
    //         w2, -h2, d2,
    //         -w2, -h2, d2,
    //         // Back
    //         -w2, h2, -d2,
    //         w2, h2, -d2,
    //         w2, -h2, -d2,
    //         -w2, -h2, -d2
    //     ];
    //     const normals = [
    //         // Up
    //         0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    //         // Down
    //         0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    //         // Left
    //         -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    //         // Right
    //         1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    //         // Front
    //         0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    //         // Back
    //         0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    //     ];
    //     const uvs = [
    //         // Up
    //         0, 0, 1, 0, 1, 1, 0, 1,
    //         // Down
    //         0, 1, 1, 1, 1, 0, 0, 0,
    //         // Left
    //         0, 0, 1, 0, 1, 1, 0, 1,
    //         // Right
    //         1, 0, 0, 0, 0, 1, 1, 1,
    //         // Front
    //         0, 0, 1, 0, 1, 1, 0, 1,
    //         // Back
    //         1, 0, 0, 0, 0, 1, 1, 1,
    //     ];
    //     // prettier-ignore
    //     const indices = [
    //         // Up
    //         0, 2, 1, 2, 0, 3,
    //         // Down
    //         4, 6, 7, 6, 4, 5,
    //         // Left
    //         8, 10, 9, 10, 8, 11,
    //         // Right
    //         12, 14, 15, 14, 12, 13,
    //         // Front
    //         16, 18, 17, 18, 16, 19,
    //         // Back
    //         20, 22, 23, 22, 20, 21
    //     ];
    //     return { positions, normals, uvs, indices };
    // }
    static createBoxData(width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
        // segments
        widthSegments = Math.floor(widthSegments);
        heightSegments = Math.floor(heightSegments);
        depthSegments = Math.floor(depthSegments);

        // buffers
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        // helper variables
        let numberOfVertices = 0;
        let groupStart = 0;

        // build each side of the box geometry

        buildPlane(2, 1, 0, - 1, - 1, depth, height, width, depthSegments, heightSegments, 0); // px
        buildPlane(2, 1, 0, 1, - 1, depth, height, - width, depthSegments, heightSegments, 1); // nx
        buildPlane(0, 2, 1, 1, 1, width, depth, height, widthSegments, depthSegments, 2); // py
        buildPlane(0, 2, 1, 1, - 1, width, depth, - height, widthSegments, depthSegments, 3); // ny
        buildPlane(0, 1, 2, 1, - 1, width, height, depth, widthSegments, heightSegments, 4); // pz
        buildPlane(0, 1, 2, - 1, - 1, width, height, - depth, widthSegments, heightSegments, 5); // nz        

        function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex) {
            const segmentWidth = width / gridX;
            const segmentHeight = height / gridY;
            const widthHalf = width / 2;
            const heightHalf = height / 2;
            const depthHalf = depth / 2;
            const gridX1 = gridX + 1;
            const gridY1 = gridY + 1;

            let vertexCounter = 0;
            let groupCount = 0;

            const vector = [0, 0, 0];

            // generate vertices, normals and uvs
            for (let iy = 0; iy < gridY1; iy++) {
                const y = iy * segmentHeight - heightHalf;
                for (let ix = 0; ix < gridX1; ix++) {
                    const x = ix * segmentWidth - widthHalf;

                    // set values to correct vector component
                    vector[u] = x * udir;
                    vector[v] = y * vdir;
                    vector[w] = depthHalf;
                    // now apply vector to vertex buffer
                    vertices.push(vector[0], vector[1], vector[2]);

                    // set values to correct vector component
                    vector[u] = 0;
                    vector[v] = 0;
                    vector[w] = depth > 0 ? 1 : - 1;
                    // now apply vector to normal buffer
                    normals.push(vector[0], vector[1], vector[2]);

                    // uvs
                    uvs.push(ix / gridX);
                    uvs.push(1 - (iy / gridY));

                    // counters
                    vertexCounter += 1;
                }

            }
            // indices
            // 1. you need three indices to draw a single face
            // 2. a single segment consists of two faces
            // 3. so we need to generate six (2*3) indices per segment
            for (let iy = 0; iy < gridY; iy++) {
                for (let ix = 0; ix < gridX; ix++) {
                    const a = numberOfVertices + ix + gridX1 * iy;
                    const b = numberOfVertices + ix + gridX1 * (iy + 1);
                    const c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
                    const d = numberOfVertices + (ix + 1) + gridX1 * iy;
                    // faces
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                    // increase counter
                    groupCount += 6;
                }
            }

            // add a group to the geometry. this will ensure multi material support
            // scope.addGroup(groupStart, groupCount, materialIndex);
            // calculate new start value for groups
            groupStart += groupCount;

            // update total number of vertices
            numberOfVertices += vertexCounter;
        }
        return { vertices, normals, uvs, indices };
    }
    static createSphereData(radius = 1, widthSegments = 32, heightSegments = 16, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI) {
        widthSegments = Math.max(3, Math.floor(widthSegments));
        heightSegments = Math.max(2, Math.floor(heightSegments));

        const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

        let index = 0;
        const grid = [];

        const vertex = vec3.create();
        const normal = vec3.create();

        // buffers

        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        // generate vertices, normals and uvs

        for (let iy = 0; iy <= heightSegments; iy++) {
            const verticesRow = [];
            const v = iy / heightSegments;

            // special case for the poles
            let uOffset = 0;
            if (iy === 0 && thetaStart === 0) {
                uOffset = 0.5 / widthSegments;
            } else if (iy === heightSegments && thetaEnd === Math.PI) {
                uOffset = - 0.5 / widthSegments;
            }

            for (let ix = 0; ix <= widthSegments; ix++) {
                const u = ix / widthSegments;

                // vertex
                vertex[0] = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertex[1] = radius * Math.cos(thetaStart + v * thetaLength);
                vertex[2] = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertices.push(vertex[0], vertex[1], vertex[2]);

                // normal
                // Vec3.copy(normal, vertex);
                vec3.normalize(normal, vertex);
                // normal.copy(vertex).normalize();
                normals.push(normal[0], normal[1], normal[2]);

                // uv
                uvs.push(u + uOffset, 1 - v);
                verticesRow.push(index++);
            }
            grid.push(verticesRow);
        }

        // indices
        for (let iy = 0; iy < heightSegments; iy++) {
            for (let ix = 0; ix < widthSegments; ix++) {
                const a = grid[iy][ix + 1];
                const b = grid[iy][ix];
                const c = grid[iy + 1][ix];
                const d = grid[iy + 1][ix + 1];

                if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
                if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
            }
        }
        return { vertices, normals, uvs, indices };
    }
}

// export const BoxData = {
//     // prettier-ignore
//     vertices: ([
//         -0.50, -0.50, 0.50,
//         -0.50, -0.50, 0.50,
//         -0.50, -0.50, 0.50,
//         -0.50, 0.50, 0.50,
//         -0.50, 0.50, 0.50,
//         -0.50, 0.50, 0.50,
//         -0.50, -0.50, -0.50,
//         -0.50, -0.50, -0.50,
//         -0.50, -0.50, -0.50,
//         -0.50, 0.50, -0.50,
//         -0.50, 0.50, -0.50,
//         -0.50, 0.50, -0.50,
//         0.50, -0.50, 0.50,
//         0.50, -0.50, 0.50,
//         0.50, -0.50, 0.50,
//         0.50, 0.50, 0.50,
//         0.50, 0.50, 0.50,
//         0.50, 0.50, 0.50,
//         0.50, -0.50, -0.50,
//         0.50, -0.50, -0.50,
//         0.50, -0.50, -0.50,
//         0.50, 0.50, -0.50,
//         0.50, 0.50, -0.50,
//         0.50, 0.50, -0.50
//     ]),
//     // prettier-ignore
//     normals: ([
//         -1.00, 0.00, 0.00,
//         0.00, -1.00, 0.00,
//         0.00, 0.00, 1.00,
//         -1.00, 0.00, 0.00,
//         0.00, 0.00, 1.00,
//         0.00, 1.00, 0.00,
//         -1.00, 0.00, 0.00,
//         0.00, -1.00, 0.00,
//         0.00, 0.00, -1.00,
//         -1.00, 0.00, 0.00,
//         0.00, 0.00, -1.00,
//         0.00, 1.00, 0.00,
//         0.00, -1.00, 0.00,
//         0.00, 0.00, 1.00,
//         1.00, 0.00, 0.00,
//         0.00, 0.00, 1.00,
//         0.00, 1.00, 0.00,
//         1.00, 0.00, 0.00,
//         0.00, -1.00, 0.00,
//         0.00, 0.00, -1.00,
//         1.00, 0.00, 0.00,
//         0.00, 0.00, -1.00,
//         0.00, 1.00, 0.00,
//         1.00, 0.00, 0.00
//     ]),

//     // prettier-ignore
//     uvs: ([
//         0.67, 0.67,
//         1.00, 1.00,
//         0.67, 0.33,
//         0.33, 0.67,
//         0.67, 0.67,
//         0.00, 0.00,
//         0.67, 1.00,
//         1.00, 0.67,
//         0.33, 0.33,
//         0.33, 1.00,
//         0.00, 0.33,
//         0.33, 0.00,
//         0.67, 1.00,
//         0.33, 0.33,
//         0.33, 1.00,
//         0.33, 0.67,
//         0.00, 0.33,
//         0.00, 1.00,
//         0.67, 0.67,
//         0.33, 0.67,
//         0.33, 0.67,
//         0.00, 0.67,
//         0.33, 0.33,
//         0.00, 0.67
//     ]),

//     // prettier-ignore
//     weights_arr: ([]),

//     // prettier-ignore
//     indices: ([
//         16, 5, 22,
//         5, 11, 22,
//         1, 12, 7,
//         12, 18, 7,
//         2, 4, 13,
//         4, 15, 13,
//         14, 17, 20,
//         17, 23, 20,
//         19, 21, 8,
//         21, 10, 8,
//         6, 9, 0,
//         9, 3, 0
//     ]),

// }
