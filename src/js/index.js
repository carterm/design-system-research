//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import {
  ca_eureka,
  ca_head,
  ca_nav,
  ca_body,
  ca_footer
} from "./web-components/index.js";

window.addEventListener("load", () => {
  ca_eureka.defineComponent(window);
  ca_head.defineComponent(window);
  ca_nav.defineComponent(window);
  ca_body.defineComponent(window);
  ca_footer.defineComponent(window);
});
