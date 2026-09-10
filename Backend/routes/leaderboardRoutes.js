import {Router} from 'express'; import User from '../models/User.js'; import {protect} from '../middleware/authMiddleware.js'; const r=Router();
r.get('/',protect,async(req,res,next)=>{try{const users=await User.find().sort({totalScore:-1,createdAt:1}).limit(50).select('name totalScore gamesPlayed badges');res.json({leaderboard:users})}catch(e){next(e)}}); export default r;
