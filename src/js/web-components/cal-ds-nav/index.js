// from
// https://www.cssscript.com/create-a-multi-level-drop-down-menu-with-pure-css/

//@ts-check
import cal_ds_base from "../_cal-ds-base/index";

// @ts-ignore
import css from "./styles.css";

export default class extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-nav";
  }

  constructor() {
    const contentChanged = () => {
      const myTemplate = this.querySelector("template");

      if (myTemplate && this.shadowRoot) {
        this.shadowRoot.innerHTML = "";

        const dom = /** @type {DocumentFragment} */ (
          myTemplate.content.cloneNode(true)
        );

        const anchors = dom.querySelectorAll("a");

        anchors.forEach(a => {
          const anchorUrl = new URL(a.href, window.location.origin);

          if (anchorUrl.href === window.location.href) {
            a.ariaCurrent = "page";
          }
        });

        this.shadowRoot.appendChild(dom);
      }
    };

    super({ shadow: true, css, connectedCallback: contentChanged });

    const myTemplate = this.querySelector("template");
    if (myTemplate) {
      // Callback function to execute when mutations are observed
      // eslint-disable-next-line jsdoc/no-undefined-types
      /** @type {MutationCallback} */
      const mutationCallback = mutationsList =>
        mutationsList.forEach(contentChanged);

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(mutationCallback);

      // Start observing the target node for configured mutations
      observer.observe(myTemplate.content, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }
}
