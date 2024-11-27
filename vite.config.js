import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// TODO: Publish this so we can import it.
import { melangeDuneFree, melangeWithDune } from "/home/tjdevries/git/vite-plugin-ocaml/dist/index.mjs";


// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src"), "_build/": false } },
  server: {
    // fs: { allow: ["./src", "./public"] },
    watch: {
      ignored: ['**/_build/**'], // Exclude from watcher
    },
  },
    // ssr: {
    //     noExternal: ['react', 'react-dom'],
    // },
    plugins: [
        react(),
        melangeDuneFree({ root: "src", target: "generated", }),
        // melangeWithDune({ root: "src", target: "generated", }),
    ],
});
