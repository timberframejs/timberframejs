import {defineElement, html} from '../../src/index.js'
const AUHOST_EXAMPLE = 'auhost-example';

export class AuHostExample extends HTMLElement{
  model={counter:'0', test1:''}
  connectedCallback(){
    this.model.counter = (Number(this.model.counter) + 1).toString()
    this.append(this.templateLit())
  }

  templateLit(){
    return html`
      <style>
        .tf-host{
          max-width: 800px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        textarea,
        input[type="text"],
        select {
            width: 95%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding-bottom:10px;
        }
      </style>
      <div class="tf-host">
        <h3>tf-HOST example</h3>
        <p>tf-host is to help prevent syntax errors and simplify the selector of a host or parent element</p>
        <p>A preflight plug-in that replaces certain attributes with the value of host with the value in the tf-host attribute.

        </p>

        <textarea rows="10">
          <form is="my-form">
            <input/>
            <input/>
            <button
              tf-host="closest form"
              tf-include="host"
              tf-target="host"
              tf-ced="post form">click</button>
          </form>
        </textarea>
        <h4>Becomes</h4>
        <textarea rows="10">
        <form is="my-form">
          <input/>
          <input/>
          <button
            tf-host="closest form"
            tf-include="closest form"
            tf-target="closest form"
            tf-ced="post form">click</button>
        </form>
      </textarea>

      <div>
          <input name="test1" value="${this.model?.test1}"/>
          <input type="number" name="counter" value="${this.model?.counter}"/>
          <button
            tf-host="closest ${AUHOST_EXAMPLE}"
            tf-include="host"
            tf-target="host"
            tf-ced="post ${AUHOST_EXAMPLE}">click</button>
      </div>
    </div>
    `
  }
}

defineElement(AUHOST_EXAMPLE, AuHostExample)