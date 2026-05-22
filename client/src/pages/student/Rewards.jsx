import { useState } from "react";
import { Star, Gift, Zap, Lock } from "lucide-react";

const REWARDS = [
  {id:"1",e:"📱",title:"Safaricom 50 Airtime",desc:"Instant M-PESA credit to any Safaricom number.",pts:200,cat:"Airtime",rarity:"Common"},
  {id:"2",e:"📱",title:"Safaricom 100 Airtime",desc:"Double the airtime boost.",pts:380,cat:"Airtime",rarity:"Common"},
  {id:"3",e:"🛒",title:"Naivas KES 100 Voucher",desc:"Shop groceries at any Naivas supermarket branch.",pts:450,cat:"Shopping",rarity:"Uncommon"},
  {id:"4",e:"🛒",title:"Naivas KES 500 Voucher",desc:"Big grocery haul on us.",pts:1800,cat:"Shopping",rarity:"Rare"},
  {id:"5",e:"🌳",title:"Plant a Tree",desc:"Sponsor a mangrove tree planting in your name along Kenya's coast.",pts:300,cat:"Sustainability",rarity:"Common"},
  {id:"6",e:"🏅",title:"Green Ambassador Badge",desc:"Exclusive digital badge for your profile and school certificate.",pts:500,cat:"Badge",rarity:"Uncommon"},
  {id:"7",e:"☕",title:"Java Coffee Voucher",desc:"A free beverage at any Java House outlet.",pts:350,cat:"Food",rarity:"Uncommon"},
  {id:"8",e:"🎟️",title:"EcoWarrior Premium",desc:"Unlock premium analytics, bonus challenges, and priority QR scanning.",pts:2500,cat:"Premium",rarity:"Legendary"},
];
const CATS = ["All","Airtime","Shopping","Sustainability","Badge","Food","Premium"];
const RARITY_STYLE={
  Common:    {bg:"var(--bg-subtle)",  color:"var(--text-muted)"},
  Uncommon:  {bg:"var(--g-100)",     color:"var(--g-800)"},
  Rare:      {bg:"#dbeafe",          color:"#1e40af"},
  Legendary: {bg:"#fdf4ff",          color:"#7e22ce"},
};
const USER_POINTS = 680;

export default function Rewards() {
  const [cat, setCat] = useState("All");
  const shown = REWARDS.filter(r => cat === "All" || r.cat === cat);

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Rewards Marketplace</h1>
          <p className="page-subtitle">Exchange your eco-points for real rewards.</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,background:"var(--g-50)",border:"1px solid var(--g-200)",borderRadius:"var(--r-md)",padding:"10px 16px"}}>
          <Zap size={18} style={{color:"var(--lime-dk)"}}/>
          <div>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:20,lineHeight:1,color:"var(--g-800)"}}>{USER_POINTS.toLocaleString()}</div>
            <div style={{fontSize:11,color:"var(--text-muted)",fontWeight:600}}>Eco Points</div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {CATS.map(c=>(
          <button key={c} className={`tag ${cat===c?"tag-active":"tag-inactive"}`} onClick={()=>setCat(c)}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid-auto">
        {shown.map((r,i)=>{
          const canRedeem = USER_POINTS >= r.pts;
          const rar = RARITY_STYLE[r.rarity];
          return(
            <div key={r.id} className={`reward-card animate-fade-up delay-${(i%3+1)*100}`}>
              <div className="reward-card-img" style={{background:`linear-gradient(135deg,${r.rarity==="Legendary"?"#fdf4ff,#ede9fe":r.rarity==="Rare"?"#dbeafe,#bfdbfe":r.rarity==="Uncommon"?"var(--g-50),var(--g-100)":"var(--bg),var(--bg-subtle)"})`}}>
                <span>{r.e}</span>
                <span style={{position:"absolute",top:10,right:10,background:rar.bg,color:rar.color,borderRadius:100,padding:"2px 8px",fontSize:11,fontWeight:700}}>
                  {r.rarity}
                </span>
              </div>
              <div className="reward-card-body">
                <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,marginBottom:6}}>{r.title}</div>
                <p style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.6,marginBottom:12}}>{r.desc}</p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div className="reward-pts">{r.pts.toLocaleString()}</div>
                    <div style={{fontSize:11,color:"var(--text-muted)",fontWeight:500}}>eco-points</div>
                  </div>
                  <button
                    className={canRedeem?"btn btn-primary btn-sm":"btn btn-sm"}
                    disabled={!canRedeem}
                    style={!canRedeem?{background:"var(--bg-subtle)",color:"var(--text-soft)",cursor:"not-allowed",border:"1px solid var(--border)"}:{}}
                    aria-label={`Redeem ${r.title}`}
                  >
                    {canRedeem?<><Star size={12}/> Redeem</>:<><Lock size={12}/> {r.pts - USER_POINTS} more pts</>}
                  </button>
                </div>
                {!canRedeem&&(
                  <div style={{marginTop:8}}>
                    <div className="progress-track">
                      <div className="progress-fill" style={{width:`${(USER_POINTS/r.pts)*100}%`}}/>
                    </div>
                    <div style={{fontSize:11,color:"var(--text-soft)",marginTop:4}}>{Math.round((USER_POINTS/r.pts)*100)}% there</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
