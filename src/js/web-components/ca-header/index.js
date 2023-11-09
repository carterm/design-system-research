//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";
import ca_eureka from "../ca-eureka/index.js";

export default class ca_header extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement(ca_eureka.tagName);
  }
}
