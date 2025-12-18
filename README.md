# Twill T-Shirt Co - Custom Design & Printing Website

A complete e-commerce platform for custom t-shirt design and printing with real-time product visualization and Stripe payment integration.

## Features

- **Interactive Product Designer**
  - Upload custom images/designs
  - Real-time product visualization using Canvas API
  - Multiple product types (T-Shirt, Hoodie, Sweatshirt, Tank Top)
  - 10+ color options for each product
  
- **Shopping Cart System**
  - Add multiple customized items
  - Adjust quantities and sizes
  - Real-time price calculation
  
- **Payment Integration**
  - Secure payment processing via Stripe
  - Support for all major credit cards
  - Order confirmation system

- **Professional Design**
  - Clean, modern UI inspired by CustomInk
  - Responsive design for mobile and desktop
  - Smooth animations and transitions

## Tech Stack

- **Frontend:**
  - HTML5 Canvas for product visualization
  - Vanilla JavaScript (ES6+)
  - CSS3 with CSS Variables
  - Stripe.js for payment processing

- **Backend:**
  - Node.js with Express
  - Stripe API for payment processing
  - Multer for file uploads
  - CORS enabled

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Stripe account (for payment processing)

### Setup Steps

1. **Clone or navigate to the project directory:**
   ```bash
   cd "/Users/brandonsmith/Documents/tshirt website"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Get your Stripe API keys from https://dashboard.stripe.com/apikeys
   - Update `.env` with your Stripe keys:
     ```
     STRIPE_SECRET_KEY=sk_test_your_secret_key
     STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
     PORT=3000
     ```

4. **Update the Stripe publishable key in app.js:**
   - Open `app.js`
   - Find the `initializeStripe()` function
   - Replace the placeholder key with your actual Stripe publishable key

5. **Create uploads directory:**
   ```bash
   mkdir uploads
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon (auto-restart on file changes).

### Production Mode

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage Guide

### For Customers

1. **Design Your Product:**
   - Click "Start Designing" or scroll to the design section
   - Upload your custom image/design (PNG, JPG, SVG)
   - Select a product type (T-Shirt, Hoodie, etc.)
   - Choose your preferred color
   - Select size and quantity

2. **Add to Cart:**
   - Review your design in the preview
   - Click "Add to Cart"
   - View cart by clicking the cart icon in the header

3. **Checkout:**
   - Click "Proceed to Checkout" in the cart
   - Fill in your shipping information
   - Enter payment details
   - Complete your order

### For Developers

#### File Structure

```
tshirt-website/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── app.js             # Frontend JavaScript
├── server.js          # Express backend
├── package.json       # Dependencies
├── .env.example       # Environment variables template
├── .gitignore        # Git ignore rules
├── README.md         # This file
└── uploads/          # User uploaded designs (gitignored)
```

#### API Endpoints

- `GET /` - Serve main application
- `POST /upload-design` - Handle design file uploads
- `POST /create-payment-intent` - Create Stripe payment intent
- `POST /webhook` - Stripe webhook handler
- `GET /order-status/:paymentIntentId` - Check order status
- `GET /health` - Health check endpoint

#### Customization

**Adding New Products:**
1. Update `ProductTemplates` in `app.js` with new product dimensions
2. Add a drawing function for the product shape
3. Update HTML product selector
4. Update CSS as needed

**Changing Colors:**
1. Edit the color buttons in `index.html`
2. CSS variables in `styles.css` control the theme

**Price Configuration:**
Update the `data-price` attributes in the product selector buttons.

## Stripe Configuration

### Test Mode

The app uses Stripe test mode by default. Use these test cards:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Auth:** 4000 0025 0000 3155

Use any future expiry date, any 3-digit CVC, and any postal code.

### Production Mode

1. Get production API keys from Stripe dashboard
2. Update `.env` with production keys (starting with `pk_live_` and `sk_live_`)
3. Set up webhook endpoints in Stripe dashboard
4. Update webhook secret in `.env`

## Security Notes

- Never commit `.env` file to version control
- Always use HTTPS in production
- Validate all user inputs on the backend
- Implement rate limiting for production
- Add CSRF protection for production use

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### Stripe Errors
- Verify API keys are correct
- Check that keys match the mode (test/live)
- Ensure internet connection for Stripe API calls

### Canvas Not Drawing
- Check browser console for errors
- Verify Canvas API support in browser
- Clear browser cache

## Future Enhancements

- [ ] User accounts and order history
- [ ] Product customization (text, clipart)
- [ ] Bulk ordering discounts
- [ ] Design templates library
- [ ] Mobile app version
- [ ] Email notifications
- [ ] Admin dashboard

## License

MIT License - Feel free to use this project for commercial purposes.

## Support

For issues or questions, please open an issue in the repository or contact support@twilltshirt.com

---

Built with ❤️ for Twill T-Shirt Co
