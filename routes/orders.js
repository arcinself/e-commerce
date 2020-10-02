const express = require('express');
const router = express.Router();
const {to} = require('await-to-js');
const mysql= require('./../lib/datacenter/mysql/connection');
const logger = require('../lib/logger/winston');
const { checkToken } = require('../middleware/index')
const joiOrderValue = require('../lib/validator/validation');

router.get('/:order_id', checkToken, async function(req, res, next) {
    try{
        let err, result;

        [err, result] = await to(mysql.orderModel.findAll({
            where : {
                id : req.params['order_id']
            }
        }));

        if(err){
            throw new Error('Unable to fetch order with this order ID.');
        }

        if(!result[0]){
            throw new Error('No order exists with this order ID.');
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


router.post('/', checkToken, async function(req, res, next) {
    try {
        let err, result;

        [err, result] = await to(joiOrderValue.newOrder.validateAsync(req.body));

        if (err) {
            throw new Error(err.message)
        }

        [err, result] = await to(mysql.orderModel.findAll());

        const newId = result.length + 1;

        [err, result] = await to(mysql.productModel.findAll({
            where: {
                id: req.body.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to fetch product.')
        }
        if (!result[0]) {
            throw new Error('No product exists with this product ID.');
        }
        
        [err, result] = await to(mysql.customerModel.findAll({
            where: {
                id: req.body.customer_id
            }
        }));

        if (err) {
            throw new Error('Unable to fetch customer.')
        }

        if (!result[0]) {
            throw new Error('No customer exists with this customer ID.');
        }

        if (!result[0]['dataValues']['address']) {
            throw new Error('Order cannot be placed due to missing address.')
        }

        if (!result[0]['dataValues']['creditCardNumber']) {
            throw new Error('Order cannot be placed due to missing credit card number.')
        }

        [err, result] = await to(mysql.orderModel.create({
            id: newId,
            customer_id : req.body.customer_id,
            product_id : req.body.product_id,
            quantity : req.body.quantity
        }));

        if (err) {
            throw new Error('Error placing order.');
        }

        return res.json({
            data: {
                message : 'Order placed successfully.'
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
