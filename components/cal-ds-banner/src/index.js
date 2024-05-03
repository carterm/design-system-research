// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/

//@ts-check
import cal_ds_base from "../../_cal-ds-base/index";

// @ts-ignore
import css from "./styles.css";

// @ts-ignore
import html from "./template.html";

export default class extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-banner";
  }

  constructor() {
    const _contentChanged = () => {
      if (this.UserTemplate && this.shadowRoot && this.HTMLTemplateString) {
        this.shadowRoot.innerHTML = this.HTMLTemplateString;

        const ul = /** @type {HTMLElement} */ (
          this.shadowRoot.querySelector("p")
        );
        const dom = /** @type {DocumentFragment} */ (
          this.UserTemplate.cloneNode(true)
        );

        ul.appendChild(dom);
      }

      //Move itself to the top
      if (document.body.firstElementChild !== this) document.body.prepend(this);
    };

    super({
      shadow: true,
      css,
      html,
      connectedCallback: _contentChanged
    });

    if (this.UserTemplate) {
      // Callback function to execute when mutations are observed
      // eslint-disable-next-line jsdoc/no-undefined-types
      /** @type {MutationCallback} */
      const mutationCallback = mutationsList =>
        mutationsList.forEach(_contentChanged);

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(mutationCallback);

      // Start observing the target node for configured mutations
      observer.observe(this.UserTemplate, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }
}
