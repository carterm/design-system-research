//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import custom_css from "./styles.css" assert { type: "css" };

// @ts-ignore
import html_template from "./template.html" assert { type: "html" };

export default class ca_footer extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-footer";
  }

  constructor() {
    super({ use_shadow: true, custom_css, html_template });
  }
}
