import {useEffect,useState} from 'react'; import {Link} from 'react-router-dom'; import api from '../services/api'; import {LockKeyhole,Target,Star,ShieldCheck,Heart,Fish,QrCode,Siren,Database,ShieldAlert} from 'lucide-react';
const NAMES=['Phishing Trap','Digital Defense','QR & Message Scams','Data Protection','Incident Commander'];
const MISSION_ICON=[Fish,QrCode,Siren,Database,ShieldAlert];
const CHALLENGE_LABEL={phishing:'Phishing',password:'Passwords',qr:'Fake QR',scam:'Scam Msgs',other:'Security'};
const CHALLENGE_ICON={phishing:Fish,password:ShieldCheck,qr:QrCode,scam:Siren,other:ShieldAlert};
export default function Dashboard(){
  const [levels,setLevels]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);
  useEffect(()=>{
    api.get('/game/levels')
      .then(r=>setLevels(r.data.levels||[]))
      .catch(()=>setError('Could not load missions. Is the backend running on '+(import.meta.env.VITE_API_URL||'http://localhost:5000/api')+'?'))
      .finally(()=>setLoading(false));
  },[]);
  return <>
    <section className="hero">
      <div>
        <span className="eyebrow">DIGITAL SAFETY ESCAPE ROOM</span>
        <h1>Think fast. Stay safe.<br/><em>Escape the threat.</em></h1>
        <p>Spot phishing, harden passwords, unmask fake QR codes and scam messages — 3 lives per mission.</p>
      </div>
      <div className="hero-badge"><ShieldCheck size={56}/></div>
    </section>
    {error&&<div className="error">{error}</div>}
    <h2>Mission Control</h2>
    <div className="grid">{[1,2,3,4,5].map(n=>{
      const l=levels.find(x=>x._id===n);
      const tags=l?.challenges?.map(c=>CHALLENGE_LABEL[c]||c).join(' • ');
      const sub=loading?'Loading…':l?`${l.questions} challenges • ${tags||l.topics?.join(' • ')}`:'No challenges yet';
      const MIcon=MISSION_ICON[n-1];
      return <Link className="level" to={`/game/${n}`} key={n}><span className="mission-icon"><MIcon size={22}/></span><div className="level-num">0{n}</div><div><h3>{NAMES[n-1]}</h3><p>{sub}</p>{!loading&&l&&<p className="tagrow">{(l.challenges||[]).map(c=>{const C=CHALLENGE_ICON[c]||ShieldAlert;return <span key={c} className="tag"><C size={11}/> {CHALLENGE_LABEL[c]||c}</span>})}</p>}</div><Target/></Link>;
    })}</div>
    <div className="stats">
      <div><Star/> <b>4</b><span>challenge types: phishing • passwords • fake QR • scams</span></div>
      <div><Heart/> <b>3</b><span>lives per mission + instant explanations</span></div>
      <div><LockKeyhole/><b>5</b><span>security missions with final grade & badges</span></div>
    </div>
  </>;
}
