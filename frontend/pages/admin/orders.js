import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const STATUSES=['pending','confirmed','processing','shipped','delivered','cancelled','returned'];
const SC={pending:'#D4AF37',confirmed:'#E91E63',processing:'#9C27B0',shipped:'#2196F3',delivered:'#4CAF50',cancelled:'#f44336',returned:'#FF9800'};

export default function AdminOrders() {
  const [orders,setOrders]=useState([]);const [loading,setLoading]=useState(true);const [page,setPage]=useState(1);const [pages,setPages]=useState(1);const [total,setTotal]=useState(0);const [statusFilter,setStatusFilter]=useState('');const [search,setSearch]=useState('');const [selected,setSelected]=useState(null);const [updating,setUpdating]=useState(false);const [sf,setSf]=useState({orderStatus:'',note:'',trackingNumber:'',courierName:''});

  const load=async()=>{setLoading(true);try{const p=new URLSearchParams({page,limit:20});if(statusFilter)p.set('status',statusFilter);if(search)p.set('search',search);const r=await api.get(`/orders/admin/all?${p}`);setOrders(r.data.orders||[]);setTotal(r.data.total||0);setPages(r.data.pages||1);}catch{toast.error('Failed');}finally{setLoading(false);}};
  useEffect(()=>{load();},[page,statusFilter]);

  const openOrder=(order)=>{setSelected(order);setSf({orderStatus:order.orderStatus,note:'',trackingNumber:order.trackingNumber||'',courierName:order.courierName||''});};
  const handleUpdate=async()=>{setUpdating(true);try{await api.put(`/orders/admin/${selected._id}/status`,sf);toast.success('Updated!');setSelected(null);load();}catch{toast.error('Failed');}finally{setUpdating(false);}};

  return (
    <AdminLayout title="Orders">
      <style jsx>{`
        .tb{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;align-items:center;}
        .tb input,.tb select{padding:10px 14px;border:1px solid rgba(212,175,55,0.3);border-radius:10px;font-family:'Poppins',sans-serif;font-size:13px;outline:none;background:white;}
        table{width:100%;border-collapse:collapse;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.05);}
        th{background:rgba(233,30,99,0.04);padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;font-family:'Poppins',sans-serif;}
        td{padding:12px 16px;font-size:13px;border-top:1px solid rgba(0,0,0,0.04);font-family:'Poppins',sans-serif;}
        .modal{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;}
        .mbox{background:#FFF9F5;border-radius:20px;padding:32px;width:100%;max-width:600px;margin:20px auto;}
        .dr{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(212,175,55,0.1);font-size:13px;font-family:'Poppins',sans-serif;}
        .fgrp{margin-bottom:14px;}
        .fgrp label{display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#999;margin-bottom:6px;font-family:'Poppins',sans-serif;}
        .fgrp select,.fgrp input{width:100%;padding:10px 14px;border:1px solid rgba(212,175,55,0.3);border-radius:10px;font-family:'Poppins',sans-serif;font-size:13px;outline:none;background:white;}
      `}</style>
      <div className="tb">
        <input placeholder="Search order number..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()}/>
        <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}>
          <option value="">All Statuses</option>
          {STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <button onClick={load} style={{padding:'10px 16px',background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:10,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:13}}>🔍 Search</button>
        <span style={{marginLeft:'auto',fontSize:13,color:'#999',fontFamily:'Poppins,sans-serif'}}>{total} orders</span>
      </div>
      {loading?<div style={{textAlign:'center',padding:60}}>Loading...</div>:(
        <div style={{overflowX:'auto'}}>
          <table>
            <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {orders.length===0?<tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'#999'}}>No orders found</td></tr>:
                orders.map(order=>(
                  <tr key={order._id}>
                    <td style={{fontWeight:700,color:'#E91E63'}}>{order.orderNumber}</td>
                    <td><div style={{fontWeight:600}}>{order.user?.name||order.guestInfo?.name||'Guest'}</div><div style={{fontSize:11,color:'#999'}}>{order.user?.email||order.guestInfo?.email}</div></td>
                    <td>{order.items?.length} item(s)</td>
                    <td style={{fontWeight:700}}>₹{order.pricing?.total?.toLocaleString()}</td>
                    <td><div style={{fontSize:12}}>{order.paymentMethod?.toUpperCase()}</div><div style={{fontSize:11,color:order.paymentStatus==='paid'?'#4CAF50':'#FF9800',fontWeight:600}}>{order.paymentStatus}</div></td>
                    <td><span style={{background:SC[order.orderStatus]||'#999',color:'white',borderRadius:20,padding:'4px 10px',fontSize:11,fontWeight:700,textTransform:'uppercase',fontFamily:'Poppins,sans-serif'}}>{order.orderStatus}</span></td>
                    <td style={{fontSize:12,color:'#999'}}>{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                    <td><button onClick={()=>openOrder(order)} style={{padding:'6px 14px',background:'rgba(233,30,99,0.1)',color:'#E91E63',border:'none',borderRadius:8,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:12,fontWeight:600}}>📋 Manage</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {pages>1&&<div style={{display:'flex',gap:8,justifyContent:'center',marginTop:20,flexWrap:'wrap'}}>{[...Array(pages)].map((_,i)=><button key={i} onClick={()=>setPage(i+1)} style={{width:36,height:36,borderRadius:8,border:'1px solid rgba(212,175,55,0.3)',background:page===i+1?'linear-gradient(135deg,#E91E63,#D4AF37)':'white',color:page===i+1?'white':'#3A2A2A',cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:13}}>{i+1}</button>)}</div>}
        </div>
      )}

      {selected&&(
        <div className="modal">
          <div className="mbox">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.3rem'}}>Order #{selected.orderNumber}</h2>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',fontSize:22,cursor:'pointer'}}>✕</button>
            </div>
            <div style={{marginBottom:20}}>
              <div className="dr"><span style={{color:'#999'}}>Customer</span><span style={{fontWeight:600}}>{selected.user?.name||selected.guestInfo?.name}</span></div>
              <div className="dr"><span style={{color:'#999'}}>Phone</span><span>{selected.shippingAddress?.phone||selected.guestInfo?.phone}</span></div>
              <div className="dr"><span style={{color:'#999'}}>Address</span><span style={{textAlign:'right',maxWidth:'60%'}}>{[selected.shippingAddress?.addressLine1,selected.shippingAddress?.city,selected.shippingAddress?.state,selected.shippingAddress?.pincode].filter(Boolean).join(', ')}</span></div>
              <div className="dr"><span style={{color:'#999'}}>Payment</span><span>{selected.paymentMethod?.toUpperCase()} · <span style={{color:selected.paymentStatus==='paid'?'#4CAF50':'#FF9800',fontWeight:600}}>{selected.paymentStatus}</span></span></div>
              <div className="dr"><span style={{color:'#999'}}>Total</span><span style={{fontWeight:700,color:'#E91E63',fontSize:'1rem'}}>₹{selected.pricing?.total?.toLocaleString()}</span></div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:'Playfair Display,serif',fontSize:'1rem',marginBottom:12}}>Order Items</div>
              {selected.items?.map((item,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(212,175,55,0.1)',fontSize:13,fontFamily:'Poppins,sans-serif'}}><span>{item.name} ×{item.quantity}{item.size&&` (${item.size})`}</span><span style={{fontWeight:600}}>₹{((item.discountPrice||item.price)*item.quantity).toLocaleString()}</span></div>)}
            </div>
            <div style={{background:'rgba(233,30,99,0.03)',border:'1px solid rgba(233,30,99,0.1)',borderRadius:12,padding:16,marginBottom:16}}>
              <div style={{fontFamily:'Playfair Display,serif',fontSize:'1rem',marginBottom:14}}>Update Status</div>
              <div className="fgrp"><label>New Status</label><select value={sf.orderStatus} onChange={e=>setSf(f=>({...f,orderStatus:e.target.value}))}>{STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div>
              <div className="fgrp"><label>Note</label><input type="text" value={sf.note} onChange={e=>setSf(f=>({...f,note:e.target.value}))} placeholder="e.g. Dispatched via Delhivery"/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="fgrp" style={{marginBottom:0}}><label>Tracking Number</label><input type="text" value={sf.trackingNumber} onChange={e=>setSf(f=>({...f,trackingNumber:e.target.value}))} placeholder="AWB12345"/></div>
                <div className="fgrp" style={{marginBottom:0}}><label>Courier Name</label><input type="text" value={sf.courierName} onChange={e=>setSf(f=>({...f,courierName:e.target.value}))} placeholder="Delhivery, DTDC..."/></div>
              </div>
            </div>
            {selected.statusHistory?.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontFamily:'Playfair Display,serif',fontSize:'0.95rem',marginBottom:10}}>Status History</div>
                {[...selected.statusHistory].reverse().map((h,i)=>(
                  <div key={i} style={{display:'flex',gap:10,marginBottom:8,fontSize:12,fontFamily:'Poppins,sans-serif'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:'#E91E63',marginTop:4,flexShrink:0}}/>
                    <div><span style={{fontWeight:600,textTransform:'capitalize'}}>{h.status}</span>{h.note&&<span style={{color:'#999'}}> — {h.note}</span>}<div style={{color:'#bbb',fontSize:11}}>{new Date(h.updatedAt).toLocaleString('en-IN')}</div></div>
                  </div>
                ))}
              </div>
            )}
            <div style={{display:'flex',gap:12}}>
              <button onClick={()=>setSelected(null)} style={{flex:1,padding:12,background:'rgba(0,0,0,0.05)',border:'none',borderRadius:12,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontWeight:600}}>Cancel</button>
              <button onClick={handleUpdate} disabled={updating} style={{flex:2,padding:12,background:'linear-gradient(135deg,#E91E63,#D4AF37)',color:'white',border:'none',borderRadius:12,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontWeight:600,fontSize:14}}>{updating?'Updating...':'✅ Update Status'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
