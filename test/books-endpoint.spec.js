const knex = require('knex') 
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Books endpoints', function() {
    let db 

    const { 
        testUsers,
        testBooks,
    } = helpers.makeBookFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw('TRUNCATE bookworm_users, bookworm_books RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE bookworm_users, bookworm_books RESTART IDENTITY CASCADE'))

    
    describe('GET /:user_name/books', () => {
        context('Given no books', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/:user_name/books')
                    .expect(200, [])
            })
        })

        context('Given there are books in the database', () => {
            
            const testUsers = helpers.makeUsersArray()
            const testBooks = helpers.makeBooksArray(testUsers);
        
            beforeEach('insert books', () => {
                return db
                    .into('bookworm_users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('bookworm_books')
                            .insert(testBooks)
                    })
            })

            it('responds with 200 and all of the books for that user', () => {
                const  user_name  = 'test-user-4'
                return supertest(app)
                    .get(`/${user_name}/books`)
                    .expect(200)
            })
        })
    })
})

