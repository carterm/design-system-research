//@ts-check

import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_head extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-head";
  }

  static observedAttributes = ["data-title", "data-description"];
  /**
   *
   * @param {string} name
   * @param {string} _oldValue
   * @param {string} newValue
   * @override
   */
  // eslint-disable-next-line class-methods-use-this
  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "data-title":
        document.title = newValue;
        break;
      case "data-description":
        {
          const metaDescription = document.head.querySelector(
            `meta[name="description" i]`
          );

          if (metaDescription) {
            metaDescription.attributes["content"].value = newValue;
          } else {
            document.head.append(
              Object.assign(document.createElement("meta"), {
                name: "description",
                content: newValue
              })
            );
          }
        }
        break;
    }
  }
}
