// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('furniCart')) || [];
    
    // Update cart count in navigation
    function updateCartCount() {
      const cartCountElements = document.querySelectorAll('.cart__count');
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      
      cartCountElements.forEach(element => {
        element.textContent = itemCount;
      });
    }
    
    // Update cart display on cart page
    function updateCartDisplay() {
      const cartItemsContainer = document.querySelector('.cart__items');
      const cartEmptyMessage = document.querySelector('.cart__empty');
      const cartSummary = document.querySelector('.cart__summary');
      
      if (!cartItemsContainer) return; // Not on cart page
      
      if (cart.length === 0) {
        // Show empty cart message, hide items and summary
        cartEmptyMessage.style.display = 'flex';
        cartItemsContainer.style.display = 'none';
        cartSummary.style.display = 'none';
        return;
      }
      
      // Hide empty message, show items and summary
      cartEmptyMessage.style.display = 'none';
      cartItemsContainer.style.display = 'block';
      cartSummary.style.display = 'block';
      
      // Clear current items
      cartItemsContainer.innerHTML = '';
      
      // Create cart items HTML
      let subtotal = 0;
      
      // Add table header
      const tableHeader = document.createElement('div');
      tableHeader.className = 'cart__header';
      tableHeader.innerHTML = `
        <div class="cart__item__col">Product</div>
        <div class="cart__item__col">Price</div>
        <div class="cart__item__col">Quantity</div>
        <div class="cart__item__col">Total</div>
        <div class="cart__item__col"></div>
      `;
      cartItemsContainer.appendChild(tableHeader);
      
      // Add cart items
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart__item';
        cartItem.innerHTML = `
          <div class="cart__item__col cart__item__product">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart__item__details">
              <h4>${item.name}</h4>
            </div>
          </div>
          <div class="cart__item__col">$${parseFloat(item.price).toFixed(2)}</div>
          <div class="cart__item__col cart__item__quantity">
            <button class="quantity__btn minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity__btn plus" data-id="${item.id}">+</button>
          </div>
          <div class="cart__item__col">$${itemTotal.toFixed(2)}</div>
          <div class="cart__item__col">
            <button class="remove__item" data-id="${item.id}">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
      });
      
      // Update subtotal and total
      document.querySelector('.cart__subtotal').textContent = `$${subtotal.toFixed(2)}`;
      document.querySelector('.cart__total').textContent = `$${subtotal.toFixed(2)}`;
      
      // Add event listeners to quantity buttons and remove buttons
      document.querySelectorAll('.quantity__btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          decreaseQuantity(id);
        });
      });
      
      document.querySelectorAll('.quantity__btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          increaseQuantity(id);
        });
      });
      
      document.querySelectorAll('.remove__item').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          removeItem(id);
        });
      });
    }
    
    // Add item to cart
    function addToCart(id, name, price, image) {
      // Check if item already exists in cart
      const existingItem = cart.find(item => item.id === id);
      
      if (existingItem) {
        // Increase quantity if item exists
        existingItem.quantity += 1;
      } else {
        // Add new item if it doesn't exist
        cart.push({
          id,
          name,
          price,
          image,
          quantity: 1
        });
      }
      
      // Save to localStorage
      localStorage.setItem('furniCart', JSON.stringify(cart));
      
      // Update UI
      updateCartCount();
      updateCartDisplay();
      
      // Show added to cart message
      showMessage(`${name} added to cart!`);
    }
    
    // Increase item quantity
    function increaseQuantity(id) {
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity += 1;
        localStorage.setItem('furniCart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
      }
    }
    
    // Decrease item quantity
    function decreaseQuantity(id) {
      const itemIndex = cart.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
          cart[itemIndex].quantity -= 1;
        } else {
          // Remove item if quantity would be 0
          cart.splice(itemIndex, 1);
        }
        localStorage.setItem('furniCart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
      }
    }
    
    // Remove item from cart
    function removeItem(id) {
      const itemIndex = cart.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        localStorage.setItem('furniCart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        showMessage(`${removedItem.name} removed from cart`);
      }
    }
    
    // Show message
    function showMessage(message) {
      // Create message element if it doesn't exist
      let messageElement = document.querySelector('.cart__message');
      if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'cart__message';
        document.body.appendChild(messageElement);
      }
      
      // Set message and show
      messageElement.textContent = message;
      messageElement.classList.add('show');
      
      // Hide after 3 seconds
      setTimeout(() => {
        messageElement.classList.remove('show');
      }, 3000);
    }
    
    // Add event listeners to Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add__to__cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = this.getAttribute('data-price');
        const image = this.getAttribute('data-img');
        
        addToCart(id, name, price, image);
      });
    });
    
    // Add event listener to checkout button
    const checkoutButton = document.querySelector('.checkout__btn');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
          showMessage('Your cart is empty. Add items before checkout.');
          return;
        }
        
        alert('Proceeding to checkout...');
        // Here you would normally redirect to a checkout page
      });
    }
    
    // Initialize the cart display on page load
    updateCartCount();
    updateCartDisplay();
  });