//@ts-check

import cal_ds_base from "../_cal-ds-base/src/index";

export default class my extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-seo";
  }

  /**
   * @protected
   * @override
   */
  static get observedAttributes() {
    return ["data-title", "data-description", "data-canonical-params"];
  }
  /**
   *  attributeChangedCallback, static so it can be a reference
   *  @private
   *  @readonly
   */
  static _callback =
    /**
     * @param {string} name
     * @param {string} _oldValue
     * @param {string} newValue
     */
    (name, _oldValue, newValue) => {
      /**
       * @param {string} metaName
       * @param {string | null} metaValue
       */
      const setMeta = (metaName, metaValue) => {
        const existingMeta = document.head.querySelector(
          `meta[name="${metaName}" i]`
        );

        if (existingMeta) {
          if (metaValue === null) {
            existingMeta.remove();
          } else {
            existingMeta.attributes["content"].value = metaValue;
          }
        } else if (metaValue !== null) {
          document.head.append(
            Object.assign(document.createElement("meta"), {
              name: metaName,
              content: metaValue
            })
          );
        }
      };

      const observedAttributes = my.observedAttributes; // const will minify

      switch (name) {
        case observedAttributes[0]: //"data-title":
          document.title = newValue || "";
          ["title", "og:title", "twitter:title"].forEach(m =>
            setMeta(m, newValue)
          );

          break;
        case observedAttributes[1]: //"data-description":
          ["description", "og:description", "twitter:description"].forEach(m =>
            setMeta(m, newValue)
          );

          break;
        case observedAttributes[2]: //"data-canonical-params":
          {
            let href = null;

            if (newValue !== null) {
              const desiredQueryItems = newValue
                .split(",")
                .map(t => t.trim().toLowerCase());

              const currentUrl = new URL(location.href.toLowerCase());
              const newUrl = new URL(currentUrl.host + currentUrl.pathname);

              //Rebuild the query in desired order
              desiredQueryItems.forEach(k => {
                const v = currentUrl.searchParams.get(k);
                if (v) {
                  newUrl.searchParams.set(k, v);
                }
              });

              href = newUrl.href;
            }
            ["canonical", "og:url", "twitter:url"].forEach(m =>
              setMeta(m, href)
            );
          }

          break;
      }
    };

  constructor() {
    super({ attributeChangedCallback: my._callback });
  }
}
