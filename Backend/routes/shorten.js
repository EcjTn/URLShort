import { Router } from "express";

import { addUrl } from "../db/db-queries.js";
import { validateUrl } from "../utils/validator.js";

const router = Router();

router.post('/shorten', async(req, res, next) => {
    try{
        const validateBody = await validateUrl(req.body);
        if(!validateBody) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const shortenedUrl = validateBody.shorten_url.trim().replace(/\s+/g, "-").toLowerCase();
        const ogUrl = validateBody.url.trim().replace(/\s+/g, "-").toLowerCase();
        const addToDb = await addUrl(shortenedUrl, ogUrl);

        
        res.send(addToDb.rows[0]);
    }catch(e){
        console.error(e.message);
        return res.status(400).json({ error: 'Something went wrong.' });
    }
})


export default router;