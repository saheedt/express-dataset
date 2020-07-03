var express = require('express');
var router = express.Router();

const { getAllEvents } = require('../controllers/events');

// Routes related to event
router
  .route('/')
  .get(getAllEvents)

module.exports = router;