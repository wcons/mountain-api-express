// Require express
const express = require('express')
// Require passport for authentication
const passport = require('passport')
// Bringing in our example mongoose model
const Mountain = require('../models/mountain')
// Bringing in the custom_errors file
const customErrors = require('../../lib/custom_errors')
// Dot into customErrors to grab handle404
const handle404 = customErrors.handle404
// Dot into customErrors to grab requireOwnership
const requireOwnership = customErrors.requireOwnership
// middleware to remove blank fields from the req.body.whatever
const removeBlanks = require('../../lib/remove_blank_fields')
// Pass this as the second argument to the route.whatever_verb
// It will make sure that a token is provided and it will set the req.user
const requireToken = passport.authenticate('bearer', { session: false })
// instantiate a router object (mini app that only handles routes)
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

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/mountains/:id', requireToken, removeBlanks, (req, res, next) => {
  // delete the owner property on the request.body.<resource> so it doesn't
  // accidentally or intentionally get changed when the update is successful
  delete req.body.mountain.owner
  // Use findById to get the resource with the ID from URI
  Mountain.findById(req.params.id)
  // handle any errors when the resource doesn't exist
    .then(handle404)
    // use requireOwnership middleware to check if the owner of the resource
    // is the same as the users
    .then(mountain => {
      // if requireOwnership fails it will throw
      requireOwnership(req, mountain)
      // if it doesn;'t we'll run update to update the resource using the data
      // out of the request
      return mountain.update(req.body.mountain)
    })
    // no need to send back any json in the response body
    // just set and send the status
    .then(() => res.sendStatus(204))
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
