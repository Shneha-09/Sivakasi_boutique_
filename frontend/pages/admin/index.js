import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../lib/api';
import Link from 'next/link';

const SM = { pending:'🟡',confirmed:'🔵',processing:'🟣',shipped:'🚚',delivered:'✅',cancelled:'❌',returned:'↩️' };

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ api.get('/dashboard/stats').then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); },[]);
  const stats = data?.stats||{};

  const SC = ({icon,label,value,sub,color})=>(
    <div style={{background:'rgba(255,255,255,0.75)',backdropFilter:'blur(20px)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:16,padding:24,boxShadow:'0 4px 20px rgba(233,30,99,0.07)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}><span style={{fontSize:'2rem'}}>{icon}</span><span style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'#999'}}>{label}</span></div>
      <div style={{fontSize:'2rem',fontWeight:700,fontFamily:'Playfair Display,serif',color:color||'#3A2A2A'}}>{loading?'—':value}</div>
      {sub&&<div style={{fontSize:12,color:'#999',marginTop:4}}>{sub}</div>}
    </div>
  );

  return (
    <AdminLayout title="Dashboard">
      <style jsx>{`
        .sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:20px;margin-bottom:32px;}
        .sec{background:rgba(255,255,255,0.75);backdrop-filter:blur(20px);border:1px solid rgba(212,175,55,0.3);border-radius:16px;padding:24px;margin-bottom:24px;}
        .st{font-family:'Playfair Display',serif;font-size:1.1rem;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(212,175,55,0.2);}
        table{width:100%;border-collapse:collapse;}
        th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;padding:8px 12px;font-family:'Poppins',sans-serif;border-bottom:1px solid rgba(212,175,55,0.15);}
        td{padding:12px;font-size:13px;border-bottom:1px solid rgba(212,175,55,0.08);font-family:'Poppins',sans-serif;}
        .tc{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
        @media(max-width:768px){.tc{grid-template-columns:1fr;}}
      `}</style>
      <div className="sg">
        <SC icon="📦" label="Total Orders" value={stats.totalOrders?.toLocaleString()} sub={`${stats.monthOrders||0} this month`}/>
        <SC icon="💰" label="Total Revenue" value={`₹${(stats.totalRevenue||0).toLocaleString()}`} sub={`₹${(stats.monthRevenue||0).toLocaleString()} this month`} color="#E91E63"/>
        <SC icon="👗" label="Products" value={stats.totalProducts?.toLocaleString()}/>
        <SC icon="👥" label="Customers" value={stats.totalUsers?.toLocaleString()}/>
        <SC icon="⏳" label="Pending" value={stats.pendingOrders?.toLocaleString()} color="#D4AF37"/>
      </div>
      <div className="tc">
        <div className="sec">
          <div className="st">Recent Orders</div>
          {data?.recentOrders?.length>0?(
            <table><thead><tr><th>Order #</th><th>Customer</th><th>Status</th><th>Amount</th></tr></thead>
            <tbody>{data.recentOrders.map(o=><tr key={o._id}><td style={{fontWeight:600,color:'#E91E63'}}>{o.orderNumber}</td><td>{o.user?.name||o.guestInfo?.name||'Guest'}</td><td>{SM[o.orderStatus]} {o.orderStatus}</td><td>₹{o.pricing?.total?.toLocaleString()}</td></tr>)}</tbody></table>
          ):<p style={{color:'#999',fontSize:14}}>No orders yet</p>}
          <div style={{marginTop:16}}><Link href="/admin/orders" style={{color:'#E91E63',fontSize:13,fontFamily:'Poppins,sans-serif',fontWeight:600}}>View All Orders →</Link></div>
        </div>
        <div className="sec">
          <div className="st">Orders by Status</div>
          {data?.ordersByStatus?.map(s=>(
            <div key={s._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,padding:'8px 0',borderBottom:'1px solid rgba(212,175,55,0.1)'}}>
              <span style={{fontSize:14,fontFamily:'Poppins,sans-serif',textTransform:'capitalize'}}>{SM[s._id]} {s._id}</span>
              <span style={{fontWeight:700,fontFamily:'Poppins,sans-serif',background:'rgba(233,30,99,0.08)',color:'#E91E63',borderRadius:20,padding:'2px 10px',fontSize:13}}>{s.count}</span>
            </div>
          ))}
          <div style={{marginTop:16}}><Link href="/admin/products" style={{color:'#E91E63',fontSize:13,fontFamily:'Poppins,sans-serif',fontWeight:600}}>Manage Products →</Link></div>
        </div>
      </div>
      {data?.topProducts?.length>0&&(
        <div className="sec">
          <div className="st">Top Selling Products</div>
          <table><thead><tr><th>Product</th><th>Units Sold</th><th>Revenue</th></tr></thead>
          <tbody>{data.topProducts.map(p=><tr key={p._id}><td style={{fontWeight:500}}>{p.name}</td><td>{p.totalSold}</td><td style={{color:'#E91E63',fontWeight:600}}>₹{p.revenue?.toLocaleString()}</td></tr>)}</tbody></table>
        </div>
      )}
    </AdminLayout>
  );
}
