//@ts-check

// @ts-ignore
import css from "./styles.css";

import ca_eureka_component from "../_ca-eureka-component/index";

export default class extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-cardgroup-wrap";
  }

  constructor() {
    super({ shadow: true, css });
  }
}
