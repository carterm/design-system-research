//@ts-check
import { ca_eureka_component, ca_eureka } from "../index.js";

export default class ca_body extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement(ca_eureka.tagName);
  }

  /**
   *
   * @param {Window} window
   */
  static defineComponent(window) {
    window.customElements.define(this.tagName, this, { extends: "p" });
  }
}
