//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import * as all from "./index";

//comment out any elements you are not using
//Definition order matters!!!  Code will run in this order

const my_bundle = [
  all.ca_custom_css,
  all.ca_seo,
  all.ca_nav,
  all.ca_footer,
  all.ca_accordion,
  all.ca_card_simple,
  all.ca_cardgroup_wrap
];

for (const c of my_bundle) {
  //sync "for", to ensure define order
  window.customElements.define(c.tagName, c);
}
