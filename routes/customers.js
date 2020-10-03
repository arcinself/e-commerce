require('dotenv').config();
const express = require('express');
const router = express.Router();
const {to} = require('await-to-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql= require('./../lib/datacenter/mysql/connection');
const logger = require('../lib/logger/winston');
const { checkToken } = require('../middleware/index')
const joiCustomerValue = require('../lib/validator/validation');

router.post('/', async function(req, res, next) {
    try {
        let err, result, encryptedPassword;

        [err, result] = await to(joiCustomerValue.newCustomer.validateAsync(req.body));

        if (err) {
            throw new Error(err.message)
        }

        [err, encryptedPassword] = await to(bcrypt.hash(req.body.password, 12));

        if (err) {
            throw new Error('Error while generating password hash.');
        }

        [err, result] = await to(mysql.customerModel.findAll());

        const newId = result.length + 1;

        [err, result] = await to(mysql.customerModel.findAll({
            where: {
                email: req.body.email
            }
        }));

        if (result[0]) {
            throw new Error('A customer with this email ID already exists.');
        }

        [err, result] = await to(mysql.customerModel.create({
            id: newId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            creditCardNumber: req.body.creditCardNumber,
            encryptedPassword: encryptedPassword
        }));

        if (err) {
            throw new Error('Error signing-up customer.');
        }
        return res.json({
            data: {
                message: 'Customer signed-up successfully.'
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


router.post('/login', async function(req, res, next) {
    try {
        let err, result;

        [err, result] = await to(joiCustomerValue.loginCustomer.validateAsync(req.body));

        if (err) {
            throw new Error(err.message)
        }

        [err, result] = await to(mysql.customerModel.findAll({
            where: {
                email: req.body.email
            }
        }));

        if (!result[0]) {
            throw new Error('No customer with this email ID exists.');
        }

        let customer = result[0]['dataValues'];

        [err, result] = await to(bcrypt.compare(req.body.password, customer.encryptedPassword));
        if (err) {
            throw new Error('Error logging-in.');
        }
        if (result) {

            customer = {
                email : req.body.email,
                encryptedPassword : customer.encryptedPassword
            }

            const token = jwt.sign(customer, process.env.mySalt, {expiresIn: '50m'});

            return res.json({
                data : {
                    message : 'Customer logged-in successfully.',
                    token : token
                },
                err : null
            });
        }
        else {
            throw new Error('Invalid password.');
        }
    }
    catch (err) {

        logger.error(err.message);

        return res.json({
            data : null,
            err : {
                message: err.message
            }
        });
    }
});


router.get('/', checkToken, async function(req,res) {
    try{
        let err,result;

        [err, result] = await to(mysql.customerModel.findAll({
            where : {
                email : req.body.email
            }
        }));

        if(err){
            throw new Error('Unable to find customer.');
        }

        if(!result[0]){
            throw new Error('Customer not found with email ID');
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


router.put('/address', checkToken, async function(req,res){
    try{
        let err, result;

        [err, result] = await to(joiCustomerValue.address.validateAsync(req.body));

        if (err) {
            throw new Error(err.message)
        }

        [err, result] = await to(mysql.customerModel.update({
            address : req.body.address,
        },{
            where : {
                email : req.body.email
            }
        }));

        if(err){
            throw new Error('Unable to update address.');
        }

        if(!result[0]){
            throw new Error('Customer with email ID does not exist');
        }

        return res.json({
            data : {
                message : 'Address updated successfully.'
            } ,
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


router.put('/creditCard', checkToken, async function(req,res){
    try{
        let err, result;

        [err, result] = await to(joiCustomerValue.creditCard.validateAsync(req.body));

        if (err) {
            throw new Error(err.message)
        }

        [err, result] = await to(mysql.customerModel.update({
            creditCardNumber : req.body.creditCardNumber,
        },{
            where : {
                email : req.body.email
            }
        }));

        if(err){
            throw new Error('Unable to update credit card number.');
        }

        if(!result[0]){
            throw new Error('Customer with email ID does not exist');
        }

        return res.json({
            data : {
                message : 'Credit card number updated successfully.'
            } ,
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


module.exports = router;
