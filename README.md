# TimberFrameJs
TimberFrameJs is inspired by HTMX. Instead of rendering HTML on the server like HTMX, TimberFrameJs uses client-side JavaScript native customElements to generate HTML.

The goal of TimberFrameJs

* more easily pass data between components
* simple reactivity to changes in data without complex state management strategies
* reduce boiler plate for events in custom elements
* separation of concerns between custom elements - child reaching up to a parent element or element on another tree
* allow custom elements to focus on templating with data.

TimberFrameJs is not meant to solve every problem. It is a simple starting point for custom elements. If more complexity is needed, then fall back to wiring up events in your custom element.



``` html
  <button 
    au-trigger='click'
    au-target="main"
    au-swap='innerHTML'
    au-ced='post hello-msg'
    name='msg'
    value='Hello World'>Show Message</button>
  // main before button click
  <main></main>
  // main after button click
  <main><hello-msg>Hello World</hello-msg></main>
 ```

Example interacting with the server fist then rendering the described component.
 ``` html
  <button 
    au-trigger='click'
    au-server='post ./api/translate/german'
    au-target="main"
    au-swap='innerHTML'
    au-ced='post hello-msg'
    name='msg'
    value='Hello World'>Show Message</button>
  // main before button click
  <main></main>
  // main after button click
  <main><hello-msg>Hallo Welt</hello-msg></main>
 ```

## Install
```npm i timberframejs/timberframejs```


## Project Technical Summary
TimberFrameJs is an attribute-based 'reactive' (really re-rendering) framework for web components. Inspired by HTMX.
TimberFrameJs renders HTML on the client using the ES6 customElement specification. HTMX renders html on the server.

CED Component Element Description

CED explained
[MDN CreateElement for web components](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement#web_component_example)

``` html
  <div au-ced='div?is=hello-world&msg=nice to meet you'>click</div>
```
Translates to 
``` js
  const helloWorldCED = {
    tagName:'div',
    attributes:{
      is:'hello-world',
      msg:'nice to meet you'
    }
  }
  createElement(helloWorldCED)
```
Which is equivalent to
``` js
  const ele = document.createElement('div', {is: 'hello-world'} )
  ele.setAttribute('msg','nice to meet you')
  ele.setAttribute('is', 'hello-world')

  // before render
  <div is="hello-world" msg="nice to meet you"></div>
  // rendered
  <div is="hello-world" msg="nice to meet you">nice to meet you<div>
```

customElement
``` js
export class HelloWorld extends HTMLElement{
  connectedCallback(){
    this.textContent = this.getAttribute('msg')
  }
}
```
## Example Click Counter

``` js
// simple input and button. Clicking the button updates the input value.
// the rendered live html

  <click-counter>
    <input name="counter" value="54">
    <button
        au-trigger="click"
        au-ced="click-counter"
        au-include="closest click-counter"
        // au-server="post ./api/click" // to post the data to a server, then send the results to the component
        au-target="post closest click-counter">add one</button>
  </click-counter>

```

Click counter custom element

html is a simple template literal sanitization library that returns a document fragment
``` js
import { html } from '../../src/utils/index.js'
export const CLICK_COUNTER = 'click-counter'
export class ClickCounter extends HTMLElement {
  body: FormData;
  connectedCallback() {
    const previousCount = Number(this?.body?.get('counter') ?? 0)
    const frag = html`
      <input name='counter' value='${(previousCount + 1).toString()}' />
      <button
        au-trigger='click'
        au-ced='${CLICK_COUNTER}'
        au-include='closest ${CLICK_COUNTER}'
        au-target='post closest ${CLICK_COUNTER}'>click me</button>
    `
    this.append(frag)
  }
}
```
