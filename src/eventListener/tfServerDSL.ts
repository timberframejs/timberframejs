import { objectToQueryParams } from "../common.js"
import { makeFormData } from "./tfFormData.js"
import { tfCedEle, tfMetaType, pluginArgs } from "../types.js"
import { getIncludeElement } from "../eventListener/parseTfTarget.js"

//todo:need to test this function
function toFormData(o) {
  // @ts-ignore
  return Object.entries(o).reduce((d, e) => (d.append(...e), d), new FormData())
}

const errorMsg = (newEle: tfCedEle) => { return `Developer, you are using the tf-ced attribute without a property of body or model for component named ${newEle?.tagName}. Either add body or model to the component, or remove the post hint` }

export const isTfServer = (tfMeta: tfMetaType) => { return tfMeta.server?.length > 0 }

export const updateCedData = (model, json, plugIn: pluginArgs) => {
  // todo: what if the CED has a get attribute? we need to turn the form into querystring params
  // @ts-ignore
  const merged = { ...model, ...json };
  const hasBody = plugIn.cedEle.hasOwnProperty('body');
  const hasModel = plugIn.cedEle.hasOwnProperty('model');
  if (hasBody) {
    // since we merged, shouldn't have duplicates
    // todo: test this out and uncomment the toFormData(merged) line
    //newEle.body = toFormData(merged)
  }
  if (hasModel) {
    plugIn.cedEle.model = merged
  }
  if (!hasBody && !hasModel) {
    throw new Error(errorMsg(plugIn.cedEle))
  }
}

export const getModel = (plugIn: pluginArgs) => {
  const formDataEle = getIncludeElement(plugIn.ele, plugIn.tfMeta)
  const fd = makeFormData(formDataEle, plugIn.ele)
  return Object.fromEntries(fd.entries())
}

/**
 * <div tf-server="post ./users"
 * todo: the following are not implemented yet, might be nice
 * <div tf-server="post ./users/${model.userid}"
 * <div tf-server="post as json ./users"
 * <div tf-server="post as formdata ./users"
 */
export async function attachServerRespToCedEle(plugIn: pluginArgs) {
  if (!plugIn.tfMeta.server) { return }
  const [verb, url] = plugIn.tfMeta.server.split(' ')

  switch(verb) {
    case "post": {
      const model = getModel(plugIn)
      const json = await plugIn.tfConfig.serverPost(url, model, plugIn)
      // @ts-ignore
      const merged = { ...model, ...json }
      updateCedData(merged, json, plugIn)
      break;
    }
    case "get": {
      //todo: add in any querystring params from the tf-server attribute
      const model = getModel(plugIn);
      const qs = objectToQueryParams(model);
      const urlWithQs = `${url}${qs}`;
      const json = await plugIn.tfConfig.serverGet(urlWithQs, plugIn);
      updateCedData(model, json, plugIn)
      break;
    }
    case "delete" : {
      const model = getModel(plugIn);
      const json = await plugIn.tfConfig.serverDelete(url, plugIn)
      updateCedData(model, json, plugIn)
      break;

    }
    case "put" : {
      const model = getModel(plugIn);
      const json = await plugIn.tfConfig.serverPut(url, model, plugIn)

      // @ts-ignore
      const merged = { ...model, ...json }
      updateCedData(model, json, plugIn)
      break;
    }
  }
}