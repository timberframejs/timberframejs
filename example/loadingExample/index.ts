import { defineElement, html } from "../../src";

export class LoadingExample extends HTMLElement {

  readonly timeoutInMS = 4000;
  //tfIsDone = () => { }

  async connectedCallback() {
    this.setAttribute("tf-loading-ced","get loading-example-swap")

    let frag = html`<div>
          <div></div>
          <h3>This element will not show until service is done loading</h3>
      </div>`

    this.append(frag);

    setTimeout(() => {
      // isDone function is created by tf. TS doesn't know it exists at this point.
      (this as any).tfIsDone();
    }, this.timeoutInMS);
  }
}

export class LoadingExampleSwap extends HTMLElement {
  
  // todo : trying to get post model to work.
  async connectedCallback() {
    let frag = html`<div>
         My Loading Content
      </div>`

    this.append(frag);

   
  }
}



defineElement("loading-example", LoadingExample)
defineElement("loading-example-swap", LoadingExampleSwap)