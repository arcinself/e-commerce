const express = require('express');
const router = express.Router();
const {to} = require('await-to-js');
const mysql= require('./../lib/datacenter/mysql/connection');
const logger = require('../lib/logger/winston');
const Sequelize = require('sequelize');
const { checkToken } = require('../middleware/index')
const joiCartValue = require('../lib/validator/validation');


router.get('/', checkToken, async function (req,res){
    try{
        let err,result;

        [err, result] = await to(mysql.cartItemModel.findAll({
            where : {
                customer_id : req.body.customer_id
            }
        }));

        if(err){
            throw new Error('Unable to fetch cart.');
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


router.post('/addProduct', checkToken, async function (req,res){
    try {
        let err, result;

        [err, result] = await to(joiCartValue.newCart.validateAsync(req.body));

        if (err) {
            throw new Error(err.message);
        }

        [err, result] = await to(mysql.cartItemModel.findAll());

        const newId = result.length + 1;

        [err, result] = await to(mysql.productModel.findAll({
            where : {
                id : req.body.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to find product with this product ID.')
        }

        if (!result[0]) {
            throw new Error('No product exists with this product ID.')
        }

        [err, result] = await to(mysql.cartItemModel.findAll({
            where: {
                customer_id : req.body.customer_id,
                product_id : req.body.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to add product to the cart.')
        }

        if (result[0]) {

            [err, result] = await to(mysql.cartItemModel.update({
                quantity: Sequelize.literal(`quantity+${req.body.quantity}`)
            }, {
                where: {
                    customer_id: req.body.customer_id,
                    product_id: req.body.product_id
                }
            }));

            if (err) {
                throw new Error('Unable to add product to the cart.')
            }
        }

        else {
            [err, result] = await to(mysql.cartItemModel.create({
                id : newId,
                customer_id : req.body.customer_id,
                product_id : req.body.product_id,
                quantity : req.body.quantity
            }));

            if (err) {
                throw new Error('Unable to add product to the cart.');
            }
        }

        return res.json({
            data: {
                message: 'Product successfully added to cart.'
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


router.put('/quantity', checkToken, async function (req,res){
    try {
        let err, result;

        [err, result] = await to(mysql.productModel.findAll({
            where : {
                id : req.body.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to find product with this product ID.')
        }

        if (!result[0]) {
            throw new Error('No product exists with this product ID.')
        }

        [err, result] = await to(mysql.cartItemModel.findAll({
            where: {
                customer_id : req.body.customer_id,
                product_id : req.body.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to update product quantity in the cart.')
        }

        if (!result[0]) {
            throw new Error('Cart does not exist and hence product quantity cannot be updated.')
        }

        [err, result] = await to(mysql.cartItemModel.update({
            quantity: req.body.quantity,
        }, {
            where : {
                customer_id : req.body.customer_id,
                product_id : req.body.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to update product quantity in the cart.');
        }

        return res.json({
            data: {
                message: 'Product quantity updated successfully.'
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


router.delete('/removeProduct', checkToken, async function (req,res){
    try {
        let err, result;

        [err, result] = await to(mysql.productModel.findAll({
            where : {
                id : req.body.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to find product with this product ID.')
        }

        if (!result[0]) {
            throw new Error('No product exists with this product ID.')
        }

        [err, result] = await to(mysql.cartItemModel.findAll({
            where: {
                customer_id : req.body.customer_id,
                product_id : req.body.product_id
            }
        }));

        if (err) {
            throw new Error('Unable to remove product from the cart.')
        }

        if (!result[0]) {
                throw new Error('First add product to cart.')
        }

        [err, result] = await to(mysql.cartItemModel.destroy({
            where : {
                customer_id: req.body.customer_id,
                product_id: req.body.product_id,
            }
        }));

        if (err) {
            throw new Error('Unable to remove product from the cart.');
        }

        return res.json({
            data: {
                message: 'Product successfully removed from the cart.'
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


router.get('/totalAmount', checkToken, async function (req,res){
    try {
        let err, result;

        [err, result] = await to(mysql.cartItemModel.findAll({
            where: {
                customer_id: req.body.customer_id
            }
        }));
console.log(result)
        if (err) {
            throw new Error('Unable to find Customer ID.')
        }

        let totalAmount = 0;

        for (const item of result) {

            [err, result] = await to(mysql.productModel.findAll({
                where: {
                    id : item['dataValues']['product_id']
                }
            }));

            if (err) {
                throw new Error('Unable to find product.')
            }

            totalAmount += result[0]['dataValues']['price'] * item['dataValues']['quantity']
        }

        return res.json({
            data: {
                message : `Total Amount = INR ${totalAmount}`
            },
            err: null
        });
    }
    catch (err) {

        logger.error(err.message)

        return res.json({
            data : null,
            error : {
                message: err.message
            }
        });
    }
});


module.exports = router;
