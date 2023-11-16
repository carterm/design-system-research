//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import * as eureka from "./web-components/index.js";

//comment out any elements you are not using
[
  eureka.ca_eureka,
  eureka.ca_head,
  eureka.ca_nav,
  eureka.ca_body,
  eureka.ca_footer
].forEach(c => window.customElements.define(c.tagName, c));
