import StoreLayout from '../../components/layout/StoreLayout';
import { useCartStore } from '../../lib/store';
import Link from 'next/link';
import { useRouter } from 'next/router';
const API = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

export default function Cart() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const router = useRouter();
  const subtotal = items.reduce((s,i) => s + (i.product.discountPrice||i.product.price)*i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;
  return (
    <StoreLayout title="Shopping Cart">
      <style jsx>{`
        .cw{max-width:1100px;margin:0 auto;padding:40px 20px;}
        .cg{display:grid;grid-template-columns:1fr 360px;gap:32px;}
        .ci{display:flex;gap:16px;padding:20px;background:var(--card-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:16px;margin-bottom:16px;}
        .ci-img{width:90px;height:110px;object-fit:cover;border-radius:10px;flex-shrink:0;}
        .qty-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--glass-border);background:white;cursor:pointer;font-size:16px;}
        .os{background:var(--card-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:20px;padding:28px;height:fit-content;position:sticky;top:90px;}
        .sr{display:flex;justify-content:space-between;font-size:14px;font-family:'Poppins',sans-serif;margin-bottom:12px;color:var(--text-light);}
        @media(max-width:768px){.cg{grid-template-columns:1fr;}}
      `}</style>
      <div className="cw">
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',marginBottom:32}}>🛒 Shopping Cart</h1>
        {items.length===0 ? (
          <div style={{textAlign:'center',padding:'80px 20px'}}>
            <div style={{fontSize:'5rem',marginBottom:16}}>🛍️</div>
            <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',marginBottom:8}}>Your cart is empty</h3>
            <p style={{color:'var(--text-light)',marginBottom:24}}>Add some beautiful products!</p>
            <Link href="/shop" className="btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cg">
            <div>
              {items.map(item => {
                const img = item.product.images?.[0] ? (item.product.images[0].startsWith('http')?item.product.images[0]:`${API}${item.product.images[0]}`) : 'https://via.placeholder.com/200x250/FFE0F0/E91E63?text=P';
                return (
                  <div className="ci" key={item.key}>
                    <img src={img} alt={item.product.name} className="ci-img" />
                    <div style={{flex:1}}>
                      <div style={{fontFamily:'Playfair Display,serif',fontSize:'1rem',marginBottom:4}}>{item.product.name}</div>
                      <div style={{fontSize:12,color:'var(--text-light)',marginBottom:8,fontFamily:'Poppins,sans-serif'}}>Size: {item.size}{item.color&&` | ${item.color}`}</div>
                      <div style={{fontSize:'1.1rem',fontWeight:700,color:'var(--primary)',fontFamily:'Poppins,sans-serif',marginBottom:8}}>₹{((item.product.discountPrice||item.product.price)*item.quantity).toLocaleString()}</div>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <button className="qty-btn" onClick={()=>updateQuantity(item.key,item.quantity-1)}>−</button>
                        <span style={{fontSize:14,fontWeight:600,fontFamily:'Poppins,sans-serif',minWidth:20,textAlign:'center'}}>{item.quantity}</span>
                        <button className="qty-btn" onClick={()=>updateQuantity(item.key,item.quantity+1)}>+</button>
                        <span style={{fontSize:12,color:'var(--text-light)',fontFamily:'Poppins,sans-serif',marginLeft:8}}>₹{item.product.discountPrice||item.product.price} each</span>
                      </div>
                    </div>
                    <button onClick={()=>removeItem(item.key)} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#ccc',alignSelf:'flex-start'}}>🗑️</button>
                  </div>
                );
              })}
            </div>
            <div className="os">
              <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.3rem',marginBottom:20,paddingBottom:12,borderBottom:'2px solid rgba(212,175,55,0.2)'}}>Order Summary</div>
              <div className="sr"><span>Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="sr"><span>Shipping</span><span style={{color:shipping===0?'#2ed573':'inherit'}}>{shipping===0?'FREE':`₹${shipping}`}</span></div>
              {shipping>0&&<div style={{fontSize:12,color:'#2ed573',marginBottom:12,fontFamily:'Poppins,sans-serif'}}>Add ₹{500-subtotal} more for free shipping!</div>}
              <div className="sr" style={{fontWeight:700,fontSize:'1.1rem',color:'var(--text)',borderTop:'1px solid rgba(212,175,55,0.2)',paddingTop:12,marginTop:4}}><span>Total</span><span style={{color:'var(--primary)'}}>₹{total.toLocaleString()}</span></div>
              <button className="btn-primary" style={{width:'100%',justifyContent:'center',marginTop:16,padding:14,fontSize:15}} onClick={()=>router.push('/checkout')}>Proceed to Checkout →</button>
              <Link href="/shop" style={{display:'block',textAlign:'center',marginTop:12,fontSize:13,color:'var(--text-light)',textDecoration:'none',fontFamily:'Poppins,sans-serif'}}>← Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
