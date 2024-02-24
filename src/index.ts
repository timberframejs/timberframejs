export * from './utils/idMaker/index.js'
export * from './tfObserver.js'
export * from './auConstants.js'
export * from './utils/index.js'
export * from './defaultConfig.js'
import { _tfObserver } from './tfObserver.js'
import { defaultConfig } from './defaultConfig.js'
import { tfConfigType } from './types.js'
/**
 * usage
 * auObserver(document.body)
 * or if you want control over the HTTP requests or other options
 * auObserver(document.body, myConfig)
 */
export function auObserver(ele:HTMLElement, tfConfig:tfConfigType = defaultConfig) {
  _tfObserver(ele,tfConfig)
}

