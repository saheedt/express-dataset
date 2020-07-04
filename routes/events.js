var express = require('express');
var router = express.Router();

const { addEvent, getAllEvents, getByActor } = require('../controllers/events');

// Routes related to event
router
  .route('/')
  .get(getAllEvents)
  .post(addEvent);

router.route("/actors/:id").get(getByActor);
module.exports = router;