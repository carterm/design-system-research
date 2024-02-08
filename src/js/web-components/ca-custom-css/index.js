//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_custom_css extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-custom-css";
  }

  constructor() {
    super();

    window.addEventListener("eureka_shadow_constructed_end", e => {
      const comp = /** @type {import("..").ca_eureka_component} **/ (e.target);

      if (comp !== this) {
        this.querySelectorAll("style").forEach(s => comp.addStyle(s.innerHTML));
      }
    });
  }
}
