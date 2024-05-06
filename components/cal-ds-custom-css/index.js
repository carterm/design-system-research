//@ts-check
import cal_ds_base from "../_cal-ds-base/src/index";

export default class my extends cal_ds_base {
  /** @override */
  static get tagName() {
    return "cal-ds-custom-css";
  }

  constructor() {
    super();

    //Push the styles on anything with a shadow
    cal_ds_base.addCEventListener("cal_ds_shadow_constructed_end", comp => {
      // expecting <template><style>

      if (this.UserTemplate) {
        const style = this.UserTemplate.querySelector("style");

        if (style) {
          comp.addStyle(style.innerHTML);
        } else {
          console.error(`${my.tagName}: missing \`<style>\` tag`);
        }
      } else {
        console.error(`${my.tagName}: missing \`<template>\` tag`);
      }
    });
  }
}
