// ---------- Settings: change these to your own details ----------
const CONFIG = {
  shopName: "Jounkey's Pizza Shop",
  whatsappNumber: "254740919279",        // country code first, no + and no spaces
  email: "olangjounkey1@example.com",    // put your real email here
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

// ---------- Helpers ----------
function formatKES(amount) {
  return "KES " + amount.toLocaleString("en-KE");
}

function calculateTotal() {
  const pizza = document.getElementById("pizza").value;
  const sizeInput = form.querySelector('input[name="size"]:checked');
  const quantity = parseInt(document.getElementById("quantity").value, 10);

  if (!pizza || !sizeInput || !quantity || quantity < 1) {
    return 0;
  }
  return MENU[pizza][sizeInput.value] * quantity;
}

function updateTotal() {
  totalOutput.textContent = formatKES(calculateTotal());
}

function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function buildMessage(data) {
  const pizza = MENU[data.pizza];
  const lines = [
    "New order for " + CONFIG.shopName,
    "",
    "Name: " + data.name,
    "Phone: " + data.phone,
    "Order: " + data.quantity + " x " + pizza.name + " (" + capitalise(data.size) + ")",
    "Total: " + formatKES(calculateTotal()),
    "Delivery address: " + data.address,
  ];

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

// ---------- Events ----------
// Recalculate whenever the pizza, size or quantity changes
form.addEventListener("input", updateTotal);
form.addEventListener("change", updateTotal);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    pizza: document.getElementById("pizza").value,
    size: form.querySelector('input[name="size"]:checked').value,
    quantity: document.getElementById("quantity").value,
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
});

updateTotal();