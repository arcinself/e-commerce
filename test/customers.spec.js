const server = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

describe('Customer APIs', () => {

    let token;
/*
    describe('Sign-up Customer', () => {

        const customer = {
            "name" : "test",
            "email" : "test1@gmail.com",
            "phone" : 123456789,
            "address" : "test" ,
            "creditCardNumber" : 1234,
            "password" : "test"
        }

        it('it should signup the new customer', (done) => {
            chai.request(server)
            .post("/customers")
            .send(customer)
            .end( (err, res) => {
                res.should.have.status(200);
                (res.body).should.be.a('object');
                (res.body).should.have.property('data');
                (res.body.data.message).should.be.a('string');
                (res.body.data.message).should.be.eq("Customer signed-up successfully.");
                done();
            });
        });
    });
*/


    describe('Login Customer', () => {

        const customer = {
                "email" : "test@gmail.com",
                "password" : "test"
        }

        it('it should login customer', (done) => {
            chai.request(server)
                .post("/customers/login")
                .send(customer)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data.message).should.be.a('string');
                    (res.body.data.message).should.be.eq("Customer logged-in successfully.");
                    token = "Bearer " + res.body.data.token;
                    done();
                });
        });
    });


    describe('GET Customers', () => {

        const email = {
            "email" : "test@gmail.com"
        }

        it('it should get details of the customer', (done) => {
            chai.request(server)
                .get("/customers")
                .set("Authorization", token)
                .send(email)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data).should.be.a('array');
                    if( res.body.data.length > 0){
                        (res.body.data[0]).should.have.property('id');
                        (res.body.data[0]).should.have.property('name');
                        (res.body.data[0]).should.have.property('email');
                        (res.body.data[0]).should.have.property('phone');
                        (res.body.data[0]).should.have.property('address');
                        (res.body.data[0]).should.have.property('creditCardNumber');
                        (res.body.data[0]).should.have.property('encryptedPassword');
                    }
                    done();
                });
        });
    });


    describe('Update Address', () => {

        const updateAddress = {
            "email" : "test@gmail.com",
            "address" : "testDone"
        }

        it("it should update address", (done) => {
            chai.request(server)
                .put("/customers/address")
                .set("Authorization", token)
                .send(updateAddress)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data.message).should.be.a('string');
                    (res.body.data.message).should.be.eq("Address updated successfully.");
                    done();
                });
        });
    });


    describe('Update Credit Card', () => {

        let updateCreditCardNumber = {
            "email" : "test@gmail.com",
            "creditCardNumber": 12345
        };

        it("it should update credit card number", (done) => {
            chai.request(server)
                .put("/customers/creditCard")
                .set("Authorization", token)
                .send(updateCreditCardNumber)
                .end( (err, res) => {
                    res.should.have.status(200);
                    (res.body).should.be.a('object');
                    (res.body).should.have.property('data');
                    (res.body.data.message).should.be.a('string');
                    (res.body.data.message).should.be.eq("Credit card number updated successfully.");
                    done();
                });
        });
    });

});