// ---------- Settings: change these to your own details ----------
const CONFIG = {
  shopName: "Jounkey's Pizza Shop",
  whatsappNumber: "254740919279",        // country code first, no + and no spaces
  email: "olangjounkey1@gmail.com",    // put your real email here
};

// Prices in KES. These must match your menu table.
const MENU = {
  "margherita":  { name: "Margherita",     small: 400, medium: 600, large: 800 },
  "pepperoni":   { name: "Pepperoni",      small: 500, medium: 750, large: 1000 },
  "chicken-bbq": { name: "Chicken BBQ",    small: 550, medium: 800, large: 1100 },
  "veggie":      { name: "Veggie Delight", small: 450, medium: 650, large: 900 },
};

// ---------- Elements ----------
const form = document.querySelector("#order form");
const totalOutput = document.getElementById("order-total");
const statusMessage = document.getElementById("order-status");
const addToCartButton = document.getElementById("add-to-cart");
const cartMessage = document.getElementById("cart-message");
const cartList = document.getElementById("cart-items");

// ---------- Helpers ----------
function formatKES(amount) {
  return "KES " + amount.toLocaleString("en-KE");
}

function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// ---------- The cart ----------
// Each item looks like: { pizza: "pepperoni", size: "large", quantity: 2 }
// The price is NOT stored. We look it up in MENU when we need it.

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("cart"));
    if (!Array.isArray(saved)) {
      return [];
    }
    // Keep only items that still exist on the menu
    return saved.filter(function (item) {
      return MENU[item.pizza] && MENU[item.pizza][item.size] && item.quantity > 0;
    });
  } catch (error) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    // Storage can be blocked; the cart still works until the page is closed
  }
}

let cart = loadCart();

function itemSubtotal(item) {
  return MENU[item.pizza][item.size] * item.quantity;
}

function calculateTotal() {
  return cart.reduce(function (sum, item) {
    return sum + itemSubtotal(item);
  }, 0);
}

// Draws the whole cart on the page. Call it after EVERY change to the cart.
function renderCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.id = "cart-empty";
    emptyItem.textContent = "Your cart is empty.";
    cartList.appendChild(emptyItem);
  } else {
    cart.forEach(function (item, index) {
      const row = document.createElement("li");

      const text = document.createElement("span");
      text.textContent =
        item.quantity + " x " + MENU[item.pizza].name +
        " (" + capitalise(item.size) + ") - " + formatKES(itemSubtotal(item));

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "remove-item";
      removeButton.textContent = "Remove";
      removeButton.dataset.index = index;
      removeButton.setAttribute(
        "aria-label",
        "Remove " + MENU[item.pizza].name + " (" + item.size + ") from cart"
      );

      row.appendChild(text);
      row.appendChild(removeButton);
      cartList.appendChild(row);
    });
  }

  totalOutput.textContent = formatKES(calculateTotal());

  // Show how many pizzas are in the cart
  const itemCount = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);
  document.getElementById("cart-count").textContent = itemCount;
}

// ---------- Add to cart ----------
addToCartButton.addEventListener("click", function () {
  const pizza = document.getElementById("pizza").value;
  const sizeInput = form.querySelector('input[name="size"]:checked');
  const quantity = parseInt(document.getElementById("quantity").value, 10);

  if (!pizza) {
    cartMessage.textContent = "Please choose a pizza.";
    return;
  }
  if (!sizeInput) {
    cartMessage.textContent = "Please choose a size.";
    return;
  }
  if (!quantity || quantity < 1 || quantity > 20) {
    cartMessage.textContent = "Quantity must be between 1 and 20.";
    return;
  }

  const size = sizeInput.value;

  // Same pizza and size already in the cart? Increase its quantity.
  const existing = cart.find(function (item) {
    return item.pizza === pizza && item.size === size;
  });

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ pizza: pizza, size: size, quantity: quantity });
  }

  cartMessage.textContent =
    quantity + " x " + MENU[pizza].name + " (" + size + ") added to cart.";

  // Reset the fields for the next pizza
  document.getElementById("pizza").value = "";
  sizeInput.checked = false;
  document.getElementById("quantity").value = 1;

  saveCart();
  renderCart();
});

// ---------- Remove from cart ----------
// The Remove buttons are created by JavaScript, so we listen on the list
// itself and check which button was clicked (this is called event delegation).
cartList.addEventListener("click", function (event) {
  const button = event.target.closest(".remove-item");
  if (!button) {
    return;
  }

  cart.splice(Number(button.dataset.index), 1);
  cartMessage.textContent = "";
  saveCart();
  renderCart();
});

// ---------- Sending the order ----------
function buildMessage(data) {
  const lines = [
    "New order for " + CONFIG.shopName,
    "",
    "Name: " + data.name,
    "Phone: " + data.phone,
    "",
    "Order:",
  ];

  cart.forEach(function (item) {
    lines.push(
      "- " + item.quantity + " x " + MENU[item.pizza].name +
      " (" + capitalise(item.size) + ") = " + formatKES(itemSubtotal(item))
    );
  });

  lines.push("");
  lines.push("Total: " + formatKES(calculateTotal()));
  lines.push("Delivery address: " + data.address);

  if (data.notes.trim()) {
    lines.push("Notes: " + data.notes.trim());
  }
  return lines.join("\n");
}

function sendViaWhatsApp(message) {
  const url =
    "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);
  const opened = window.open(url, "_blank");
  if (!opened) {
    window.location.href = url; // popup blocked, open in the same tab
  }
}

function sendViaEmail(message) {
  const subject = "New pizza order from " + document.getElementById("name").value.trim();
  window.location.href =
    "mailto:" + CONFIG.email +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(message);
}

// ---------- Success pop-up ----------
const orderDialog = document.getElementById("order-dialog");
const orderDialogText = document.getElementById("order-dialog-text");
const orderDialogClose = document.getElementById("order-dialog-close");

function showOrderPopup(channel) {
  orderDialogText.textContent =
    channel === "whatsapp"
      ? "Your order is ready in WhatsApp. Press Send there so we receive it."
      : "Your order is ready in your email app. Press Send there so we receive it.";
  orderDialog.showModal();
}

orderDialogClose.addEventListener("click", function () {
  orderDialog.close();
});

// When the browser blocks the order because a required field is empty,
// also show our own clear message under the Place order button.
// ("invalid" events don't bubble, so we listen with `true` to catch them.)
form.addEventListener("invalid", function () {
  statusMessage.textContent =
    "Please fill in your name, phone number and delivery address, and choose WhatsApp or Email.";
}, true);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (cart.length === 0) {
    statusMessage.textContent =
      "Your cart is empty. Add at least one pizza before placing your order.";
    return;
  }

  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    notes: document.getElementById("notes").value,
  };
  const channel = form.querySelector('input[name="channel"]:checked').value;
  const message = buildMessage(data);

  if (channel === "whatsapp") {
    sendViaWhatsApp(message);
    statusMessage.textContent =
      "WhatsApp is opening with your order. Press Send there to finish.";
  } else {
    sendViaEmail(message);
    statusMessage.textContent =
      "Your email app is opening with your order. Press Send there to finish.";
  }

    showOrderPopup(channel);

    // The order has been handed to WhatsApp/email, so start with a fresh cart.
  // (The message was already built above, so clearing now is safe.)
  cart = [];
  saveCart();
  cartMessage.textContent = "";
  renderCart();
});

// ---------- Start ----------
renderCart();