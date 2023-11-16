//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

export default class ca_footer extends ca_eureka_component {
  /**
   * Returns the tagName for this static class
   */
  static get tagName() {
    return "ca-footer";
  }

  constructor() {
    const connectedCallback = () => {};
    super(connectedCallback, {
      parent: "ca-eureka",
      single: true,
      last: true
    });
  }
}
