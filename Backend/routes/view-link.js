import { Router } from 'express';
import { getUrlByShort, addClick, showLeaderboard } from '../db/db-queries.js';


const router = Router();





router.get('/leaderboard', async(req, res, next) => {
    const leaderboard = await showLeaderboard();
    res.json(leaderboard.rows);
})















router.get('/:short', async(req, res) => {
    try{
        const shortLink = req.params.short;
        const result = await getUrlByShort(shortLink);
        const originalUrl = result.rows[0]['og_link'];

        if (!result.rows[0]['og_link']) {
            return res.status(404).json({ error: 'Short link not found' });
        }

        res.redirect(originalUrl);
        await addClick(shortLink); // Increment click count after redirect
    }
    catch(e) {
        console.error(e.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})






























export default router;