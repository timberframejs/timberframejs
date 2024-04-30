import { defineElement, html } from "../../src";

const apiUrl =  'http://127.0.0.1:8081/user'
export class WorkingExampleForm extends HTMLElement {
  model : {
    myData: "My Data in swap"
  }

  async connectedCallback() {
    let frag = html`<div>
         <div></div>
         <h3>Button will swap to defined CED while working</h3>
         <input type="text" name="myData" placeholder="My data will show in swapped element if post verb used" />
         <div id="sub-wrapper">
         </div>
         
         <button
            type="submit"
            value="submit"
            tf-trigger="click"
            tf-ced="post workingexample-sub"
            tf-server="get ${apiUrl}"
            tf-target="#sub-wrapper"
            tf-include="workingexample-form"
            tf-swap="innerHTML"
            tf-working-ced="post workingexample-swap?id=1234"
            >Standard Button</button>
          </div>
      </div>`

    this.append(frag);
  }
}

export class WorkingExampleSwap extends HTMLElement {
  model : {}
  
  // todo : trying to get post model to work.
  async connectedCallback() {
    let frag = html`<div>
         My Working Content QS:${this.getAttribute("id") || ""} Model: ${(this.model as any)?.myData}
      </div>`

    this.append(frag);
  }

}

export class WorkingExampleSubContent extends HTMLElement {
  model

  async connectedCallback() {
    let frag = html`<div>
         My Sub Content 
      </div>`

    this.append(frag);
  }
}

defineElement("workingexample-form", WorkingExampleForm)
defineElement("workingexample-swap", WorkingExampleSwap)
defineElement("workingexample-sub", WorkingExampleSubContent)