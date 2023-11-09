//@ts-check
export default class ca_eureka_component extends HTMLElement {
  /**
   *
   * @param {string} ParentType
   */
  requireParentElement(ParentType) {
    if (
      this.parentElement?.tagName.toUpperCase() !== ParentType.toUpperCase()
    ) {
      console.error(
        `${this.tagName} must be contained within ${ParentType.toUpperCase()}`
      );
    }
  }

  static get tagName() {
    return "ca-eureka-component";
  }
}
