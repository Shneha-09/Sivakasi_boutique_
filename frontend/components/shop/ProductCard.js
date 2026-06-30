import Link from 'next/link';
import { useCartStore, useWishlistStore } from '../../lib/store';
import toast from 'react-hot-toast';
const API = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const inWishlist = has(product._id);
  const price = product.discountPrice || product.price;
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const imgSrc = product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `${API}${product.images[0]}`) : `https://via.placeholder.com/400x500/FFE0F0/E91E63?text=${encodeURIComponent(product.name)}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    const defaultSize = product.sizes?.find(s => s.stock > 0)?.size || 'Free Size';
    addItem(product, defaultSize, product.colors?.[0] || '', 1);
    toast.success(`Added to cart! 🛒`);
  };

  return (
    <div className="product-card">
      <style jsx>{`
        .card-img-wrap{position:relative;overflow:hidden;aspect-ratio:3/4;background:#FFF0F5;}
        .card-img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;}
        .product-card:hover .card-img{transform:scale(1.08);}
        .wish-btn{position:absolute;top:12px;right:12px;background:white;border:none;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:transform 0.3s;z-index:2;}
        .wish-btn:hover{transform:scale(1.2);}
        .badge-wrap{position:absolute;top:12px;left:12px;display:flex;flex-direction:column;gap:4px;}
        .card-body{padding:14px;}
        .cat-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--text-light);margin-bottom:4px;}
        .prod-name{font-family:'Playfair Display',serif;font-size:0.95rem;color:var(--text);margin-bottom:6px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .price-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
        .price{font-size:1rem;font-weight:700;color:var(--primary);font-family:'Poppins',sans-serif;}
        .orig-price{font-size:0.8rem;color:var(--text-light);text-decoration:line-through;}
        .add-btn{width:100%;padding:10px;background:linear-gradient(135deg,#E91E63,#D4AF37);color:white;border:none;border-radius:50px;font-family:'Poppins',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all 0.3s;}
        .add-btn:hover{transform:translateY(-1px);box-shadow:0 4px 15px rgba(233,30,99,0.3);}
        .out-btn{width:100%;padding:10px;background:#f0e8e8;color:#999;border:none;border-radius:50px;font-family:'Poppins',sans-serif;font-size:13px;cursor:not-allowed;}
      `}</style>
      <Link href={`/product/${product.slug}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
        <div className="card-img-wrap">
          <img src={imgSrc} alt={product.name} className="card-img" loading="lazy" />
          <button className="wish-btn" onClick={e => { e.preventDefault(); toggle(product); toast.success(inWishlist ? 'Removed from wishlist' : '❤️ Added!'); }}>
            {inWishlist ? '❤️' : '🤍'}
          </button>
          <div className="badge-wrap">
            {product.isNewArrival && <span className="badge badge-pink">New</span>}
            {product.isBestSeller && <span className="badge badge-gold">Best Seller</span>}
            {discount > 0 && <span className="badge badge-green">-{discount}%</span>}
            {product.totalStock === 0 && <span className="badge badge-red">Out of Stock</span>}
          </div>
        </div>
        <div className="card-body">
          <div className="cat-label">{product.category?.replace(/-/g,' ')}</div>
          <div className="prod-name">{product.name}</div>
          {product.ratings?.count > 0 && <div style={{fontSize:11,color:'#D4AF37',marginBottom:6}}>{'★'.repeat(Math.round(product.ratings.average))} <span style={{color:'#999'}}>({product.ratings.count})</span></div>}
          <div className="price-row">
            <span className="price">₹{price.toLocaleString()}</span>
            {product.discountPrice && <span className="orig-price">₹{product.price.toLocaleString()}</span>}
          </div>
        </div>
      </Link>
      <div style={{padding:'0 14px 14px'}}>
        {product.totalStock > 0 ? <button className="add-btn" onClick={handleAddToCart}>Add to Cart</button> : <button className="out-btn" disabled>Out of Stock</button>}
      </div>
    </div>
  );
}
