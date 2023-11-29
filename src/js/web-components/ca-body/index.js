//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import styles from "./styles.css" assert { type: "css" };

// @ts-ignore
import template from "./template.html" assert { type: "html" };

export default class ca_body extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-body";
  }

  constructor() {
    super({
      not_after: ["ca-footer"],
      parent: "ca-eureka",
      single: true
    });

    const shadow = this.attachShadow({ mode: "closed" });
    ca_body.addStyle(shadow, styles);
    shadow.innerHTML = template;
  }
}
