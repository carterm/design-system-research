//@ts-check
import ca_eureka_component from "../ca-eureka-component/index.js";

/**
 * Base element for Eureka
 * @example
 * ```html
 * <ca-eureka>
 *
 * </ca-eureka>
 * ```
 */
export default class ca_eureka extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-eureka";
  }

  constructor() {
    const connectedCallback = () => {};

    super(connectedCallback, {
      parent: "body",
      single: true
    });
  }
}
