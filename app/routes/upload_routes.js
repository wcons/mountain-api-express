const express = require('express')
const Upload = require('../models/upload')
const multer = require('multer')
const multerUpload = multer({
  dest: 'tempFiles/'
})
const router = express.Router()
const {
  s3Upload,
  createParams,
  promiseReadFile
} = require('../../lib/promiseS3Upload.js')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const removeBlanks = require('../../lib/remove_blank_fields')
const requireOwnership = customErrors.requireOwnership
const passport = require('passport')
const requireToken = passport.authenticate('bearer', {
  session: false
})

// CREATE
// POST /examples
router.post('/uploads', multerUpload.single('file'), requireToken, (req, res, next) => {
  req.body.owner = req.user._id
  promiseReadFile(req.file)
    .then(createParams)
    .then(s3Upload)
    .then(s3Response => Upload.create({
      url: s3Response.Location,
      name: req.body.name,
      description: req.body.description,
      tags: req.body.tags,
      owner: req.body.owner,
      email: req.user.email
    }))
    .then(upload => {
      const uploadObject = upload.toObject()
      uploadObject.editable = true
      return uploadObject
    })
    .then(uploadObject => {
      res.status(201).json({
        upload: uploadObject
      })
    })
    .catch(next)
})

// INDEX
// GET /examples
router.get('/uploads', requireToken, (req, res, next) => {
  Upload.find().populate('owner')
    .then(uploads => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return uploads.map(upload => upload.toObject())
    })
    .then(uploads => {
      uploads.map(upload => {
        if (JSON.stringify(req.user._id) === JSON.stringify(upload.owner._id)) {
          upload.editable = true
        } else {
          upload.editable = false
        }
      })
      return uploads
    })
    // respond with status 200 and JSON of the examples
    .then(uploads => res.status(200).json({
      uploads: uploads
    }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/uploads/:id', requireToken, (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, upload)
      // delete the example ONLY IF the above didn't throw
      upload.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/uploads/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.upload.owner

  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, upload)

      // pass the result of Mongoose's `.update` to the next `.then`
      return upload.update(req.body.upload)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
