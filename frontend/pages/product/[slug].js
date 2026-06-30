import { useState } from 'react';
import { useRouter } from 'next/router';
import StoreLayout from '../../components/layout/StoreLayout';
import { useCartStore, useWishlistStore } from '../../lib/store';
import api from '../../lib/api';
import toast from 'react-hot-toast';
const API = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

export default function ProductDetail({ product }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]?.size || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  if (router.isFallback) return <div style={{textAlign:'center',padding:100}}>Loading...</div>;
  if (!product) return <div style={{textAlign:'center',padding:100}}>Product not found</div>;
  const price = product.discountPrice || product.price;
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const images = product.images?.length ? product.images : [`https://via.placeholder.com/600x750/FFE0F0/E91E63?text=${encodeURIComponent(product.name)}`];
  const getImg = (img) => img.startsWith('http') ? img : `${API}${img}`;
  const stockForSize = product.sizes?.find(s => s.size === selectedSize)?.stock || 0;
  const handleAddToCart = () => { if (!selectedSize) { toast.error('Please select a size'); return; } addItem(product, selectedSize, selectedColor, qty); toast.success('Added to cart! 🛒'); };
  return (
    <StoreLayout title={product.seoTitle || product.name} description={product.seoDescription || product.description?.slice(0,160)} keywords={product.seoKeywords?.join(', ') || product.category}>
      <style jsx>{`
        .pd{max-width:1280px;margin:0 auto;padding:40px 20px;}
        .bc{font-size:13px;color:var(--text-light);margin-bottom:24px;font-family:'Poppins',sans-serif;display:flex;gap:8px;flex-wrap:wrap;}
        .bc a{color:var(--primary);text-decoration:none;}
        .pd-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;}
        .main-img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:20px;border:2px solid var(--glass-border);}
        .thumb-row{display:flex;gap:10px;overflow-x:auto;margin-top:12px;}
        .thumb{width:72px;height:90px;object-fit:cover;border-radius:10px;cursor:pointer;border:2px solid transparent;}
        .thumb.active{border-color:var(--primary);}
        .size-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;}
        .size-btn{padding:8px 18px;border-radius:8px;border:1.5px solid var(--glass-border);background:white;font-family:'Poppins',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s;}
        .size-btn.active{border-color:var(--primary);background:rgba(233,30,99,0.08);color:var(--primary);font-weight:600;}
        .qty-row{display:flex;align-items:center;gap:12px;margin-bottom:24px;}
        .qty-btn{width:36px;height:36px;border-radius:8px;border:1px solid var(--glass-border);background:white;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;}
        .cta-row{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;}
        @media(max-width:768px){.pd-grid{grid-template-columns:1fr;}}
      `}</style>
      <div className="pd">
        <div className="bc"><a href="/">Home</a> / <a href="/shop">Shop</a> / <a href={`/shop?category=${product.category}`}>{product.category?.replace(/-/g,' ')}</a> / {product.name}</div>
        <div className="pd-grid">
          <div>
            <img src={getImg(images[activeImg])} alt={product.name} className="main-img" />
            {images.length > 1 && <div className="thumb-row">{images.map((img,i) => <img key={i} src={getImg(img)} alt="" className={`thumb ${activeImg===i?'active':''}`} onClick={()=>setActiveImg(i)} />)}</div>}
          </div>
          <div>
            <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
              {product.isNewArrival&&<span className="badge badge-pink">New Arrival</span>}
              {product.isBestSeller&&<span className="badge badge-gold">Best Seller</span>}
            </div>
            <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',marginBottom:8}}>{product.name}</h1>
            {product.ratings?.count > 0 && <div style={{marginBottom:16}}>{'★'.repeat(Math.round(product.ratings.average))}<span style={{color:'#999',fontSize:14,fontFamily:'Poppins,sans-serif'}}> ({product.ratings.count} reviews)</span></div>}
            <div style={{marginBottom:20}}>
              <span style={{fontSize:'2rem',fontWeight:700,color:'var(--primary)',fontFamily:'Poppins,sans-serif'}}>₹{price.toLocaleString()}</span>
              {product.discountPrice&&<span style={{fontSize:'1.1rem',color:'var(--text-light)',textDecoration:'line-through',marginLeft:12}}>₹{product.price.toLocaleString()}</span>}
              {discount>0&&<span style={{background:'rgba(46,213,115,0.12)',color:'#1a7a3a',borderRadius:50,padding:'4px 12px',fontSize:13,fontWeight:600,marginLeft:8}}>{discount}% OFF</span>}
            </div>
            {product.shortDescription&&<p style={{fontSize:14,color:'var(--text-light)',marginBottom:20,lineHeight:1.7,fontFamily:'Poppins,sans-serif'}}>{product.shortDescription}</p>}
            {product.sizes?.length>0&&(<>
              <div style={{fontSize:13,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,color:'var(--text-light)',marginBottom:10,fontFamily:'Poppins,sans-serif'}}>Size {selectedSize&&<span style={{color:'var(--text)',fontWeight:700}}> – {selectedSize}</span>}</div>
              <div className="size-grid">{product.sizes.map(s=><button key={s.size} className={`size-btn ${selectedSize===s.size?'active':''}`} disabled={s.stock===0} onClick={()=>setSelectedSize(s.size)}>{s.size}{s.stock===0?' (OOS)':''}</button>)}</div>
            </>)}
            {product.colors?.length>0&&(<>
              <div style={{fontSize:13,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,color:'var(--text-light)',marginBottom:10,fontFamily:'Poppins,sans-serif'}}>Color {selectedColor&&<span style={{color:'var(--text)',fontWeight:700}}> – {selectedColor}</span>}</div>
              <div style={{display:'flex',gap:10,marginBottom:24,flexWrap:'wrap'}}>
                {product.colors.map(c=><div key={c} onClick={()=>setSelectedColor(c)} style={{padding:'6px 14px',borderRadius:20,border:`2px solid ${selectedColor===c?'var(--primary)':'var(--glass-border)'}`,cursor:'pointer',fontSize:12,fontFamily:'Poppins,sans-serif',background:selectedColor===c?'rgba(233,30,99,0.08)':'white'}}>{c}</div>)}
              </div>
            </>)}
            <div style={{fontSize:13,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,color:'var(--text-light)',marginBottom:10,fontFamily:'Poppins,sans-serif'}}>Quantity</div>
            <div className="qty-row">
              <button className="qty-btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
              <span style={{fontSize:16,fontWeight:600,width:40,textAlign:'center',fontFamily:'Poppins,sans-serif'}}>{qty}</span>
              <button className="qty-btn" onClick={()=>setQty(q=>q+1)}>+</button>
              {stockForSize>0&&<span style={{fontSize:12,color:'#2ed573',fontFamily:'Poppins,sans-serif'}}>✓ {stockForSize} in stock</span>}
            </div>
            <div className="cta-row">
              <button className="btn-primary" style={{flex:1,justifyContent:'center',padding:14}} onClick={handleAddToCart}>🛒 Add to Cart</button>
              <button className="btn-secondary" style={{padding:'14px 20px'}} onClick={()=>{handleAddToCart();router.push('/cart');}}>Buy Now</button>
              <button onClick={()=>{toggle(product);toast.success(has(product._id)?'Removed':'❤️ Added to wishlist!');}} style={{padding:'14px 16px',borderRadius:50,border:'1px solid var(--glass-border)',background:'white',cursor:'pointer',fontSize:20}}>{has(product._id)?'❤️':'🤍'}</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>
              {[['🚚','Free Delivery'],['🔒','Secure Payment'],['↩️','Easy Return'],['⭐','Genuine Product']].map(([icon,text])=>(
                <div key={text} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}><span>{icon}</span><span>{text}</span></div>
              ))}
            </div>
            {product.fabric&&<div style={{marginTop:16,fontSize:13,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>Fabric: <strong>{product.fabric}</strong></div>}
          </div>
        </div>
        <div style={{marginTop:60}}>
          <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',marginBottom:16}}>Product Description</h3>
          <p style={{fontSize:14,color:'var(--text-light)',lineHeight:1.8,fontFamily:'Poppins,sans-serif'}}>{product.description}</p>
        </div>
      </div>
    </StoreLayout>
  );
}
export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api'}/products/${params.slug}`);
    const data = await res.json();
    if (!data.success) return { notFound: true };
    return { props: { product: JSON.parse(JSON.stringify(data.product)) } };
  } catch { return { notFound: true }; }
}
