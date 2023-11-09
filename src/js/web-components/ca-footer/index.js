//@ts-check

import { ca_eureka_component } from "../index.js";

export default class ca_footer extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement("ca-eureka");
    this.requireSingle();
  }
}
