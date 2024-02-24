import { pluginDefinition } from "src/types.js";
import { tfHash } from "./tfHash.js";


export const tfHashPlugin = {
  name:'tfHash',
  endEventCallback: {
    when:'end',
    callback: tfHash,
    args:{
      _window: window
    }
  }
} as pluginDefinition