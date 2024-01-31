//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class my_component extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "my-component";
  }

  /** @protected @readonly @override */
  static observedAttributes = ["attributeToObserve"];

  constructor() {
    super({
      shadow: true,
      css,
      html
    });
  }
}