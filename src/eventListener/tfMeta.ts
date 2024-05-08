import { tfConfigType, tfMetaType } from '../types.js';
import { CED } from '../utils/index.js';
import { parseTfCed } from './parseTfCed.js';
import { guessTheTargetSelector } from './parseTfTarget.js';

export async function tfMetaPrep(ele: HTMLElement, tfConfig: tfConfigType): Promise<Partial<tfMetaType>>{
  const brains = []
  if (ele.getAttribute('tf-trigger') === null) {
    ele.setAttribute('tf-trigger', tfConfig.defaultAttributes['tf-trigger']);
    brains.push('tf-trigger was empty. The default in the was added for you.')
  }
  if (ele.getAttribute('tf-swap') === null) {
    ele.setAttribute('tf-swap', tfConfig.defaultAttributes['tf-swap']);
    brains.push('tf-swap was empty. The default in the config was added for you.')
  }

  if(ele.getAttribute('tf-ced') === 'patch'){
    // more descriptive of what is being patched
    ele.setAttribute('tf-ced', 'patch include');
    console.warn('Please use patch target or patch include for tf-ced.')
    brains.push('tf-ced="patch" was changed to tf-ced="patch include".')
  }

  if(ele.getAttribute('tf-ced').startsWith('patch-')){
    console.warn('Not wise to name your component after a reserved ced verb "patch-" ')
  }


  const tfMeta = {
    trigger: ele.getAttribute('tf-trigger'),
    brains
  }
  return tfMeta
}

export async function gettfMeta(ele: HTMLElement, initialMeta:Partial<tfMetaType>, tfConfig: tfConfigType): Promise<tfMetaType> {

  const tfMeta = {
    trigger: initialMeta.trigger, //eventlistener already running when trigger is set
    server: ele.getAttribute('tf-server'),
    targetSelector: ele.getAttribute('tf-target'),
    tfCed: parseTfCed(ele.getAttribute('tf-ced'), tfConfig, ele),
    tfInclude:  ele.getAttribute('tf-include'), //parsetfInclude(ele.getAttribute('tf-include'), tfConfig, ele),
    tfSwap: ele.getAttribute('tf-swap'),
    tfWorkingCed: (ele.getAttribute('tf-working-ced') != null) ? parseTfCed(ele.getAttribute('tf-working-ced'), tfConfig, ele) : null,
    tfRemoveMe: ele.getAttribute('tf-remove-me'),
    tfLoadingCed: (ele.getAttribute('tf-loading-ced') != null) ? parseTfCed(ele.getAttribute('tf-loading-ced'), tfConfig, ele) : null,
    tfPing: ele.getAttribute('tf-ping'),
    isThis: false,
    brains: initialMeta.brains,
    ced: {
      tagName: '',
      attributes: {},
      properties: {}
    } as CED<HTMLElement>

  }


  tfMeta.ced.tagName = tfMeta.tfCed.tagName
  // figure out ced element name
  if (tfMeta.ced.tagName === 'this') {
    tfMeta.isThis = true
    tfMeta.ced.tagName = ele.tagName
    tfMeta.targetSelector = 'this'
  }

  guessTheTargetSelector(ele, tfMeta)

  // attributes are nice and allow for outer configuration like classes and such
  // but attributes do clutter up the dom if just needed as properties
  // if we only passed properties, then the user could have getters/setters that do set the attribute
  // but attributes are usually safer
  // BUT picking and choosing interfears with the whole get/post form data serialization thing.
  // technically all form values should be paramertized, but what about a big text field?
  // todo: move to tfMeta
  for (const [key, value] of tfMeta.tfCed.qs.entries()) {
    tfMeta.ced.attributes[key] = value
  }

    //input auElement special use case where the input is basically the form so we can copy into get any mattaching verb searchParameter
    if (ele.tagName === 'INPUT') {
    // overwrite searchparam->attrbiute with the value of the input box
    if (tfMeta.tfCed.qs.get((ele as HTMLInputElement)?.name)) {
      tfMeta.ced.attributes[(ele as HTMLInputElement)?.name] = (ele as HTMLInputElement)?.value
    }
  }

  // todo: revisit this use case
  // could have an overwrite situation when the searchParam and an existing attribute are the same.
  if (tfMeta.isThis) {
    // copy existing attributes to new element
    for (const attr of ele.attributes) {
      tfMeta.ced.attributes[attr.name] = attr.value
    }
  }
  
  // throw warnings if meta is missing dependencies
  if(tfMeta.tfPing !== null) {
    if(tfConfig.tfPingEndpointUrl == null) {
      console.warn("Warning: No tfPingEndpointUrl found in tf configuration. tf-ping cannot function. tfPingEndpointUrl can be overridden within defaultConfig before it is used by auObserver.")
    }
  }

  // given <div tf-ced="get hello-msg?msg=hello world" we want to use the parameters as attributes
  // this will be an important part of the convention
  // tfMeta.searchParams = new URLSearchParams(tfCedParts[1])
  return tfMeta
}