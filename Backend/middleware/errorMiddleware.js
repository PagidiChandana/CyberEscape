export const notFound=(req,res)=>{
  const hint=/^\/(auth|game|analytics|leaderboard)(\/|$)/.test(req.originalUrl)
    ? ' Hint: API routes live under /api — set VITE_API_URL to https://<your-render-app>.onrender.com/api'
    : '';
  res.status(404).json({message:`Route not found: ${req.originalUrl}.${hint}`});
};
export const errorHandler=(err,req,res,next)=>{ console.error(err); if(err?.type==='entity.parse.failed'||err instanceof SyntaxError) return res.status(400).json({message:'Invalid JSON body'}); if(err?.message?.startsWith('CORS blocked')) return res.status(403).json({message:err.message}); if(err?.name==='CastError') return res.status(400).json({message:'Invalid id format'}); if(err?.name==='ValidationError') return res.status(400).json({message:err.message}); if(err?.code===11000) return res.status(409).json({message:'Duplicate value'}); res.status(err.status||500).json({message:err.message||'Server error'}); };
