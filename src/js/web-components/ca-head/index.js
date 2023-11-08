const tagName_ca_eureka = "ca-eureka";
/**
 *
 * @param {HTMLElement} MyElement
 * @param {string} ParentType
 */
const requireParentElement = (MyElement, ParentType) => {
  if (
    MyElement.parentElement?.tagName.toUpperCase() !== ParentType.toUpperCase()
  ) {
    console.error(
      `${
        MyElement.tagName
      } must be contained within ${ParentType.toUpperCase()}`
    );
  }
};

export default class ca_head extends HTMLElement {
  connectedCallback() {
    requireParentElement(this, tagName_ca_eureka);

    if (this.dataset.title) {
      document.title = this.dataset.title;
    }

    if (this.dataset.description) {
      const metaDescription =
        document.head.querySelector(`meta[name="description" i]`) ||
        Object.assign(document.createElement("meta"), {
          name: "Description"
        });

      metaDescription.attributes["content"].value = this.dataset.description;
    }
  }
}
