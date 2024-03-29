import { tfConfigType } from "../../src/types.js";

export function parseTfCed(raw:string, tfConfig:tfConfigType, ele){
  // Split the raw string by '?' to separate the verb and query string
  // Check if the raw string contains a ' ' character to split verb and tagName
  if(!raw){
    // note: this could be an input attribute where a form is listening for input or change
    // console.warn('No tf-ced attribute to parse')
    throw new Error(`tf-ced attribute cannot be empty on ele ${ele.tagName}`)
  }

  if(raw.startsWith('patch')){
    return {
      raw,
      verb: 'patch',
      tagName:'',
      qs:new URLSearchParams()
    }
  }
  const spaceIndex = raw.indexOf(' ');

  // Initialize verb and tagName with default values
  let verb = tfConfig.tfCed.verb;
  let tagName = '';

  // Check if a space was found, if yes, split the raw string
  if (spaceIndex !== -1) {
    // @ts-ignore
    verb = raw.substring(0, spaceIndex);
    tagName = raw.substring(spaceIndex + 1);
  } else {
    tagName = raw;
  }

  // Check if there is a query string and split it
  const qsIndex = tagName.indexOf('?');
  let qs = '';

  if (qsIndex !== -1) {
    qs = tagName.substring(qsIndex + 1);
    tagName = tagName.substring(0, qsIndex);
  }

  const searchParams = new URLSearchParams(qs)

  // Create an object with the extracted properties
  const result = {
    raw,
    verb,
    tagName,
    qs: searchParams,
  };

  return result;
}