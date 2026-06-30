import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCartStore, useAuthStore } from '../../lib/store';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCartStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn); }, []);

  const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) { router.push(`/shop?search=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); setSearchQuery(''); } };
  const handleLogout = () => { logout(); toast.success('Logged out'); router.push('/'); };

  return (
    <>
      <style jsx>{`
        .navbar{position:fixed;top:0;left:0;right:0;z-index:1000;transition:all 0.4s ease;padding:16px 0;}
        .navbar.scrolled{background:rgba(255,249,245,0.95);backdrop-filter:blur(20px);box-shadow:0 4px 30px rgba(233,30,99,0.1);padding:10px 0;border-bottom:1px solid rgba(212,175,55,0.2);}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;max-width:1280px;margin:0 auto;padding:0 20px;}
        .logo{font-family:'Great Vibes',cursive;font-size:2rem;color:#E91E63;text-decoration:none;transition:color 0.3s;}
        .logo:hover{color:#D4AF37;}
        .nav-links{display:flex;gap:28px;list-style:none;align-items:center;}
        .nav-links a{font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;color:#3A2A2A;text-decoration:none;transition:color 0.3s;position:relative;}
        .nav-links a::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;background:#E91E63;transition:width 0.3s;}
        .nav-links a:hover{color:#E91E63;}.nav-links a:hover::after{width:100%;}
        .nav-actions{display:flex;align-items:center;gap:14px;}
        .icon-btn{background:none;border:none;cursor:pointer;color:#3A2A2A;font-size:20px;transition:color 0.3s;position:relative;display:flex;align-items:center;text-decoration:none;}
        .icon-btn:hover{color:#E91E63;}
        .cart-badge{position:absolute;top:-8px;right:-8px;background:#E91E63;color:white;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;}
        .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:4px;}
        .hamburger span{width:24px;height:2px;background:#3A2A2A;border-radius:2px;transition:all 0.3s;}
        .search-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(58,42,42,0.5);z-index:2000;display:flex;align-items:flex-start;justify-content:center;padding-top:100px;}
        .search-box{background:white;border-radius:16px;padding:8px;display:flex;width:90%;max-width:600px;box-shadow:0 20px 60px rgba(0,0,0,0.2);border:2px solid rgba(212,175,55,0.3);}
        .search-box input{flex:1;border:none;outline:none;font-family:'Poppins',sans-serif;font-size:16px;padding:8px 12px;color:#3A2A2A;}
        .search-btn{background:linear-gradient(135deg,#E91E63,#D4AF37);color:white;border:none;border-radius:10px;padding:10px 20px;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:600;}
        .mobile-menu{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,249,245,0.98);backdrop-filter:blur(20px);z-index:999;display:flex;flex-direction:column;padding:80px 30px 30px;transform:translateX(100%);transition:transform 0.4s ease;}
        .mobile-menu.open{transform:translateX(0);}
        .mobile-nav-links{list-style:none;display:flex;flex-direction:column;gap:20px;}
        .mobile-nav-links a{font-family:'Playfair Display',serif;font-size:1.3rem;color:#3A2A2A;text-decoration:none;border-bottom:1px solid rgba(212,175,55,0.2);padding-bottom:16px;display:block;}
        @media(max-width:768px){.nav-links{display:none;}.hamburger{display:flex;}}
      `}</style>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="logo">Sivakasi Boutique</Link>
          <ul className="nav-links">
            <li><Link href="/shop">Shop All</Link></li>
            <li><Link href="/shop?category=womens-kurtis">Kurtis</Link></li>
            <li><Link href="/shop?category=nighties">Nighties</Link></li>
            <li><Link href="/shop?category=womens-innerwear">Women's Inner</Link></li>
            <li><Link href="/shop?category=mens-innerwear">Men's Inner</Link></li>
          </ul>
          <div className="nav-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)}>🔍</button>
            <Link href="/cart" className="icon-btn">🛒{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</Link>
            {user ? (
              <>
                {user.role === 'admin' && <Link href="/admin" className="icon-btn">⚙️</Link>}
                <Link href="/account" className="icon-btn">👤</Link>
                <button className="icon-btn" onClick={handleLogout} title="Logout">🚪</button>
              </>
            ) : <Link href="/auth/login" className="icon-btn">👤</Link>}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}><span/><span/><span/></button>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <form className="search-box" onClick={e => e.stopPropagation()} onSubmit={handleSearch}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search kurtis, nighties, innerwear..." autoFocus />
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>
      )}

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button onClick={() => setMenuOpen(false)} style={{position:'absolute',top:20,right:20,background:'none',border:'none',fontSize:24,cursor:'pointer'}}>✕</button>
        <ul className="mobile-nav-links">
          {[['Shop All','/shop'],['Kurtis','/shop?category=womens-kurtis'],['Nighties','/shop?category=nighties'],["Women's Innerwear",'/shop?category=womens-innerwear'],["Men's Innerwear",'/shop?category=mens-innerwear']].map(([label,href]) => (
            <li key={href}><Link href={href} onClick={() => setMenuOpen(false)}>{label}</Link></li>
          ))}
          {user ? (
            <>
              <li><Link href="/account" onClick={() => setMenuOpen(false)}>My Account</Link></li>
              {user.role === 'admin' && <li><Link href="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link></li>}
              <li><a onClick={() => { handleLogout(); setMenuOpen(false); }} style={{cursor:'pointer',fontFamily:'Playfair Display,serif',fontSize:'1.3rem',color:'#3A2A2A',borderBottom:'1px solid rgba(212,175,55,0.2)',paddingBottom:16,display:'block'}}>Logout</a></li>
            </>
          ) : <li><Link href="/auth/login" onClick={() => setMenuOpen(false)}>Login / Register</Link></li>}
        </ul>
      </div>
    </>
  );
}
