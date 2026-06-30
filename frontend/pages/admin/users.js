import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users,setUsers]=useState([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState('');const [page,setPage]=useState(1);const [pages,setPages]=useState(1);const [total,setTotal]=useState(0);
  const load=async()=>{setLoading(true);try{const p=new URLSearchParams({page,limit:20});if(search)p.set('search',search);const r=await api.get(`/users?${p}`);setUsers(r.data.users||[]);setTotal(r.data.total||0);setPages(r.data.pages||1);}catch{toast.error('Failed');}finally{setLoading(false);}};
  useEffect(()=>{load();},[page]);
  const toggleUser=async(id)=>{try{await api.put(`/users/${id}/toggle`);toast.success('Updated');load();}catch{toast.error('Failed');}};

  return (
    <AdminLayout title="Customers">
      <style jsx>{`
        .tb{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;align-items:center;}
        .tb input{padding:10px 14px;border:1px solid rgba(212,175,55,0.3);border-radius:10px;font-family:'Poppins',sans-serif;font-size:13px;outline:none;background:white;min-width:240px;}
        table{width:100%;border-collapse:collapse;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.05);}
        th{background:rgba(233,30,99,0.04);padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;font-family:'Poppins',sans-serif;}
        td{padding:12px 16px;font-size:13px;border-top:1px solid rgba(0,0,0,0.04);font-family:'Poppins',sans-serif;}
      `}</style>
      <div className="tb">
        <input placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()}/>
        <button onClick={load} style={{padding:'10px 16px',background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:10,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:13}}>🔍 Search</button>
        <span style={{marginLeft:'auto',fontSize:13,color:'#999',fontFamily:'Poppins,sans-serif'}}>{total} customers</span>
      </div>
      {loading?<div style={{textAlign:'center',padding:60}}>Loading...</div>:(
        <div style={{overflowX:'auto'}}>
          <table>
            <thead><tr><th>Customer</th><th>Phone</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {users.length===0?<tr><td colSpan={5} style={{textAlign:'center',padding:40,color:'#999'}}>No customers found</td></tr>:
                users.map(u=>(
                  <tr key={u._id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#E91E63,#D4AF37)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:14,flexShrink:0}}>{u.name?.charAt(0).toUpperCase()}</div>
                        <div><div style={{fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:'#999'}}>{u.email}</div></div>
                      </div>
                    </td>
                    <td>{u.phone||'—'}</td>
                    <td style={{fontSize:12,color:'#999'}}>{new Date(u.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                    <td><span style={{color:u.isActive?'#4CAF50':'#f44336',fontWeight:700,fontSize:12}}>{u.isActive?'✅ Active':'❌ Blocked'}</span></td>
                    <td><button onClick={()=>toggleUser(u._id)} style={{padding:'6px 14px',background:u.isActive?'rgba(255,71,87,0.1)':'rgba(46,213,115,0.1)',color:u.isActive?'#c0392b':'#1a7a3a',border:'none',borderRadius:8,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:12,fontWeight:600}}>{u.isActive?'🚫 Block':'✅ Unblock'}</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {pages>1&&<div style={{display:'flex',gap:8,justifyContent:'center',marginTop:20,flexWrap:'wrap'}}>{[...Array(pages)].map((_,i)=><button key={i} onClick={()=>setPage(i+1)} style={{width:36,height:36,borderRadius:8,border:'1px solid rgba(212,175,55,0.3)',background:page===i+1?'linear-gradient(135deg,#E91E63,#D4AF37)':'white',color:page===i+1?'white':'#3A2A2A',cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:13}}>{i+1}</button>)}</div>}
        </div>
      )}
    </AdminLayout>
  );
}
