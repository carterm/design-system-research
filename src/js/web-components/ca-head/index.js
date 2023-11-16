//@ts-check

import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_head extends ca_eureka_component {
  /**
   * Returns the tagName for this static class
   */
  static get tagName() {
    return "ca-head";
  }

  constructor() {
    const connectedCallback = () => {};

    super(connectedCallback, {
      parent: "ca-eureka",
      single: true
    });
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
