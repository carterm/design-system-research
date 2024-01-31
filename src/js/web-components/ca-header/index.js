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

  /** @protected @readonly @override */
  static observedAttributes = ["data-department"];

  /**
   * @param {string} name
   * @param {string} _oldValue
   * @param {string} newValue
   * @protected
   * @override
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    const o = ca_header.observedAttributes;
    console.log("attribute changed: ", o);
    console.log(this);
    switch (name) {
      case o[0]: //"data-department":
        this.slot = `${newValue}`;
        break;
      default:
        this.slot = `Department of Website`;
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
