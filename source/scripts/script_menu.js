document.addEventListener("DOMContentLoaded", () => {
    const menuGrid = document.getElementById("menuGrid");
    const cart = document.getElementById("cart");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const submitOrderBtn = document.getElementById("submit-order");
    const orderResult = document.getElementById("order-result");
    const usernameInput = document.getElementById("username");
    const loginButton = document.getElementById("login");

    let cartData = JSON.parse(localStorage.getItem("cartData")) || [];
    let username = "User123";

const menuItems = [
  // Starters
  {
    name: "Garlic Bread",
    weight: "100g",
    price: 3.0,
    image: "images/foods/garlic_bread.jpeg",
    description: "Toasted bread with garlic butter and herbs.",
    category: "starters",
  },
  {
    name: "Bruschetta",
    weight: "120g",
    price: 4.0,
    image: "images/foods/buschetta_bread.jpeg",
    description: "Toasted bread topped with tomatoes, basil, and olive oil.",
    category: "starters",
  },
  {
    name: "Spring Rolls",
    weight: "150g",
    price: 3.5,
    image: "images/foods/spring_rolls.jpg",
    description: "Crispy spring rolls with a vegetable filling.",
    category: "starters",
  },
  {
    name: "Chicken Wings",
    weight: "200g",
    price: 5.0,
    image: "images/foods/chicken_wings.jpg",
    description: "Spicy chicken wings served with dipping sauce.",
    category: "starters",
  },
  {
    name: "Mozzarella Sticks",
    weight: "130g",
    price: 4.5,
    image: "images/foods/mozzarella_sticks.jpeg",
    description: "Fried mozzarella sticks with marinara sauce.",
    category: "starters",
  },

  // Breakfast
  {
    name: "Pancakes",
    weight: "200g",
    price: 5.0,
    image: "images/foods/pancakes.jpeg",
    description: "Fluffy pancakes served with maple syrup and butter.",
    category: "breakfast",
  },
  {
    name: "Eggs Benedict",
    weight: "250g",
    price: 6.5,
    image: "images/foods/eggs_benedict.jpg",
    description: "Poached eggs on English muffins with hollandaise sauce.",
    category: "breakfast",
  },
  {
    name: "Avocado Toast",
    weight: "180g",
    price: 4.5,
    image: "images/foods/avocado_toast.jpeg",
    description: "Toasted bread topped with mashed avocado and seasonings.",
    category: "breakfast",
  },
  {
    name: "French Toast",
    weight: "220g",
    price: 5.5,
    image: "images/foods/french_toast.jpeg",
    description: "Sweet French toast topped with powdered sugar and berries.",
    category: "breakfast",
  },
  {
    name: "Breakfast Burrito",
    weight: "300g",
    price: 7.0,
    image: "images/foods/breakfast_burrito.jpeg",
    description: "A hearty burrito filled with eggs, cheese, and sausage.",
    category: "breakfast",
  },

  // Lunch
  {
    name: "Caesar Salad",
    weight: "150g",
    price: 6.0,
    image: "images/foods/caesar_salad.jpg",
    description: "Classic Caesar salad with croutons and parmesan.",
    category: "lunch",
  },
  {
    name: "Grilled Chicken Sandwich",
    weight: "250g",
    price: 7.5,
    image: "images/foods/grilled_chicken_sandwich.jpeg",
    description: "Grilled chicken breast with lettuce, tomato, and mayo.",
    category: "lunch",
  },
  {
    name: "Beef Burger",
    weight: "300g",
    price: 8.0,
    image: "images/foods/beef_burger.jpg",
    description: "Juicy beef patty with cheese, lettuce, and pickles.",
    category: "lunch",
  },
  {
    name: "Vegetable Wrap",
    weight: "200g",
    price: 6.5,
    image: "images/foods/vegetable_wrap.jpeg",
    description: "A healthy wrap filled with fresh vegetables and hummus.",
    category: "lunch",
  },
  {
    name: "Pasta Alfredo",
    weight: "280g",
    price: 9.0,
    image: "images/foods/pasta_alfredo.jpg",
    description: "Creamy Alfredo pasta with parmesan and garlic.",
    category: "lunch",
  },

  // Snacks
  {
    name: "French Fries",
    weight: "150g",
    price: 3.5,
    image: "images/foods/french_fries.jpeg",
    description: "Crispy golden fries served with ketchup.",
    category: "snacks",
  },
  {
    name: "Onion Rings",
    weight: "120g",
    price: 4.0,
    image: "images/foods/onion_rings.jpeg",
    description: "Crispy fried onion rings with dipping sauce.",
    category: "snacks",
  },
  {
    name: "Nachos",
    weight: "200g",
    price: 5.5,
    image: "images/foods/nachos.jpg",
    description: "Tortilla chips topped with cheese, salsa, and guacamole.",
    category: "snacks",
  },
  {
    name: "Cheese Sticks",
    weight: "130g",
    price: 4.5,
    image: "images/foods/cheese-sticks.jpg",
    description: "Fried cheese sticks served with marinara sauce.",
    category: "snacks",
  },
  {
    name: "Potato Wedges",
    weight: "180g",
    price: 4.0,
    image: "images/foods/potato_wedges.jpeg",
    description: "Seasoned potato wedges with a side of sour cream.",
    category: "snacks",
  },

  // Desserts
  {
    name: "Chocolate Cake",
    weight: "150g",
    price: 5.0,
    image: "images/foods/chocolate_cake.jpg",
    description: "Rich chocolate cake with a creamy frosting.",
    category: "desserts",
  },
  {
    name: "Cheesecake",
    weight: "120g",
    price: 6.0,
    image: "images/foods/cheese_cake.jpeg",
    description: "Creamy cheesecake with a graham cracker crust.",
    category: "desserts",
  },
  {
    name: "Apple Pie",
    weight: "200g",
    price: 5.5,
    image: "images/foods/apple_pie.jpeg",
    description: "Classic apple pie with a flaky crust.",
    category: "desserts",
  },
  {
    name: "Ice Cream Sundae",
    weight: "180g",
    price: 4.5,
    image: "images/foods/icecreamsundae.jpg",
    description: "Vanilla ice cream topped with chocolate syrup and nuts.",
    category: "desserts",
  },
  {
    name: "Tiramisu",
    weight: "150g",
    price: 6.5,
    image: "images/foods/tiramisu.jpeg",
    description: "Classic Italian dessert with coffee and mascarpone.",
    category: "desserts",
  },

  // Beverages
  {
    name: "Iced Coffee",
    weight: "300ml",
    price: 3.5,
    image: "images/foods/iced_coffee.jpeg",
    description: "Chilled coffee with milk and sugar.",
    category: "beverages",
  },
  {
    name: "Fresh Orange Juice",
    weight: "250ml",
    price: 4.0,
    image: "images/foods/freshorangejuice.jpeg",
    description: "Freshly squeezed orange juice.",
    category: "beverages",
  },
  {
    name: "Mango Smoothie",
    weight: "300ml",
    price: 5.0,
    image: "images/foods/mangosmoothie.jpg",
    description: "Refreshing mango smoothie with yogurt.",
    category: "beverages",
  },
  {
    name: "Green Tea",
    weight: "200ml",
    price: 2.5,
    image: "images/foods/green_tea.jpg",
    description: "Hot green tea with a hint of lemon.",
    category: "beverages",
  },
  {
    name: "Strawberry Milkshake",
    weight: "350ml",
    price: 5.5,
    image: "images/foods/strawberry_milkshake.jpg",
    description: "Creamy strawberry milkshake topped with whipped cream.",
    category: "beverages",
  },
];

    // Populate menu grid
    function populateMenu(items) {
        menuGrid.innerHTML = "";
        items.forEach((item) => {
            const menuItem = document.createElement("div");
            menuItem.className = "menu-item";
            menuItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.weight}</p>
                <p>${item.description}</p>
                <p>¢${item.price.toFixed(2)}</p>
                <button class="add-to-cart" aria-label="Add ${item.name} to cart">Add to Cart</button>
            `;
            menuGrid.appendChild(menuItem);

            const addToCartBtn = menuItem.querySelector(".add-to-cart");
            addToCartBtn.addEventListener("click", () => {
                cartData.push({ ...item, id: cartData.length });
                updateCart();
            });
        });
    }

    // Filter menu items by category
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category");
            filterMenuItems(category);
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });

    function filterMenuItems(category) {
        const filteredItems = category === "all" ? menuItems : menuItems.filter(item => item.category === category);
        populateMenu(filteredItems);
    }

    // Update Cart Display
    function updateCart() {
        cartItemsList.innerHTML = "";
        const total = cartData.reduce((sum, item) => sum + item.price, 0);

        cartData.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${item.name} - ¢${item.price.toFixed(2)} 
                    <button class="remove-item" data-index="${index}">Remove</button>`;
            cartItemsList.appendChild(li);
        });

        cartTotal.textContent = total.toFixed(2);

        // Remove Item
        document.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", () => {
                const index = button.getAttribute("data-index");
                cartData.splice(index, 1);
                localStorage.setItem("cartData", JSON.stringify(cartData));
                updateCart();
                if (cartData.length === 0) cart.classList.remove("active");
            });
        });

        localStorage.setItem("cartData", JSON.stringify(cartData));
    }

    // Submit Order
    submitOrderBtn.addEventListener("click", () => {
        if (cartData.length === 0) {
            orderResult.innerHTML = '<p class="text-danger">Cart is empty!</p>';
            return;
        }

        submitOrderBtn.disabled = true;
        submitOrderBtn.innerHTML = '<div class="loading"></div> Submitting...';

        const total = cartData.reduce((sum, item) => sum + item.price, 0);
        const now = new Date();
        const dateTime = now.toISOString().replace(/[:.-]/g, "");
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

        // Simulate network request
        setTimeout(() => {
            const success = Math.random() > 0.5; // Simulate success/failure
            if (success) {
                orderResult.innerHTML = `
                    <p class="text-success">Order Submitted!</p>
                    <p>Total: $${total.toFixed(2)}</p>
                    <p>Token: ${orderId}</p>
                `;
                cartData = [];
                updateCart();
            } else {
                orderResult.innerHTML = '<p class="text-danger">Order submission failed. Please try again.</p>';
            }
            submitOrderBtn.disabled = false;
            submitOrderBtn.innerHTML = 'Submit Order';
        }, 1000);
    });

    // User Authentication
    loginButton.addEventListener("click", () => {
        username = usernameInput.value || "User123";
        alert(`Logged in as ${username}`);
    });

    // Initial population of menu
    populateMenu(menuItems);
    updateCart();
});