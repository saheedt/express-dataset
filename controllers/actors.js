const db = require("../database");
const { BadRequestError } = require("../utils/errors/bad-request-error");
const { InternalServerError } = require("../utils/errors/internal-server-error");
const { OK, Created } = require("../utils/status-code");
const { NotFoundError } = require("../utils/errors/not-found-error");

const {
  containsInvalidAttr,
  extractDistinctActors,
  allowedActorUpdateAttrs,
  actorStreak,
  sortActorByStreak,
  removeActorStreak,
} = require("../utils");

const getAllActors = async (req, res, next) => {
	// TODO
	try {
		const events = await db.find({}).sort({
			actor: -1,
			created_at: -1,
			'actor.login': 1
		}).exec()
		// created_at: -1, "actor.login": 1
		console.log(events);
		const actors = extractDistinctActors(events);
		res.status(OK).json({
			data: actors
		})
	} catch (error) {
		console.error("DatabaseOperation Error: ", error);
    next(
      new InternalServerError({
        message: "Error fetching data",
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
			data: update
    });
	} catch (error) {
		console.error("DatabaseOperation Error: ", error);
    next(
      new InternalServerError({
        message: "Error fetching data",
      })
    );
	}
};

const getStreak = async (req, res, next) => {
	try {
		const sortEvents = await db.find({})
			.sort({ created_at: -1, 'actor.login': 1 })
			.exec();
		
		const sortByStreak = removeActorStreak(
			sortActorByStreak(
				actorStreak(
					sortEvents
				)
			)
		);
		res.status(OK).json({ data: sortByStreak });
	} catch (error) {
		console.error("DatabaseOperation Error: ", error);
    next(
      new InternalServerError({
        message: "Error fetching data",
      })
    );
	}
};


module.exports = {
	updateActor: updateActor,
	getAllActors: getAllActors,
	getStreak: getStreak
};

















