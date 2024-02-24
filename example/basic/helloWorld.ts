import { html } from '../../src/utils/index.js'
import {idGen} from './idGen.js';
export class HelloWorld extends HTMLElement {
  
  connectedCallback(){
    const frag = html`<div
      tf-ced='get hello-message?msg=click again'
      tf-trigger='click'
      tf-target='#target1'>Hello world</div>
    <div id='target1'
      tf-ced='get hello-message?msg=all done'
      tf-trigger='click'
      tf-target='this'></div>`
    this.append(frag)
  }
}

export class HelloMessage extends HTMLElement{

  connectedCallback(){
    this.textContent = this.getAttribute('msg')
  }
}

export class HelloWorldDiv extends HTMLDivElement {
  body:FormData
  connectedCallback(){
    //@ts-ignore
    this.textContent = this.getAttribute('msg') ?? this.body?.get('msg')?.toString()
  }
}
