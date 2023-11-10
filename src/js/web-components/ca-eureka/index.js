//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_eureka extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement("body");
    this.requireSingle();
  }
}
