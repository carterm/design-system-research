//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import * as all from "./index";

//comment out any elements you are not using
//Definition order matters!!!  Code will run in this order
[
  all.ca_custom_css,
  all.ca_seo,
  all.ca_nav,
  all.ca_footer,
  all.ca_accordion
].forEach(c => window.customElements.define(c.tagName, c));
