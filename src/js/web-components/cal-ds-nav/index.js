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
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = this.innerHTML;
      }
    };

    super({
      shadow: true,
      css,
      connectedCallback: contentChanged
    });

    // Callback function to execute when mutations are observed
    // eslint-disable-next-line jsdoc/no-undefined-types
    /** @type {MutationCallback} */
    const mutationCallback = mutationsList =>
      mutationsList.forEach(mutation => {
        console.log(mutation.type);
        contentChanged();
      });

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(mutationCallback);

    // Start observing the target node for configured mutations
    observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
  }
}
