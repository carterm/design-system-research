//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import CssStyleString from "./styles.css" assert { type: "css" };

// @ts-ignore
import HtmlTemplateString from "./template.html" assert { type: "html" };

export default class my_component extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "my-component";
  }

  /** @protected @readonly @override */
  static observedAttributes = ["attributeToObserve"];

  constructor() {
    super({
      parent: "ca-parent-element"
    });

    const shadow = this.attachShadow({ mode: "open" });

    this.addStyle();
    this.addStyle(CssStyleString);

    const myTemplate = document.createElement("template");
    myTemplate.innerHTML = this.setHTMLTemplateString(HtmlTemplateString);

    shadow.appendChild(myTemplate.content.cloneNode(true));
  }
}
