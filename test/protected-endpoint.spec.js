const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', function() {
    let db

    const {
        testUsers,
        testBooks
    } = helpers.makeBookFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw(`TRUNCATE bookworm_users, bookworm_books RESTART IDENTITY CASCADE`))

    afterEach('cleanup', () => db.raw(`TRUNCATE bookworm_users, bookworm_books RESTART IDENTITY CASCADE`))


    beforeEach('insert books', () => 
        helpers.seedBooksTables(
            db,
            testUsers,
            testBooks,
        )
      )

    const protectedEndpoints = [
        {
            name: 'POST /:user_name/books',
            path: `/${testUsers[0].user_name}/books`,
            method: supertest(app).post
        },
    ]

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
            it(`responds 401 'Missing bearer token' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                    .expect(401, { error: `Missing bearer token` })
            })

            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, { error: `Unauthorized request` })
            })

            it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { user_name: 'user-not-existy', id: 1}
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, { error: `Unauthorized request` })
            })
        })
    })
})