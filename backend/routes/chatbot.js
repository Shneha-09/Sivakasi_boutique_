const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const Product = require('../models/Product');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are "Priya", a friendly and knowledgeable AI shopping assistant for Sivakasi Boutique — a premium online fashion store based in Sivakasi, Virudhunagar District, Tamil Nadu, India.

Your personality:
- Warm, helpful, and enthusiastic about fashion
- You speak English naturally, and can understand Tamil words mixed in
- You address customers respectfully (use "madam" or "sir" appropriately)
- You are proud of the boutique's quality products

Store Information:
- Name: Sivakasi Boutique
- Location: Sivakasi, Virudhunagar District, Tamil Nadu — Online Sales Only
- Products: Women's Kurtis, Nighties, Women's Innerwear, Men's Innerwear
- Delivery: Free delivery across India for orders above ₹499
- Payment: Cash on Delivery (COD), UPI, Online Banking
- Returns: Easy returns within 7 days
- Support: Mon–Sat, 9AM–7PM IST

Your capabilities:
1. Help customers find the right products based on their needs
2. Answer questions about sizing, fabric, colors, and availability
3. Explain the checkout and delivery process
4. Handle complaints or issues with empathy and direct them to contact support
5. Recommend products based on occasion, preference, or budget
6. Answer general fashion styling questions
7. Help with order tracking guidance

Size Guide:
- Kurtis: XS (32), S (34), M (36), L (38), XL (40), XXL (42), XXXL (44)
- Nighties: S, M, L, XL, XXL — mostly free size available
- Innerwear: Follows standard sizing (28–42 for bras, S–XXL for others)

Rules:
- Only discuss topics related to fashion, shopping, and this boutique
- If asked something unrelated, politely redirect to shopping assistance
- Never make up product details — refer to actual product info when provided
- Always be positive and encouraging
- Keep responses concise (2–4 sentences usually) unless detailed info is needed
- Use ₹ for prices, not $ or Rs
- If customer seems unhappy, apologize sincerely and offer solutions`;

// POST /api/chatbot/message
router.post('/message', async (req, res) => {
  try {
    const { message, history = [], sessionContext = {} } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Fetch relevant products if the message seems product-related
    let productContext = '';
    const productKeywords = ['kurti', 'nighty', 'nightie', 'innerwear', 'product', 'available', 'stock', 'price', 'show', 'buy', 'recommend', 'suggest', 'cotton', 'silk', 'fabric', 'color', 'size'];
    const isProductQuery = productKeywords.some(kw => message.toLowerCase().includes(kw));

    if (isProductQuery) {
      try {
        const products = await Product.find({ isActive: true })
          .select('name category price discountPrice sizes colors fabric isFeatured isBestSeller isNewArrival totalStock')
          .limit(20)
          .lean();

        if (products.length > 0) {
          productContext = '\n\nCurrent Available Products in Store:\n' +
            products.map(p => {
              const price = p.discountPrice ? `₹${p.discountPrice} (was ₹${p.price})` : `₹${p.price}`;
              const tags = [p.isFeatured && 'Featured', p.isBestSeller && 'Best Seller', p.isNewArrival && 'New'].filter(Boolean).join(', ');
              const sizes = p.sizes?.filter(s => s.stock > 0).map(s => s.size).join(', ') || 'Check website';
              return `- ${p.name} | Category: ${p.category.replace(/-/g, ' ')} | Price: ${price} | Fabric: ${p.fabric || 'N/A'} | Available Sizes: ${sizes} | Colors: ${p.colors?.join(', ') || 'Various'}${tags ? ` | Tags: ${tags}` : ''}`;
            }).join('\n');
        }
      } catch (err) {
        console.error('Product fetch error:', err.message);
      }
    }

    // Build conversation history for Claude
    const messages = [
      ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    const systemWithContext = SYSTEM_PROMPT + productContext;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: systemWithContext,
      messages
    });

    const reply = response.content[0]?.text || "I'm sorry, I couldn't process that. Please try again!";

    // Generate quick reply suggestions based on context
    const suggestions = generateSuggestions(message, reply);

    res.json({
      success: true,
      reply,
      suggestions,
      usage: { inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens }
    });

  } catch (err) {
    console.error('Chatbot error:', err);
    if (err.status === 401) {
      return res.status(500).json({ success: false, reply: "I'm temporarily unavailable. Please add your Anthropic API key in the backend .env file.", suggestions: [] });
    }
    res.status(500).json({
      success: false,
      reply: "I'm having trouble right now. Please try again in a moment or contact our support team!",
      suggestions: ['Try again', 'Contact Support', 'Browse Products']
    });
  }
});

function generateSuggestions(userMessage, reply) {
  const msg = userMessage.toLowerCase();
  if (msg.includes('kurti') || msg.includes('kurtis')) return ['Show all kurtis', 'Cotton kurtis', 'What sizes available?', 'Price range?'];
  if (msg.includes('nighty') || msg.includes('nightie')) return ['Show nighties', 'Free size nighties', 'Best sellers', 'Price range?'];
  if (msg.includes('innerwear')) return ['Women\'s innerwear', 'Men\'s innerwear', 'Size guide', 'Show products'];
  if (msg.includes('price') || msg.includes('cost') || msg.includes('₹')) return ['Under ₹500', 'Under ₹1000', 'Best value', 'Discounted items'];
  if (msg.includes('deliver') || msg.includes('shipping')) return ['Delivery time?', 'Free delivery?', 'Track my order', 'COD available?'];
  if (msg.includes('return') || msg.includes('exchange')) return ['Return policy', 'Exchange process', 'Contact support', 'Refund policy'];
  if (msg.includes('size') || msg.includes('fit')) return ['Size guide', 'How to measure?', 'Free size?', 'XL available?'];
  return ['Show featured products', 'New arrivals', 'Best sellers', 'Contact support'];
}

// GET /api/chatbot/suggestions - initial suggestions
router.get('/suggestions', (req, res) => {
  res.json({
    success: true,
    suggestions: [
      "What kurtis do you have?",
      "Show me nighties",
      "What's your return policy?",
      "Do you offer COD?",
      "Size guide for kurtis",
      "Best sellers"
    ]
  });
});

module.exports = router;
