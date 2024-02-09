//@ts-check

import ca_eureka_component from "../_ca-eureka-component/index";

export default class ca_card_simple extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-card-simple";
  }

  constructor() {
    super({ shadow: true });
  }
}
