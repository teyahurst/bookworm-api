const express = require('express')
const BooksService = require('./books-service')
const path = require('path')


const booksRouter = express.Router()
const jsonParser = express.json()

booksRouter
    .route('/')
    .get((req, res, next) => {
        BooksService.getAllBooks(req.app.get('db'))
            .then(books => {
                res.json(books)
            })
            .catch(next)
    })

booksRouter
    .route('/:user_name/books')
    .get((req, res, next) => {
        BooksService.getBooksForUser(req.app.get('db'), req.params.user_name)
        .then(books => {
            res.json(books)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title, author, description, urltoimage, user_name } = req.body;
        const newBook = { title, author, description, urltoimage, user_name } 

        for (const [key, value] of Object.entries(newBook))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

            
            BooksService.insertBook(
                req.app.get('db'),
                newBook,
                user_name,
            )
            .then(book => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${book.id}`))
                    .json()
                    
            })
            .catch(next)
    })

booksRouter
    .route('/:user_name/books/:book_id')
    .all((req, res, next) => {
        BooksService.getBookById(req.app.get('db'), req.params.book_id)
            .then(book => {
                if(!book) {
                    return res.status(404).json({
                        error: { message: `Book doesn't exist` }
                    })
                }
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        BooksService.deleteBook(req.app.get('db'), req.params.book_id)
        .then(() => {
            res.status(204).json({})
        })
        .catch(next)
    })
    



module.exports = booksRouter