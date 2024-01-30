//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import CssStyleString from "./styles.css" assert { type: "css" };

// @ts-ignore
import HtmlTemplateString from "./template.html" assert { type: "html" };

export default class ca_header extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-header";
  }

  /** @protected @readonly @override */
  static observedAttributes = ["data-department"];

  constructor() {
    super({
      parent: "ca-root"
    });

    const shadow = this.attachShadow({ mode: "open" });

    this.addStyle();
    this.addStyle(CssStyleString);

    const myTemplate = document.createElement("template");
    myTemplate.innerHTML = this.setHTMLTemplateString(HtmlTemplateString);

    shadow.appendChild(myTemplate.content.cloneNode(true));
  }
}
