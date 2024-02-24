import { defineElement, html } from "../../src";
/**
 * Even thought this works ...
 * I would not use html-au to refresh the active-nav component.
 * Instead I would use one click event listener on the active-nav
 * that would get the nid and re-render the template.
 *
 * The biggest issue with using html-au for refreshing the nav are it is
 * too verbose, and could be a bug magnent. Especially since the only difference is
 * the nid or navagation id.
 *
 */
export class ActiveNav extends HTMLElement {
  connectedCallback() {
    const frag = this.templateLit();
    const activeNid = this.getAttribute("active");
    const activeEle = frag.querySelector(`:scope li[nid=${activeNid}]`);
    activeEle?.classList.add("active");
    this.append(frag);
  }

  templateLit() {
    return html`
      <ul>
        <li
          nid="hw1"
          tf-ced="get active-nav?active=hw1"
          tf-swap="outerHTML"
          tf-target="active-nav"
        >
          <div
            tf-ced="get div?is=hello-msg&msg=Hello World"
            tf-swap="innerHTML"
            tf-target="main"
          >
            Hello World
          </div>
        </li>
        <li
          nid="hw2"
          tf-ced="get active-nav?active=hw2"
          tf-swap="outerHTML"
          tf-target="active-nav"
        >
          <div
            tf-ced="get div?is=hello-msg&msg=Hello Universe"
            tf-swap="innerHTML"
            tf-target="main"
          >
            Hello Universe
          </div>
        </li>
        <li
          nid="hw3"
          tf-ced="get active-nav?active=hw3"
          tf-swap="outerHTML"
          tf-target="active-nav"
        >
          <div
            tf-ced="get div?is=hello-msg&msg=Hello Mario World"
            tf-swap="innerHTML"
            tf-target="main"
          >
            Hello Mario
          </div>
        </li>
      </ul>
    `;
  }
}

defineElement("active-nav", ActiveNav);
