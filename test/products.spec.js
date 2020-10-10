const server = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('Product APIs', () => {

    describe('GET Products', () => {

        it('it should get all the products', (done) => {
            chai.request(server)
                .get("/products")
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data).should.be.a('array');
                    if( res.body.data.length > 0)
                    {
                        (res.body.data[0]).should.have.property('id');
                        (res.body.data[0]).should.have.property('name');
                        (res.body.data[0]).should.have.property('details');
                        (res.body.data[0]).should.have.property('price');
                        (res.body.data[0]).should.have.property('category_id');
                    }
                    done();
                });
        });
    });


    describe('GET Products by ID', () => {

        it('it should get product by ID', (done) => {

            let product_id = 1;

            chai.request(server)
                .get(`/products/${product_id}`)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data).should.be.a('array');
                    if( res.body.data.length > 0)
                    {
                        (res.body.data[0]).should.have.property('id');
                        (res.body.data[0]).should.have.property('name');
                        (res.body.data[0]).should.have.property('details');
                        (res.body.data[0]).should.have.property('price');
                        (res.body.data[0]).should.have.property('category_id');
                    }
                    done();
                });
        });

       it('it should not get product by that ID', (done) => {

            let product_id = 500;

            chai.request(server)
                .get(`/products/${product_id}`)
                .end( (err, res) => {
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('err');
                    (res.body.err).should.be.a('object');
                    (res.body.err.message).should.be.eq('No product exists with this ID.');
                    done();
                });
        });
    });


    describe('GET Products by category ID', () => {

        it('it should get product by category ID', (done) => {

            let category_id = 1;

            chai.request(server)
                .get(`/products/inCategory/${category_id}`)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data.product_id).should.be.a('array');
                    if( res.body.data.product_id.length > 0)
                    {
                        (res.body.data.product_id[0]).should.have.property('id');
                        (res.body.data.product_id[0]).should.have.property('name');
                        (res.body.data.product_id[0]).should.have.property('details');
                        (res.body.data.product_id[0]).should.have.property('price');
                    }
                    done();
                });
        });

        it('it should not get product by category ID', (done) => {

            let category_id = 500;

            chai.request(server)
                .get(`/products/inCategory/${category_id}`)
                .end( (err, res) => {
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('err');
                    (res.body.err.message).should.be.a('string');
                    (res.body.err.message).should.be.eq("No product found for this category ID.");
                    done();
                });
        });
    });


    describe('GET Reviews by product ID', () => {

        it('it should get review by product ID', (done) => {

            let product_id = 1;

            chai.request(server)
                .get(`/products/${product_id}/reviews`)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data).should.be.a('array');
                    if( res.body.data.length > 0)
                    {
                        (res.body.data[0]).should.have.property('id');
                        (res.body.data[0]).should.have.property('review');
                        (res.body.data[0]).should.have.property('product_id');
                    }
                    done();
                });
        });

        it('it should get review by product ID', (done) => {

            let product_id = 500;

            chai.request(server)
                .get(`/products/${product_id}/reviews`)
                .end( (err, res) => {
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('err');
                    (res.body.err.message).should.be.a('string');
                    (res.body.err.message).should.be.eq("No product exists with this ID.");
                    done();
                });
        });

    });
});