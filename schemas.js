const Joi = require('joi');
module.exports.bootcampSchema = Joi.object({
    bootcamp: Joi.object({
        title: Joi.string().required(),
        topic: Joi.string().required(),
        difficulty: Joi.string().required(),
        description: Joi.string().required(),
        points: Joi.string().required(),
        complexity: Joi.string().required(),
        tags: Joi.string().required(),
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(10),
        body: Joi.string().required()
    }).required()
})