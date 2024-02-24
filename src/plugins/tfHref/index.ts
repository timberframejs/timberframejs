import { pluginDefinition } from "src/types.js";
import { tfHref } from "./tfHref.js";

export const tfHrefPlugin = {
  name:'tfHref',
  endEventCallback: {
    when:'end',
    callback: tfHref,
    args:{
      _window: window
    }
  }
} as pluginDefinition