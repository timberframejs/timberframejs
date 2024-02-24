import { pluginArgs } from "../../types.js";

/**
 * use tf-hash for now.
 * tf-href could be so much more and do not want to have breaking changes later
 */
export async function tfHref(plugIn: Partial<pluginArgs>, args) {
  const tfHref = plugIn.ele.getAttribute('tf-href')
  if (tfHref === null) { return null}
  let hash = tfHref
  if(tfHref === 'use tf-ced'){
    // todo:might want to whitelist or sanitize the tagname
    hash = `#${plugIn.tfMeta.tfCed.tagName}?${plugIn.tfMeta.tfCed.qs}`
  }
  // todo: this could be more sophisticated and use window.history.pushState
  args._window.location.hash = hash
  console.warn("Please use tf-hash, instead of tf-href. This tf-href will have breaking changes in the future.")
  return hash
}
