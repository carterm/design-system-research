# `cal-ds-header`

Banner for the top of any page. Place the code anywhere in your HTML and it will move to the top.

```html
<cal-ds-header
  data-logo-overflow="true"
  data-apps-link-style="link"
  data-apps-link-url="https://www.ca.gov"
  data-apps-link-tooltip="Link to www.ca.gov website"
>
  <template>
    <!-- Site Branding -->
    <a href="/">
      <!-- Branding logo -->
      <img src="https://cdn.cdt.ca.gov/cdt/CAWeb/site-logo-circle.svg" alt="Eureka Design System logo">
      <!-- Branding text -->
      <span>California</span>
      <span>Department Website</span>
    </a>

    <!-- Nav links -->
    <nav>
      <a href="/home/">Home</a>
      <a>Level 2 Menu</a>
      <a href="/level2/option1" data-level="2">Level 2 Option 1</a>
      <a href="/level2/option2" data-level="2">Level 2 Option 2</a>
      <a href="/about/">About</a>
    </nav>

    <!-- Search Form -->
    <form action="/serp.html">
      <input placeholder="Search">
    </form>

    <!-- Additional header links -->
    <a href="#" class="login-button">Login</a>
  </template>
</cal-ds-header>
```
