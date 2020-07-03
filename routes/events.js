var express = require('express');
var router = express.Router();

const { addEvent, getAllEvents } = require('../controllers/events');

// Routes related to event
router
  .route('/')
  .get(getAllEvents)
  .post(addEvent);

module.exports = router;