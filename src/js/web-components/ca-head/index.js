//@ts-check

import { ca_eureka_component, ca_eureka } from "../index.js";

export default class ca_head extends ca_eureka_component {
  connectedCallback() {
    this.requireParentElement(ca_eureka.tagName);

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
