//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_body extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-body";
  }

  constructor() {
    const connectedCallback = () => {};

    super(connectedCallback, {
      not_after: ["ca-footer"],
      parent: "ca-eureka",
      single: true
    });
  }
}
