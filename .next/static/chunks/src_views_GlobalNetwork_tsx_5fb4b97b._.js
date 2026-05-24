(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/views/GlobalNetwork.tsx [app-client] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/src_views_GlobalNetwork_tsx_a09212ad._.js",
  "static/chunks/node_modules_0cf8eeb3._.js",
  {
    "path": "static/chunks/_07db4d90._.css",
    "included": [
      "[project]/node_modules/leaflet/dist/leaflet.css [app-client] (css)",
      "[project]/src/views/GlobalNetwork.css [app-client] (css)"
    ],
    "moduleChunks": [
      "static/chunks/node_modules_leaflet_dist_leaflet_css_bad6b30c._.single.css",
      "static/chunks/src_views_GlobalNetwork_css_bad6b30c._.single.css"
    ]
  },
  "static/chunks/src_views_GlobalNetwork_tsx_ec036ae2._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/views/GlobalNetwork.tsx [app-client] (ecmascript, next/dynamic entry)");
    });
});
}),
]);