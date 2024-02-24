import { isTfElement } from './common.js';
import { tfConfigType } from './types.js';

export function recurseNodes(node: HTMLElement, tfConfig: tfConfigType) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    // console.log(node?.tagName)
    node.childNodes.forEach(child => recurseNodes(child as HTMLHtmlElement, tfConfig))
    if (!isTfElement(node)) { return; }
    tfConfig.eventListenerBuilder(node as unknown as HTMLElement, tfConfig)
  }
}

const getCallback = (tfConfig: tfConfigType) => {
  // Callback function to execute when mutations are observed
  return (mutationList: MutationRecord[], observer) => {
    for (const mutation of mutationList) {
      if (mutation.target?.nodeType === 1 || mutation.target?.nodeType === 11) {
        recurseNodes(mutation.target as HTMLElement, tfConfig)
      }
    }
  };
}

export const prepareAuConfig = (tfConfig: tfConfigType) => {
  tfConfig._plugins = {
    atEnd: tfConfig.plugins.filter(p => p.endEventCallback !== undefined),
    preflight: tfConfig.plugins.filter(p => p.preflight !== undefined)
  }
  return tfConfig;
}

export function _tfObserver(ele: HTMLElement, tfConfig: tfConfigType) {
  if (!Object.isFrozen(tfConfig)) {
    // organize plugins once to improve performance
    prepareAuConfig(tfConfig)
    Object.freeze(tfConfig);
  }
  const callback = getCallback(tfConfig);
  const tfObserver = new MutationObserver(callback);
  tfObserver.observe(ele, { attributes: true, subtree: true, childList: true })
}
