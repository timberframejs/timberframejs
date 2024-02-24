import { swapOptions, targetOptions } from "../tfConstants.js";
import { tfMetaType, pluginArgs } from "../types.js";

/**
 * The issue with this is when it's discovered.
 * It is after the 
 */
export function guessTheTargetSelector(ele, tfMeta:tfMetaType) {
  // potential foot gun, guess a target when null
  if (tfMeta.targetSelector === null) {
    // if no children search up the tree
    if (ele.children.length === 0) {
      tfMeta.targetSelector = `closest ${tfMeta.ced.tagName}`
    } else {
      tfMeta.targetSelector = `document ${tfMeta.ced.tagName}`
    }
    ele.setAttribute('tf-target', tfMeta.targetSelector)
    tfMeta.brains.push('tf-target was empty so one was added for you.')
    console.warn(`'guess the target selector' is being deprecated. Please correct your code. ${ele.tagName} ${tfMeta.ced.tagName}`)
  }
}


function validate(target:Element|null , cmd:string){
  if(!target){
    console.warn(`A target could not be found with tf-target="${cmd}" attempting to use document.querySelector`)
    target = document.querySelector(cmd.replace('document ', ''));
    if(target === null){
      throw new Error(`Using document.querySelector did not work either for tf-target="${cmd}"`);
    }
  }
}

/**
 * in relation to the element in which the event happened on
 * try to use same language for includes or target
 * tf-target='div' document.querySelector('div')
 * tf-target='next' // next sibbling
 * tf-target='previous' // previous sibbling // but could just use parent
 * tf-target='closest div' x.closest('div')
 * tf-target='children div' //  x.querySelector(':scope div)
 * tf-target='parent div' // x.parentElement.querySelector(':scope div')
 * tf-target='parent2 div'
 * tf-target='parent3 div'
 * tf-target='parent4 div'
 * 
 */
export function getTargetEle(auElement: HTMLElement, cmd: string): HTMLElement {
  if (cmd === '' || cmd === undefined || cmd === null) {
    return;
  }
  // todo: add 'previous cssSelector' 
  if (cmd.startsWith('previous')) {
    throw Error("Previous selector is not yet implemented");
  }
  if (cmd.startsWith('closest')) {
    const selectorText = cmd.replace('closest ', '')
    const target = auElement.closest(selectorText)
    validate(target, cmd);
    return target as HTMLElement;
  }
  if (cmd === targetOptions.next) {
    // todo: this should be a next sibling with css
    const target =  auElement.nextElementSibling as HTMLElement
    validate(target, cmd);
    return target
  }

  if (cmd === 'this') {
    const target =  auElement
    validate(target, cmd);
    return target;
  }

  if (cmd.startsWith('document ')) {
    const target = document.querySelector(cmd.replace('document ', ''))
    validate(target, cmd);
    return target as HTMLElement;
  }

  // not even sure this makes sense, usually clickable things don't have children, but here as a footgun anyway
  if (cmd.startsWith('scope ')) {
    // expected 'scope div span'
   const target =  auElement.querySelector(`:${cmd}`)
   validate(target, cmd);
   return target as HTMLElement;
  }

  const target =  document.querySelector(cmd)
  validate(target, cmd);
  return target as HTMLElement;
}

/** not sure this is idea, we might include it in the form but than might not mean it's the target to replace
*/
export function getIncludeElement(ele: HTMLElement, tfMeta: tfMetaType) {
  if (tfMeta.tfInclude?.length > 0) {
    return getTargetEle(ele, tfMeta.tfInclude)
  }
  return ele
}

export function replaceAuTarget(plugIn:pluginArgs){

  // need to play with this some more and get it working better
  let toDispose = new DocumentFragment();
  switch (plugIn.tfMeta.tfSwap) {
    case swapOptions.innerHTML:
      // could see if the inner has any auElements and remove the event listeners
      while (plugIn.targetEle.firstChild) {
        toDispose.appendChild(plugIn.targetEle.firstChild);
      }
      plugIn.targetEle.replaceChildren()
      plugIn.targetEle.append(plugIn.cedEle)
      break;
    case swapOptions.delete:
      toDispose.appendChild(plugIn.targetEle);
      break;
    default:
      // outerHTML
      // this is most likely the issue with some cases not appending the previous swapped
      plugIn.targetEle.replaceWith(plugIn.cedEle)
      toDispose.appendChild(plugIn.targetEle);
      break;
  }
  return toDispose
}