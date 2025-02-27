document.addEventListener("DOMContentLoaded", () => {
const menuGrid = document.getElementById("menuGrid");
const cart = document.getElementById("cart");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const submitOrderBtn = document.getElementById("submit-order");
const orderResult = document.getElementById("order-result");
let cartData = [];

const menuItems = [
  {
    name: "Royal De Luxe",
    weight: "140g",
    price: 2.5,
    image: "images/image1.png",
  },
  {
    name: "Chicken Roll",
    weight: "290g",
    price: 4.5,
    image: "images/image2.png",
  },
  {
    name: "Double Fish",
    weight: "160g",
    price: 3.0,
    image: "images/image3.png",
  },
  {
    name: "Sub 'Meat'",
    weight: "190g",
    price: 3.5,
    image: "images/image4.png",
  },
  {
    name: "Salad 'Caesar'",
    weight: "150g",
    price: 4.5,
    image: "images/image5.png",
  },
  {
    name: "Chicken Premier",
    weight: "140g",
    price: 2.3,
    image: "images/image6.png",
  },
  {
    name: "Pizza 'Italian'",
    weight: "30cm",
    price: 7.5,
    image: "images/image2.png",
  },
  {
    name: "Chicken Wings (7)",
    weight: "350g",
    price: 3.5,
    image: "images/image4.png",
  },
];

  // Populate menu grid
menuItems.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";
    menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.weight}</p>
            <p>$${item.price.toFixed(2)}</p>
            <button class="add-to-cart">Add to Cart</button>
        `;
    menuGrid.appendChild(menuItem);

    // Add to Cart
const addToCartBtn = menuItem.querySelector(".add-to-cart");
addToCartBtn.addEventListener("click", () => {
    cartData.push({ ...item, id: cartData.length });
    updateCart();
      cart.classList.add("active"); // Show cart when items are added
    });
});

  // Update Cart Display
function updateCart() {
    cartItemsList.innerHTML = "";
    const total = cartData.reduce((sum, item) => sum + item.price, 0);

    cartData.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - $${item.price.toFixed(2)} 
            <button class="remove-item" data-index="${index}">Remove</button>`;
    cartItemsList.appendChild(li);
    });

    cartTotal.textContent = total.toFixed(2);

    // Remove Item
    document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
        const index = button.getAttribute("data-index");
        cartData.splice(index, 1);
        updateCart();
        if (cartData.length === 0) cart.classList.remove("active"); // Hide cart if empty
    });
    });
}

  // Submit Order
submitOrderBtn.addEventListener("click", () => {
    if (cartData.length === 0) {
    orderResult.innerHTML = '<p class="text-danger">Cart is empty!</p>';
    return;}

    const total = cartData.reduce((sum, item) => sum + item.price, 0);
    const username = "User123"; // Simulated username, replace with actual user input
    const now = new Date();
    const dateTime = now.toISOString().replace(/[:.-]/g, ""); // Format: YYYYMMDDTHHMMSS
    const orderId =
    cartData
        .map((item) =>
        item.name
            .split(" ")
            .map((word) => word[0])
            .join("")
        )
        .join("-") +
    "-" +
    dateTime +
    "-" +
    username;

// Simulate sending to backend
const orderData = {
    userId: username,
    orderId,
    items: cartData,
    total: total.toFixed(2),
    token: orderId,
};
console.log("Order Submitted:", orderData);

orderResult.innerHTML = `
        <p class="text-success">Order Submitted!</p>
        <p>Total: $${total.toFixed(2)}</p>
        <p>Token: ${orderId}</p>
    `;

// Clear cart after submission
cartData = [];
updateCart();
cart.classList.remove("active");
});
});
