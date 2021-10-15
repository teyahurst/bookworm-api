const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'test-user-1',
        full_name: 'Test user 1',
        nickname: 'TU1',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 2,
        user_name: 'test-user-2',
        full_name: 'Test user 2',
        nickname: 'TU2',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 3,
        user_name: 'test-user-3',
        full_name: 'Test user 3',
        nickname: 'TU3',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 4,
        user_name: 'test-user-4',
        full_name: 'Test user 4',
        nickname: 'TU4',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
    ]
  }


  
  function makeBooksArray(users) {
    return [
      {
        id: 1,
        title: 'First test post!',
        author: 'How-to',
        user_name: users[0].user_name,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 2,
        title: 'Second test post!',
        author: 'Interview',
        user_name: users[0].user_name,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 3,
        title: 'Third test post!',
        author: 'News',
        user_name: users[0].user_name,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
      {
        id: 4,
        title: 'Fourth test post!',
        author: 'Listicle',
        user_name: users[3].user_name,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      },
    ]
  }

  
  function makeExpectedBook(users, book) {
      const author = users
        .fin(user => user.id === book.author_id)

    return {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        date_created: book.date_created.toISOString(),
        author: {
            id: author.id,
            user_name: author.user_name,
            full_name: author.full_name,
            nickname: author.nickname,
            date_created: author.date_created.toISOString(),
            date_modified: author.date_modified || null,
        },
    }
  }

  function makeExpectedBookComments(users, bookId, comments) {
      const expectedComments = comments
        .filter(comment => comment.book_id === bookId)

        return expectedComments.map(comment => {
            const commentUser = users.find(user => user.name === comment.user_name)
            return {
                id: comment.id,
                text: comment.text,
                date_created: comment.date_created.toISOString(),
                user: {
                    id: commentUser.id,
                    user_name: commentUser.user_name,
                    full_name: commentUser.full_name,
                    nickname: commentUser.nickname,
                    date_created: commentUser.date_created.toISOString(),
                    date_modified: commentUser.date_modified || null,
                }
            }
        })
  }

  function makeMaliciousBook(user) {
      const maliciousBook = {
          id: 911,
          title: 'Naughty naughty very naughty <script>alert("xss");</script>',
          author: 'XSSMARTIN',
          user_name: user.user_name,
          description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,

      }

      const expectedBook = {
          ...makeExpectedBook([user], maliciousBook),
          title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
          description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      }
      return {
          maliciousBook,
          expectedBook,
      }
  }

  function makeBookFixtures() {
      const testUsers = makeUsersArray()
      const testBooks = makeBooksArray(testUsers)
      return { testUsers, testBooks}
  }

  

  function seedBooksTables(db, users, books, comments=[]) {
      return db.transaction(async trx => {
          await trx.into('bookworm_users').insert(users)
          await trx.into('bookworm_books').insert(books)

          await Promise.all([
              trx.raw(
                  `SELECT setval('bookworm_users_id_seq', ?)`,
                  [users[users.length -1].id],
              ),
              trx.raw(
                  `SELECT setval('bookworm_books_id_seq', ?)`,
                  [books[books.length - 1].id],
              ),
          ])

          if(comments.length) {
              await trx.into('bookworm_comments').insert(comments)
              await trx.raw(
                  `SELECT setval('bookworm_comments_id_seq', ?)`,
                  [comments[comment.length-1].id],
              )
          }
      })
  }

  function seedMaliciousBook(db, user, book) {
      return db 
        .into('bookworm_users')
        .insert([user])
        .then(() => 
            db
                .into('bookworm_books')
                .insert([article])
            )
  }

  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('bookworm_users').insert(preppedUsers)
      .then(() => 
        db.raw(
          `SELECT setval('bookworm_users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
  }

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }

  module.exports = {
      makeUsersArray,
      makeBooksArray,
      makeExpectedBook,
      makeExpectedBookComments,
      makeMaliciousBook,

      seedUsers,
      makeBookFixtures,
      seedBooksTables,
      seedMaliciousBook,
      makeAuthHeader,
  }