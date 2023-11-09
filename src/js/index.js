//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import { ca_eureka, ca_head, ca_header } from "./web-components/index.js";

window.addEventListener("load", () => {
  window.customElements.define(ca_eureka.tagName, ca_eureka);
  window.customElements.define(ca_header.tagName, ca_header);
  window.customElements.define(ca_head.tagName, ca_head);
});
