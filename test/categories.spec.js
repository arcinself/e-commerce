const server = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('Category APIs', () => {

    describe('GET Categories', () => {

        it('it should get all the categories', (done) => {
            chai.request(server)
                .get("/categories")
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data).should.be.a('array');
                    if( res.body.data.length > 0)
                    {
                        (res.body.data[0]).should.have.property('id');
                        (res.body.data[0]).should.have.property('name');
                    }
                    done();
                });
        });
    });


    describe('GET Category by ID', () => {

        it('it should get category by ID', (done) => {

            let category_id = 1;

            chai.request(server)
                .get(`/categories/${category_id}`)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data).should.be.a('array');
                    if(res.body.data.length > 0){
                        (res.body.data[0]).should.have.property('id');
                        (res.body.data[0]).should.have.property('name');
                    }
                    done();
                });
        });

        it('it should not get category by ID', (done) => {

            let category_id = 500;

            chai.request(server)
                .get(`/categories/${category_id}`)
                .end( (err, res) => {
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('err');
                    (res.body.err.message).should.be.a('string');
                    (res.body.err.message).should.be.eq("No category exists with this ID.");
                    done();
                });
        });
    });


    describe('GET Category by Product ID', () => {

        it('it should get category by product ID', (done) => {

            let product_id = 1;

            chai.request(server)
                .get(`/categories/inProduct/${product_id}`)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data).should.be.a('object');
                    (res.body.data).should.have.property('category_id');
                    done();
                });
        });

        it('it should not get category by product ID', (done) => {

            let product_id = 500;

            chai.request(server)
                .get(`/categories/inProduct/${product_id}`)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('err');
                    (res.body.err.message).should.be.a('string');
                    (res.body.err.message).should.be.eq("No category found for this product ID.");
                    done();
                });
        });

    });
});