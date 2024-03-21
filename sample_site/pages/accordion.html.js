//@ts-check

window.addEventListener("cal_ds_connectedCallback_end", e => {
  const comp = /** @type {import("../../src/js").cal_ds_base} **/ (e.target);

  if (comp.tagName === "CAL-DS-ACCORDION") {
    comp.addStyle("details{background-color:pink}");

    if (comp.shadowRoot) {
      const testItem = document.createElement("em");
      testItem.innerHTML = "JavaScript added to shadow root";
      comp.shadowRoot.querySelector("details")?.appendChild(testItem);
    }

    comp.innerHTML = comp.innerHTML.replace(
      /accordion/g,
      "Accordion Customized"
    );
  }
});

window.addEventListener("cal_ds_shadow_constructed_start", e => {
  const comp = /** @type {import("../../src/js").cal_ds_base} **/ (e.target);

  if (comp.tagName === "CAL-DS-ACCORDION") {
    comp.HTMLTemplateString = comp.HTMLTemplateString?.replace(
      /<div>/g,
      "<div>JavaScript Event added"
    );
  }
});
