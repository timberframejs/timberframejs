import { triggerOptions } from "../tfConstants.js";
import { mainWorkflow } from "./workflow.js";
import { tfConfigType, tfElementType, eventSetupArgs, workflowArgs } from "../types.js";
import { tfMetaPrep } from "./tfMeta.js";

const triggerKeys = Object.values(triggerOptions)

export async function basicEventListener(eventSetup: eventSetupArgs) {
  eventSetup.ele.auAbortController = new AbortController()

  eventSetup.ele.addEventListener(eventSetup.initialMeta.trigger, async (e) => {
    (eventSetup as workflowArgs).e = e;
    if(eventSetup.tfConfig.workflow){
      await eventSetup.tfConfig.workflow(eventSetup as workflowArgs)
    }else{
      // easier tracing and debugging, but allows for overriding
      mainWorkflow(eventSetup as workflowArgs)
    }
    
  }, { signal: eventSetup.ele.auAbortController.signal })
}


export async function eventListenerBuilder(ele: tfElementType, tfConfig:tfConfigType) {
  // prevent infinate loop or already processed elements
  if (ele.auState === 'processed') { return; }
  ele.auState = 'processed'

  const initialMeta = await tfMetaPrep(ele, tfConfig);
  const eventSetupArgs = {
    ele,
    tfConfig,
    initialMeta
  } as eventSetupArgs;

  tfConfig._plugins.preflight.forEach(p=>p.preflight(eventSetupArgs));

  // safety to limit the types of events or triggers, this will need to change as the api expands
  if (!triggerKeys.includes(initialMeta.trigger)) { return }
  await basicEventListener(eventSetupArgs)

  // todo: htmx supports a setTimeout option too.
}