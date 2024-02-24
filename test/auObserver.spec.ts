import { defaultConfig } from "../src/defaultConfig.js"
import { tfMetaPrep, gettfMeta } from "../src/eventListener/tfMeta.js"
import { auObserver} from "../src/index.js"
import { tfElementType, tfMetaType} from "../src/types.js"
import { CED, createElement, html } from "../src/index.js"


describe('auObserver',()=>{
  let host:HTMLDivElement

  beforeEach(()=>{
    host = createElement<HTMLDivElement>({
      tagName:'div'
    })
    auObserver(host, defaultConfig)
  })

  it('processes auElements', (done)=>{
    const frag = html`
      <input
      type='text'
      name='msg'
      tf-ced='div?is=hello-world-div'
      tf-target='next'
      tf-trigger='input'/>
    `
    const input = frag.querySelector<tfElementType>(':scope input')
    host.append(frag)
    // need time for the mutation observer to do it's thing.
    setTimeout(() => {
      // @ts-ignore
      expect(input.auState).toBe('processed')
      done()
    }, 15);
  })

})

describe('gettfMeta',()=>{
  let inputEle:tfElementType
  let tfMeta:tfMetaType
  const inputCED = {
    tagName:'input',
    attributes:{
      type:'text',
      name:'msg',
      'tf-ced':'post div?is=hello-world-div',
      'tf-target':'next',
      'tf-trigger':'input',
    }
  }as CED<HTMLInputElement>

  beforeAll(async ()=>{
    inputEle = createElement<tfElementType>(inputCED)
    const initialMeta = await tfMetaPrep(inputEle, defaultConfig)
    tfMeta = await gettfMeta(inputEle, initialMeta, defaultConfig)
  })
  it('has tf-ced',()=>{
    // @ts-ignore
    expect(tfMeta.tfCed.raw).toBe(inputCED.attributes['tf-ced'] as string)
  })
  it('has tf-target',()=>{
    // @ts-ignore
    expect(tfMeta.targetSelector).toBe(inputCED.attributes['tf-target'] as string)
  })
  it('has tf-trigger',()=>{
    // @ts-ignore
    expect(tfMeta.trigger).toBe(inputCED.attributes['tf-trigger'] as string)
  })
  it('tf-swap is null',()=>{
    expect(tfMeta.tfSwap).toBe('outerHTML')
  })
  it('tfMeta au ced verb tobe post',()=>{
    expect(tfMeta.tfCed.verb).toBe('post')
  })
  it('searchParams tobe is=hello-world-div',()=>{
    expect(tfMeta.tfCed.qs.get('is')).toBe('hello-world-div')
  })

  it('tfInclude is null',()=>{
    expect(tfMeta.tfInclude).toBe(null)
  })
  it('isThis tobe false',()=>{
    expect(tfMeta.isThis).toBe(false)
  })
  it('ced.tagName is input',()=>{
    expect(tfMeta.ced.tagName).toBe('div')
  })

})