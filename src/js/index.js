//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import * as eureka from "./web-components/index.js";

window.addEventListener("load", () => {
  eureka.ca_eureka.defineComponent(window);
  eureka.ca_head.defineComponent(window);
  eureka.ca_nav.defineComponent(window);
  eureka.ca_body.defineComponent(window);
  eureka.ca_footer.defineComponent(window);
});
