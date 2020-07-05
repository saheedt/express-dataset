const extractDistinctActors = (events) => {
  const output = [];
  events.map((event) => {
    if (output.length <= 0) {
      output.push(event.actor);
      return;
    }
    const exists = output.find((actor) => actor.id === event.actor.id);
    if (!exists) {
      output.push(event.actor);
    }
  });
  return output;
};

const extractAllActors = (events) => events.map((event) => event.actor);

const containsInvalidAttr = (incoming, allowed) => {
  let inValidFound = false;
  incoming.forEach((item) => {
    const found = allowed.includes(item);
    if (!found) {
      inValidFound = true;
    }
  });
  return inValidFound;
};

const actorStreak = (events) => {
  const actors = extractDistinctActors(events);
  actors.forEach((actor) => {
    actor.streak = 0;
    for (let index = 0; index < events.length; index++) {
      if (events[index + 1]) {
        if (
          actor.id === events[index].actor.id &&
          actor.id === events[index + 1].actor.id
        ) {
          const days =
            (new Date(events[index].created_at).getTime() -
              new Date(events[index + 1].created_at).getTime()) / (1000 * 3600 * 24);
          if (days <= 1) {
            actor.streak = actor.streak + 1;
          }
        }
      }
    }
  });
  return actors;
}

const sortActorByStreak = (actors) => {
  return actors.sort((a, b) => b.streak - a.streak);
}

const removeActorStreak = (actors) => {
  return actors.map((actor) => {
    delete actor.streak;
    return actor
  });
};


const allowedActorUpdateAttrs = ["id", "avatar_url"];

module.exports = {
  extractDistinctActors,
  extractAllActors,
  containsInvalidAttr,
  actorStreak,
  sortActorByStreak,
  removeActorStreak,
  allowedActorUpdateAttrs,
};
