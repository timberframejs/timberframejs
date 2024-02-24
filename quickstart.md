

# Quickstart

``` html
  .. in head
  <script type="module>">
    import { auObserver, defaultConfig } form './html-au/dist/browser/js/index.js';
    import { HelloMsg } from './hello-msg.js'
    customElements.define('hello-msg', HelloMsg);
    auObserver(document.body, defaultConfig)
  </script>
  ... in body
  <button tf-trigger='click' tf-ced='post hello-msg' tf-target="main" tf-swap='innerHTML' name='msg' value='Hello World'>Show Message</button>
  <main></main>
  // returns
  <main><hello-msg>Hello World</hello-msg></main>
 ```