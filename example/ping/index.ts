import { defineElement, html } from "../../src";
import { idGen } from "../../src/index.js";

export const PING_EXAMPLE = 'ping-example'
export class PingExample extends HTMLElement {
  body;

  connectedCallback() {
    this.id = `me-${idGen.next().value}`
    const previousCount = Number(this?.body?.get('counter') ?? 0)
    const count = (previousCount + 1).toString()
    const frag = html`
      <h3>This is a copy of the click counter but with a ping feature</h3>
      <input name='counter' value='${count}' />
      <button
        id="asdf"
        tf-trigger='click'
        tf-ced='post ${PING_EXAMPLE}'
        tf-include='closest ${PING_EXAMPLE}'
        tf-target='#${this.id}'
        tf-ping="ping-feature">click me</button>


      <a href="javascript:void(0);"
        tf-trigger='click'
        tf-ced='post ${PING_EXAMPLE}'
        tf-include='closest ${PING_EXAMPLE}'
        tf-target='#${this.id}'
        tf-server='post http://127.0.0.1:8081/'
        tf-ping="feature-two">click for another feature</a>
    `
    this.append(frag)
  }
}


defineElement(PING_EXAMPLE, PingExample)