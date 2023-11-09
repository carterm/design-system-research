//@ts-check
export default class ca_eureka_component extends HTMLElement {
  /**
   * Require that this component be within a specified parent
   * @param {string} ParentTagName
   */
  requireParentElement(ParentTagName) {
    if (
      this.parentElement?.tagName.toUpperCase() !== ParentTagName.toUpperCase()
    ) {
      console.error(
        `${
          this.tagName
        } must be contained within ${ParentTagName.toUpperCase()}`
      );
    }
  }

  /**
   * Require that this component not be after OtherTagNames
   * @param {string[]} OtherTagNames
   */
  requireNotAfter(...OtherTagNames) {
    OtherTagNames.forEach(t => {
      if (
        this.parentElement?.querySelectorAll(this.tagName + "," + t)[0] !== this
      ) {
        console.error(`${this.tagName} cannot be after ${t.toUpperCase()}`);
      }
    });
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
