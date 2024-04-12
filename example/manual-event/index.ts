import { auObserver, defineElement, html, defaultConfig } from "../../src";
import { parseTfCed } from '../../src/eventListener/parseTfCed';
import { mainWorkflow, executeRawWorkflow } from "../../src/eventListener/workflow";
import { tfSwapType } from '../../dist/js/types';

const EVENT_FORM = 'event-form';
const EVENT_VIEW = 'event-view';

export class EventForm extends HTMLElement {

   model
   ticker
   async connectedCallback() {
      if (this.model === undefined) {
        // business data concern
        this.model = {
          make: '',
          model: '',
          year: '',
          lastOwner: {
            firstname: '',
            lastname: '',
          }
        }
      }
      let frag = html`<div>
         <div></div>
         <h3>Car form</h3>
         <div>
          <label for="make"> Make </label>
          <input id="make" type="text" name="make" value="${this.model.make}"/>
        </div>
        <div>
          <label for="model"> Model </label>
          <input id="model" type="text" name="model" value="${this.model.model}"/>
        </div>
        <div>
          <label for="year"> Year </label>
          <input id="year" type="text" name="year" value="${this.model.year}"/>
        </div>
        <div>
          <label for="lastOwner.firstname"> Previous Owner First Name</label>
          <input id="lastOwner.firstname" type="text" name="lastOwner.firstname" value="${this.model.lastOwner.firstname}"/>
        </div>
        <div>
         <label for="lastOwner.lastname"> Previous Owner Last Name </label>
         <input id="lastOwner.lastname" type="text" name="lastOwner.lastname" value="${this.model.lastOwner.lastname}"/>
         </div>
         <button
            type="submit"
            value="submit"
            tf-trigger="click"
            tf-ced="post ${EVENT_FORM}"
            tf-include="closest ${EVENT_FORM}"
            tf-target="closest ${EVENT_FORM}"
            >Standard Button</button>
          </div>
      </div>`
      this.append(frag);

      const button = this.querySelector<HTMLButtonElement>(":scope button");
      button?.addEventListener('tf-done', e => {
        console.log('submit post is done building');
      });

      // Manually fire a TF Event without args
      this.ticker = setInterval(() => {
          executeRawWorkflow({
            fromElement: this,
            ced:`post ${EVENT_VIEW}`,
            targetSelector: `#secondary`,
            swap: 'innerHTML',
            include: `closest ${EVENT_FORM}`
          });
      }, 500); 
   }

   async disconnectedCallback() {
      window.clearInterval(this.ticker);
   }
}

export class EventView extends HTMLElement {

   model
   async connectedCallback() {
      if (this.model === undefined) {
        // business data concern
        this.model = {
          
        }
      }
      let frag = html`<div>
         <h3>Live view from interval</h3>
         <div>
            <span style="font-weight:bold; display:block;">Make</span>
            <span style="display:inline-block; margin-left: 10px;">${this.model.make}</span>
         </div>
         <div>
            <span style="font-weight:bold; display:block;">Model</span>
            <span style="display:inline-block; margin-left: 10px;">${this.model.model}</span>
         </div>
          <div>
            <span style="font-weight:bold; display:block;">Year</span>
            <span style="display:inline-block; margin-left: 10px;">${this.model.year}</span>
         </div>
         <div>
            <span style="font-weight:bold; display:block;">Previous Owner Last Name</span>
            <span style="display:inline-block; margin-left: 10px;">${this.model.lastOwner.firstname}</span>
         </div>
         <div>
            <span style="font-weight:bold; display:block;">Previous Owner First Name</span>
            <span style="display:inline-block; margin-left: 10px;">${this.model.lastOwner.lastname}</span>
         </div>
      </div>`
      this.append(frag);

   }

   async disconnectedCallback() {

   }
}

defineElement(EVENT_FORM, EventForm)
defineElement(EVENT_VIEW, EventView)