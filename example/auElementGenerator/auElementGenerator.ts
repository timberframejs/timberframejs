// create a form to help users create an au element and explain what is going on.
import { defineElement, html, idGen} from "../../src";

defineElement('hello-try-it',class extends HTMLElement{
  model
  connectedCallback(){
    this.textContent = "Hello World"
  }
});

export class AuElementGenerator extends HTMLElement{

  model = {
    cedname:'hello-try-it',
    eventname:'click',
    targetselector:'div[try-it-target]',
    elementname:'button',
    swap:'innerHTML'
  }

  elementnameid = `elementname${idGen.next().value}`
  cednameid = `cedname${idGen.next().value}`
  targetselectorid = `targetselector${idGen.next().value}`
  swapid = `swap${idGen.next().value}`
  outputid = `output${idGen.next().value}`

  connectedCallback(){
    this.model.elementname = this.getAttribute('elementname') ?? this.model.elementname

    const frag = this.templateLit()
    this.addElementNameButtons(frag);
    this.append(frag);
    const div = this.querySelector(':scope div[try-it]')
    div?.appendChild(this.templateLitTryIt())
  }

  addElementNameButtons(frag){
    const target = frag.querySelector(`:scope label[for=${this.elementnameid}] + div`)
    const eles = ['div', 'button','span', 'form','input'];
    eles.forEach(name =>{
      const x = html`<button
      tf-host="closest element-generator"
      tf-target="host"
      tf-include="host"
      tf-ced="post element-generator?elementname=${name}"
      name="btn-set-ele-name"
      value="${name}"
      >${name}</button>`
      target?.append(x);
    })
  }

  templateLitTryIt(){
    return html`
    <${this.model.elementname}
    tf-trigger="${this.model.eventname}"
    tf-target="${this.model.targetselector}"
    tf-ced="${this.model.cedname}"
    tf-swap="${this.model.swap}"
    > click
    </${this.model.elementname}>
    `
  }

  templateLit(){
    return html`
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 800px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }
    
            h1 {
                text-align: center;
                color: #333;
            }

            div[tf-ced]{
              display:table;
            }
    
            .form-group {
                padding-bottom: 20px;
                display:table-row;
                height: 50px;
            }
    
            label {
                display: table-cell;
                font-size:smaller;
                text-align:right;
                padding-right:10px;
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
    
            .btn-submit {
                background-color: #007BFF;
                color: #fff;
                border: none;
                padding: 10px 20px;
                font-size: 18px;
                border-radius: 3px;
                cursor: pointer;
            }
    
            .btn-submit:hover {
                background-color: #0056b3;
            }

            p.details{
              font-size:smaller;
            }

            /*
            textarea{
              width:100%;
              height: 130px;
            }*/
        </style>

        <div class="container">
            <h3>AU Element Generator</h3>
            <p>There are more tf-attributes than are demonstrated here such as tf-include.</p>
            <div
              tf-trigger="input"
              tf-target="closest element-generator"
              tf-ced="element-generator"
              tf-preserve-focus
            >
                <div class="form-group">
                    <label for="${this.elementnameid}">Element Name:</label>
                    <div></div>
                    <input id="${this.elementnameid}" type="text" id="elementname" name="elementname" value="${this.model.elementname}" required>
                </div>
                <div class="form-group">
                    <label for="eventname">Event Name:</label>
                    <select id="eventname" name="eventname" required>
                        <option value="click" ${this.model.eventname === 'click'? 'selected':''}>Click</option>
                        <option value="input" ${this.model.eventname === 'input'? 'selected':''}>Input</option>
                        <option value="change" ${this.model.eventname === 'change'? 'selected':''}>Change</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="${this.cednameid}">CED</label>
                    <input id="${this.cednameid}" type="text" id="cedname" name="cedname" value="${this.model.cedname}" required/>
                </div>
                
                <div class="form-group">
                    <label for="${this.targetselectorid}">Target CSS Selector:</label>
                    <!-- <p class="details">The element already on the page you wish to overwrite with your custom element</p> -->
                    <input id="${this.targetselectorid}" type="text" id="targetselector" name="targetselector" value="${this.model.targetselector}" required/>
                </div>
                <div class="form-group">
                  <label for="${this.swapid}">Swap</label>
                  <select id="${this.swapid}" name="swap">
                    <option name="innerhtml" value="innerHTML" ${this.model.swap === 'innerHTML'? 'selected':''} >innerHTML</option>
                    <option name="outerhtml" value="outerHTML" ${this.model.swap === 'outerHTML'? 'selected':''} >outerHTML</option>
                  </select>
                </div>
                <div class="form-group">
                  <label></label>
                    <button
                      type="submit"
                      class="btn-submit"
                      tf-target="closest element-generator"
                      tf-ced="post element-generator"
                      tf-include="closest element-generator"
                      tf-preserve-focus
                      >Submit</button>
                </div>
                <div class="form-group">
                  <label for="${this.outputid}">Output</label>
<textarea id="${this.outputid}" rows="10">
&lt;${this.model.elementname}
  tf-trigger="${this.model.eventname}"
  tf-target="${this.model.targetselector}"
  tf-ced="${this.model.cedname}"
  tf-swap="${this.model.swap}"
  &gt; Click Here
&lt;/${this.model.elementname}&gt;
</textarea>
                </div>
                <div class="form-group">
                  <label></label>
                  <div try-it>
                    <h3>Try it</h3>
                  </div>
                  <div try-it-target></div>
                </div>
            </div>
        </div>

    `
  }
}

defineElement('element-generator', AuElementGenerator);