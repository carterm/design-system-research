//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import ca_custom_css from "./web-components/ca-custom-css/index";
import ca_head from "./web-components/ca-head/index";
import ca_nav from "./web-components/ca-nav/index";
import ca_footer from "./web-components/ca-footer/index";
import ca_accordion from "./web-components/ca-accordion/index";

//comment out any elements you are not using
//Definition order matters!!!  Code will run in this order
[ca_custom_css, ca_head, ca_nav, ca_footer, ca_accordion].forEach(c =>
  window.customElements.define(c.tagName, c)
);
