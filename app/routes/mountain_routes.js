// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
const customErrors = require('../../lib/custom_errors')
// pull in Mongoose model for examples
const Mountain = require('../models/mountain')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
// const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
// const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /examples
router.get('/mountains', (req, res, next) => {
  Mountain.find()
    .then(mountains => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return mountains.map(mountain => mountain.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(mountains => res.status(200).json({ mountains: mountains }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.get('/mountains/:id', (req, res, next) => {
  Mountain.findById(req.params.id)
    .then(handle404)
    .then(mountain => res.status(200).json({ mountain: mountain.toObject() }))
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/mountains/:id', requireToken, (req, res, next) => {
  // Call findById to get the example that matches the id from the req.params
  Mountain.findById(req.params.id)
  // handle the case when an example with the id is not found
  // if it is found just pass it along to the next .then
    .then(handle404)
    // checking if the user is the owner of the resource
    .then(example => {
      requireOwnership(req, example)
      // delete the example
      example.remove()
    })
    // use the sendStatus method because it's a terminal handler to set and
    // send the status
    .then(() => res.sendStatus(204))
    // Call on next if any errors happened.
    .catch(next)
})

router.post('/mountains', requireToken, (req, res, next) => {
  req.body.mountain.owner = req.user.id
  Mountain.create(req.body.mountain)
    .then(mountain => {
      res.status(201).json({ mountain: mountain.toObject() })
    })
    .catch(next)
})

module.exports = router
