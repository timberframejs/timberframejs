import { _auObserver } from '../auObserver.js';
import { isAuElement } from '../common.js';
import { getTargetEle, replaceAuTarget } from './parseTfTarget.js';
import { auCedEle, auElementType, pluginArgs, workflowArgs } from '../types.js';
import { createElement } from '../utils/index.js';
import { attachServerRespToCedEle } from './tfServerDsl.js';
import { gettfMeta } from './tfMeta.js';
import { tfCedPatchWorkflow } from './tfCedPatch.js';
import { tfCedPost } from './tfCedPost.js';

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

  if (isAuElement(ele as HTMLElement)) {
    (ele as auElementType).auAbortController.abort()
  }
  Array.from(ele.children).forEach(childEle => { removeOldEventListeners(childEle) })
}

export const mainWorkflow = async (wf: workflowArgs)=> {
  const { ele, initialMeta, tfConfig, e } = wf

  const tfMeta = await gettfMeta(ele, initialMeta, tfConfig)

  // patch has a totally different workflow, this could even move up one level
  if (tfMeta.auCed.raw.startsWith('patch')) {
    tfCedPatchWorkflow(wf, tfMeta)
    return;
  }
  const cedEle = createElement<auCedEle>(tfMeta.ced)

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
  _auObserver(cedEle, tfConfig)

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

  // todo: explore destroying other objects that are no longer needed
  return plugInArgs;
}
