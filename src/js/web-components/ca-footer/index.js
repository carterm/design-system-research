//@ts-check

import { ca_eureka_component, ca_eureka } from "../index.js";

export default class ca_footer extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement(ca_eureka.tagName);
    this.requireSingle();
  }
}
