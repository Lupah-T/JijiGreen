import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { getProfile, updateProfile } from "../../api/studentApi.js";
import { Camera, Save, Phone, FileText, Award, Zap, CheckCircle, AlertCircle, User, Mail } from "lucide-react";

function initials(n=""){return n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()||"U";}
function getTier(pts){
  if(pts>=5000)return{label:"Gold",bg:"#fef9c3",color:"#713f12"};
  if(pts>=1000)return{label:"Silver",bg:"#f1f5f9",color:"#334155"};
  return{label:"Bronze",bg:"#fef3c7",color:"#92400e"};
}

function Toast({toast}){
  if(!toast)return null;
  return(
    <div className={`toast ${toast.type==="success"?"toast-success":"toast-error"}`}>
      {toast.type==="success"?<CheckCircle size={17}/>:<AlertCircle size={17}/>}
      {toast.msg}
    </div>
  );
}

export default function Profile(){
  const{user,setUser}=useAuth();
  const fileRef=useRef(null);
  const[profile,setProfile]=useState(null);
  const[form,setForm]=useState({name:"",phone:"",bio:"",avatarUrl:""});
  const[preview,setPreview]=useState(null);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[toast,setToast]=useState(null);

  useEffect(()=>{
    getProfile().then(({data})=>{
      const u=data.data||data;
      setProfile(u);
      setForm({name:u.name||"",phone:u.phone||"",bio:u.bio||"",avatarUrl:u.avatarUrl||""});
      if(u.avatarUrl)setPreview(u.avatarUrl);
    }).catch(()=>{
      if(user){setProfile(user);setForm({name:user.name||"",phone:user.phone||"",bio:user.bio||"",avatarUrl:user.avatarUrl||""});if(user.avatarUrl)setPreview(user.avatarUrl);}
    }).finally(()=>setLoading(false));
  },[]);

  const handleFile=e=>{
    const f=e.target.files[0]; if(!f)return;
    if(f.size>2*1024*1024){showToast("error","Image must be under 2 MB");return;}
    const r=new FileReader();
    r.onload=ev=>{setPreview(ev.target.result);setForm(p=>({...p,avatarUrl:ev.target.result}));};
    r.readAsDataURL(f);
  };

  const save=async e=>{
    e.preventDefault(); setSaving(true);
    try{
      const{data}=await updateProfile(form);
      const upd=data.data||data;
      setProfile(upd);
      if(setUser)setUser(p=>({...p,...upd}));
      showToast("success","Profile updated!");
    }catch{showToast("error","Failed to save. Please try again.");}
    finally{setSaving(false);}
  };

  const showToast=(type,msg)=>{setToast({type,msg});setTimeout(()=>setToast(null),3500);};
  const tier=getTier(profile?.ecoPoints||0);

  if(loading)return<div className="loader"><span className="spinner"/>Loading profile…</div>;

  return(
    <>
      <Toast toast={toast}/>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View and update your personal details.</p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:24,alignItems:"start"}}>
        {/* Left card */}
        <div className="card" style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
          <div style={{position:"relative",display:"inline-block"}}>
            {preview?(
              <img src={preview} alt="Profile" style={{width:100,height:100,borderRadius:"50%",objectFit:"cover",border:"3px solid var(--border-g)",boxShadow:"var(--shadow-md)"}}/>
            ):(
              <div style={{width:100,height:100,borderRadius:"50%",background:"linear-gradient(135deg,var(--g-600),var(--lime-dk))",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-heading)",fontWeight:800,fontSize:32,color:"#fff",boxShadow:"var(--shadow-md)"}}>
                {initials(form.name||profile?.name)}
              </div>
            )}
            <button type="button" onClick={()=>fileRef.current?.click()} aria-label="Change photo" style={{position:"absolute",bottom:2,right:2,width:30,height:30,borderRadius:"50%",background:"var(--g-600)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",border:"2px solid #fff",cursor:"pointer",boxShadow:"var(--shadow-sm)"}}>
              <Camera size={14}/>
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
          </div>
          <div>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17}}>{form.name||"Your Name"}</div>
            <div style={{color:"var(--text-muted)",fontSize:13,marginTop:2}}>{profile?.email}</div>
          </div>
          <span style={{background:tier.bg,color:tier.color,borderRadius:100,padding:"5px 14px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
            <Award size={13}/> {tier.label} Member
          </span>
          <div style={{background:"var(--g-50)",borderRadius:"var(--r-md)",padding:"12px 16px",width:"100%",display:"flex",alignItems:"center",gap:10}}>
            <Zap size={18} style={{color:"var(--lime-dk)",flexShrink:0}}/>
            <div>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:20,color:"var(--g-800)",lineHeight:1}}>{(profile?.ecoPoints||0).toLocaleString()}</div>
              <div style={{fontSize:12,color:"var(--text-muted)"}}>Eco Points</div>
            </div>
          </div>
          <div style={{fontSize:12,color:"var(--text-soft)"}}>
            Member since {profile?.createdAt?new Date(profile.createdAt).toLocaleDateString("en-KE",{year:"numeric",month:"long"}):"—"}
          </div>
        </div>

        {/* Right form */}
        <form onSubmit={save} style={{display:"grid",gap:20}}>
          <div className="card" style={{display:"grid",gap:18}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <User size={17} style={{color:"var(--g-600)"}}/>
              <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16}}>Personal Information</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="field">
                <label className="field-label">Full Name</label>
                <input className="input" value={form.name} placeholder="Your full name" onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="input" value={profile?.email||""} disabled style={{background:"var(--bg-subtle)",cursor:"not-allowed"}}/>
              </div>
              <div className="field">
                <label className="field-label">Phone</label>
                <div style={{position:"relative"}}>
                  <input className="input" value={form.phone} placeholder="+254 7XX XXX XXX" style={{paddingLeft:42}} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
                  <Phone size={15} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--text-soft)"}}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Role</label>
                <input className="input" value={profile?.role||"student"} disabled style={{background:"var(--bg-subtle)",cursor:"not-allowed",textTransform:"capitalize"}}/>
              </div>
            </div>
            <div className="field">
              <label className="field-label">Bio</label>
              <div style={{position:"relative"}}>
                <textarea className="input" value={form.bio} placeholder="Tell us about your recycling journey…" rows={3} maxLength={300} style={{resize:"vertical",paddingRight:36}} onChange={e=>setForm(p=>({...p,bio:e.target.value}))}/>
                <FileText size={14} style={{position:"absolute",right:12,top:12,color:"var(--text-soft)"}}/>
              </div>
              <small style={{color:"var(--text-soft)",textAlign:"right"}}>{form.bio.length}/300</small>
            </div>
          </div>

          <div className="card" style={{display:"grid",gap:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Camera size={17} style={{color:"var(--g-600)"}}/>
              <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:16}}>Profile Photo</span>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <button type="button" className="btn btn-outline btn-sm" onClick={()=>fileRef.current?.click()} style={{gap:8}}>
                <Camera size={14}/> Upload Photo
              </button>
              <span style={{color:"var(--text-muted)",fontSize:13}}>JPEG or PNG, max 2 MB</span>
            </div>
            <div className="field">
              <label className="field-label">Or paste image URL</label>
              <input className="input" value={form.avatarUrl.startsWith("data:")?"":(form.avatarUrl||"")} placeholder="https://example.com/photo.jpg" onChange={e=>{setForm(p=>({...p,avatarUrl:e.target.value}));setPreview(e.target.value||null);}}/>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving} style={{justifyContent:"center",padding:13}}>
            {saving?<><span className="spinner spinner-white"/> Saving…</>:<><Save size={16}/> Save Changes</>}
          </button>
        </form>
      </div>
    </>
  );
}
