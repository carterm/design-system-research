//@ts-check
import { ca_eureka_component } from "../index.js";

export default class ca_eureka extends ca_eureka_component {
  connectedCallback() {
    this.requireSingle();
  }
}
