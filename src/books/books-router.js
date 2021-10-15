const express = require('express')
const BooksService = require('./books-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { serializeBook } = require('./books-service')

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
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { title, author, description } = req.body;
        const newBook = { title, author, description } 

        for (const [key, value] of Object.entries(newBook))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

            newBook.user_name = req.user_name

            BooksService.insertBook(
                req.app.get('db'),
                newBook
            )
            .then(book => {
                res
                    .status(201)
                    
            })
            .catch(next)
    })



module.exports = booksRouter