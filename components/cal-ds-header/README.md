# `cal-ds-header`

Banner for the top of any page. Place the code anywhere in your HTML and it will move to the top.

# User Definition Sample

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
      <div>
        Level 2 Menu
        <a href="/level2/option1">Level 2 Option 1</a>
        <a href="/level2/option2">Level 2 Option 2</a>
      </div>
      <a href="/about/">About</a>
    </nav>

    <!-- Utility Menu -->
    <nav>
      <a href="/contact/">Contact Us</a>
    </nav>

    <!-- Search Form -->
    <form action="/serp.html">
      <input placeholder="Search">
    </form>

    <!-- Additional header links -->
    <a href="#" class="login-button">Login</a>
  </template>

  <!-- Optional DOM slots -->
  <span slot="slot1">Slot 1</span>
  <span slot="slot2">Slot 2</span>
  <span slot="slot3">Slot 3</span>
  <span slot="slot4">Slot 4</span>
  <span slot="slot5">Slot 5</span>
  <span slot="slot6">Slot 6</span>
  <span slot="slot7">Slot 7</span>
  <span slot="slot8">Slot 8</span>
  <span slot="slot9">Slot 9</span>
  <span slot="slot10">Slot 10</span>
  <span slot="slot11">Slot 11</span>
  <span slot="slot12">Slot 12</span>
  <span slot="slot13">Slot 13</span>
</cal-ds-header>
```

# Rendered Markup Sample

```html
<header role="banner">
  <!-- Add class "theme-light" to use light header version -->
  <slot name="slot1"></slot>
  <div class="site-header">
    <slot name="slot2"></slot>
    <div class="site-header-container">
      <slot name="slot3"></slot>
      <nav class="mobile-nav-menu" role="navigation">
        <a href="#" tabindex="0" class="main-navigation-button" role="button">
          <div class="hamburger"></div>
          <span class="visually-hidden">Main menu</span>
        </a>
        <a
          href="#"
          tabindex="-1"
          class="main-navigation-cancel"
          role="button"
          aria-label="Close menu"></a>
        <ul>
          <li>
            <details name="MobileMenu">
              <summary>Level 1 menu - 1</summary>
              <ul>
                <li><a href="#" role="menuitem">Submenu 1A</a></li>
                <li><a href="#" role="menuitem">Submenu 1B</a></li>
                <li><a href="#" role="menuitem">Submenu 1C</a></li>
              </ul>
            </details>
          </li>
          <li>
            <details name="MobileMenu">
              <summary>Level 1 menu - 2</summary>
              <ul>
                <li><a href="#" role="menuitem">Submenu 2A</a></li>
                <li><a href="#" role="menuitem">Submenu 2B</a></li>
                <li><a href="#" role="menuitem">Submenu 2C</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>

      <a href="index.html" class="site-logo">
        <!-- add class "no-overflow" to remove image's bottom overflow-->
        <img
          src="https://cdn.cdt.ca.gov/cdt/CAWeb/site-logo-circle.svg"
          alt="Eureka Design System logo"
          class="logo-image " />

        <div class="site-branding-text">
          <span class="state">California</span>
          <span class="department">Department Website</span>
        </div>
      </a>
      <slot name="slot4"></slot>
      <div class="site-header-utility">
        <slot name="slot5"></slot>
        <div class="search-container-desktop">
          <slot name="slot6"></slot>
          <form autocomplete="on">
            <label class="search-toggle" for="site-search"
              ><span class="visually-hidden">Search this site</span></label
            >
            <input
              id="site-search"
              type="search"
              name="q"
              class="search-input"
              placeholder="Search..."
              tabindex="0"
              required />
            <button type="submit" class="search-submit" tabindex="-1"></button>
            <button type="submit" class="search-submit"></button>
          </form>
          <slot name="slot7"></slot>
        </div>
        <slot name="slot8"></slot>
        <a href="#" class="login-button"
          ><span class="login-text">Login</span></a
        >
        <slot name="slot9"></slot>
        <a class="cagov-toggle" href="https://www.ca.gov/">
          <span class="visually-hidden">ca.gov link</span>
        </a>
        <slot name="slot10"></slot>
      </div>
      <slot name="slot11"></slot>
    </div>
    <slot name="slot12"></slot>
  </div>
  <slot name="slot13"></slot>
</header>
```

# Adding HTML SCRIPT reference

```HTML
<head>
  <script src="https://cdn.jsdelivr.net/npm/@cagovweb/cal-ds-header" type="module"></script>
</head>
```

# Try this on your site

```JavaScript
document.head.appendChild(Object.assign(document.createElement("script"), {src: "https://cdn.jsdelivr.net/npm/@cagovweb/cal-ds-header",type:"module"}));
document.body.innerHTML = `

<cal-ds-header>
  <template>
    <!-- Site Branding -->
    <a href="https://www.ca.gov">
      <img
        src="https://template.webstandards.ca.gov/images/template-logo.png"
        alt="Custom Image"
        title="Custom Image" />
      <span>California Custom</span>
      <span>Department Website Custom</span>
    </a>

    <!-- Nav links -->
    <nav>
      <a href="/home/">Home</a>
      <div>
        Level 2 Menu
        <a href="/level2/option1">Level 2 Option 1</a>
        <a href="/level2/option2">Level 2 Option 2</a>
      </div>
      <a href="/about/">About</a>
    </nav>

    <!-- Utility Menu -->
    <nav>
      <a href="/contact/">Contact Us</a>
    </nav>

    <!-- Search Form -->
    <form action="/serp.html">
      <input placeholder="Search">
    </form>

    <!-- Additional header links -->
    <a href="#" class="login-button">Login</a>
  </template>
</cal-ds-header>

`+document.body.innerHTML;
```
