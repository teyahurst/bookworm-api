const xss = require('xss')

const BooksService = {
    getAllBooks(knex) {
        return knex.select('*').from('bookworm_books')
    },

    getBooksForUser(knex, user_name){
        return knex
            .from('bookworm_books')
            .select('*')
            .where('user_name', user_name)
    },
    getBookById(knex, id) {
        return knex
            .select('*')
            .from('bookworm_books')
            .where('id', id)
            .first()
    },

    insertBook(knex, newBook, user_name) {
        return knex
            .insert(newBook)
            .into('bookworm_books')
            .where('user_name', user_name)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteBook(knex, id) {
        return knex('bookworm_books')
            .where({ id })
            .delete()
    }
}

module.exports = BooksService