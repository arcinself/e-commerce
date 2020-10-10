const express = require('express');
const router = express.Router();
const {to} = require('await-to-js');
const mysql= require('./../lib/datacenter/mysql/connection');
const logger = require('../lib/logger/winston');
const joiCategoryValue = require('../lib/validator/validation');
const cache = require("../lib/cache/redis");


router.get('/', async function(req, res, next) {
  try{
    let err, result;

    [err, result] = await to(mysql.categoryModel.findAll())

    if(err){
      throw new Error('Unable to fetch categories.');
    }

    if(!result[0]){
      throw new Error('No categories to display.');
    }

    let Categories = JSON.stringify(result);

    [err, result] = await to(cache.getValue("Categories"));

    result = JSON.parse(Categories);

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

    [err, result] = await to(mysql.categoryModel.findAll({
      where : {
        id : req.params.id
      }
    }));

    if(err){
      throw new Error('Unable to fetch category with this category ID.');
    }

    if(!result[0]){
      throw new Error('No category exists with this ID.');
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

    [err, result] = await to(mysql.productModel.findAll({
      attributes: ['category_id'],
      where: {
        id : req.params.product_id
      }
    }));

    if (err) {
      throw new Error('Unable to fetch category with this product ID.')
    }

    if (!result[0]) {
      throw new Error('No category found for this product ID.')
    }

    return res.json({
      data : {
        category_id: result[0]['dataValues']['category_id']
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

    [err, result] = await to(joiCategoryValue.newCategory.validateAsync(req.body));

    if (err) {
      throw new Error(err.message)
    }

    [err, result] = await to(mysql.categoryModel.findAll());

    const newId = result.length + 1;

    [err, result] = await to(mysql.categoryModel.findAll({
      where: {
        name : req.body.name
      }
    }));

    if (result[0]) {
      throw new Error('A category with this name already exists.');
    }

    [err, result] = await to(mysql.categoryModel.create({
      id: newId,
      name: req.body.name
    }));

    if (err) {
      throw new Error('Error adding category.');
    }

    [err, result] = await to(cache.setValue("Categories", JSON.stringify(result)));

    return res.json({
      data: {
        message: 'Category added successfully.'
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
