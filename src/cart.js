document.addEventListener('DOMContentLoaded', () => {
    const placeOrderButton = document.querySelector('.place-order-button');
    placeOrderButton.addEventListener('click', async () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        try {
            const response = await fetch('/stripe-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: cart
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create Stripe checkout session');
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Invalid URL received from the server:', data.url);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            // Handle error scenario (e.g., show error message to user)
        }
    });

    function updateCheckoutDisplay() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartDiv = document.querySelector('.cart-items');
        const totalPriceDiv = document.querySelector('.total-price');
        cartDiv.innerHTML = '';
        let totalPrice = 0;

        cart.forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `<p>${item.name} - ${item.price}</p>`;
            cartDiv.appendChild(itemDiv);

            // Remove currency symbol and parse the price as a number
            const price = parseFloat(item.price.replace('Rs ', '').replace(/,/g, ''));
            totalPrice += price;
        });

        totalPriceDiv.innerHTML = `<h3>Total: Rs ${totalPrice.toLocaleString()}</h3>`;
    }

    updateCheckoutDisplay();
});
