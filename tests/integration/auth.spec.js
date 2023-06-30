const request = require('supertest')
const { connect } = require('./database')
const UserModel = require('../../models/user.model')
const app = require('../../index');

describe('Auth: Signup', () => {
    let conn;

    beforeAll(async() => {
        conn = await connect()
    })

    afterEach(async() => {
        await conn.cleanup()
    })

    afterAll(async() => {
        await conn.disconnect()
    })



    it('should sign up a user and return an object', async() => {
        const response = await request(app).post('/scissor/api/v1/auth/signup')
            .set('content-type', 'application/json')
            .send({


                firstname: 'tobie',
                lastname: 'Augustina',
                email: 'tobi@mail.com',
                password: 'Password123'
            })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('firstname', 'tobie')
        expect(response.body.user).toHaveProperty('lastname', 'Augustina')
        expect(response.body.user).toHaveProperty('email', 'tobi@mail.com')
    })

    it('should login a user', async() => {
        // create user in our db
        const user = await UserModel.create({
            firstname: 'tobie',
            lastname: 'Augustina',
            email: 'tobi@mail.com',
            password: 'Password123'
        });

        // login user
        const response = await request(app)
            .post('/scissor/api/v1/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'tobi@mail.com',
                password: 'Password123'
            });


        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')
    })
})