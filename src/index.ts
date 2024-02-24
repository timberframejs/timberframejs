export * from './utils/idMaker/index.js'
export * from './auObserver.js'
export * from './auConstants.js'
export * from './utils/index.js'
export * from './defaultConfig.js'
import { _auObserver } from './auObserver.js'
import { defaultConfig } from './defaultConfig.js'
import { tfConfigType } from './types.js'
/**
 * usage
 * auObserver(document.body)
 * or if you want control over the HTTP requests or other options
 * auObserver(document.body, myConfig)
 */
export function auObserver(ele:HTMLElement, auConfig:tfConfigType = defaultConfig) {
  _auObserver(ele,auConfig)
}

