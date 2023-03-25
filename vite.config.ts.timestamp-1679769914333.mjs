// vite.config.ts
import { defineConfig } from "file:///Users/novyjpolzovatel/Desktop/FHP/node_modules/vite/dist/node/index.js";
import react from "file:///Users/novyjpolzovatel/Desktop/FHP/node_modules/@vitejs/plugin-react/dist/index.mjs";
import Icons from "file:///Users/novyjpolzovatel/Desktop/FHP/node_modules/unplugin-icons/dist/vite.mjs";
import Unfonts from "file:///Users/novyjpolzovatel/Desktop/FHP/node_modules/unplugin-fonts/dist/vite.mjs";
var mobile = process.env.TAURI_PLATFORM === "android" || process.env.TAURI_PLATFORM === "ios";
var vite_config_default = defineConfig(async ({ command, mode }) => {
  return {
    plugins: [
      react(),
      Icons({
        compiler: "jsx",
        jsx: "react"
      }),
      Unfonts({
        google: {
          families: ["Noto Sans Display"]
        }
      })
    ],
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true
    },
    // to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      // Tauri supports es2021
      target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbm92eWpwb2x6b3ZhdGVsL0Rlc2t0b3AvRkhQXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbm92eWpwb2x6b3ZhdGVsL0Rlc2t0b3AvRkhQL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9ub3Z5anBvbHpvdmF0ZWwvRGVza3RvcC9GSFAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgVW5mb250cyBmcm9tICd1bnBsdWdpbi1mb250cy92aXRlJ1xuY29uc3QgbW9iaWxlID1cbiAgcHJvY2Vzcy5lbnYuVEFVUklfUExBVEZPUk0gPT09IFwiYW5kcm9pZFwiIHx8XG4gIHByb2Nlc3MuZW52LlRBVVJJX1BMQVRGT1JNID09PSBcImlvc1wiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGFzeW5jICh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBJY29ucyh7XG4gICAgICBjb21waWxlcjogJ2pzeCcsXG4gICAgICBqc3g6ICdyZWFjdCcsXG4gICAgfSksXG4gICAgVW5mb250cyh7XG4gICAgICBnb29nbGU6IHtcbiAgICAgICAgZmFtaWxpZXM6IFtcIk5vdG8gU2FucyBEaXNwbGF5XCJdXG4gICAgICB9XG4gICAgfSksXSxcbiAgICAvLyBWaXRlIG9wdGlvbnMgdGFpbG9yZWQgZm9yIFRhdXJpIGRldmVsb3BtZW50IGFuZCBvbmx5IGFwcGxpZWQgaW4gYHRhdXJpIGRldmAgb3IgYHRhdXJpIGJ1aWxkYFxuICAgIC8vIHByZXZlbnQgdml0ZSBmcm9tIG9ic2N1cmluZyBydXN0IGVycm9yc1xuICAgIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgICAvLyB0YXVyaSBleHBlY3RzIGEgZml4ZWQgcG9ydCwgZmFpbCBpZiB0aGF0IHBvcnQgaXMgbm90IGF2YWlsYWJsZVxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogMTQyMCxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgfSxcbiAgICAvLyB0byBtYWtlIHVzZSBvZiBgVEFVUklfREVCVUdgIGFuZCBvdGhlciBlbnYgdmFyaWFibGVzXG4gICAgLy8gaHR0cHM6Ly90YXVyaS5zdHVkaW8vdjEvYXBpL2NvbmZpZyNidWlsZGNvbmZpZy5iZWZvcmVkZXZjb21tYW5kXG4gICAgZW52UHJlZml4OiBbXCJWSVRFX1wiLCBcIlRBVVJJX1wiXSxcbiAgICBidWlsZDoge1xuICAgICAgLy8gVGF1cmkgc3VwcG9ydHMgZXMyMDIxXG4gICAgICB0YXJnZXQ6IHByb2Nlc3MuZW52LlRBVVJJX1BMQVRGT1JNID09IFwid2luZG93c1wiID8gXCJjaHJvbWUxMDVcIiA6IFwic2FmYXJpMTNcIixcbiAgICAgIC8vIGRvbid0IG1pbmlmeSBmb3IgZGVidWcgYnVpbGRzXG4gICAgICBtaW5pZnk6ICFwcm9jZXNzLmVudi5UQVVSSV9ERUJVRyA/IFwiZXNidWlsZFwiIDogZmFsc2UsXG4gICAgICAvLyBwcm9kdWNlIHNvdXJjZW1hcHMgZm9yIGRlYnVnIGJ1aWxkc1xuICAgICAgc291cmNlbWFwOiAhIXByb2Nlc3MuZW52LlRBVVJJX0RFQlVHLFxuICAgIH0sXG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3UixTQUFTLG9CQUFvQjtBQUNyVCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sYUFBYTtBQUNwQixJQUFNLFNBQ0osUUFBUSxJQUFJLG1CQUFtQixhQUMvQixRQUFRLElBQUksbUJBQW1CO0FBR2pDLElBQU8sc0JBQVEsYUFBYSxPQUFPLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDdkQsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQUMsTUFBTTtBQUFBLE1BQUcsTUFBTTtBQUFBLFFBQ3ZCLFVBQVU7QUFBQSxRQUNWLEtBQUs7QUFBQSxNQUNQLENBQUM7QUFBQSxNQUNELFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxVQUNOLFVBQVUsQ0FBQyxtQkFBbUI7QUFBQSxRQUNoQztBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQUU7QUFBQTtBQUFBO0FBQUEsSUFHSCxhQUFhO0FBQUE7QUFBQSxJQUViLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxJQUNkO0FBQUE7QUFBQTtBQUFBLElBR0EsV0FBVyxDQUFDLFNBQVMsUUFBUTtBQUFBLElBQzdCLE9BQU87QUFBQTtBQUFBLE1BRUwsUUFBUSxRQUFRLElBQUksa0JBQWtCLFlBQVksY0FBYztBQUFBO0FBQUEsTUFFaEUsUUFBUSxDQUFDLFFBQVEsSUFBSSxjQUFjLFlBQVk7QUFBQTtBQUFBLE1BRS9DLFdBQVcsQ0FBQyxDQUFDLFFBQVEsSUFBSTtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
