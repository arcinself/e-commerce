const express = require('express');
const router = express.Router();
const {to} = require('await-to-js');
const mysql= require('./../lib/datacenter/mysql/connection');
const logger = require('../lib/logger/winston');
const joiProductValue = require('../lib/validator/validation');
const joiReviewValue = require('../lib/validator/validation');

router.get('/', async function(req, res, next) {
    try{
        let err, result;

        [err, result] = await to(mysql.productModel.findAll())

        if(err){
            throw new Error('Unable to fetch products.');
        }

        if(!result[0]){
            throw new Error('No products to display.');
        }

        return res.json({
            data : result,
            err : null
        });
    }
    catch(err){

        logger.error(err.message);

        return res.json({
            data : null,
            err : {
                message: err.message
            }
        });
    }
});


router.get('/:id', async function(req, res, next) {
    try{
        let err, result;

        [err, result] = await to(mysql.productModel.findAll({
            where : {
                id : req.params.id
            }
        }));

        if(err){
            throw new Error('Unable to fetch products.');
        }

        if(!result[0]){
            throw new Error('No product exists with this ID.');
        }

        return res.json({
            data : result,
            err : null
        });
    }
    catch(err){

        logger.error(err.message);

        return res.json({
            data: null,
            err: {
                message: err.message
            }
        });
    }
});


router.get('/inCategory/:category_id', async function(req, res, next) {
    try{
        let err, result;

        [err, result] = await to(mysql.productModel.findAll({

            where: {
                category_id : req.params.category_id
            }
        }));

        if (err) {
            throw new Error('Unable to fetch products with this category ID.')
        }

        if (!result[0]) {
            throw new Error('No category found for this product ID.')
        }

        return res.json({
            data : {
                product_id : result
            },
            err : null
        });
    }
    catch(err){

        logger.error(err.message);

        return res.json({
            data: null,
            err: {
                message: err.message
            }
        });
    }
});


router.post('/', async function(req, res, next) {
    try {
        let err, result;

        [err, result] = await to(joiProductValue.newProduct.validateAsync(req.body));

        if (err) {
            throw new Error(err.message)
        }

        [err, result] = await to(mysql.productModel.findAll());

        const newId = result.length + 1;

        [err, result] = await to(mysql.productModel.create({
            id: newId,
            name: req.body.name,
            details : req.body.details,
            price : req.body.price,
            category_id : req.body.category_id
        }));

        if (err) {
            throw new Error('Error adding product.');
        }

        return res.json({
            data: {
                message: 'Product added successfully.'
            },
            err: null
        });
    }
    catch (err) {

        logger.error(err.message);

        return res.json({
            data: null,
            err: {
                message: err.message
            }
        });
    }
});


router.post('/:product_id/reviews',async function(req,res){
    try{
        let err,result;

        [err, result] = await to(joiReviewValue.newReview.validateAsync(req.body));

        if (err) {
            throw new Error(err.message)
        }

        [err, result] = await to(mysql.productModel.findAll({
            where : {
                id : req.params.product_id
            }
        }));

        if (!result[0]) {
            throw new Error('No product exists with this ID.')
        }

        [err, result] = await to(mysql.reviewModel.findAll());

        const newId = result.length + 1;

        [err, result] = await to(mysql.reviewModel.create({
            id : newId,
            review : req.body.review,
            product_id : req.params.product_id
        }));

        if (err) {
            throw new Error('Unable to add review for this product.')
        }

        return res.json({
            data : {
                message: 'Review added successfully.'
            },
            err : null
        });
    }
    catch(err){

        logger.error(err.message);

        return res.json({
            data: null,
            err: {
                message: err.message
            }
        });
    }
});


router.get('/:product_id/reviews',async function(req,res){
    try{
        let err,result;

        [err, result] = await to(mysql.productModel.findAll({
            where : {
                id : req.params.product_id
            }
        }));

        if (!result[0]) {
            throw new Error('No product exists with this ID.')
        }

        [err, result] = await to(mysql.reviewModel.findAll({
            where : {
                product_id : req.params.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to get review for this product.')
        }

        if (!result[0]) {
            throw new Error('No review exists for this product.')
        }

        return res.json({
            data : result,
            err : null
        });
    }
    catch(err){

        logger.error(err.message);

        return res.json({
            data: null,
            err: {
                message: err.message
            }
        });
    }
});


module.exports = router;


