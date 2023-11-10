//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_body extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement("ca-eureka");
    this.requireSingle();
    this.requireNotAfter("ca-footer");
  }
}
