//@ts-check

/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} ca_eureka_component_options
 * @property {string} [parent] - The required parent tag. Example:```ca-eureka```
 * @property {string[]} [not_after] - Elements this element must not be after
 * @property {boolean} [single] - true if this element must be the only one under a parent
 * @property {boolean} [last] - true if this element must be last under a parent
 */

export default class ca_eureka_component extends HTMLElement {
  /**
   * Must override this static get in your component
   */
  static get tagName() {
    throw new Error(
      "ca_eureka_component: tagName needs to be defined as a static get in component"
    );
    return "";
  }

  /**
   * @param {() => void} connectedCallback
   * @param {ca_eureka_component_options} [options]
   */
  constructor(connectedCallback, options) {
    super();

    /** @type {()=>void} */
    this._connectedCallback = connectedCallback;
    /** @type {ca_eureka_component_options | undefined} */
    this._options = options;
  }

  /**
   * Base class connectedCallback
   */
  connectedCallback() {
    if (this._options?.parent) {
      if (
        this.parentElement?.tagName.toUpperCase() !==
        this._options.parent.toUpperCase()
      ) {
        console.error(
          `${
            this.tagName
          } must be contained within ${this._options.parent.toUpperCase()}`
        );
      }
    }

    this._options?.not_after?.forEach(t => {
      if (
        this.parentElement?.querySelectorAll(this.tagName + "," + t)[0] !== this
      ) {
        console.error(`${this.tagName} cannot be after ${t.toUpperCase()}`);
      }
    });

    if (this._options?.single) {
      if (this.parentElement?.querySelector(this.tagName) !== this) {
        console.error(`Only one ${this.tagName} allowed.`);
      }
    }

    if (this._options?.last) {
      if (
        this.parentElement?.querySelector(this.tagName + ":last-child") !== this
      ) {
        console.error(`${this.tagName} must be last`);
      }
    }

    if (this._connectedCallback) {
      console.log(this.tagName + " connectedCallback");

      this._connectedCallback();
    }
  }
}
