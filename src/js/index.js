//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import yo from "./web-components/ca-eureka/index.js";
import ca_head from "./web-components/ca-head/index.js";

window.addEventListener("load", () => {
  yo();

  /**
   *
   * @param {HTMLElement} MyElement
   * @param {string} ParentType
   */
  const requireParentElement = (MyElement, ParentType) => {
    if (
      MyElement.parentElement?.tagName.toUpperCase() !==
      ParentType.toUpperCase()
    ) {
      console.error(
        `${
          MyElement.tagName
        } must be contained within ${ParentType.toUpperCase()}`
      );
    }
  };

  const tagName_ca_eureka = "ca-eureka";

  class ca_eureka extends HTMLElement {
    connectedCallback() {}
  }

  window.customElements.define(tagName_ca_eureka, ca_eureka);

  class ca_header extends HTMLElement {
    connectedCallback() {
      requireParentElement(this, tagName_ca_eureka);
    }
  }

  window.customElements.define("ca-header", ca_header);
  window.customElements.define("ca-head", ca_head);
});
