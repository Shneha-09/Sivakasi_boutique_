import StoreLayout from '../../components/layout/StoreLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';
export default function OrderSuccess() {
  const { query } = useRouter();
  return (
    <StoreLayout title="Order Confirmed!">
      <div style={{minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div className="glass-card" style={{maxWidth:500,width:'100%',padding:48,textAlign:'center'}}>
          <div style={{fontSize:'5rem',marginBottom:16}}>🎉</div>
          <span style={{fontFamily:'Great Vibes,cursive',fontSize:'2rem',color:'#D4AF37',display:'block',marginBottom:8}}>Thank you!</span>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'1.8rem',marginBottom:12}}>Order Confirmed</h1>
          <p style={{color:'var(--text-light)',marginBottom:8,fontFamily:'Poppins,sans-serif',fontSize:14}}>Your order has been placed successfully.</p>
          {query.orderNumber&&<div style={{background:'rgba(233,30,99,0.06)',border:'1px solid rgba(233,30,99,0.15)',borderRadius:12,padding:'12px 20px',margin:'16px 0',fontFamily:'Poppins,sans-serif'}}>Order #: <strong style={{color:'var(--primary)'}}>{query.orderNumber}</strong></div>}
          <p style={{color:'var(--text-light)',fontSize:13,marginBottom:24,fontFamily:'Poppins,sans-serif'}}>We'll dispatch it soon from Sivakasi! 💌</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/account" className="btn-primary">Track Order</Link>
            <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
          </div>
          <p style={{marginTop:20,fontSize:12,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>💬 Questions? Ask our AI assistant Priya!</p>
        </div>
      </div>
    </StoreLayout>
  );
}
