import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../lib/api';
import { uploadImage } from '../../lib/upload';
import toast from 'react-hot-toast';

const CATS=['Womens-kurtis','Nighties','Womens-Innerwear','Mens-Innerwear'];
const EMPTY={images:[],name:'',description:'',shortDescription:'',price:'',discountPrice:'',category:'womens-kurtis',fabric:'',sizes:[{size:'S',stock:0},{size:'M',stock:0},{size:'L',stock:0},{size:'XL',stock:0},{size:'XXL',stock:0},{size:'Free Size',stock:0}],colors:[],tags:[],isFeatured:false,isBestSeller:false,isNewArrival:false,isActive:true,seoTitle:'',seoDescription:'',seoKeywords:''};

export default function AdminProducts() {
  const [products,setProducts]=useState([]);const [loading,setLoading]=useState(true);const [showForm,setShowForm]=useState(false);const [editId,setEditId]=useState(null);const [form,setForm]=useState(EMPTY);const [search,setSearch]=useState('');const [catFilter,setCatFilter]=useState('');const [page,setPage]=useState(1);const [total,setTotal]=useState(0);const [pages,setPages]=useState(1);const [saving,setSaving]=useState(false);const [colorInput,setColorInput]=useState('');
  const load=async()=>{setLoading(true);try{const p=new URLSearchParams({page,limit:15});if(search)p.set('search',search);if(catFilter)p.set('category',catFilter);const r=await api.get(`/products/admin/all?${p}`);setProducts(r.data.products||[]);setTotal(r.data.total||0);setPages(r.data.pages||1);}catch{toast.error('Failed');}finally{setLoading(false);}};
  useEffect(()=>{load();},[page,catFilter]);
  const u=(k,v)=>setForm(f=>({...f,[k]:v}));
  const updateSize=(i,field,val)=>{const sizes=[...form.sizes];sizes[i]={...sizes[i],[field]:field==='stock'?Number(val):val};setForm(f=>({...f,sizes}));};
  const handleSave=async()=>{if(!form.name||!form.price){toast.error('Name and price required');return;}setSaving(true);try{const payload={...form,price:Number(form.price),discountPrice:form.discountPrice?Number(form.discountPrice):undefined,seoKeywords:form.seoKeywords?form.seoKeywords.split(',').map(s=>s.trim()):[],sizes:JSON.stringify(form.sizes),colors:JSON.stringify(form.colors),tags:JSON.stringify(form.tags||[])};if(editId){await api.put(`/products/${editId}`,payload);toast.success('Updated!');}else{await api.post('/products',payload);toast.success('Created!');}setShowForm(false);setEditId(null);setForm(EMPTY);load();}catch(err){toast.error(err.response?.data?.message||'Failed');}finally{setSaving(false);}};
  const handleDelete=async(id)=>{if(!confirm('Deactivate?'))return;await api.delete(`/products/${id}`);toast.success('Deactivated');load();};
  const handleEdit=(p)=>{setForm({...p,price:p.price,discountPrice:p.discountPrice||'',seoKeywords:p.seoKeywords?.join(',')||'',sizes:p.sizes?.length?p.sizes:EMPTY.sizes,colors:p.colors||[]});setEditId(p._id);setShowForm(true);};
  const API2=process.env.NEXT_PUBLIC_UPLOADS_URL||'http://localhost:5000';

  return (
    <AdminLayout title="Products">
      <style jsx>{`
        .tb{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;align-items:center;}
        .tb input,.tb select{padding:10px 14px;border:1px solid rgba(212,175,55,0.3);border-radius:10px;font-family:'Poppins',sans-serif;font-size:13px;outline:none;background:white;}
        table{width:100%;border-collapse:collapse;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.05);}
        th{background:rgba(233,30,99,0.04);padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;font-family:'Poppins',sans-serif;}
        td{padding:12px 16px;font-size:13px;border-top:1px solid rgba(0,0,0,0.04);font-family:'Poppins',sans-serif;vertical-align:middle;}
        .pi{width:44px;height:54px;object-fit:cover;border-radius:8px;}
        .ab{padding:6px 12px;border-radius:8px;border:none;cursor:pointer;font-size:12px;font-family:'Poppins',sans-serif;font-weight:600;transition:all 0.2s;margin-right:6px;}
        .modal{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;}
        .mbox{background:#FFF9F5;border-radius:20px;padding:32px;width:100%;max-width:700px;margin:20px auto;}
        .fgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .fgrp{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
        label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#999;font-family:'Poppins',sans-serif;}
        input[type=text],input[type=number],textarea,select{width:100%;padding:10px 14px;border:1px solid rgba(212,175,55,0.3);border-radius:10px;font-family:'Poppins',sans-serif;font-size:13px;color:#3A2A2A;outline:none;background:white;}
        textarea{resize:vertical;min-height:80px;}
        .sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
        .srow{display:flex;align-items:center;gap:6px;}
        .tog{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;font-family:'Poppins',sans-serif;}
        .trow{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:16px;}
        @media(max-width:600px){.fgrid{grid-template-columns:1fr;}.sgrid{grid-template-columns:repeat(2,1fr);}}
      `}</style>
      <div className="tb">
        <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()}/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}><option value="">All Categories</option>{CATS.map(c=><option key={c} value={c}>{c.replace(/-/g,' ')}</option>)}</select>
        <button onClick={load} style={{padding:'10px 16px',background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:10,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:13}}>🔍 Search</button>
        <button className="ab" style={{marginLeft:'auto',background:'linear-gradient(135deg,#E91E63,#D4AF37)',color:'white',padding:'10px 20px',borderRadius:10,fontSize:13}} onClick={()=>{setForm(EMPTY);setEditId(null);setShowForm(true);}}>+ Add Product</button>
      </div>
      <div style={{marginBottom:12,fontSize:13,color:'#999',fontFamily:'Poppins,sans-serif'}}>{total} products</div>
      {loading?<div style={{textAlign:'center',padding:60}}>Loading...</div>:(
        <div style={{overflowX:'auto'}}>
          <table>
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p=>(
                <tr key={p._id}>
                  <td><img src={p.images?.[0]?(p.images[0].startsWith('http')?p.images[0]:`${API2}${p.images[0]}`):`https://via.placeholder.com/100/FFE0F0/E91E63?text=P`} className="pi" alt="" onError={e=>e.target.src='https://via.placeholder.com/100/FFE0F0/E91E63?text=P'}/></td>
                  <td style={{fontWeight:600,maxWidth:200}}>{p.name}</td>
                  <td><span style={{background:'rgba(233,30,99,0.08)',color:'#E91E63',borderRadius:20,padding:'2px 10px',fontSize:11,whiteSpace:'nowrap'}}>{p.category?.replace(/-/g,' ')}</span></td>
                  <td>₹{p.discountPrice||p.price}{p.discountPrice&&<><br/><span style={{fontSize:11,color:'#999',textDecoration:'line-through'}}>₹{p.price}</span></>}</td>
                  <td>{p.totalStock||0}</td>
                  <td><span style={{color:p.isActive?'#2ed573':'#ff4757',fontSize:12,fontWeight:600}}>{p.isActive?'Active':'Inactive'}</span></td>
                  <td>
                    <button className="ab" style={{background:'rgba(233,30,99,0.1)',color:'#E91E63'}} onClick={()=>handleEdit(p)}>✏️ Edit</button>
                    <button className="ab" style={{background:'rgba(255,71,87,0.1)',color:'#c0392b'}} onClick={()=>handleDelete(p._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages>1&&<div style={{display:'flex',gap:8,justifyContent:'center',marginTop:20,flexWrap:'wrap'}}>{[...Array(pages)].map((_,i)=><button key={i} onClick={()=>setPage(i+1)} style={{width:36,height:36,borderRadius:8,border:'1px solid rgba(212,175,55,0.3)',background:page===i+1?'linear-gradient(135deg,#E91E63,#D4AF37)':'white',color:page===i+1?'white':'#3A2A2A',cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:13}}>{i+1}</button>)}</div>}
        </div>
      )}
      {showForm&&(
        <div className="modal">
          <div className="mbox">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem'}}>{editId?'Edit Product':'Add New Product'}</h2>
              <button onClick={()=>setShowForm(false)} style={{background:'none',border:'none',fontSize:22,cursor:'pointer'}}>✕</button>
            </div>
            <div className="fgrid">
              <div className="fgrp">
                <label>Product Image</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    console.log("File selected");
                    console.log(e.target.files);
                    const file = e.target.files[0];
                    if (!file) return;

                    try {
                      const url = await uploadImage(file);

                      setForm((f) => ({
                        ...f,
                        images: [url]   // store uploaded image
                      }));

                      toast.success("Image uploaded");
                    } catch (err) {
                      toast.error("Upload failed");
                    }
                  }}
                />

                {/* PREVIEW */}
                {form.images?.length > 0 && (
                  <img
                    src={
                      form.images[0].startsWith('http')
                        ? form.images[0]
                        : `${API2}${form.images[0]}`
                    }
                    style={{
                      width: 120,
                      height: 120,
                      marginTop: 10,
                      borderRadius: 10,
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
              <div className="fgrp"><label>Product Name *</label><input type="text" value={form.name} onChange={e=>u('name',e.target.value)} placeholder="e.g. Floral Kurti"/></div>
              <div className="fgrp"><label>Category *</label><select value={form.category} onChange={e=>u('category',e.target.value)}>{CATS.map(c=><option key={c} value={c}>{c.replace(/-/g,' ')}</option>)}</select></div>
              <div className="fgrp"><label>Price (₹) *</label><input type="number" value={form.price} onChange={e=>u('price',e.target.value)} placeholder="999"/></div>
              <div className="fgrp"><label>Discount Price (₹)</label><input type="number" value={form.discountPrice} onChange={e=>u('discountPrice',e.target.value)} placeholder="799"/></div>
              <div className="fgrp"><label>Fabric</label><input type="text" value={form.fabric} onChange={e=>u('fabric',e.target.value)} placeholder="Cotton, Silk..."/></div>
            </div>
            <div className="fgrp"><label>Short Description</label><input type="text" value={form.shortDescription} onChange={e=>u('shortDescription',e.target.value)} placeholder="One-line summary"/></div>
            <div className="fgrp"><label>Full Description *</label><textarea value={form.description} onChange={e=>u('description',e.target.value)} placeholder="Detailed description..."/></div>
            <div className="fgrp">
              <label>Sizes & Stock</label>
              <div className="sgrid">{form.sizes.map((s,i)=><div className="srow" key={i}><input type="text" value={s.size} onChange={e=>updateSize(i,'size',e.target.value)} style={{width:80}} placeholder="Size"/><input type="number" value={s.stock} onChange={e=>updateSize(i,'stock',e.target.value)} style={{width:70}} placeholder="Qty" min={0}/></div>)}</div>
              <button onClick={()=>setForm(f=>({...f,sizes:[...f.sizes,{size:'',stock:0}]}))} style={{marginTop:8,padding:'4px 12px',background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:6,cursor:'pointer',fontSize:12,fontFamily:'Poppins,sans-serif'}}>+ Add Size</button>
            </div>
            <div className="fgrp">
              <label>Colors</label>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
                {form.colors.map((c,i)=><span key={i} style={{background:'rgba(233,30,99,0.08)',color:'#E91E63',borderRadius:20,padding:'4px 10px',fontSize:12,fontFamily:'Poppins,sans-serif',display:'flex',alignItems:'center',gap:6}}>{c}<button onClick={()=>setForm(f=>({...f,colors:f.colors.filter((_,ci)=>ci!==i)}))} style={{background:'none',border:'none',cursor:'pointer',fontSize:12,color:'inherit'}}>✕</button></span>)}
              </div>
              <div style={{display:'flex',gap:8}}><input type="text" value={colorInput} onChange={e=>setColorInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&colorInput.trim()){setForm(f=>({...f,colors:[...f.colors,colorInput.trim()]}));setColorInput('');}}} placeholder="Type color and press Enter" style={{flex:1}}/><button onClick={()=>{if(colorInput.trim()){setForm(f=>({...f,colors:[...f.colors,colorInput.trim()]}));setColorInput('');}}} style={{padding:'8px 14px',background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:8,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:13}}>Add</button></div>
            </div>
            <div className="trow">
              {[['isFeatured','⭐ Featured'],['isBestSeller','🔥 Best Seller'],['isNewArrival','🆕 New Arrival'],['isActive','✅ Active']].map(([key,label])=>(
                <label key={key} className="tog"><input type="checkbox" checked={form[key]} onChange={e=>u(key,e.target.checked)} style={{accentColor:'#E91E63',width:16,height:16}}/>{label}</label>
              ))}
            </div>
            <details style={{marginBottom:16}}>
              <summary style={{cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'Poppins,sans-serif',marginBottom:8}}>SEO Settings</summary>
              <div style={{paddingTop:12}}>
                <div className="fgrp"><label>SEO Title</label><input type="text" value={form.seoTitle} onChange={e=>u('seoTitle',e.target.value)}/></div>
                <div className="fgrp"><label>Meta Description</label><textarea value={form.seoDescription} onChange={e=>u('seoDescription',e.target.value)} style={{minHeight:60}}/></div>
                <div className="fgrp"><label>Keywords (comma separated)</label><input type="text" value={form.seoKeywords} onChange={e=>u('seoKeywords',e.target.value)} placeholder="kurti, cotton, women"/></div>
              </div>
            </details>
            <div style={{display:'flex',gap:12}}>
              <button onClick={()=>setShowForm(false)} style={{flex:1,padding:12,background:'rgba(0,0,0,0.05)',border:'none',borderRadius:12,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontWeight:600}}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{flex:2,padding:12,background:'linear-gradient(135deg,#E91E63,#D4AF37)',color:'white',border:'none',borderRadius:12,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontWeight:600,fontSize:14}}>{saving?'Saving...':(editId?'💾 Update':'✨ Create Product')}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
