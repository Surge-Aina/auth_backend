const mongoose = require("mongoose")
const request = require("supertest")
const app = require("../index.js")
require("dotenv").config()


const userLoginTestObj = {
    "name":"test user 2",
    "email":"tes2@email.com",
    "password": "test123Pass",
    "role":"admin"
}
describe("POST /api/login/admin", () => {
    test("should login admin user", async () => {
        return request(app)
                .post("/api/login/admin")
                .send(userLoginTestObj)
                .expect(200)
                .then(({body}) => {
                    console.log(body)
                })
    })
})