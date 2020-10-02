const express = require('express');
const router = express.Router();
const {to} = require('await-to-js');
const mysql= require('./../lib/datacenter/mysql/connection');
const logger = require('../lib/logger/winston');
const joiAttributeValue = require('../lib/validator/validation');


router.get('/', async function(req, res, next) {
    try{
        let err, result;

        [err, result] = await to(mysql.attributeModel.findAll())

        if(err){
            throw new Error('Unable to fetch attributes.');
        }

        if(!result[0]){
            throw new Error('No attributes to display.');
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


router.get('/:attribute_id', async function(req, res, next) {
    try{
        let err, result;

        [err, result] = await to(mysql.attributeModel.findAll({
            where : {
                id : req.params['attribute_id']
            }
        }));

        if(err){
            throw new Error('Unable to fetch attributes.');
        }

        if(!result[0]){
            throw new Error('No attribute exists with this ID.');
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


router.get('/inProduct/:product_id', async function(req, res, next) {
    try{
        let err, result;

        [err, result] = await to(mysql.attributeModel.findAll({
            where: {
                product_id : req.params.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to fetch attributes with this product ID.')
        }

        if (!result[0]) {
            throw new Error('No attribute found for this product ID.')
        }

        return res.json({
            data : {
                attribute_id : result
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

        [err, result] = await to(joiAttributeValue.newAttribute.validateAsync(req.body));

        if (err) {
            throw new Error(err.message)
        }

        [err, result] = await to(mysql.attributeModel.findAll());

        const newId = result.length + 1;

        [err, result] = await to(mysql.attributeModel.create({
            id: newId,
            name: req.body.name,
            value : req.body.value,
            product_id : req.body.product_id
        }));

        if (err) {
            throw new Error('Error adding attribute.');
        }

        return res.json({
            data: {
                message: 'Attribute added successfully.'
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

module.exports = router;
