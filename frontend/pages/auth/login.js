import { useState } from 'react';
import { useRouter } from 'next/router';
import StoreLayout from '../../components/layout/StoreLayout';
import { useAuthStore } from '../../lib/store';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' });
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const u = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(tab==='login'?'/auth/login':'/auth/register', form);
      setAuth(data.user, data.token);
      toast.success(tab==='login'?'Welcome back! 🌸':'Account created! 🎉');
      router.push(data.user.role==='admin'?'/admin':'/');
    } catch (err) { toast.error(err.response?.data?.message||'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <StoreLayout title={tab==='login'?'Login':'Create Account'}>
      <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div className="glass-card" style={{maxWidth:440,width:'100%',padding:40}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <span style={{fontFamily:'Great Vibes,cursive',fontSize:'2.5rem',color:'#E91E63',display:'block'}}>Sivakasi Boutique</span>
            <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',marginTop:8}}>{tab==='login'?'Welcome Back':'Join Us'}</h1>
          </div>
          <div style={{display:'flex',background:'rgba(0,0,0,0.05)',borderRadius:12,padding:4,marginBottom:24}}>
            {['login','register'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:'10px',border:'none',cursor:'pointer',borderRadius:9,fontFamily:'Poppins,sans-serif',fontWeight:600,fontSize:13,transition:'all 0.3s',background:tab===t?'white':'transparent',color:tab===t?'var(--primary)':'var(--text-light)',boxShadow:tab===t?'0 2px 8px rgba(0,0,0,0.1)':'none'}}>
                {t==='login'?'Sign In':'Register'}
              </button>
            ))}
          </div>
          {tab==='register'&&<div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>Full Name</label><input className="form-input" style={{marginTop:6}} placeholder="Your full name" value={form.name} onChange={e=>u('name',e.target.value)}/></div>}
          <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>Email</label><input className="form-input" style={{marginTop:6}} type="email" placeholder="you@example.com" value={form.email} onChange={e=>u('email',e.target.value)}/></div>
          {tab==='register'&&<div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>Phone</label><input className="form-input" style={{marginTop:6}} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>u('phone',e.target.value)}/></div>}
          <div style={{marginBottom:24}}><label style={{fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>Password</label><input className="form-input" style={{marginTop:6}} type="password" placeholder="••••••••" value={form.password} onChange={e=>u('password',e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()}/></div>
          <button className="btn-primary" style={{width:'100%',justifyContent:'center',padding:14,fontSize:15}} onClick={handleSubmit} disabled={loading}>{loading?'Please wait...':(tab==='login'?'Sign In':'Create Account')}</button>
          <p style={{textAlign:'center',marginTop:16,fontSize:13,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>
            {tab==='login'?"Don't have an account? ":"Already have an account? "}
            <button onClick={()=>setTab(tab==='login'?'register':'login')} style={{background:'none',border:'none',cursor:'pointer',color:'var(--primary)',fontWeight:600,fontFamily:'Poppins,sans-serif'}}>{tab==='login'?'Register':'Sign In'}</button>
          </p>
        </div>
      </div>
    </StoreLayout>
  );
}
