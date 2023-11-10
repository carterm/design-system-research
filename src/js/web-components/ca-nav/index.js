//@ts-check
import { ca_eureka_component } from "../index.js";

export default class ca_nav extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement("ca-eureka");
    this.requireSingle();
    this.requireNotAfter("ca-body", "ca-footer");
  }
}
