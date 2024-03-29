import { html } from "../../src/index.js";

export const POST_TEST = 'post-test';
export class PostTest extends HTMLElement {
  body: FormData
  model = {
    color: '',
    keeper: '',
    counter: '0'
  }

  constructor() {
    super();
    this.model.counter = '0'
    this.body = new FormData()
  }

  async connectedCallback() {
    const previousCounter = Number(this.model.counter);
    const frag = html`
      <input type="text" name="color" value="${this.model.color}"/>
      <input type="text" name="sound" value="${this.body?.get('sound')?.toString() ?? ''}"/>
      <input type="number" name="counter" value="${(previousCounter + 1).toString()}" />
      <button
        tf-trigger="click"
        tf-host="closest ${POST_TEST}"
        tf-include="host"
        tf-ced="post ${POST_TEST}"
        tf-target="host">click</button>
    `
    this.replaceChildren()
    this.append(frag);
  }
}