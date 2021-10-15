const xss = require('xss')

const BooksService = {
    getAllBooks(knex) {
        return knex.select('*').from('bookworm_books')
    },

    getBooksForUser(knex, user_name){
        return knex.select('*').from('bookworm_books').where({user_name})
    },

    insertBook(knex, newBook) {
        return knex
            .insert(newBook)
            .into('bookworm_books')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
}

module.exports = BooksService