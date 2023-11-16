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
    if (this._options && this.parentElement) {
      const options = this._options;
      const parentElement = this.parentElement;
      const tagName = this.tagName;
      const reportError = (/** @type {string} */ message) => {
        console.error(`${tagName}: ${message}`);
      };

      if (options.parent) {
        const parent = options.parent.toUpperCase();
        if (parentElement.tagName.toUpperCase() !== parent) {
          reportError(`Must be contained within ${parent}`);
        }
      }

      options.not_after?.forEach(t => {
        if (parentElement.querySelectorAll(tagName + "," + t)[0] !== this) {
          reportError(`Cannot be after ${t.toUpperCase()}`);
        }
      });

      if (options.single) {
        if (parentElement.querySelector(tagName) !== this) {
          reportError(`Only one allowed.`);
        }
      }

      if (options.last) {
        if (parentElement.querySelector(tagName + ":last-child") !== this) {
          reportError(`Must be last`);
        }
      }
    }

    if (this._connectedCallback) {
      console.log(this.tagName + " connectedCallback");

      this._connectedCallback();
    }
  }
}
