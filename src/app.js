require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const booksRouter = require('./books/books-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')


const app = express();

const morganOption = process.env.NODE_ENV === 'production'
    ? 'tiny'
    : 'common';

const corsOptions = {
    origin: CLIENT_ORIGIN,
    optionsSuccessStatus: 200
}

app.use(morgan(morganOption))
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})


app.use('/', cors(corsOptions), booksRouter)
app.use('/api/auth', cors(corsOptions), authRouter)
app.use('/api/users', cors(corsOptions), usersRouter)

app.use(function errorHandler(error, req, res, next){
    let response 
    if(NODE_ENV === 'production'){
        response = { error: { message: 'server error'}}
    } else {
        response = { message: error.message, error }
    }
    console.error(error)
    res.status(500).json(response)
})

module.exports = app;