import { defineElement, html } from "../../src";

export class RemoveMeExample extends HTMLElement {

  readonly timeoutInMS = 2000;
  async connectedCallback() {
    let frag = html`<div>
          <div></div>
          <h3>The element below will be removed in ${this.timeoutInMS.toString()} MS</h3>
          <div tf-remove-me="${this.timeoutInMS.toString()}">
            My Element that is being removed.
            <p>All of this should be gone</p>
          </div>
      </div>`

    this.append(frag);
  }
}

defineElement("remove-me-example", RemoveMeExample)