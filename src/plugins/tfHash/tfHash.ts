import { pluginArgs } from "../../types.js";

export async function tfHash(plugIn: Partial<pluginArgs>, args) {
  const tfHash = plugIn.ele.getAttribute('tf-hash')
  if (tfHash === null) { return null}
  let hash = tfHash
  if(tfHash === 'use tf-ced'){
    // todo:might want to whitelist or sanitize the tagname
    hash = `#${plugIn.tfMeta.tfCed.tagName}?${plugIn.tfMeta.tfCed.qs}`
  }
  // todo: this could be more sophisticated and use window.history.pushState
  args._window.location.hash = hash
  return hash
}
