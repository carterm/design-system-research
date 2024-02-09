//@ts-check
import ca_eureka_component from "../_ca-eureka-component/index";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-footer";
  }

  constructor() {
    super({ shadow: true, css, html });
  }
}
