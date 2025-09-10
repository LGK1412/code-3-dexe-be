const Joi = require('joi')

exports.signupSchema = Joi.object({
    email: Joi.string().min(6).max(60).required().email({
        tlds: { allow: ['com', 'net', 'vn'] }
    }),
    password: Joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,30}$/)
})

exports.signinSchema = Joi.object({
    email: Joi.string().min(6).max(60).required().email({
        tlds: { allow: ['com', 'net', 'vn'] }
    }),
    password: Joi.string().required().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{6,30}$/)
})

exports.acceptCodeSchema = Joi.object({
    email: Joi.string().min(6).max(60).required().email({
        tlds: { allow: ['com', 'net', 'vn'] }
    }),
    providedCode: Joi.number().required()
})

exports.acceptLogoutSchema = Joi.object({
    email: Joi.string().min(6).max(60).required().email({
        tlds: { allow: ['com', 'net', 'vn'] }
    }),
    loginToken: Joi.string().required()
})

exports.acceptChangePassCodeSchema = Joi.object({
    email: Joi.string().min(6).max(60).required(), // chỉ check độ dài
    providedCode: Joi.number().required(),         // vẫn giữ code là number
    newPassword: Joi.string().min(6).max(30).required() // chỉ check độ dài
});