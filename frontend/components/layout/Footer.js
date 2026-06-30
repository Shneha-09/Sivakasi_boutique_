import Link from 'next/link';
export default function Footer() {
  return (
    <footer style={{background:'linear-gradient(135deg,#3A2A2A 0%,#5C3A3A 100%)',color:'white',padding:'60px 0 20px'}}>
      <style jsx>{`
        .fg{display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:40px;max-width:1280px;margin:0 auto;padding:0 20px 40px;border-bottom:1px solid rgba(255,255,255,0.1);}
        .fl{font-family:'Great Vibes',cursive;font-size:2.5rem;color:#D4AF37;margin-bottom:12px;}
        .fd{font-family:'Poppins',sans-serif;font-size:13px;opacity:0.7;line-height:1.8;margin-bottom:20px;}
        .ft{font-family:'Playfair Display',serif;font-size:1.1rem;color:#D4AF37;margin-bottom:16px;}
        .flinks{list-style:none;display:flex;flex-direction:column;gap:8px;}
        .flinks a{font-family:'Poppins',sans-serif;font-size:13px;color:rgba(255,255,255,0.7);text-decoration:none;transition:color 0.3s;}
        .flinks a:hover{color:#E91E63;}
        .ci{display:flex;align-items:flex-start;gap:10px;font-family:'Poppins',sans-serif;font-size:13px;opacity:0.7;margin-bottom:10px;}
        .fb{max-width:1280px;margin:20px auto 0;padding:0 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
        @media(max-width:768px){.fg{grid-template-columns:1fr 1fr;}}
        @media(max-width:480px){.fg{grid-template-columns:1fr;}}
      `}</style>
      <div className="fg">
        <div>
          <div className="fl">Sivakasi Boutique</div>
          <p className="fd">Your trusted online destination for premium women's kurtis, nighties, innerwear and men's innerwear. Quality fashion from Sivakasi, Virudhunagar.</p>
        </div>
        <div>
          <div className="ft">Quick Links</div>
          <ul className="flinks">
            {[['Shop All','/shop'],['New Arrivals','/shop?newArrival=true'],['Best Sellers','/shop?bestSeller=true'],['Cart','/cart'],['My Account','/account']].map(([l,h]) => <li key={h}><Link href={h}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="ft">Categories</div>
          <ul className="flinks">
            {[["Women's Kurtis",'/shop?category=womens-kurtis'],['Nighties','/shop?category=nighties'],["Women's Innerwear",'/shop?category=womens-innerwear'],["Men's Innerwear",'/shop?category=mens-innerwear']].map(([l,h]) => <li key={h}><Link href={h}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="ft">Contact Us</div>
          <div className="ci"><span>📍</span><span>Sivakasi, Virudhunagar District, Tamil Nadu — 626123</span></div>
          <div className="ci"><span>📞</span><span>+91 98765 43210</span></div>
          <div className="ci"><span>✉️</span><span>support@sivakaasiboutique.com</span></div>
          <div className="ci"><span>⏰</span><span>Mon–Sat: 9AM – 7PM IST</span></div>
        </div>
      </div>
      <div className="fb">
        <p style={{fontFamily:'Poppins,sans-serif',fontSize:12,opacity:0.5}}>© 2024 Sivakasi Boutique. All rights reserved. | Virudhunagar, Tamil Nadu</p>
        <div style={{display:'flex',gap:12}}>
          {['📘','📸','🐦'].map((icon,i) => <a key={i} href="#" style={{width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',fontSize:16,transition:'background 0.3s'}}>{icon}</a>)}
        </div>
      </div>
    </footer>
  );
}
