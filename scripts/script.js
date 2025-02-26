document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartItemsList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const submitOrderBtn = document.getElementById('submit-order');
    const orderResult = document.getElementById('order-result');

    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            cart.push({ name, price });
            updateCart();
        });
    });

    // Update Cart Display
    function updateCart() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `${item.name} - $${item.price} <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>`;
            cartItemsList.appendChild(li);
        });

        cartTotal.textContent = total.toFixed(2);

        // Remove Item
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // Submit Order
    submitOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            orderResult.innerHTML = '<p class="text-danger">Cart is empty!</p>';
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const userId = 'USER123'; // Simulated user ID
        const orderId = 'ORDER' + Math.floor(Math.random() * 10000);
        const token = `${userId}_${orderId}`;

        // Simulate sending to backend
        console.log('Order Submitted:', { userId, orderId, cart, total, token });

        orderResult.innerHTML = `
            <p class="text-success">Order Submitted!</p>
            <p>Total: $${total.toFixed(2)}</p>
            <p>Token: ${token}</p>
        `;

        // Clear cart after submission
        cart.length = 0;
        updateCart();
    });
});