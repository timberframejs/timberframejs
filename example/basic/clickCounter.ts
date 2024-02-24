import { idGen } from "../../src/index.js";
import { defineElement, html } from '../../src/utils/index.js'
export const CLICK_COUNTER = 'click-counter'

export class ClickCounter extends HTMLElement {
  body: FormData;

  connectedCallback() {
    this.id = `me-${idGen.next().value}`
    const previousCount = Number(this?.body?.get('counter') ?? 0)
    const count = (previousCount + 1).toString()
    const frag = html`
      <input name='counter' value='${count}' />
      <button
        tf-trigger='click'
        tf-ced='post ${CLICK_COUNTER}'
        tf-include='closest ${CLICK_COUNTER}'
        tf-target='#${this.id}'>click me</button>
    `
    this.append(frag)
  }
}

defineElement(CLICK_COUNTER, ClickCounter)