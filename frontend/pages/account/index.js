import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StoreLayout from '../../components/layout/StoreLayout';
import { useAuthStore } from '../../lib/store';
import api from '../../lib/api';

const SC = { pending:'#D4AF37',confirmed:'#E91E63',processing:'#9C27B0',shipped:'#2196F3',delivered:'#4CAF50',cancelled:'#f44336',returned:'#FF9800' };

export default function Account() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    api.get('/orders/my').then(r=>setOrders(r.data.orders||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <StoreLayout title="My Account">
      <style jsx>{`
        .aw{max-width:1100px;margin:0 auto;padding:40px 20px;}
        .ag{display:grid;grid-template-columns:260px 1fr;gap:32px;}
        .asb{background:var(--card-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:20px;padding:28px;height:fit-content;}
        .ua{width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#E91E63,#D4AF37);display:flex;align-items:center;justify-content:center;font-size:28px;color:white;margin:0 auto 12px;}
        .ni{padding:10px 14px;border-radius:10px;border:none;background:none;cursor:pointer;text-align:left;font-family:'Poppins',sans-serif;font-size:14px;color:var(--text);transition:all 0.2s;display:flex;align-items:center;gap:8px;width:100%;}
        .ni.active{background:rgba(233,30,99,0.08);color:var(--primary);font-weight:600;}
        .oc{background:var(--card-bg);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:16px;padding:20px;margin-bottom:16px;}
        @media(max-width:768px){.ag{grid-template-columns:1fr;}}
      `}</style>
      <div className="aw">
        <div className="ag">
          <div className="asb">
            <div className="ua">{user.name?.charAt(0).toUpperCase()}</div>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',textAlign:'center',marginBottom:4}}>{user.name}</div>
            <div style={{fontSize:12,color:'var(--text-light)',textAlign:'center',marginBottom:20,fontFamily:'Poppins,sans-serif'}}>{user.email}</div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              <button className={`ni ${tab==='orders'?'active':''}`} onClick={()=>setTab('orders')}>📦 My Orders</button>
              <button className={`ni ${tab==='profile'?'active':''}`} onClick={()=>setTab('profile')}>👤 Profile</button>
              {user.role==='admin'&&<button className="ni" onClick={()=>router.push('/admin')}>⚙️ Admin Panel</button>}
              <button className="ni" onClick={()=>{logout();router.push('/');}}>🚪 Logout</button>
            </div>
          </div>
          <div>
            {tab==='orders'&&(<>
              <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.6rem',marginBottom:24}}>My Orders</h2>
              {loading?<div style={{textAlign:'center',padding:60}}>Loading...</div>:
                orders.length===0?(
                  <div style={{textAlign:'center',padding:60}}>
                    <div style={{fontSize:'4rem',marginBottom:16}}>📭</div>
                    <h3 style={{fontFamily:'Playfair Display,serif',marginBottom:8}}>No orders yet</h3>
                    <button className="btn-primary" onClick={()=>router.push('/shop')}>Shop Now</button>
                  </div>
                ):orders.map(order=>(
                  <div className="oc" key={order._id}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,flexWrap:'wrap',gap:8}}>
                      <div>
                        <div style={{fontFamily:'Playfair Display,serif',fontSize:'1rem',fontWeight:700}}>#{order.orderNumber}</div>
                        <div style={{fontSize:12,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
                      </div>
                      <span style={{background:SC[order.orderStatus]||'#999',color:'white',borderRadius:20,padding:'4px 12px',fontSize:11,fontWeight:700,textTransform:'uppercase',fontFamily:'Poppins,sans-serif'}}>{order.orderStatus}</span>
                    </div>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
                      {order.items?.map((item,i)=><span key={i} style={{background:'rgba(233,30,99,0.05)',border:'1px solid rgba(233,30,99,0.1)',borderRadius:8,padding:'4px 10px',fontSize:12,fontFamily:'Poppins,sans-serif'}}>{item.name} ×{item.quantity}</span>)}
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
                      <span style={{fontWeight:700,color:'var(--primary)',fontFamily:'Poppins,sans-serif'}}>₹{order.pricing?.total?.toLocaleString()}</span>
                      <span style={{fontSize:12,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>{order.paymentMethod?.toUpperCase()} · {order.paymentStatus}</span>
                    </div>
                    {order.trackingNumber&&<div style={{marginTop:8,fontSize:12,fontFamily:'Poppins,sans-serif',color:'var(--text-light)'}}>Tracking: {order.courierName} – {order.trackingNumber}</div>}
                  </div>
                ))
              }
            </>)}
            {tab==='profile'&&(
              <div>
                <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.6rem',marginBottom:24}}>Profile Details</h2>
                <div className="glass-card" style={{padding:28}}>
                  {[['Name',user.name],['Email',user.email],['Phone',user.phone||'—'],['Account Type',user.role]].map(([label,val])=>(
                    <div key={label} style={{marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(212,175,55,0.15)'}}>
                      <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,color:'var(--text-light)',fontFamily:'Poppins,sans-serif',marginBottom:4}}>{label}</div>
                      <div style={{fontFamily:'Poppins,sans-serif',fontSize:14,fontWeight:500}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
