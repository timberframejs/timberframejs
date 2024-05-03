import { defineElement, html } from "../../src";

export class LoadingExample extends HTMLElement {

  readonly timeoutInMS = 2000;
  //tfIsDone = () => { }

  async connectedCallback() {
    this.setAttribute("tf-loading-ced","get loading-example-swap")

    let frag = html`<div>
          <h3>This element will not show until service is done loading</h3>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>
            This is useful for controls that need to show a wireframe, spinner, or some other
            kind of indicator that main content is loading.
          </p>
          <p>
            The <b>tf-loading-ced</b> doesn't require any other tf- attributes to work.
            It is stand alone so that it can be applied to any element that needs to show a loading element.
            The only caveat for tf-loading-ced is that it requires you to call a tfIsDone() method on the loading element once content is ready to be displayed.
            It is done this way so you can indicate exactly when the element is ready.
          </p>
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
        <h3>My Loading Content</h3>
        <p></p>
        <p></p>
        <p></p>
        <p>This can be any custom element you want to show while the core element is rendered.</p>
      </div>`

    this.append(frag);
  }
}



defineElement("loading-example", LoadingExample)
defineElement("loading-example-swap", LoadingExampleSwap)