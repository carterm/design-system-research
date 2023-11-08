//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import yo from "./web-components/ca-eureka/index.js";

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

  class ca_head extends HTMLElement {
    connectedCallback() {
      requireParentElement(this, tagName_ca_eureka);

      if (this.dataset.title) {
        document.title = this.dataset.title;
      }

      if (this.dataset.description) {
        const metaDescription =
          document.head.querySelector(`meta[name="description" i]`) ||
          Object.assign(document.createElement("meta"), {
            name: "Description"
          });

        metaDescription.attributes["content"].value = this.dataset.description;
      }
    }
  }

  window.customElements.define("ca-head", ca_head);
});
