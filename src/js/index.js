//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

window.addEventListener("load", () => {
  class MyElement extends HTMLElement {
    connectedCallback() {
      // Create a shadow root
      // const shadow = this.attachShadow({ mode: "open" });

      this.style.backgroundColor = "#FAA";
      this.innerText = "connected";
    }
  }

  window.customElements.define("ca-eureka", MyElement);
});
