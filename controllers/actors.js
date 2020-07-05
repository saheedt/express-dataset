const db = require("../database");
const { BadRequestError } = require("../utils/errors/bad-request-error");
const { InternalServerError } = require("../utils/errors/internal-server-error");
const { OK } = require("../utils/status-code");
const { NotFoundError } = require("../utils/errors/not-found-error");

const {
  allowedActorUpdateAttrs,
  containsInvalidAttr,
	getActorsBystreak,
	getActorsByAssociatedEvents,
} = require("../utils/actors");

const getAllActors = async (req, res, next) => {
	try {
		const events = await db.find({}).sort({
			created_at: -1,
			'actor.login': 1
		}).exec();

		const actors = getActorsByAssociatedEvents(events);
		res.status(OK).json({
			status_code: OK,
			data: actors
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

const updateActor = async (req, res, next) => {
	try {
		const incomingAttrs = Object.keys(req.body);
		
		if (containsInvalidAttr(incomingAttrs, allowedActorUpdateAttrs)) {
      return next(
        new BadRequestError({
          message: "Invalid attributes supplied",
        })
      );
    }

		const { id, avatar_url } = req.body;
		const found = await db.findOne({ "actor.id": id });

		if (!found) {
			return next(
				new NotFoundError({
					message: "Actor not found"
				})
			);
		}
		
		const update = await db.update(
      { "actor.id": id },
      { $set: { "actor.avatar_url": avatar_url } },
      { returnUpdatedDocs: true, multi: true }
    );
		
		res.status(OK).json({
			status_code: OK,
			data: update
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

const getStreak = async (req, res, next) => {
	try {
		const events = await db.find({}).sort({
			created_at: -1,
			'actor.login': 1
		}).exec();
		
		const actorsByStreak = getActorsBystreak(events);
		res.status(OK).json({
			status_code: OK,
			data: actorsByStreak
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
	updateActor: updateActor,
	getAllActors: getAllActors,
	getStreak: getStreak
};

















