import { tfMetaType, tfElementType, workflowArgs } from "../types.js"
import { makeFormData } from "./tfFormData.js"
import { getIncludeElement, getTargetEle } from "./parseTfTarget.js"

/**
 * when tf-ced="post" this is a special short circuit where we do not recreate the element.
 * we instead attach the form data then call connectedCallback.
 * Note: there is work related to this in the parseTfCed function
 * Form input trigger example:
 * 
 *  <form tf-trigger="input" tf-ced="patch">...</form>
 * 
 * Button in a form example:
 *  <button
 *      tf-trigger="click"
 *      tf-host="closest form"
 *      tf-include="host"
 *      tf-ced="patch include"
 *      tf-target="host">click</button>
 * 
 */
export const tfCedPatchWorkflow = (wf:workflowArgs, tfMeta:tfMetaType) => {
  const { ele } = wf

  const includedEle = tfMeta.tfInclude === null ? ele : getIncludeElement(ele, tfMeta) as tfElementType
  // note: user gets to decide which format by what they put in their componet
  const fd = makeFormData(includedEle, ele)
  // the default is to patch the included ele
  const target = tfMeta.tfCed.raw === 'patch target' ? getTargetEle(ele, tfMeta.targetSelector) as tfElementType: includedEle;
  const hasBody = target.hasOwnProperty('body')
  const hasModel = target.hasOwnProperty('model')
  if (hasBody) {
    if (hasBody === undefined) {
      target.body = fd;
    } else {
      for (const [key, val] of fd.entries()) {
        target.body.set(key, val)
      }
    }
  }
  if (hasModel) {
    // update or patch the model
    if(target.model === undefined){
      target.model = {}
    }
    for (const [key, val] of fd.entries()) {
      target.model[key] = val;
    }
  }
  if (!hasBody && !hasModel) {
    throw new Error('Using attribute tf-ced="patch" the element or the included element needs a property of body or model.')
  }

  if(tfMeta.tfCed.raw === 'patch target'){
    // todo: throw a helpful error if the target is not a custom element.
    target?.connectedCallback()
    return;
  }
  //note: thought about clearing the children here, but decided to leave that control to the component
  includedEle.connectedCallback();

  //todo: should we run the end plugins
}
