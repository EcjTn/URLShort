async function recaptchaCheck(recaptchaResponse) {
    try{
        if(!recaptchaCheck) return "Recaptcha response is required";

        const recaptchaKey = process.env.RECAPTCHA_SECRET;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaKey}&response=${recaptchaResponse}`;

        const responose = await fetch(url, { method: 'POST' });
        const data = await responose.json();

        return data
    }
    catch(e){
        return "Error: " + e.message;
    }
}


export default recaptchaCheck;