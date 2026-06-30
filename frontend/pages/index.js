import StoreLayout from '../components/layout/StoreLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import ProductCard from '../components/shop/ProductCard';

const CATS = [
  { slug:'womens-kurtis', label:"Women's Kurtis", emoji:'👗', desc:'Elegant everyday wear' },
  { slug:'nighties', label:'Nighties', emoji:'🌙', desc:'Comfortable nightwear' },
  { slug:'womens-innerwear', label:"Women's Innerwear", emoji:'🌸', desc:'Premium comfort basics' },
  { slug:'mens-innerwear', label:"Men's Innerwear", emoji:'👔', desc:"Quality men's basics" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/products?featured=true&limit=8'), api.get('/products?newArrival=true&limit=4')])
      .then(([f, n]) => { setFeatured(f.data.products || []); setNewArrivals(n.data.products || []); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <StoreLayout title="Premium Women's Kurtis, Nighties & Innerwear Online" description="Shop the finest women's kurtis, nighties, innerwear and men's innerwear online from Sivakasi Boutique, Virudhunagar." keywords="womens kurtis online, nighties, innerwear, sivakasi boutique, virudhunagar fashion">
      <style jsx>{`
        .hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;}
        .hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;}
        .hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(58,42,42,0.75) 0%,rgba(233,30,99,0.35) 50%,rgba(58,42,42,0.6) 100%);z-index:1;}
        .hero-fallback{position:absolute;inset:0;background:linear-gradient(135deg,#3A2A2A 0%,#8B2252 40%,#3A2A2A 100%);z-index:0;}
        .hero-content{position:relative;z-index:2;text-align:center;padding:0 20px;max-width:800px;}
        .hero-script{font-family:'Great Vibes',cursive;font-size:clamp(2rem,6vw,4rem);color:#D4AF37;display:block;margin-bottom:8px;}
        .hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,7vw,5rem);color:white;line-height:1.1;margin-bottom:20px;}
        .hero-title span{color:#FFB6A3;}
        .hero-sub{font-family:'Poppins',sans-serif;font-size:clamp(0.9rem,2vw,1.1rem);color:rgba(255,255,255,0.85);margin-bottom:36px;line-height:1.8;}
        .hero-ctas{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:1px solid rgba(212,175,55,0.4);border-radius:50px;padding:8px 20px;color:white;font-size:13px;font-family:'Poppins',sans-serif;margin-top:30px;}
        .trust-bar{background:linear-gradient(135deg,#E91E63 0%,#C2185B 100%);padding:16px 20px;}
        .trust-inner{max-width:1280px;margin:0 auto;display:flex;justify-content:space-around;flex-wrap:wrap;gap:12px;}
        .trust-item{display:flex;align-items:center;gap:8px;color:white;font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;}
        .section{padding:80px 20px;max-width:1280px;margin:0 auto;}
        .section-header{text-align:center;margin-bottom:48px;}
        .cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
        .cat-card{
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;

          width:100%;
          min-height:260px;

          background:var(--card-bg);
          backdrop-filter:blur(20px);

          border:2px solid var(--glass-border);
          border-radius:20px;

          padding:32px 24px;

          text-align:center;
          text-decoration:none;
          color:inherit;

          gap:14px;

          transition:all .35s ease;
        }

        .cat-card:hover{
          transform:translateY(-8px);
          border-color:var(--primary-light);
          box-shadow:0 20px 40px rgba(233,30,99,.15);
        }

        .cat-emoji{
          font-size:3rem;
          margin-bottom:8px;
        }

        .cat-card h3{
          margin:0;
          font-family:'Playfair Display',serif;
          font-size:1.4rem;
          font-weight:700;
        }

        .cat-card p{
          margin:0;
          font-size:14px;
          color:var(--text-light);
          line-height:1.6;
        }

        .cat-card .shop-link{
          color:var(--primary);
          font-weight:600;
          font-size:14px;
        }
        .cat-card:hover{transform:translateY(-8px);border-color:var(--primary-light);box-shadow:0 20px 40px rgba(233,30,99,0.15);}
        .cat-emoji{font-size:3rem;animation:float 3s ease-in-out infinite;}
        .promo-banner{background:linear-gradient(135deg,#3A2A2A 0%,#5C2A2A 100%);border-radius:24px;padding:60px 40px;display:flex;align-items:center;justify-content:space-between;gap:30px;overflow:hidden;position:relative;}
        .promo-banner::before{content:'✦';position:absolute;font-size:200px;color:rgba(212,175,55,0.05);top:-40px;right:-20px;}
        .ai-banner{background:linear-gradient(135deg,#E91E63 0%,#9C27B0 50%,#3A2A2A 100%);border-radius:24px;padding:40px;display:flex;align-items:center;gap:24px;margin:0 20px;max-width:1280px;margin-left:auto;margin-right:auto;}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
        @media(max-width:900px){.cat-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:600px){.promo-banner{flex-direction:column;text-align:center;}.ai-banner{flex-direction:column;text-align:center;}}
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-fallback" />
        <video className="hero-video" autoPlay muted loop playsInline poster="/hero-poster.jpg">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-script">Welcome to</span>
          <h1 className="hero-title">Sivakasi <span>Boutique</span></h1>
          <p className="hero-sub">Discover exquisite women's kurtis, elegant nightwear & premium innerwear.<br/>Fashion crafted with love from the heart of Virudhunagar.</p>
          <div className="hero-ctas">
            <Link href="/shop" className="btn-primary" style={{fontSize:'15px',padding:'14px 36px'}}>Shop Now ✨</Link>
            <Link href="/shop?newArrival=true" className="btn-secondary" style={{color:'white',borderColor:'rgba(212,175,55,0.7)',fontSize:'15px',padding:'12px 30px'}}>New Arrivals</Link>
          </div>
          <div className="hero-badge">⭐ Premium Quality &nbsp;|&nbsp; 🚚 Free Delivery &nbsp;|&nbsp; 🤖 AI Shopping Assistant</div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-inner">
          {[['🚚','Free Delivery Across India'],['🔒','Secure Payments'],['↩️','Easy Returns'],['🤖','AI Chat Assistant'],['📦','Fast Dispatch']].map(([icon,text]) => (
            <div className="trust-item" key={text}><span>{icon}</span><span>{text}</span></div>
          ))}
        </div>
      </div>

      {/* AI CHATBOT BANNER */}
      <div style={{padding:'40px 20px 0'}}>
        <div className="ai-banner">
          <div style={{fontSize:'4rem',flexShrink:0,animation:'float 3s ease-in-out infinite'}}>🤖</div>
          <div style={{flex:1}}>
            <span style={{fontFamily:'Great Vibes,cursive',fontSize:'1.8rem',color:'#D4AF37',display:'block',marginBottom:4}}>Meet Priya</span>
            <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',color:'white',marginBottom:8}}>Your AI Shopping Assistant</h3>
            <p style={{fontFamily:'Poppins,sans-serif',fontSize:13,color:'rgba(255,255,255,0.8)',lineHeight:1.6}}>Ask Priya anything! She can help you find the perfect outfit, check sizes, delivery info, and more — powered by Claude AI.</p>
          </div>
          <div style={{flexShrink:0}}>
            <div style={{background:'rgba(255,255,255,0.1)',borderRadius:16,padding:'16px 20px',fontFamily:'Poppins,sans-serif',fontSize:13,color:'white',border:'1px solid rgba(255,255,255,0.2)',maxWidth:200}}>
              <div style={{marginBottom:8,opacity:0.7}}>Try asking:</div>
              {['"Show me cotton kurtis"','"What sizes do you have?"','"Free delivery kya hai?"'].map(q => <div key={q} style={{padding:'4px 0',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>{q}</div>)}
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section">
        <div className="section-header">
          <span style={{fontFamily:'Great Vibes,cursive',fontSize:'2rem',color:'#E91E63'}}>Browse by</span>
          <h2 className="section-title">Our Collections</h2>
          <div className="section-divider" />
        </div>
        <div className="cat-grid">
          {CATS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="cat-card"
            >
              <div className="cat-emoji">
                {cat.emoji}
              </div>

              <h3>{cat.label}</h3>

              <p>{cat.desc}</p>

              <span className="shop-link">
                Shop Now →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {(featured.length > 0 || loading) && (
        <section style={{background:'rgba(233,30,99,0.03)',padding:'80px 20px'}}>
          <div style={{maxWidth:1280,margin:'0 auto'}}>
            <div className="section-header">
              <span style={{fontFamily:'Great Vibes,cursive',fontSize:'2rem',color:'#E91E63'}}>Handpicked for you</span>
              <h2 className="section-title">Featured Products</h2>
              <div className="section-divider" />
            </div>
            {loading ? <div className="product-grid">{[...Array(8)].map((_,i) => <div key={i} className="skeleton" style={{height:400,borderRadius:16}} />)}</div>
              : <div className="product-grid">{featured.map(p => <ProductCard key={p._id} product={p} />)}</div>}
            <div style={{textAlign:'center',marginTop:40}}><Link href="/shop?featured=true" className="btn-primary">View All Featured →</Link></div>
          </div>
        </section>
      )}

      {/* PROMO BANNER */}
      <section style={{padding:'60px 20px',maxWidth:1280,margin:'0 auto'}}>
        <div className="promo-banner">
          <div>
            <span style={{fontFamily:'Great Vibes,cursive',fontSize:'2rem',color:'#D4AF37',display:'block',marginBottom:8}}>Special Offer</span>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(1.8rem,4vw,3rem)',color:'white',marginBottom:12}}>New Arrivals Just Dropped!</h2>
            <p style={{color:'rgba(255,255,255,0.7)',fontSize:15,marginBottom:24,fontFamily:'Poppins,sans-serif'}}>Fresh kurtis & nightwear — limited stock!</p>
            <Link href="/shop?newArrival=true" className="btn-gold">Explore Now →</Link>
          </div>
          <div style={{fontSize:'8rem',opacity:0.8,animation:'float 3s ease-in-out infinite'}}>🛍️</div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="section">
          <div className="section-header">
            <span style={{fontFamily:'Great Vibes,cursive',fontSize:'2rem',color:'#E91E63'}}>Fresh in store</span>
            <h2 className="section-title">New Arrivals</h2>
            <div className="section-divider" />
          </div>
          <div className="product-grid">{newArrivals.map(p => <ProductCard key={p._id} product={p} />)}</div>
        </section>
      )}

      {/* WHY US */}
      <section style={{background:'rgba(233,30,99,0.03)',padding:'80px 20px'}}>
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="section-header">
            <h2 className="section-title">Why Choose Us?</h2>
            <div className="section-divider" />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:24}}>
            {[['✨','Premium Quality','Hand-picked fabrics for lasting comfort.'],['🚚','Fast Delivery','Quick dispatch from Sivakasi across India.'],['💰','Best Prices','Factory-direct pricing, no middlemen.'],['🔄','Easy Returns','Hassle-free returns within 7 days.'],['🔒','Secure Shopping','Encrypted payments, safe checkout.'],['🤖','AI Assistant','24/7 AI chat for all your shopping queries.']].map(([icon,title,desc]) => (
              <div key={title} className="glass-card" style={{padding:28,textAlign:'center'}}>
                <div style={{fontSize:'2.5rem',marginBottom:12}}>{icon}</div>
                <h4 style={{fontFamily:'Playfair Display,serif',fontSize:'1.1rem',marginBottom:8}}>{title}</h4>
                <p style={{fontSize:13,color:'var(--text-light)',lineHeight:1.6,fontFamily:'Poppins,sans-serif'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
