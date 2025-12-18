const AppState = {
    currentProduct: 'tshirt',
    currentColor: '#FFFFFF',
    currentPrice: 19.99,
    uploadedImage: null,
    cart: [],
    stripe: null,
    cardElement: null
};

const ProductTemplates = {
    tshirt: { width: 500, height: 600, designArea: { x: 150, y: 150, width: 200, height: 200 } },
    hoodie: { width: 500, height: 600, designArea: { x: 150, y: 180, width: 200, height: 200 } },
    sweatshirt: { width: 500, height: 600, designArea: { x: 150, y: 160, width: 200, height: 200 } },
    tank: { width: 500, height: 600, designArea: { x: 150, y: 120, width: 200, height: 200 } }
};

function initializeApp() {
    setupCanvas();
    setupImageUpload();
    setupProductSelection();
    setupColorSelection();
    setupPriceCalculation();
    setupCart();
    setupModals();
    drawProduct();
}

function setupCanvas() {
    const canvas = document.getElementById('productCanvas');
    if (canvas) {
        canvas.width = 500;
        canvas.height = 600;
    }
}

function drawProduct() {
    const canvas = document.getElementById('productCanvas');
    const ctx = canvas.getContext('2d');
    const template = ProductTemplates[AppState.currentProduct];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawProductShape(ctx, AppState.currentProduct, AppState.currentColor);
    
    if (AppState.uploadedImage) {
        drawDesignOnProduct(ctx, template);
    }
}

function drawProductShape(ctx, productType, color) {
    ctx.fillStyle = color;
    
    switch(productType) {
        case 'tshirt':
            drawTShirt(ctx);
            break;
        case 'hoodie':
            drawHoodie(ctx);
            break;
        case 'sweatshirt':
            drawSweatshirt(ctx);
            break;
        case 'tank':
            drawTankTop(ctx);
            break;
    }
    
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
}

function drawTShirt(ctx) {
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(50, 180);
    ctx.lineTo(50, 250);
    ctx.lineTo(100, 250);
    ctx.lineTo(100, 500);
    ctx.lineTo(400, 500);
    ctx.lineTo(400, 250);
    ctx.lineTo(450, 250);
    ctx.lineTo(450, 180);
    ctx.lineTo(400, 150);
    ctx.lineTo(350, 100);
    ctx.lineTo(300, 80);
    ctx.lineTo(250, 70);
    ctx.lineTo(200, 80);
    ctx.lineTo(150, 100);
    ctx.closePath();
}

function drawHoodie(ctx) {
    ctx.beginPath();
    ctx.moveTo(100, 180);
    ctx.lineTo(50, 200);
    ctx.lineTo(50, 280);
    ctx.lineTo(100, 280);
    ctx.lineTo(100, 550);
    ctx.lineTo(120, 580);
    ctx.lineTo(380, 580);
    ctx.lineTo(400, 550);
    ctx.lineTo(400, 280);
    ctx.lineTo(450, 280);
    ctx.lineTo(450, 200);
    ctx.lineTo(400, 180);
    ctx.lineTo(350, 120);
    ctx.lineTo(300, 90);
    ctx.lineTo(250, 80);
    ctx.lineTo(200, 90);
    ctx.lineTo(150, 120);
    ctx.closePath();
    
    ctx.arc(250, 120, 30, 0, Math.PI * 2);
}

function drawSweatshirt(ctx) {
    ctx.beginPath();
    ctx.moveTo(100, 160);
    ctx.lineTo(50, 190);
    ctx.lineTo(50, 270);
    ctx.lineTo(100, 270);
    ctx.lineTo(100, 530);
    ctx.lineTo(400, 530);
    ctx.lineTo(400, 270);
    ctx.lineTo(450, 270);
    ctx.lineTo(450, 190);
    ctx.lineTo(400, 160);
    ctx.lineTo(350, 110);
    ctx.lineTo(300, 85);
    ctx.lineTo(250, 75);
    ctx.lineTo(200, 85);
    ctx.lineTo(150, 110);
    ctx.closePath();
}

function drawTankTop(ctx) {
    ctx.beginPath();
    ctx.moveTo(150, 120);
    ctx.lineTo(100, 480);
    ctx.lineTo(400, 480);
    ctx.lineTo(350, 120);
    ctx.lineTo(320, 100);
    ctx.lineTo(280, 90);
    ctx.lineTo(250, 85);
    ctx.lineTo(220, 90);
    ctx.lineTo(180, 100);
    ctx.closePath();
}

function drawDesignOnProduct(ctx, template) {
    const { x, y, width, height } = template.designArea;
    
    ctx.save();
    ctx.globalAlpha = 0.9;
    
    const imgAspect = AppState.uploadedImage.width / AppState.uploadedImage.height;
    const areaAspect = width / height;
    
    let drawWidth = width;
    let drawHeight = height;
    let drawX = x;
    let drawY = y;
    
    if (imgAspect > areaAspect) {
        drawHeight = width / imgAspect;
        drawY = y + (height - drawHeight) / 2;
    } else {
        drawWidth = height * imgAspect;
        drawX = x + (width - drawWidth) / 2;
    }
    
    ctx.drawImage(AppState.uploadedImage, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
}

function setupImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('imageUpload');
    const preview = document.getElementById('uploadedImagePreview');
    
    fileInput.addEventListener('change', handleImageSelect);
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });
}

function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

