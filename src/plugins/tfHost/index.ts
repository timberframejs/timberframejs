import { pluginDefinition } from "src/types.js";
import { tfHostImpl } from "./tfHost";

export const tfHostPlugIn = {
  name:'tfHost',
  preflight: tfHostImpl
} as pluginDefinition