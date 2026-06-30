import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '../../lib/store';
import Head from 'next/head';

const NAV = [{ href:'/admin',icon:'📊',label:'Dashboard' },{ href:'/admin/products',icon:'👗',label:'Products' },{ href:'/admin/orders',icon:'📦',label:'Orders' },{ href:'/admin/users',icon:'👥',label:'Customers' }];

export default function AdminLayout({ children, title='Admin' }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (!user) { router.push('/auth/login'); return; } if (user.role!=='admin') router.push('/'); }, [user]);
  if (!user||user.role!=='admin') return null;

  return (
    <>
      <Head><title>{title} | Sivakasi Boutique Admin</title><meta name="robots" content="noindex,nofollow"/></Head>
      <style jsx global>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Poppins',sans-serif;background:#FFF9F5;color:#3A2A2A;}
        .adm-wrap{display:flex;min-height:100vh;}
        .adm-sb{width:240px;background:linear-gradient(180deg,#3A2A2A 0%,#5C2A2A 100%);position:fixed;top:0;left:0;bottom:0;z-index:100;display:flex;flex-direction:column;transition:transform 0.3s;}
        .adm-sb.closed{transform:translateX(-240px);}
        .sb-logo{padding:28px 20px;border-bottom:1px solid rgba(255,255,255,0.1);}
        .sb-logo .sc{font-family:'Great Vibes',cursive;font-size:1.8rem;color:#D4AF37;display:block;}
        .sb-logo .ss{font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:2px;}
        .sb-nav{flex:1;padding:20px 12px;overflow-y:auto;}
        .nav-it{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;text-decoration:none;color:rgba(255,255,255,0.7);font-size:14px;font-weight:500;transition:all 0.2s;margin-bottom:4px;}
        .nav-it:hover,.nav-it.active{background:rgba(233,30,99,0.2);color:white;}
        .nav-it.active{background:rgba(233,30,99,0.3);border-left:3px solid #E91E63;}
        .sb-foot{padding:16px 12px;border-top:1px solid rgba(255,255,255,0.1);}
        .adm-main{margin-left:240px;flex:1;display:flex;flex-direction:column;min-height:100vh;}
        .adm-top{background:rgba(255,249,245,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(212,175,55,0.2);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .adm-content{padding:32px;flex:1;}
        .ham{display:none;background:none;border:none;cursor:pointer;font-size:22px;}
        .ov{display:none;}
        @media(max-width:768px){.adm-sb{transform:translateX(-240px);}.adm-sb.open{transform:translateX(0);}.adm-main{margin-left:0;}.ham{display:block;}.ov.vis{display:block;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99;}.adm-content{padding:20px;}}
      `}</style>
      <div className="adm-wrap">
        <aside className={`adm-sb ${sidebarOpen?'open':''}`}>
          <div className="sb-logo"><span className="sc">Sivakasi</span><span className="ss">Boutique Admin</span></div>
          <nav className="sb-nav">
            {NAV.map(item=><Link key={item.href} href={item.href} className={`nav-it ${router.pathname===item.href?'active':''}`} onClick={()=>setSidebarOpen(false)}><span>{item.icon}</span><span>{item.label}</span></Link>)}
          </nav>
          <div className="sb-foot">
            <Link href="/" className="nav-it" style={{fontSize:12}}><span>🏪</span><span>View Store</span></Link>
            <button className="nav-it" style={{width:'100%',border:'none',cursor:'pointer',background:'none'}} onClick={()=>{logout();router.push('/auth/login');}}><span>🚪</span><span>Logout</span></button>
          </div>
        </aside>
        <div className={`ov ${sidebarOpen?'vis':''}`} onClick={()=>setSidebarOpen(false)}/>
        <div className="adm-main">
          <div className="adm-top">
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <button className="ham" onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</button>
              <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.3rem'}}>{title}</h1>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#E91E63,#D4AF37)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:14}}>{user.name?.charAt(0).toUpperCase()}</div>
              <span style={{fontSize:13,fontWeight:500}}>{user.name}</span>
            </div>
          </div>
          <div className="adm-content">{children}</div>
        </div>
      </div>
    </>
  );
}
