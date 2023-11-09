//@ts-check
export default class ca_eureka_component extends HTMLElement {
  /**
   * Require that this component be within a specified parent
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

  /**
   * Require that this component be unique within a parent
   */
  requireSingle() {
    if (this.parentElement?.querySelector(this.tagName) !== this) {
      console.error(`Only one ${this.tagName} allowed.`);
    }
  }

  /**
   *
   * @param {Window} window
   */
  static defineComponent(window) {
    window.customElements.define(this.tagName, this);
  }

  /**
   * Returns the tagName for this static class
   */
  static get tagName() {
    return this.name.toLowerCase().replace(/_/g, "-");
  }
}
