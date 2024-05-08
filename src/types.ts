import { CED } from "./utils/index.js"


export type tfSwapType = 'none' | 'innerHTML' | 'outerHTML' | 'delete'

export type tfMetaType = {
  trigger: string
  targetSelector: string | null
  server: string | null
  /**
   * note: there are subtle differences between tfCed and ced.
   *  The tfCed is the attribute that is parsed into an object then later becomes the CED
   *  */
  tfCed: { raw: string, verb: string, tagName: string, qs: URLSearchParams }
  tfSwap: string // tfSwapType
  tfInclude: string | null
  isThis: boolean
  tfWorkingCed: { raw: string, verb: string, tagName: string, qs: URLSearchParams }
  tfLoadingCed: { raw: string, verb: string, tagName: string, qs: URLSearchParams }
  tfPing: string
  /** messages for decisions we make trying to be smart for the user */
  brains: Array<string>
  ced: CED<HTMLElement>
}

type booleanAttribute = true | false // really it exists or does not exist as an attribute

// more to come, just the ones currently supported
export type auAttributeTypes = {
  'tf-cmd'?: string
  'tf-trigger'?: string
  'tf-include'?: string
  'tf-swap'?: tfSwapType
  'tf-href'?: string
  'tf-preserve-focus'?: booleanAttribute
  'tf-attach-swapped'?: booleanAttribute
  'tf-server'?: string
}

export type tfElementType = {
  auState: 'processed'
  auAbortController: AbortController
  tfMeta: tfMetaType
  body?: FormData
  model?: any
  attributes: auAttributeTypes
  name:string|undefined
  value:string|undefined
  // auPreviousTree: DocumentFragment
  connectedCallback?:()=>void
} & HTMLElement


export type tfCedEle = HTMLElement & {
  body?: unknown
  model?: unknown
  tfMeta?: tfMetaType
  name?:string
  value?:string
}

export type tfPingPOSTBody = {
  feature: string
  fromEleID: string
  fromEleTag: string
  toComponent: string
  trigger: string
  server: string
}

export type tfConfigType = {
  eventListenerBuilder: (ele: HTMLElement, tfConfig: tfConfigType) => Promise<void>
  workflow?: (wf: workflowArgs) => Promise<pluginArgs>
  serverPost: (url: string, data: unknown | FormData, plugIn: pluginArgs) => Promise<unknown>
  serverGet: (url: string, plugIn: pluginArgs) => Promise<unknown>
  serverDelete: (url: string, plugIn: pluginArgs) => Promise<unknown>
  serverPut: (url: string, data: unknown | FormData, plugIn: pluginArgs) => Promise<unknown>

  /**
   * Custom fetch for sending ping data. Data is sent as an appended query string on the end of pingEndpointUrl.
   * WARNING: Nothing sensitive should be in ping data.
   */
  pingFetcher?: (pingEndpointUrl: string, fromUrl: string, toUrl: string) => void

  /**
   * Url endpoint for sending ping data. This can be used without pingFetcher to use global fetcher.
   * Ping data is appended to url as a query string EX: www.myexampleapi.com/analytics?feature=myfeature
   * WARNING: Nothing sensitive should be in ping data.
   */
  tfPingEndpointUrl?: string

  defaultAttributes: {
    'tf-swap': string
    'tf-trigger': string
  }
  tfCed: {
    verb: 'post' | 'get' | 'patch'
  },
  tfInclude:{
    verb: 'post'|'get'
  },
  plugins: Array<pluginDefinition>,
  _plugins: {
    atEnd: Array<pluginDefinition>
    preflight:Array<pluginDefinition>
  }
}

/**
 * Everything a plug-in would need to do whatever it needed to do.
 */
export type pluginArgs = {
  e: Event
  tfMeta: tfMetaType
  // todo: define what ele is, if we can
  ele: tfElementType
  targetEle?: HTMLElement
  cedEle?: tfCedEle
  tfConfig: tfConfigType
}

export type eventSetupArgs = {
  // the element to setup listeners on
  ele: tfElementType,
  // cmd: string,
  initialMeta: Partial<tfMetaType>,
  tfConfig: tfConfigType
}

export type workflowArgs = eventSetupArgs & {
  e: Event
}

/**
 * todo: for when we could support better ordering like
 * after somePluginName
 */
export type pluginDefinition = {
  name: string
  preflight?:(esa:eventSetupArgs, piArgs?:any)=>void
  // this could be an array
  endEventCallback?:{
    when: string
    callback: (pi: pluginArgs, args: any) => Promise<any>
    args: any
  }
}