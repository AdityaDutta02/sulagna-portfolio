// Tailwind v4: tokens defined in app/globals.css via @theme. This file
// exists only so content paths are discoverable by IDE tooling.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
};

export default config;
