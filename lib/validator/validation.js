const Joi = require('@hapi/joi');

const newAttribute = Joi.object({
    name : Joi.string().required(),
    value : Joi.string().required(),
    product_id : Joi.number().required()
});

const newCategory = Joi.object({
    name : Joi.string().required()
});

const newCustomer = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().email().required(),
    phone : Joi.number().required(),
    password : Joi.required(),
});

const newOrder = Joi.object({
    product_id : Joi.number().required(),
    quantity : Joi.number().integer().min(1).required()
});

const newProduct = Joi.object({
    name : Joi.string().required(),
    details : Joi.string().required(),
    price : Joi.number().required(),
    category_id : Joi.number().required(),
});

const newReview = Joi.object({
    review : Joi.string().required(),
    product_id : Joi.number().required()
});

const loginCustomer = Joi.object({
    email : Joi.string().required(),
    password : Joi.required(),
});

const address = Joi.object({
    address : Joi.string().required()
});

const creditCard = Joi.object({
    creditCard : Joi.number().required()
});


module.exports = {
    newAttribute, newCategory, newCustomer, newOrder, newProduct, newReview,
    loginCustomer, address, creditCard
}