import { defineConfig, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
  cli: {
    entry: {
      patterns: ["./main.tsx"],
      outFile: "./static/uno.css",
    },
  },
  presets: [
    presetUno(),
    presetWebFonts({
        provider: "google",
        fonts: {
            sans: "M PLUS 2"
        }
    })
  ],
});
