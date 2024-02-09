//@ts-check
import ca_eureka_component from "../_ca-eureka-component/index";

// @ts-ignore
import css from "./styles.css";

export default class extends ca_eureka_component {
  /** @override */
  static get tagName() {
    return "ca-nav";
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
    const callback = mutationsList =>
      mutationsList.forEach(mutation => {
        console.log(mutation.type);
        contentChanged();
      });

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
  }
}
