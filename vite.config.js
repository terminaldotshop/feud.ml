import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import melangePlugin from "vite-plugin-melange";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    ssr: {
        noExternal: ['react', 'react-dom'],
    },
    plugins: [
        react(),
        melangePlugin({
            emitDir: "src",
            buildTarget: "generated",
            buildCommand: "dune build",
            watchCommand: "dune build @melange -w",
        }),
    ],
});
