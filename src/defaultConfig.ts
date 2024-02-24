import { swapOptions, triggerOptions } from "./tfConstants.js";
import { eventListenerBuilder } from "./eventListener/addEventListener.js";
import { mainWorkflow } from "./eventListener/workflow.js";
import { getJson, postJson } from "./fetcher.js";
import { tfConfigType } from "./types.js";
import { preserveFocusPlugin } from "./plugins/preserveFocus/index.js";
import { tfHrefPlugin } from "./plugins/tfHref/index.js";
import { tfHostPlugIn } from "./plugins/tfHost/index.js";
import { tfHashPlugin } from "./plugins/tfHash/index.js";

// for now the assumption is that all responses will be json 
// you can send data to the server as FormData or json, but the response should be json
export const defaultConfig = {
  eventListenerBuilder,
  workflow:mainWorkflow,
  // note: serverPost can be postForm or postJson or a custom one
  serverPost:postJson,
  serverGet: getJson,
  defaultAttributes:{
    'tf-swap': swapOptions.outerHTML,
    'tf-trigger':triggerOptions.click,
  },
  tfCed:{
    verb:'post'
  },
  plugins:[ tfHrefPlugin, preserveFocusPlugin, tfHostPlugIn, tfHashPlugin]
} as tfConfigType
