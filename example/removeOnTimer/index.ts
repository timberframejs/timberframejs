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
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>
            This is used to show temporary elements that a job has been completed to end users. 
          </p>
          <p>
            The <b>tf-remove-me</b> attribute doesn't require any other tf- attributes to work.
         </p>
      </div>`

    this.append(frag);
  }
}

defineElement("remove-me-example", RemoveMeExample)