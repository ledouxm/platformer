import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh(), VitePWA()],
    base: "/",
    root: "./",
    build: {
        outDir: "./dist",
        emptyOutDir: true,
    },
    esbuild: {
        jsxInject: `import React from 'react'`,
    },
    resolve: {
        alias: [
            {
                find: "@",
                replacement: "/src",
            },
        ],
    },
});
