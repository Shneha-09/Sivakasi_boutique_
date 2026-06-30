import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import StoreLayout from "../../components/layout/StoreLayout";
import ProductCard from "../../components/shop/ProductCard";
import api from "../../lib/api";

const CATEGORIES = [
  { value: "", label: "All Products" },
  { value: "womens-kurtis", label: "Women's Kurtis" },
  { value: "nighties", label: "Nighties" },
  { value: "womens-innerwear", label: "Women's Innerwear" },
  { value: "mens-innerwear", label: "Men's Innerwear" },
];

const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function Shop() {
  const router = useRouter();

  const {
    category: qCat,
    search: qSearch,
    featured,
    newArrival,
    bestSeller,
  } = router.query;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (qCat) setCategory(qCat);
  }, [qCat]);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams({
      sort,
      page,
      limit: 12,
    });

    if (category) params.set("category", category);
    if (qSearch) params.set("search", qSearch);
    if (featured) params.set("featured", "true");
    if (newArrival) params.set("newArrival", "true");
    if (bestSeller) params.set("bestSeller", "true");
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    api
      .get(`/products?${params}`)
      .then((res) => {
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [
    category,
    sort,
    page,
    qSearch,
    featured,
    newArrival,
    bestSeller,
    minPrice,
    maxPrice,
  ]);

  const pageTitle =
    qSearch
      ? `Search: "${qSearch}"`
      : CATEGORIES.find((c) => c.value === category)?.label || "All Products";

  return (
    <StoreLayout
      title={pageTitle}
      description={`Shop ${pageTitle} online at Sivakasi Boutique.`}
    >
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .shop-wrap {
          max-width: 1280px;
          margin: auto;
          padding: 40px 20px;
        }

        .shop-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 32px;
        }

        .sidebar {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 28px;
          height: fit-content;
          position: sticky;
          top: 90px;
        }

        .cat-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          margin-bottom: 5px;
          transition: .25s;
          font-family: Poppins;
        }

        .cat-btn:hover {
          background: rgba(233,30,99,.05);
        }

        .cat-btn.active {
          background: rgba(233,30,99,.08);
          color: var(--primary);
          border-color: rgba(233,30,99,.2);
          font-weight: 600;
        }

        .price-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
        }

        .price-inputs input {
          width: 100%;
          min-width: 0;
          padding: 11px 12px;
          border-radius: 10px;
          border: 1px solid var(--glass-border);
          font-family: Poppins;
          outline: none;
          background: #fff;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .sort-select {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid var(--glass-border);
          background: white;
          font-family: Poppins;
        }

        .filter-btn {
          display: none;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        .page-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 1px solid var(--glass-border);
          background: white;
          cursor: pointer;
        }

        .page-btn.active {
          background: linear-gradient(
            135deg,
            #E91E63,
            #D4AF37
          );
          color: white;
          border: none;
        }

        .clear-btn {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: rgba(233,30,99,.08);
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
        }

        .overlay {
          display: none;
        }

        @media (max-width:900px){

          .shop-layout{
            grid-template-columns:1fr;
          }

          .filter-btn{
            display:flex;
            align-items:center;
            gap:6px;
            padding:10px 16px;
            border-radius:10px;
            background:white;
            border:1px solid var(--glass-border);
            cursor:pointer;
          }

          .sidebar{
            display:none;
            position:fixed;
            top:0;
            left:0;
            bottom:0;
            width:320px;
            z-index:999;
            overflow:auto;
            border-radius:0;
          }

          .sidebar.open{
            display:block;
          }

          .overlay.active{
            display:block;
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.45);
            z-index:998;
          }
        }

        @media(max-width:450px){

          .price-inputs{
            grid-template-columns:1fr;
          }

        }
      `}</style>
       <div className="shop-wrap">
        <div style={{marginBottom:32}}><h1 style={{fontFamily:'Playfair Display,serif',fontSize:'2rem'}}>{pageTitle}</h1><p style={{color:'var(--text-light)',fontSize:14}}>{total} products</p></div>
        <div className="shop-layout">
          <aside className={`sidebar ${filterOpen?'open':''}`}>
            <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.2rem',marginBottom:20,paddingBottom:12,borderBottom:'2px solid rgba(212,175,55,0.2)'}}>🔍 Filters</div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--text-light)',marginBottom:8,fontFamily:'Poppins,sans-serif'}}>Category</div>
              {CATEGORIES.map(c=><button key={c.value} className={`cat-btn ${category===c.value?'active':''}`} onClick={()=>{setCategory(c.value);setPage(1);setFilterOpen(false);}}>{c.label}</button>)}
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1,color:'var(--text-light)',marginBottom:8,fontFamily:'Poppins,sans-serif'}}>Price Range (₹)</div>
              <div className="price-inputs"><input type="number" placeholder="Min" value={minPrice} onChange={e=>{setMinPrice(e.target.value);setPage(1);}}/><input type="number" placeholder="Max" value={maxPrice} onChange={e=>{setMaxPrice(e.target.value);setPage(1);}}/></div>
            </div>
            <button onClick={()=>{setCategory('');setMinPrice('');setMaxPrice('');setSort('newest');setPage(1);}} style={{width:'100%',padding:10,background:'rgba(233,30,99,0.08)',color:'var(--primary)',border:'1px solid rgba(233,30,99,0.2)',borderRadius:10,cursor:'pointer',fontFamily:'Poppins,sans-serif',fontWeight:600,fontSize:13}}>Clear Filters</button>
          </aside>
          <div className={`overlay ${filterOpen?'active':''}`} onClick={()=>setFilterOpen(false)} />
          <div>
            <div className="toolbar">
              <button className="filter-btn" onClick={()=>setFilterOpen(true)}>⚙️ Filters</button>
              <span style={{fontSize:14,color:'var(--text-light)',fontFamily:'Poppins,sans-serif'}}>{total} results</span>
              <select className="sort-select" value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}}>
                {SORTS.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            {loading?<div className="product-grid">{[...Array(8)].map((_,i)=><div key={i} className="skeleton" style={{height:400,borderRadius:16}}/>)}</div>
              :products.length===0?<div style={{textAlign:'center',padding:'80px 20px'}}><div style={{fontSize:'4rem'}}>🛍️</div><h3 style={{fontFamily:'Playfair Display,serif',fontSize:'1.5rem',margin:'16px 0 8px'}}>No Products Found</h3><p style={{color:'var(--text-light)'}}>Try adjusting your filters</p></div>
              :<div className="product-grid">{products.map(p=><ProductCard key={p._id} product={p}/>)}</div>}
            {pages>1&&<div className="pagination">{[...Array(pages)].map((_,i)=><button key={i} className={`page-btn ${page===i+1?'active':''}`} onClick={()=>setPage(i+1)}>{i+1}</button>)}</div>}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
