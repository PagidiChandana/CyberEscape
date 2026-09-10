import {useEffect,useState} from 'react'; import {useParams,Link} from 'react-router-dom'; import api from '../services/api'; import {Award,Heart,ChevronRight} from 'lucide-react';
function hearts(n,total){return Array.from({length:total},(_,i)=>(<Heart key={i} size={16} fill={i<n?'currentColor':'none'} className={i<n?'life on':'life'}/>))}
export default function Attempt(){
  const {id}=useParams();
  const [a,setA]=useState(null),[error,setError]=useState('');
  useEffect(()=>{api.get(`/game/sessions/${id}`).then(r=>setA(r.data)).catch(e=>setError(e.response?.data?.message||'Could not open this attempt.'))},[id]);
  if(error) return <div><div className="error">{error}</div><Link to="/analytics"><button>Back to analytics</button></Link></div>;
  if(!a) return <div className="center">Loading attempt…</div>;
  return (
    <div className="result">
      <span className="eyebrow">MISSION 0{a.level} — PREVIOUS ATTEMPT • FINAL CYBERSECURITY SCORE</span>
      <h1>{a.score} <small>/ {a.maxScore} POINTS</small></h1>
      <div className="debrief"><span>{a.correctCount}/{a.total} correct</span><span>{a.accuracy}% accuracy</span><span>{Math.floor((a.durationSeconds||0)/60)}m {(a.durationSeconds||0)%60}s</span><span>{a.status}</span></div>
      <div className="lives-row">Lives left: {hearts(a.livesLeft,a.livesStart||3)}</div>
      <div className="grade"><Award size={20}/> Final grade: <b>{a.grade}</b></div>
      <h2>Answer Intelligence</h2>
      <div className="review">{a.answers.map((x,i)=>(
        <div className={x.correct?'correct':'wrong'} key={String(x.questionId)+i}>
          <b>{i+1}. {x.question}</b>
          <span>{x.selectedAnswer===undefined||x.selectedAnswer===null?'○ Skipped (time up)':x.correct?`✓ Correct (+${x.points})`:'✕ Review'}</span>
          {x.scenario&&<p className="scenario">{x.scenario}</p>}
          <p><b>Explanation:</b> {x.explanation}</p>
        </div>))}
      </div>
      <Link to="/analytics"><button>Back to analytics <ChevronRight size={15}/></button></Link>
    </div>
  );
}
