const db = require('../database');
// fix err handling repitition

const getAllEvents = (req, res) => {
	db.find({}).sort({ id: 1 }).exec((err, docs) => {
		if (err) {
			return res.status(500).json({
				message: 'Error fetching data'
			});
		}
		res.status(200).json({
			data: docs
		});
	});
};

const addEvent = (req, res) => {
	console.log(req.body);
	const { id, type, actor, repo, created_at } = req.body;
	if (!id || !type || !actor || !repo || !created_at) {
    return res.status(400).json({
      message: "Invalid event data provided",
    });
	}
	
	db.findOne({ id }, (err, doc) => {
		if (err) {
      return res.status(500).json({
        message: "Error fetching data",
      });
		}
		
		if (doc) {
			return res.status(400).json({
				message: 'Event already exists'
			});
		}

		db.insert(req.body, (err, newDoc) => {
			if (err) {
        return res.status(500).json({
          message: "Error storing data",
        });
			}
			
			res.status(201).json({
				data: newDoc
			});
		});
	});
};


var getByActor = () => {

};


var eraseEvents = () => {

};

module.exports = {
	getAllEvents: getAllEvents,
	addEvent: addEvent,
	getByActor: getByActor,
	eraseEvents: eraseEvents
};

















