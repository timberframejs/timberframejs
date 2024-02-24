import { pluginArgs } from "../../types.js";

export async function auHash(plugIn: Partial<pluginArgs>, args) {
  const auHash = plugIn.ele.getAttribute('tf-hash')
  if (auHash === null) { return null}
  let hash = auHash
  if(auHash === 'use tf-ced'){
    // todo:might want to whitelist or sanitize the tagname
    hash = `#${plugIn.tfMeta.auCed.tagName}?${plugIn.tfMeta.auCed.qs}`
  }
  // todo: this could be more sophisticated and use window.history.pushState
  args._window.location.hash = hash
  return hash
}
