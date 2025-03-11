"use strict";

import clear from 'rollup-plugin-clear';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import screeps from 'rollup-plugin-screeps';
import { execSync } from 'child_process';

let cfg;

// Helper function for getting secrets from 1Password CLI
function getSecretFromVault(itemName, fieldName, vaultName) {
  try {
    // Adjust to include the vault explicitly
    return execSync(`op item get "${itemName}" --vault "${vaultName}" --field "${fieldName}"`, { encoding: 'utf-8' }).trim();
  } catch (error) {
    console.error(`Error fetching secret "${itemName}.${fieldName}" from vault "${vaultName}":`, error.message);
    process.exit(1);
  }
}

const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified - code will be compiled but not uploaded");
} else if ((cfg = require("./screeps.json")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

// Dynamically inject secrets using 1Password CLI
// Here we retrieve the "Token" property from the "Screeps" item inside the "Screeps" vault
if (dest === "pserver") {
  cfg.email = getSecretFromVault("Screeps", "email", "Screeps");
  cfg.password = getSecretFromVault("Screeps", "password", "Screeps");
} else {
  cfg.token = getSecretFromVault("Screeps", "Token", "Screeps"); // Assuming the token is stored this way
}

export default [{
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    clear({ targets: ["dist"] }),
    resolve({ rootDir: "src" }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    screeps({ config: cfg, dryRun: cfg == null }),
  ],
}, {
  input: 'src/console/Connect.ts', // update this line, replace with your file path
  output: {
    file: 'distConsole/Connect.mjs', // update this line, place the output where you need it
    format: 'es',
    inlineDynamicImports: true,
  },
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    clear({ targets: ["distConsole"] }),
    resolve({ rootDir: "src" }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
}];
