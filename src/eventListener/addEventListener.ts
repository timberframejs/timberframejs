import { triggerOptions } from "../tfConstants.js";
import { mainWorkflow } from "./workflow.js";
import { tfConfigType, tfElementType, eventSetupArgs, workflowArgs, tfCedEle } from "../types.js";
import { tfMetaPrep } from "./tfMeta.js";
import { parseTfCed } from './parseTfCed.js';
import { createElement } from '../utils/index.js';

const triggerKeys = Object.values(triggerOptions)

export async function basicEventListener(eventSetup: eventSetupArgs) {
  eventSetup.ele.auAbortController = new AbortController()

  eventSetup.ele.addEventListener(eventSetup.initialMeta.trigger, async (e) => {
    (eventSetup as workflowArgs).e = e;
    if(eventSetup.tfConfig.workflow){
      await eventSetup.tfConfig.workflow(eventSetup as workflowArgs)
    }else{
      // easier tracing and debugging, but allows for overriding
      mainWorkflow(eventSetup as workflowArgs)
    }
  }, { signal: eventSetup.ele.auAbortController.signal })
  
  eventSetup.ele.dispatchEvent(new CustomEvent("tf-done"))
}


export async function eventListenerBuilder(ele: tfElementType, tfConfig:tfConfigType) {
  // prevent infinate loop or already processed elements
  if (ele.auState === 'processed') { return; }
  ele.auState = 'processed'

  // If element doesnt have a ced we need to handle the element as a special use-case plugin
  if(ele.getAttribute("tf-ced") == null) {
    if(ele.getAttribute("tf-remove-me") != null) {
      buildPluginRemoveMe(ele, Number(ele.getAttribute("tf-remove-me")));
      return;
    }
    
  }

  // Loading CED Plugin
  // If this attribute is found we need to process a loading state on target ele
  if(ele.getAttribute("tf-loading-ced") != null) {
    buildPluginLoading(ele, parseTfCed(ele.getAttribute('tf-loading-ced'), tfConfig, ele));
    if(ele.getAttribute("tf-ced") == null) {
      return;
    }
  }

  const initialMeta = await tfMetaPrep(ele, tfConfig);
  const eventSetupArgs = {
    ele,
    tfConfig,
    initialMeta
  } as eventSetupArgs;

  
  tfConfig._plugins.preflight.forEach(p=>p.preflight(eventSetupArgs));

  // safety to limit the types of events or triggers, this will need to change as the api expands
  if (!triggerKeys.includes(initialMeta.trigger)) { return }
  await basicEventListener(eventSetupArgs)

  // todo: htmx supports a setTimeout option too.
}

function buildPluginRemoveMe(ele: tfElementType, removalTimoutMs: number) {
  setTimeout(() => {
    ele.remove();
  }, removalTimoutMs);
}

function buildPluginLoading(ele: tfElementType, ced) {

  let originalStyle = ele.style.display;

  // show / hide done instead of replace to preserve element relationships
  ced.attributes = [];
  for (const [key, value] of ced.qs.entries()) {
    ced.attributes[key] = value
  }
  // create element
  const cedEle = createElement<tfCedEle>(ced)

  // hide original
  ele.style.display = "none";

  // add working element after hidden original
  ele.insertAdjacentElement('afterend', cedEle)

  // setup expected function in host element
  ele["tfIsDone"] = () => {
    
    // swap original display styles with temp
    ele.style.display = originalStyle;
    ele.parentNode.removeChild(ele.nextSibling);
  }

  // How to give a warning that tf-is-done needs to be listened to?
}