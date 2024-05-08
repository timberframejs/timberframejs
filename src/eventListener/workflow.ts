import { _tfObserver } from '../tfObserver.js';
import { isTfElement } from '../common.js';
import { getTargetEle, replaceAuTarget } from './parseTfTarget.js';
import { parseTfCed } from '../../src/eventListener/parseTfCed';
import { tfCedEle, tfElementType, pluginArgs, workflowArgs, tfConfigType, tfPingPOSTBody } from '../types.js';
import { createElement,  } from '../utils/index.js';
import { attachServerRespToCedEle } from './tfServerDSL.js';
import { gettfMeta } from './tfMeta.js';
import { tfCedPatchWorkflow } from './tfCedPatch.js';
import { tfCedPost } from './tfCedPost.js';
import { defaultConfig } from '../defaultConfig';
import { makeComplexData } from "./tfFormData.js";

/**
 * destroy the old event listener so we don't degrade performance
 * if issues, then turn this off.
 * todo: prove this is valuable
 */ 
const removeOldEventListeners = async (ele: Element | DocumentFragment)=> {
  if (ele.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    Array.from(ele.children).forEach(childEle => { removeOldEventListeners(childEle) })
    return
  }

  if (isTfElement(ele as HTMLElement)) {
    (ele as tfElementType).auAbortController?.abort()
  }
  Array.from(ele.children).forEach(childEle => { removeOldEventListeners(childEle) })
}

const startWorking = (originalEle: HTMLElement, tfMeta) : string => {
  let ced = tfMeta.tfWorkingCed;
  let originalStyle = originalEle.style.display;

  // build attributes
  ced.attributes = [];
  for (const [key, value] of ced.qs.entries()) {
    ced.attributes[key] = value
  }
  // create element
  const cedEle = createElement<tfCedEle>(ced)

  // if post add data
  if(ced.verb === 'post') {
    let workingMeta = {...tfMeta};
    workingMeta.tfCed.verb = 'post';
    workingMeta.server = null;
    const plugInArgs = {
      tfMeta : workingMeta,
      ele : originalEle,
      cedEle : cedEle,
    } as pluginArgs
  
    tfCedPost(plugInArgs);
  }

  /*
    Instead of replacing the original element we are hiding it and appending the working element next to it.
    We need to do it this way because the main workflow uses the initial element for most of its target work.
    Replacing the element will nullify all the references it needs and result in errors.
  */

  // hide original
  originalEle.style.display = "none";

  // add working element after hidden original
  originalEle.insertAdjacentElement('afterend', cedEle)
  return originalStyle;
}

const endWorking = async (originalEle: HTMLElement, originalStyle:string)=> {
  originalEle.style.display = originalStyle;
  // Remove adjacent element
  originalEle.parentNode.removeChild(originalEle.nextSibling)
}

