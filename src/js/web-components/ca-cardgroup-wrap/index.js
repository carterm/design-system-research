//@ts-check

import ca_eureka_component from "../_ca-eureka-component/index";

export default class ca_cardgroup_wrap extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-cardgroup-wrap";
  }

  constructor() {
    super({ shadow: true });
  }
}
