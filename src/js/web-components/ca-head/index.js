//@ts-check

import { ca_eureka_component, ca_eureka } from "../index.js";

export default class ca_head extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement(ca_eureka.tagName);
  }

  static observedAttributes = ["data-title", "data-description"];
  /**
   *
   * @param {string} name
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "data-title":
        document.title = newValue;
        break;
      case "data-description":
        const metaDescription =
          document.head.querySelector(`meta[name="description" i]`) ||
          Object.assign(document.createElement("meta"), {
            name: "description"
          });

        metaDescription.attributes["content"].value = newValue;
        break;
    }
  }
}
