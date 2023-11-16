//@ts-check

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements

import * as eureka from "./web-components/index.js";

const all = (
  /** @type {Window } */ window,
  /** @type {(typeof eureka.ca_eureka_component)[]} */ ...constructors
) => {
  constructors.forEach(c => {
    window.customElements.define(c.tagName, c);
  });
};

all(
  window,
  eureka.ca_eureka,
  eureka.ca_head,
  eureka.ca_nav,
  eureka.ca_body,
  eureka.ca_footer
);
/*
  [eureka.ca_eureka,
    eureka.ca_head,
    eureka.ca_nav,
    eureka.ca_body,
    eureka.ca_footer].forEach(c => {
      
    })
    */
