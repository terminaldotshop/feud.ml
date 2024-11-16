import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import melangePlugin from "vite-plugin-melange";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: {
	watch: { 
	  // usePolling: true,
	  // atomic: 200,
	  //  awaitWriteFinish: {
	  //    stabilityThreshold: 250,
	  //  }
	},
  },
  plugins: [
    react(),
    melangePlugin({
      emitDir: "src",
      buildTarget: "generated",
      buildCommand: "exit 0",
      watchCommand: "dune build @melange -w",
    }),
  ],
});
