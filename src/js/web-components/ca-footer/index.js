//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import styles from "./styles.css" assert { type: "css" };

// @ts-ignore
import template from "./template.html" assert { type: "html" };

export default class ca_footer extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-footer";
  }

  constructor() {
    super({
      parent: "ca-eureka",
      single: true,
      last: true
    });

    const shadow = this.attachShadow({ mode: "open" });
    ca_footer.addStyle(shadow, styles);

    shadow.innerHTML = template;
  }
}
