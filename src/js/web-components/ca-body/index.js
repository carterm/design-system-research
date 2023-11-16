//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_body extends ca_eureka_component {
  /**
   * Returns the tagName for this static class
   */
  static get tagName() {
    return "ca-body";
  }

  constructor() {
    super(() => {
      this.requireParentElement("ca-eureka");
      this.requireSingle();
      this.requireNotAfter("ca-footer");
    });
  }
}
