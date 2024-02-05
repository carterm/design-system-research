//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class ca_header extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-header";
  }

  // eslint-disable-next-line jsdoc/empty-tags
  /** @protected @readonly @override */
  static observedAttributes = ["data-department", "data-avatar"];

  /**
   * @param {string} name
   * @param {string} _oldValue
   * @param {string} newValue
   * @protected
   * @override
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "data-department":
        {
          const selector = this.shadowRoot?.querySelectorAll(
            ".department-name > h4"
          );
          if (selector) {
            selector.forEach(item => (item.innerHTML = newValue));
          }
        }
        break;
      case "data-avatar":
        {
          const selector = this.shadowRoot?.querySelectorAll(".avatar > img");
          if (selector) {
            selector.forEach(item => item.setAttribute("src", newValue));
          }
        }
        break;
    }
  }

  constructor() {
    super({
      shadow: true,
      css,
      html
    });
  }
}
