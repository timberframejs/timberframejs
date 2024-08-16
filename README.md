# TimberFrameJs

[Examples](https://timberframejs.github.io/timberframejs/examples/)

TimberFrameJs is inspired by HTMX. Instead of rendering HTML on the server like HTMX, TimberFrameJs uses client-side JavaScript native customElements to generate HTML.

The goal of TimberFrameJs

* more easily pass data between components
* simple reactivity to changes in data without complex state management strategies
* reduce boiler plate for events in custom elements
* separation of concerns between custom elements - child reaching up to a parent element or element on another tree
* allow custom elements to focus on templating with data.

TimberFrameJs is not meant to solve every problem. It is a simple starting point for custom elements. If more complexity is needed, then fall back to wiring up events in your custom element.

## How it works
Inside TimberframeJs, a Mutation Observer watches for 'tf-' attributes and adds an eventlistener to the element. The event listener uses various methods to pass data to other components, and optionally can make a pitstop to call a server side api . TimberframeJs merges data and passes it to the next component/configured component.

Rendering Strategy: The TimberframeJs rendering and re-render strategy favors rendering/re-rendering whole components. In contrast Vue, React, Angular favor micro updates by diffing a virtual DOM against the DOM and uptading only very small pieces of the DOM. It is our experience that re-rendering whole components is often faster than the traditional virtual DOM diffing strategy.

## HTMX
The high level difference between HTMX and TimberframeJs is where template work is done. In Timberframe the 'template' work is done in JavaScript using custom elements and template literals. In HTMX the templating is done on the server. (Server side templating languages are usually more robust than template literals. But they almost always require some extra JavaScript work that is bolted onto the page.)

## Tips
* Install a template literal syntax highlighter in your IDE. This will turn template literal strings into formatted html. 
* Sanitize your template literals. DOM Purify is recommened. Or you can roll your own similar to the one used in the examples.

## Examples

``` html
  <button 
    tf-trigger='click'
    tf-target="main"
    tf-swap='innerHTML'
    tf-ced='post hello-msg'
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
    tf-trigger='click'
    tf-server='post ./api/translate/german'
    tf-target="main"
    tf-swap='innerHTML'
    tf-ced='post hello-msg'
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
  <div tf-ced='div?is=hello-world&msg=nice to meet you'>click</div>
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
        tf-trigger="click"
        tf-ced="click-counter"
        tf-include="closest click-counter"
        // tf-server="post ./api/click" // to post the data to a server, then send the results to the component
        tf-target="post closest click-counter">add one</button>
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
        tf-trigger='click'
        tf-ced='${CLICK_COUNTER}'
        tf-include='closest ${CLICK_COUNTER}'
        tf-target='post closest ${CLICK_COUNTER}'>click me</button>
    `
    this.append(frag)
  }
}
```


## Details

* primarily a mutation observer that creates events.
* form binding for all elements, not just forms
* Can make api calls 
* no virtual DOM
* leverages custom elements
* the goal is to leverage web standards as much as possible

## Values

* simplicity
* stability - always strive for backward compatibility - we reserve the right to make breaking changes in cases of security issues.
* developer experience - balance helpful feedback and runtime performance. 
* admire [PEP 20](https://peps.python.org/pep-0020/) especially the preferrably one way to do it.
* select few configurable defaults
* default attributes will be added at runtime for visibility. (a small relaxing of explicit over implicit to balance against developer experience.)
* plug-in architecture
* attempt to discover and throw potential attribute errors before the event is triggered.
* testing - unit and integration
* low/no intrusion into custom elements. Custom elements only have to know about their data model.
* New features must have a valid use case.


## Common Workflows

### General Pattern

- event happens
- create element
- place element on page

### Basic click
- click
- create new element
- place element on page

### Click Include Data
- click
- include data from page
- create new element
- place element on page with new data passed to it.

### Click Call API 
- click
- include data from page
- send data to server
- create new element
- place element on page with both page and server data passed to it

### ReRender self
- input or change element
- re-render changed component

### ReRender Form - Validation
- input or change element
- render parent component

### Initial page load to show spinner or skeleton while waiting for data.
- show spinner
- fetch data
- create custom element and add to DOM
- hide spinner
