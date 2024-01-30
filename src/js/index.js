//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import * as eureka from "./web-components/index.js";

//comment out any elements you are not using
[
  eureka.ca_head,
  eureka.ca_nav,
  eureka.ca_footer,
  eureka.ca_accordion,
  eureka.ca_header,
  eureka.ca_custom_css
].forEach(c => window.customElements.define(c.tagName, c));
