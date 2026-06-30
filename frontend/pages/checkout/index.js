import { useState } from 'react';
import { useRouter } from 'next/router';
import StoreLayout from '../../components/layout/StoreLayout';
import { useCartStore, useAuthStore } from '../../lib/store';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: user?.name||'', email:'', phone:'', addressLine1:'', addressLine2:'', city:'', state:'Tamil Nadu', pincode:'', paymentMethod:'cod' });
  const subtotal = items.reduce((s,i) => s+(i.product.discountPrice||i.product.price)*i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;
  const u = (k,v) => setForm(f=>({...f,[k]:v}));

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map(i=>({ product:i.product._id, name:i.product.name, image:i.product.images?.[0]||'', price:i.product.price, discountPrice:i.product.discountPrice, quantity:i.quantity, size:i.size, color:i.color }));
      const { data } = await api.post('/orders', { items:orderItems, shippingAddress:{ fullName:form.fullName, phone:form.phone, addressLine1:form.addressLine1, addressLine2:form.addressLine2, city:form.city, state:form.state, pincode:form.pincode }, pricing:{ subtotal, shipping, total }, paymentMethod:form.paymentMethod, guestInfo:!user?{ name:form.fullName, email:form.email, phone:form.phone }:undefined, userId:user?._id });
      clearCart();
      toast.success('🎉 Order placed successfully!');
      router.push(`/order-success?orderNumber=${data.order.orderNumber}`);
    } catch (err) { toast.error(err.response?.data?.message||'Order failed'); }
    finally { setLoading(false); }
  };

  if (items.length===0) { if (typeof window!=='undefined') router.push('/cart'); return null; }

  const API = process.env.NEXT_PUBLIC_UPLOADS_URL||'http://localhost:5000';

  return (
    <StoreLayout title="Checkout">
      <style jsx>{`
        .co{max-width:1100px;margin:0 auto;padding:40px 20px;}
        .co-grid{display:grid;grid-template-columns:1fr 340px;gap:32px;}
        .steps{display:flex;margin-bottom:32px;}
        .step{flex:1;text-align:center;padding:12px;font-size:13px;font-family:'Poppins',sans-serif;background:rgba(255,255,255,0.7);border:1px solid var(--glass-border);color:var(--text-light);}
        .step:first-child{border-radius:10px 0 0 10px;}.step:last-child{border-radius:0 10px 10px 0;}
        .step.active{background:linear-gradient(135deg,#E91E63,#D4AF37);color:white;border-color:transparent;font-weight:600;}
        .fs{background:var(--card-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:20px;padding:28px;margin-bottom:20px;}
        .fg{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .fgrp{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
        label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-light);font-family:'Poppins',sans-serif;}
        .po{display:flex;align-items:center;gap:12px;padding:16px;border:1.5px solid var(--glass-border);border-radius:12px;cursor:pointer;margin-bottom:12px;transition:all 0.2s;}
        .po.selected{border-color:var(--primary);background:rgba(233,30,99,0.05);}
        .os2{background:var(--card-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:20px;padding:24px;height:fit-content;position:sticky;top:90px;}
        .oi{display:flex;gap:10px;margin-bottom:12px;font-size:13px;font-family:'Poppins',sans-serif;}
        .oi-img{width:50px;height:60px;object-fit:cover;border-radius:8px;}
        @media(max-width:768px){.co-grid{grid-template-columns:1fr;}.fg{grid-template-columns:1fr;}}
      `}</style>
      <div className="co">
        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem',marginBottom:32}}>Checkout</h1>
        <div className="steps">
          <div className={`step ${step>=1?'active':''}`}>1. Details</div>
          <div className={`step ${step>=2?'active':''}`}>2. Payment</div>
          <div className={`step ${step>=3?'active':''}`}>3. Confirm</div>
        </div>
        <div className="co-grid">
          <div>
            {step===1&&(
              <div className="fs">
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',marginBottom:20}}>📦 Delivery Address</div>
                {!user&&(<>
                  <div className="fg">
                    <div className="fgrp"><label>Full Name *</label><input className="form-input" value={form.fullName} onChange={e=>u('fullName',e.target.value)} placeholder="Your full name"/></div>
                    <div className="fgrp"><label>Phone *</label><input className="form-input" value={form.phone} onChange={e=>u('phone',e.target.value)} placeholder="+91 XXXXX XXXXX"/></div>
                  </div>
                  <div className="fgrp"><label>Email *</label><input className="form-input" type="email" value={form.email} onChange={e=>u('email',e.target.value)} placeholder="email@example.com"/></div>
                </>)}
                {user&&(<div className="fg">
                  <div className="fgrp"><label>Full Name *</label><input className="form-input" value={form.fullName} onChange={e=>u('fullName',e.target.value)}/></div>
                  <div className="fgrp"><label>Phone *</label><input className="form-input" value={form.phone} onChange={e=>u('phone',e.target.value)}/></div>
                </div>)}
                <div className="fgrp"><label>Address Line 1 *</label><input className="form-input" value={form.addressLine1} onChange={e=>u('addressLine1',e.target.value)} placeholder="House/Flat No., Street"/></div>
                <div className="fgrp"><label>Address Line 2</label><input className="form-input" value={form.addressLine2} onChange={e=>u('addressLine2',e.target.value)} placeholder="Area, Landmark"/></div>
                <div className="fg">
                  <div className="fgrp"><label>City *</label><input className="form-input" value={form.city} onChange={e=>u('city',e.target.value)} placeholder="City"/></div>
                  <div className="fgrp"><label>Pincode *</label><input className="form-input" value={form.pincode} onChange={e=>u('pincode',e.target.value)} placeholder="626123"/></div>
                </div>
                <div className="fgrp"><label>State *</label>
                  <select className="form-input" value={form.state} onChange={e=>u('state',e.target.value)}>
                    {['Tamil Nadu','Kerala','Karnataka','Andhra Pradesh','Telangana','Maharashtra','Delhi','Gujarat','Rajasthan','West Bengal','Other'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <button className="btn-primary" style={{width:'100%',justifyContent:'center',padding:14}} onClick={()=>{ if(!form.fullName||!form.addressLine1||!form.city||!form.pincode){toast.error('Fill all required fields');return;} setStep(2); }}>Continue to Payment →</button>
              </div>
            )}
            {step===2&&(
              <div className="fs">
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',marginBottom:20}}>💳 Payment Method</div>
                {[{value:'cod',label:'💵 Cash on Delivery',desc:'Pay when your order arrives'},{value:'upi',label:'📱 UPI Payment',desc:'Pay via GPay, PhonePe, Paytm'},{value:'online',label:'🏦 Online Banking',desc:'Debit/Credit card, Net Banking'}].map(opt=>(
                  <label key={opt.value} className={`po ${form.paymentMethod===opt.value?'selected':''}`} onClick={()=>u('paymentMethod',opt.value)}>
                    <input type="radio" name="pay" checked={form.paymentMethod===opt.value} readOnly/>
                    <div><div style={{fontFamily:'Poppins,sans-serif',fontSize:14,fontWeight:600}}>{opt.label}</div><div style={{fontSize:12,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>{opt.desc}</div></div>
                  </label>
                ))}
                <div style={{display:'flex',gap:12,marginTop:8}}>
                  <button className="btn-secondary" onClick={()=>setStep(1)} style={{flex:1,justifyContent:'center'}}>← Back</button>
                  <button className="btn-primary" style={{flex:2,justifyContent:'center',padding:14}} onClick={handlePlaceOrder} disabled={loading}>{loading?'Placing Order...':`Place Order – ₹${total.toLocaleString()}`}</button>
                </div>
              </div>
            )}
          </div>
          <div className="os2">
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',marginBottom:16,paddingBottom:12,borderBottom:'1px solid rgba(212,175,55,0.2)'}}>Your Order ({items.reduce((s,i)=>s+i.quantity,0)} items)</div>
            {items.map(item=>{
              const img=item.product.images?.[0]?(item.product.images[0].startsWith('http')?item.product.images[0]:`${API}${item.product.images[0]}`):'https://via.placeholder.com/100x120/FFE0F0/E91E63?text=P';
              return(<div className="oi" key={item.key}><img src={img} alt="" className="oi-img"/><div><div style={{fontWeight:600,marginBottom:2}}>{item.product.name}</div><div style={{color:'var(--text-light)',fontSize:11}}>Size: {item.size} × {item.quantity}</div><div style={{color:'var(--primary)',fontWeight:700}}>₹{((item.product.discountPrice||item.product.price)*item.quantity).toLocaleString()}</div></div></div>);
            })}
            <div style={{borderTop:'1px solid rgba(212,175,55,0.2)',paddingTop:12,marginTop:4}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,fontFamily:'Poppins,sans-serif',marginBottom:8,color:'var(--text-light)'}}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,fontFamily:'Poppins,sans-serif',marginBottom:12,color:'var(--text-light)'}}><span>Shipping</span><span style={{color:shipping===0?'#2ed573':'inherit'}}>{shipping===0?'FREE':`₹${shipping}`}</span></div>
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:'1.1rem',fontFamily:'Poppins,sans-serif',color:'var(--primary)'}}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
