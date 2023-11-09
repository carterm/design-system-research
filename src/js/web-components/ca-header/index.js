//@ts-check
import { ca_eureka_component } from "../index.js";

export default class ca_header extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement("ca-eureka");
    this.requireSingle();
    this.requireFirst();
    this.requireNotAfter("ca-body", "ca-footer");
  }
}
