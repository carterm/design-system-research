# `cal-ds-nav`

Navigation menu

Sample usage:

```html
<cal-ds-nav>
  <template>
    <a href="/">Home</a>
    <a href="/accordion/">Accordion</a>
    <a href="/cards/">Cards</a>
    <a href="/about/">About</a>
  </template>
</cal-ds-nav>
```

Try this anywhere

## Try this on any page on the web!

Place this in the web console

```javascript
document.head.appendChild(Object.assign(document.createElement("script"), {src: "https://cdn.jsdelivr.net/npm/@cagovweb/cal-ds-nav",type:"module"}));
document.body.innerHTML = `

<cal-ds-nav>
  <template>
    <a href="/">Home</a>
    <a href="/accordion/">Accordion</a>
    <a href="/cards/">Cards</a>
    <a href="/about/">About</a>
  </template>
</cal-ds-nav>

`+document.body.innerHTML;
```