export const mainWorkflow = async (wf: workflowArgs)=> {
  const { ele, initialMeta, tfConfig, e } = wf

  const tfMeta = await gettfMeta(ele, initialMeta, tfConfig)

  let eleDisplayStyle = "";
  if(tfMeta.tfWorkingCed) {
    eleDisplayStyle = startWorking(ele, tfMeta)
  }
  
  // patch has a totally different workflow, this could even move up one level
  if (tfMeta.tfCed.raw.startsWith('patch')) {
    tfCedPatchWorkflow(wf, tfMeta)
    return;
  }

  // if ping analytics are setup we send those to configured endpoint
  if (tfMeta.tfPing !== null && tfConfig.tfPingEndpointUrl != null) {
    const postBody = {
      feature: tfMeta.tfPing,
      fromEleID: ele.id,
      fromEleTag: ele.tagName,
      toComponent: tfMeta.tfCed.tagName,
      trigger: tfMeta.trigger,
      server: tfMeta.server
    } as tfPingPOSTBody
     
    // fire and forget ping post
    tfConfig.serverPost(tfConfig.tfPingEndpointUrl, postBody, null);
  }

  const cedEle = createElement<tfCedEle>(tfMeta.ced)

  const plugInArgs = {
    e,
    tfMeta,
    ele,
    cedEle,
    tfConfig: tfConfig
  } as pluginArgs

  // attachServerResp is mutually exclusive against update the component with form data
  await attachServerRespToCedEle(plugInArgs)

  tfCedPost(plugInArgs)

  cedEle.tfMeta = { ...tfMeta } // add the metadata for debugging and other edge use cases like maybe they want to parse the tf-post query params
  // the observer will decide if it needs to wire up as another auElement
  // todo: validate this is still necessary.
  _tfObserver(cedEle, tfConfig)

  // todo: clear up the language between the targetElement and the event target element. The event target is what kicks everything off like a button is clicked on. The button is the eventTargetEle. 
  //       the target or targetEle is where we are going to insert the newEle created by CED into the DOM.


  const target = getTargetEle(ele, tfMeta.targetSelector)
  plugInArgs.targetEle = target

  let toDispose = new DocumentFragment()
  // todo: add error message that tf-view-transition is not compatible with preserve focusS
  // @ts-ignore
  if(plugInArgs.ele.hasAttribute('tf-view-transition') && document.startViewTransition){
     // @ts-ignore
    document.startViewTransition(()=>{
      toDispose = replaceAuTarget(plugInArgs)
      wf.tfConfig._plugins.atEnd.forEach(pi => pi.endEventCallback.callback(plugInArgs, pi.endEventCallback.args))
      removeOldEventListeners(toDispose)
    })
  }else{
    toDispose = replaceAuTarget(plugInArgs)
    wf.tfConfig._plugins.atEnd.forEach(pi => pi.endEventCallback.callback(plugInArgs, pi.endEventCallback.args))
    removeOldEventListeners(toDispose)
  }

  if(tfMeta.tfWorkingCed) {
    endWorking(ele, eleDisplayStyle);
  }

  // todo: explore destroying other objects that are no longer needed
  return plugInArgs;
}

export class executeRawWorkflowArgs {
  ced: string;
  targetSelector: string;
  fromElement?: HTMLElement;
  server?: string;
  swap?: string;
  include?: string;
  config?: tfConfigType;
}
export const executeRawWorkflow = async (args: executeRawWorkflowArgs)=> {

  const config = args.config || defaultConfig;
  const ele = args.fromElement || document.querySelector('body');
  const initialMeta = {
    targetSelector : args.targetSelector,
    server: args.server,
    tfSwap: args.swap,
    tfCed: parseTfCed(args.ced, config, undefined),
    tfInclude: args.include
  };
  const tfConfig = config;
  const wf = {ele, initialMeta, tfConfig, e: undefined}
  
  const tfMeta = initialMeta;
  if (initialMeta.tfCed.raw.startsWith('patch')) {
    tfCedPatchWorkflow(wf as any, tfMeta as any)
    return;
  }

  const cedEle = createElement<tfCedEle>(tfMeta.tfCed)

  const plugInArgs = {
    tfMeta,
    ele,
    cedEle,
    tfConfig: tfConfig,
    targetEle: null
  }

  // attachServerResp is mutually exclusive against update the component with form data
  await attachServerRespToCedEle(plugInArgs as any)

  tfCedPost(plugInArgs as any)

  cedEle.tfMeta = { ...tfMeta } as any // add the metadata for debugging and other edge use cases like maybe they want to parse the tf-post query params
  // the observer will decide if it needs to wire up as another auElement
  // todo: validate this is still necessary.
  _tfObserver(cedEle, tfConfig)

  const target = getTargetEle(ele, tfMeta.targetSelector)
  plugInArgs.targetEle = target

  let toDispose = new DocumentFragment()
  toDispose = replaceAuTarget(plugInArgs as any)

  wf.tfConfig._plugins.atEnd.forEach(pi => pi.endEventCallback.callback(plugInArgs as any, pi.endEventCallback.args))
  removeOldEventListeners(toDispose)
}
