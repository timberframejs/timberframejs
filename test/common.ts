import { isTfElement } from "../src/common.js";
import { tfConfigType, auElementType } from "../src/types.js";

export async function recurseTestNodes(node: HTMLElement, tfConfig: tfConfigType) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    await Array.from(node.children).forEach(child => recurseTestNodes(child as HTMLHtmlElement, tfConfig))
    if (!isTfElement(node)) { return; }
    await tfConfig.eventListenerBuilder(node as unknown as HTMLElement, tfConfig)
  }
}

