# Jounkey's Pizza Shop

A responsive pizza shop website where customers can browse the menu, see a live price total, and send their order to the shop on WhatsApp or by email. Built with plain HTML, CSS and JavaScript, with no frameworks or backend.

## Features

- Responsive design that works on phones, tablets and computers
- Sticky navigation with a pizzeria-style checkered strip
- Menu table with prices in KES for small, medium and large sizes
- Online order form with live total that updates as the customer chooses a pizza, size and quantity
- Customers choose how to send their order: WhatsApp or email
- Order details (name, phone, pizza, size, quantity, total, address, notes) are filled in automatically

## Built with

- HTML5
- CSS3 (custom properties, grid, flexbox)
- JavaScript (vanilla)

## Project structure

```
pizza-shop/
├── index.html
├── styles.css
├── script.js
├── README.md
└── image.pizza/
    ├── pizza-1.png
    ├── pizza-2.png
    ├── pizza-3.png
    └── pizza-4.png
```

## How to run

1. Download or clone this project.
2. Open `index.html` in your browser.

No installation or build step is needed.

## How ordering works

When a customer fills in the form and clicks **Place order**:

- **WhatsApp:** WhatsApp opens a chat with the shop's number with the order already typed out.
- **Email:** the customer's email app opens with the order addressed to the shop.

The customer must press **Send** in WhatsApp or their email app for the order to reach the shop.

## Customising

All settings are at the top of `script.js`:

```js
const CONFIG = {
  shopName: "Jounkey's Pizza Shop",
  whatsappNumber: "254740919279", // country code first, no + or spaces
  email: "olangjounkey1@example.com",
};
```

To change pizzas or prices, edit the `MENU` object in `script.js` **and** the menu table in `index.html` so they match.

Colors and fonts are set in the `:root` block at the top of `styles.css`.

## Future improvements

- Shopping cart for ordering several different pizzas at once
- Automatic order emails using a service like Formspree or EmailJS
- Google Maps link to the shop location
- Online payments (M-Pesa)

## Author

Jounkey Olang
