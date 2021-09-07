let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");


//Assertion Style
chai.should();

chai.use(chaiHttp);



describe('Tasks API', () => {

    /**
     * Test checks endpoints
     */
     describe("GET /api/v1/checks", () => {
        it("It should GET all the checks", (done) => {
            chai.request(server)
                .get("/api/v1/checks")
                .set({ "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzQ4NjhkOTU4MTE2MWFhODU4NWUxZCIsImVtYWlsIjoiaXNsYW1fZWxtYXNyeUBob3RtYWlsLmNvbSIsImlhdCI6MTYzMDgzMjMxMSwiZXhwIjoxNjMzNDI0MzExfQ.FtZG7blVSxPjEFtwIhvk0MuI6NAD9n8c81jiBhMMrAM"  })
                .end((err, response) => {
                    response.should.have.status(200);
                    done();
                });
        }).timeout(5000);
    });   
    
    describe("POST /api/v1/checks/createCheck", () => {
        it("It should create a check", (done) => {
            chai.request(server)
                .post("/api/v1/checks/createCheck")
                .set({ "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzQ4NjhkOTU4MTE2MWFhODU4NWUxZCIsImVtYWlsIjoiaXNsYW1fZWxtYXNyeUBob3RtYWlsLmNvbSIsImlhdCI6MTYzMDgzMjMxMSwiZXhwIjoxNjMzNDI0MzExfQ.FtZG7blVSxPjEFtwIhvk0MuI6NAD9n8c81jiBhMMrAM"  })
                .send({
                    "name": "test-check"+Math.floor(Math.random() * 1000),
                    "url": "www.google.com",
                    "protocol": "HTTPS",
                    "path": "",
                            "Port": 1000,
                            "webhook": "https://webhook.site/c56f64e1-999a-4a3a-9c65-721f613d1e9f",
                            "timeout": "10000",
                            "interval": 600000,
                            "threshold": 1,
                            "authentication": {
                                "name":"islam",
                                "password":"1234566"
                            },
                            "headers": [{
                                "name":"header1",
                                "value":"value1"
                            }],
                            "assertCode": 200,
                            "tags": ["tag1"],
                            "ignoreSSL": false,
                            "user": "6134868d9581161aa8585e1d"
                })
                .end((err, response) => {
                    response.should.have.status(201);
                    done();
                });
        }).timeout(5000);


        
    });


    describe("PUT /api/v1/checks/updatecheck?id=613270a3a4f1942c24a29f9b", () => {
        it("It should edit a check", (done) => {
            chai.request(server)
                .put("/api/v1/checks/updatecheck?id=613270a3a4f1942c24a29f9b")
                .set({ "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzQ4NjhkOTU4MTE2MWFhODU4NWUxZCIsImVtYWlsIjoiaXNsYW1fZWxtYXNyeUBob3RtYWlsLmNvbSIsImlhdCI6MTYzMDgzMjMxMSwiZXhwIjoxNjMzNDI0MzExfQ.FtZG7blVSxPjEFtwIhvk0MuI6NAD9n8c81jiBhMMrAM"  })
                .send({
                    "name": "test-check"+Math.floor(Math.random() * 1000),
                    "url": "www.google.com",
                    "protocol": "HTTPS",
                    "path": "",
                            "Port": 1000,
                            "webhook": "https://webhook.site/c56f64e1-999a-4a3a-9c65-721f613d1e9f",
                            "timeout": "10000",
                            "interval": 600000,
                            "threshold": 1,
                            "authentication": {
                                "name":"islam",
                                "password":"1234566"
                            },
                            "headers": [{
                                "name":"header122",
                                "value":"value1"
                            }],
                            "assertCode": 200,
                            "tags": ["tag1"],
                            "ignoreSSL": false,
                            "user": "6134868d9581161aa8585e1d"
                })
                .end((err, response) => {
                    response.should.have.status(201);
                    done();
                });
        }).timeout(5000);
    });


    describe("GET /api/v1/checks/test?id=613489ad9581161aa8585e1f", () => {
        it("It pool a check", (done) => {
            chai.request(server)
                .get("/api/v1/checks/test?id=613489ad9581161aa8585e1f")
                .set({ "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzQ4NjhkOTU4MTE2MWFhODU4NWUxZCIsImVtYWlsIjoiaXNsYW1fZWxtYXNyeUBob3RtYWlsLmNvbSIsImlhdCI6MTYzMDgzMjMxMSwiZXhwIjoxNjMzNDI0MzExfQ.FtZG7blVSxPjEFtwIhvk0MuI6NAD9n8c81jiBhMMrAM"  })
                .end((err, response) => {
                    response.should.have.status(200);
                    done();
                });
        }).timeout(5000);
    });   
    

});
