//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import sheet from "./styles.css" assert { type: "css" };

export default class ca_footer extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-footer";
  }

  constructor() {
    const connectedCallback = () => {
      if (this.shadowRoot) this.shadowRoot.innerHTML = this.innerHTML;
    };
    super(connectedCallback, {
      parent: "ca-eureka",
      single: true,
      last: true
    });

    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets.push(sheet);
  }
}
