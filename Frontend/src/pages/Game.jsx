import {useEffect,useState} from 'react'; import {useNavigate,useParams} from 'react-router-dom'; import api from '../services/api'; import {Clock,ChevronRight,ChevronLeft,Heart,Info,Award,Fish,KeyRound,QrCode,Siren,ShieldAlert} from 'lucide-react';

const LIVES_START = 3;
const TIME_PER_Q = 45;
const CHALLENGE_LABEL = { phishing: 'Phishing', password: 'Password', qr: 'Fake QR', scam: 'Scam Message', other: 'Security' };
const CHALLENGE_ICON = { phishing: Fish, password: KeyRound, qr: QrCode, scam: Siren, other: ShieldAlert };

function shuffle(a){const arr=[...a];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function buildDeck(list){
  // fresh random question order AND option order on every attempt.
  // _opt = display-order options, _map[displayIdx] = originalIdx (sent to server).
  return shuffle(list).map(q=>{
    const optOrder=shuffle(q.options.map((_,k)=>k));
    return {...q,_opt:optOrder.map(k=>q.options[k]),_map:optOrder};
  });
}

function hearts(n, total){
  return Array.from({length: total}, (_, i) => (
    <Heart key={i} size={16} fill={i < n ? 'currentColor' : 'none'} className={i < n ? 'life on' : 'life'} />
  ));
}

export default function Game(){
  const {level}=useParams(),nav=useNavigate();
  const [qs,setQs]=useState([]),[answers,setAnswers]=useState({}),[session,setSession]=useState(null);
  const [qtime,setQtime]=useState({}),[result,setResult]=useState(null),[busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true),[error,setError]=useState(''),[step,setStep]=useState(0);

  useEffect(()=>{
    setLoading(true);setError('');
    Promise.all([api.get(`/game/questions/${level}`),api.post('/game/sessions',{level:Number(level)})])
      .then(([q,s])=>{const deck=buildDeck(q.data.questions||[]);setQs(deck);setSession(s.data.session);setAnswers({});setStep(0);setQtime(Object.fromEntries(deck.map(d=>[String(d._id),TIME_PER_Q])))})
      .catch(e=>setError(e.response?.data?.message||'Could not load mission. Check backend connection.'))
      .finally(()=>setLoading(false));
  },[level]);

  useEffect(()=>{
    if(result||!qs.length) return;
    const t=setInterval(()=>{setQtime(prev=>{
      const nx={...prev};let changed=false;
      for(const q of qs){const id=String(q._id);if(answers[id]===undefined&&(nx[id]??TIME_PER_Q)>0){nx[id]=(nx[id]??TIME_PER_Q)-1;changed=true}}
      return changed?nx:prev;
    })},1000);
    return()=>clearInterval(t);
  },[result,qs,answers]);

  const answered=Object.keys(answers).length, total=qs.length;
  const progress=total?Math.round((answered/total)*100):0;

  const pick=(qid,j)=>{const id=String(qid);if((qtime[id]??TIME_PER_Q)<=0&&answers[id]===undefined)return;setAnswers(a=>({...a,[id]:j}))};

  const submit=async()=>{
    if(!session){setError('No active session. Reload the mission.');return}
    if(answered<total&&!confirm('Some questions are unanswered. Submit anyway?'))return;
    setBusy(true);setError('');
    try{
      const payload=Object.entries(answers).map(([questionId,disp])=>{
        const quest=qs.find(x=>String(x._id)===String(questionId));
        const orig=quest&&quest._map?quest._map[Number(disp)]:Number(disp);
        return {questionId,selectedAnswer:orig};
      });
      const r=await api.post(`/game/sessions/${session._id}/submit`,{answers:payload});
      setResult(r.data);
    }catch(e){setError(e.response?.data?.message||'Submit failed. Try again.')}
    finally{setBusy(false)}
  };

  if(loading) return <div className="center">Loading mission…</div>;

  if(result) return (
    <div className="result">
      <span className="eyebrow">MISSION COMPLETE — FINAL CYBERSECURITY SCORE</span>
      <h1>{result.score} <small>/ {result.maxScore} POINTS</small></h1>
      <div className="debrief"><span>{result.correctCount}/{result.total} correct</span><span>{result.accuracy}% accuracy</span><span>{Math.floor(result.durationSeconds/60)}m {result.durationSeconds%60}s</span></div>
      <div className="lives-row">Lives left: {hearts(result.livesLeft, result.livesStart||LIVES_START)}</div>
      <div className="grade"><Award size={20}/> Final grade: <b>{result.grade}</b></div>
      {result.badgeEarned&&<div className="badge-earned">Badge earned: {result.badgeEarned}</div>}
      <h2>Answer Intelligence</h2>
      <div className="review">{result.answers.map((a,i)=>(
        <div className={a.correct?'correct':'wrong'} key={a.questionId}>
          <b>{i+1}. {a.question}</b><span>{a.correct?'✓ Correct (+'+a.points+')':'✕ Review'}</span>
          <p>{a.explanation}</p>
        </div>))}
      </div>
      <button onClick={()=>nav('/')}>Back to missions</button>
    </div>
  );

  return (
    <div>
      <div className="gamebar">
        <div><span className="eyebrow">MISSION 0{level}</span><h2>Threat Assessment</h2></div>
        <div className="lives">{hearts(LIVES_START, LIVES_START)}<small>{LIVES_START} lives</small></div>
        <div className="timer"><Clock/> 0:45 / question</div>
      </div>
      <div className="progress"><i style={{width:`${progress}%`}}/><span>{answered}/{total} answered • {progress}%</span></div>
      {error&&<div className="error">{error}</div>}
      {!qs.length&&!error&&<p className="muted">No questions found for this level.</p>}
      {total>0&&(()=>{
        const safe=Math.min(step,total-1);
        const q=qs[safe];
        const id=String(q._id);
        const left=qtime[id]??TIME_PER_Q;
        const locked=left<=0&&answers[id]===undefined;
        const Icon=CHALLENGE_ICON[q.challenge]||ShieldAlert;
        return (<div key={q._id}>
          <div className="dots">{qs.map((d,i)=>{const did=String(d._id);const st=answers[did]!==undefined?'done':((qtime[did]??TIME_PER_Q)<=0?'locked':'');return <button key={did} type="button" className={'dot '+st+(i===safe?' current':'')} onClick={()=>setStep(i)} title={'Question '+(i+1)}>{i+1}</button>})}</div>
        <article className="question">
          <div className="qtop"><span className="q-challenge"><Icon size={15}/> {CHALLENGE_LABEL[q.challenge]||q.topic}</span><small>Question {safe+1} of {total} • {q.topic} • {q.points} pts</small><span className={'qtime'+(left<=10?' low':'')}><Clock size={12}/> 0:{String(Math.max(0,left)).padStart(2,'0')}</span></div>
          <h2>{q.question}</h2>
          <p className="scenario">{q.scenario}</p>
          <div className="options">{(q._opt||q.options).map((o,j)=>(
            <button type="button" disabled={locked} className={answers[id]===j?'selected':''} onClick={()=>pick(id,j)} key={j}>
              <b>{String.fromCharCode(65+j)}</b>{o}
            </button>))}
          </div>
          {locked&&<div className="locked">Time's up — this question is locked and counts as skipped.</div>}
          {q.explanation&&<div className="insight"><Info size={15}/> <span><b>Why it matters:</b> {q.explanation}{answers[id]===undefined&&!locked?' Pick an answer — correctness is revealed at submit.':''}</span></div>}
        </article>
        <div className="stepnav">
          <button type="button" className="ghost-btn" disabled={safe===0} onClick={()=>setStep(safe-1)}><ChevronLeft size={16}/> Previous</button>
          {safe<total-1
            ?<button type="button" className="ghost-btn" onClick={()=>setStep(safe+1)}>Next <ChevronRight size={16}/></button>
            :<button type="button" className="submit inline" disabled={busy||!session} onClick={submit}>{busy?'Evaluating…':'Submit mission'} <ChevronRight size={16}/></button>}
        </div>
        </div>);
      })()}
    </div>
  );
}
