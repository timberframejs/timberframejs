import {CED, auObserver, createElement, defineElement, html, defaultConfig} from '../src/index.js';
import './basic/clickCounter.js'
import './user-form/index.js'
import './manual-event/index.js'
import './dialog/dialogButtons.js'
import { HelloWorldDiv } from './basic/helloWorld.js';
import './patch/patch.js';
import './store/store.js'
import './auElementGenerator/auElementGenerator.js'
import './tfHost/tfHostExample.js'
import './timerApp/index.js'
defineElement('hello-msg', HelloWorldDiv,'div')

auObserver(document.body, defaultConfig);

const pageLayout = html`
  <h1>Examples Scratchpad </h1>
  <nav>
    <button
      tf-hash="use tf-ced"
      tf-ced='get div?is=hello-msg&msg=Hello World'
      tf-swap="innerHTML"
      tf-target="main"
      tf-view-transition
      >Hello Message using get</button>
    <!-- todo this should still work and copy the query params over -->
    <button
      tf-hash="#div?is=hello-msg&msg=Hello"
      tf-ced="post div?is=hello-msg&msg=Hello"
      tf-swap="innerHTML"
      tf-target="main"
      tf-view-transition
      > Hello Message post</button>

    <a 
      href="#click-counter"
      tf-trigger="click"
      tf-ced="post click-counter"
      tf-target="main"
      tf-swap="innerHTML"
      tf-view-transition
      >Click Counter</a>

      <a 
      href="#user-form"
      tf-trigger="click"
      tf-ced="post user-form"
      tf-target="main"
      tf-swap="innerHTML"
      tf-view-transition
      >User Form</a>

      <a 
      href="#event-form"
      tf-trigger="click"
      tf-ced="post event-form"
      tf-target="main"
      tf-swap="innerHTML"
      tf-view-transition
      >Manual Events</a>
      
      <!-- automatically adds trigger='click' from the default config -->
      <a
      href="#dialog-buttons"
      tf-ced="post dialog-buttons?open"
      tf-target="main"
      tf-swap="innerHTML"
      tf-view-transition
      >Dialog Buttons</a>

    <a 
      href="#epatch-example"
      tf-ced="post epatch-example"
      tf-target="main"
      tf-swap="innerHTML"
      tf-view-transition
      >Patch Example<a>
    <!-- this one is wrong I think href does not match the ced
    <a 
      href="#simple-store"
      tf-ced="epatch-example"
      tf-target="main"
      tf-swap="innerHTML"
      >Simple Store<a>
      -->
    
      <a 
      href="#element-generator"
      tf-ced="element-generator"
      tf-target="main"
      tf-swap="innerHTML"
      tf-view-transition
      >AU Element Generator<a>
      <a 
      href="#auhost-example"
      tf-ced="get auhost-example"
      tf-target="main"
      tf-swap="innerHTML"
      tf-view-transition
      >tf-host attribute<a>
    <a 
      href="#timer-table"
      tf-ced="get timer-table"
      tf-target="main"
      tf-swap="innerHTML"
      tf-view-transition
      >Primeagen Timer</a>
  </nav>
  <main></main>
  <div id="secondary"></div>
`

// nothing to do with html-au, just a development time saver: loads the last component on page refresh
const main = pageLayout.querySelector(':scope main') as HTMLElement;
const view = window.location.hash
// todo: could has if it has is
const noHash = view.replace('#','')
const split = noHash.split('?')
const tagName = split[0]

if(view?.length > 0){
  const ced = {
    tagName,
    attributes:{
      is: new URLSearchParams(split[1]).get('is')
    }
  } as CED<HTMLElement>
  const report = createElement(ced);
  main?.replaceChildren();
  main?.append(report);
}

document.body.append(pageLayout)