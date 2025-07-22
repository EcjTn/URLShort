import recaptchaCheck from "../utils/recaptcha-check.js"


async function recaptchaRoute(req, res, next){
    try{
        const recaptchaResponse = req.body.recaptchaResponse;
        const recaptchaResult = await recaptchaCheck(recaptchaResponse)

        if(!recaptchaCheck) return res.status(400).json({ error: "Recaptcha response is required"})

        if(!recaptchaResult.success) {
            return res.status(400).json({ error: "Recaptcha verification failed" })
        }

        //if recaptcha.success is true or passed all the checks.
        next()
    }
    catch(e){
        console.log(e.message)
        return res.status(400).json({ error: "Something went wrong." })
    }
}


export default recaptchaRoute;