import type { Config } from "tailwindcss";
import sharedConfig from "@gaqno-dev/config/tailwind";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [sharedConfig],
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar')],
};

export default config;
