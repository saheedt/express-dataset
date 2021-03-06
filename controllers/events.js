const db = require('../database');
const { BadRequestError } = require('../utils/errors/bad-request-error');
const { InternalServerError } = require("../utils/errors/internal-server-error");
const { OK, Created } = require('../utils/status-code');
const { NotFoundError } = require('../utils/errors/not-found-error');

const getAllEvents = async (req, res, next) => {
	try { 
		const events = await db.find({}).sort({ id: 1 }).exec();
		res.status(OK).json({
      status_code: OK,
      body: events
    });
	} catch (error) {
		console.error('Operation Error: ', error);
		next(new InternalServerError({
      message: "Error performing operation",
    }));
	}
};

const addEvent = async (req, res, next) => {
	try {
		const { id, type, actor, repo, created_at } = req.body;
    if (!id || !type || !actor || !repo || !created_at) {
      return next(new BadRequestError({
        message: "Invalid event data provided",
      }));
		}
		const exists = await db.findOne({ id });
		if (exists) {
			return next(new BadRequestError({
        message: "Event already exists",
      }));
		}
    const newDoc = await db.insert(req.body);
		res.status(Created).json({
      status_code: Created,
      body: {},
    });

  } catch (error) {
    console.error("Operation Error: ", error);
		next(new InternalServerError({
			message: "Error performing operation",
		}));
  }
};


const getByActor = async (req, res, next) => {
	const { id } = req.params;
	try {
		const events = await db.find({ 'actor.id': parseInt(id, 10) })
			.sort({ id: 1 })
			.exec();
		
		if (events.length <= 0) {
			return next(new NotFoundError({
				message: 'No event found by actor'
			}));
		}

		res.status(OK).json({
			status_code: OK,
      body: events,
    });
	} catch (error) {
		console.error("Operation Error: ", error);
    next(
      new InternalServerError({
        message: "Error performing operation",
      })
    );
	}
};


const eraseEvents = async (req, res, next) => {
	try {
		await db.remove({}, { multi: true });
		res.status(OK).json({
			status_code: OK,
			body: {}
    });
	} catch (error) {
		console.error("Operation Error: ", error);
    next(
      new InternalServerError({
        message: "Error performing operation",
      })
    );
	}
};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents
};
