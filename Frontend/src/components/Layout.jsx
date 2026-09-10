import {NavLink,useNavigate} from 'react-router-dom'; import {Shield,LogOut,BarChart3,Trophy,Home} from 'lucide-react'; import {useAuth} from '../context/AuthContext';
export default function Layout({children}){
  const {user,logout}=useAuth();const nav=useNavigate();
  const initial=(user?.name||user?.email||'?').trim().charAt(0).toUpperCase();
  return <>
    <header>
      <NavLink className="brand" to="/"><span className="brand-mark"><Shield/></span><span>CyberEscape<small>SECURITY OPS TRAINING</small></span></NavLink>
      <nav>
        <NavLink to="/" end className={({isActive})=>isActive?'active':''}><Home/><span className="lbl">Missions</span></NavLink>
        <NavLink to="/analytics" className={({isActive})=>isActive?'active':''}><BarChart3/><span className="lbl">Analytics</span></NavLink>
        <NavLink to="/leaderboard" className={({isActive})=>isActive?'active':''}><Trophy/><span className="lbl">Leaderboard</span></NavLink>
        {user&&<span className="user-chip"><span className="avatar">{initial}</span><span className="who">{user.name}</span><span className="score">{user.totalScore??0} pts</span></span>}
        <button className="ghost" onClick={()=>{logout();nav('/login')}}><LogOut/><span className="lbl">Logout</span></button>
      </nav>
    </header>
    <main>{children}</main>
    <footer><span className="foot"><Shield size={13}/> CyberEscape <span className="dot">•</span> Digital Safety Escape Room <span className="dot">•</span> Phishing • Passwords • Fake QR • Scam Messages</span></footer>
  </>;
}
