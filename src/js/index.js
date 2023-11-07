//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

window.addEventListener("load", () => {
  class MyElement extends HTMLElement {
    connectedCallback() {}
  }

  window.customElements.define("ca-eureka", MyElement);

  class MyElement2 extends HTMLElement {
    connectedCallback() {}
  }

  window.customElements.define("ca-header", MyElement2);

  class ca_head extends HTMLElement {
    connectedCallback() {
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

  window.customElements.define("ca-head", ca_head);
});
