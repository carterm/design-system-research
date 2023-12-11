//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_root extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-eureka";
  }

  constructor() {
    super({
      parent: "body",
      single: true
    });
  }
}
