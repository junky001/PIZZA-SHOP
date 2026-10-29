# Jounkey's Pizza Shop

A responsive pizza shop website where customers can browse the menu, build an order in a shopping cart, and send it to the shop on WhatsApp or by email. Built with plain HTML, CSS and JavaScript, with no frameworks or backend.

<!-- Add a screenshot: save it as screenshot.png in this folder, then delete this line and the arrows around the next line -->
<!-- ![Jounkey's Pizza Shop](screenshot.png) -->

<!-- Live demo: after publishing on GitHub Pages, add the link here -->

## Features

- Responsive design that works on phones, tablets and computers
- Sticky navigation with a pizzeria-style checkered strip
- Menu table with prices in KES for small, medium and large sizes
- **Shopping cart:** customers can add several different pizzas to one order
  - Adding the same pizza and size again increases its quantity instead of creating a duplicate row
  - Each item can be removed with one click
  - A cart icon with a badge shows how many pizzas are in the cart
  - The cart is saved in the browser, so it survives a page refresh
- Live total that updates whenever the cart changes
- Customers choose how to send their order: WhatsApp or email
- The order message is written automatically: name, phone, every pizza with its size, quantity and price, the total, the delivery address and any notes
- Friendly messages when the cart is empty or delivery details are missing
- "Order placed successfully" pop-up after an order is sent, and the cart is emptied for the next order

## Built with

- HTML5 (semantic elements, forms, `<dialog>`)
- CSS3 (custom properties, grid, flexbox)
- JavaScript (vanilla): arrays and objects, DOM manipulation, `localStorage`, event delegation

## Project structure

```
pizza-shop/
├── index.html
├── styles.css
├── script.js
├── README.md
└── image.pizza/
    ├── pizza6.png
    ├── pizza-2.png
    ├── pizza-3.png
    └── pizza-4.png
```

## How to run

1. Download or clone this project.
2. Open `index.html` in your browser.

No installation or build step is needed.

## How ordering works

1. The customer chooses a pizza, a size and a quantity, then clicks **Add to cart**. This can be repeated for as many pizzas as they like.
2. The cart shows every item with its price, and the total updates automatically. Items can be removed.
3. The customer fills in their name, phone number and delivery address (notes are optional) and chooses WhatsApp or email.
4. When they click **Place order**:
   - **WhatsApp:** WhatsApp opens a chat with the shop's number with the whole order already typed out.
   - **Email:** the customer's email app opens with the order addressed to the shop.
5. A pop-up confirms the order, and the cart is emptied.

The customer must press **Send** in WhatsApp or their email app for the order to reach the shop. The website can only open these apps with the message ready; it cannot send the message itself.

## Customising

All settings are at the top of `script.js`:

```js
const CONFIG = {
  shopName: "Your Shop Name",
  whatsappNumber: "2547XXXXXXXX", // country code first, no + or spaces
  email: "your-email@example.com",
};
```

To change pizzas or prices, update these three places so they match:

1. The `MENU` object in `script.js`
2. The menu table in `index.html`
3. The pizza dropdown (`<select id="pizza">`) in `index.html`

Colors and fonts are set in the `:root` block at the top of `styles.css`.

## What I practised

- Storing and updating data with arrays and objects (the cart)
- Rebuilding part of the page from data (`renderCart()`)
- Event delegation for buttons that are created by JavaScript
- Saving data in the browser with `localStorage`
- Building a pre-filled WhatsApp link and `mailto:` link with `encodeURIComponent`
- Form validation and clear messages for the customer
- The built-in `<dialog>` element for an accessible pop-up

## Future improvements

- Plus and minus buttons to change quantities inside the cart
- Automatic order emails using a service like Formspree or EmailJS
- A Contact section with a Google Maps link to the shop location
- Online payments (M-Pesa)

## Author

Jounkey Olang
