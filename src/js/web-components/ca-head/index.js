//@ts-check

import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_head extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-head";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-title", "data-description"];
  }

  constructor() {
    /**
     *
     * @param {string} name
     * @param {string} _oldValue
     * @param {string} newValue
     */
    const attributeChangedCallback = (name, _oldValue, newValue) => {
      /**
       * @param {string} metaName
       * @param {string} metaValue
       */
      const setMeta = (metaName, metaValue) => {
        const existingMeta = document.head.querySelector(
          `meta[name="${metaName}" i]`
        );

        if (existingMeta) {
          existingMeta.attributes["content"].value = newValue;
        } else {
          document.head.append(
            Object.assign(document.createElement("meta"), {
              name: metaName,
              content: metaValue
            })
          );
        }
      };

      switch (name) {
        case "data-title":
          document.title = newValue;
          ["title", "og:title", "twitter:title"].forEach(m =>
            setMeta(m, newValue)
          );

          break;
        case "data-description":
          ["description", "og:description", "twitter:description"].forEach(m =>
            setMeta(m, newValue)
          );

          break;
      }
    };

    super({ attributeChangedCallback });
  }
}