function handleImageFile(file) {
    if (!file.type.match('image.*')) {
        alert('Please upload an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            AppState.uploadedImage = img;
            displayImagePreview(e.target.result);
            drawProduct();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayImagePreview(src) {
    const preview = document.getElementById('uploadedImagePreview');
    preview.innerHTML = `<img src="${src}" alt="Uploaded design">`;
    preview.classList.add('active');
}

function setupProductSelection() {
    const productButtons = document.querySelectorAll('.product-btn');
    
    productButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            productButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            AppState.currentProduct = btn.dataset.product;
            AppState.currentPrice = parseFloat(btn.dataset.price);
            
            updatePrice();
            drawProduct();
        });
    });
}

function setupColorSelection() {
    const colorButtons = document.querySelectorAll('.color-btn');
    
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            AppState.currentColor = btn.dataset.color;
            drawProduct();
        });
    });
}

function setupPriceCalculation() {
    const quantityInput = document.getElementById('quantity');
    
    quantityInput.addEventListener('change', updatePrice);
    quantityInput.addEventListener('input', updatePrice);
}

function updatePrice() {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const total = (AppState.currentPrice * quantity).toFixed(2);
    document.getElementById('totalPrice').textContent = `$${total}`;
}

function setupCart() {
    const addToCartBtn = document.getElementById('addToCart');
    const resetBtn = document.getElementById('resetDesign');
    
    addToCartBtn.addEventListener('click', addToCart);
    resetBtn.addEventListener('click', resetDesign);
    
    document.querySelector('.cart-link').addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });
}

function addToCart() {
    if (!AppState.uploadedImage) {
        alert('Please upload a design first');
        return;
    }
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const size = document.getElementById('size').value;
    
    const canvas = document.getElementById('productCanvas');
    const previewImage = canvas.toDataURL();
    
    const cartItem = {
        id: Date.now(),
        product: AppState.currentProduct,
        color: AppState.currentColor,
        size: size,
        quantity: quantity,
        price: AppState.currentPrice,
        total: AppState.currentPrice * quantity,
        preview: previewImage
    };
    
    AppState.cart.push(cartItem);
    updateCartCount();
    
    alert('Item added to cart!');
}

function resetDesign() {
    AppState.uploadedImage = null;
    document.getElementById('imageUpload').value = '';
    document.getElementById('uploadedImagePreview').classList.remove('active');
    document.getElementById('uploadedImagePreview').innerHTML = '';
    drawProduct();
}

function updateCartCount() {
    const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    displayCartItems();
    modal.classList.add('active');
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (AppState.cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        document.getElementById('cartSubtotal').textContent = '$0.00';
        document.getElementById('cartTotal').textContent = '$0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    AppState.cart.forEach(item => {
        subtotal += item.total;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.preview}" alt="${item.product}" style="max-width: 100%; max-height: 100%;">
            </div>
            <div class="cart-item-details">
                <h4>${capitalizeFirst(item.product)}</h4>
                <p>Color: <span style="display: inline-block; width: 20px; height: 20px; background: ${item.color}; border: 1px solid #ccc; vertical-align: middle; border-radius: 3px;"></span></p>
                <p>Size: ${item.size} | Qty: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">$${item.total.toFixed(2)}</div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${subtotal.toFixed(2)}`;
}

function removeFromCart(itemId) {
    AppState.cart = AppState.cart.filter(item => item.id !== itemId);
    updateCartCount();
    displayCartItems();
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setupModals() {
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    document.getElementById('continueShopping').addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (AppState.cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        cartModal.classList.remove('active');
        openCheckoutModal();
    });
    
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const total = AppState.cart.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
    
    if (!AppState.stripe) {
        initializeStripe();
    }
    
    modal.classList.add('active');
}

function initializeStripe() {
    AppState.stripe = Stripe('pk_test_51QTZlcP50BJjv0MiLBDNDo7oI3yRoQMc7BtWt3vxmcPFnfE5OPsKqh6vvLZZ7nF0hUcDlQVUTzz8w4TJjR0wt4JB00aVTvgWHj');
    const elements = AppState.stripe.elements();
    AppState.cardElement = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#333',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
        },
    });
    AppState.cardElement.mount('#card-element');
    
    AppState.cardElement.on('change', (event) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

async function handleCheckout(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const shippingAddress = document.getElementById('shippingAddress').value;
    
    const total = AppState.cart.reduce((sum, item) => sum + item.total, 0);
    
    try {
        const response = await fetch('http://localhost:3000/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(total * 100),
                customer: {
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    address: shippingAddress
                },
                items: AppState.cart
            }),
        });
        
        const { clientSecret } = await response.json();
        
        const { error, paymentIntent } = await AppState.stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: AppState.cardElement,
                billing_details: {
                    name: customerName,
                    email: customerEmail,
                },
            },
        });
        
        if (error) {
            document.getElementById('card-errors').textContent = error.message;
            submitButton.disabled = false;
            submitButton.textContent = 'Complete Order';
        } else {
            if (paymentIntent.status === 'succeeded') {
                alert('Order completed successfully! You will receive a confirmation email shortly.');
                AppState.cart = [];
                updateCartCount();
                document.getElementById('checkoutModal').classList.remove('active');
                document.getElementById('checkoutForm').reset();
                submitButton.textContent = 'Complete Order';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
        submitButton.disabled = false;
        submitButton.textContent = 'Complete Order';
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
