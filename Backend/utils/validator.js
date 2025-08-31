import Joi from "joi";


const urlSchema = Joi.object({
    url: Joi.string().uri().required(),
    shorten_url: Joi.string().required(),
    recaptchaResponse: Joi.string().required()
})


function validateUrl(data) {
    return urlSchema.validateAsync(data);
}


export { validateUrl };