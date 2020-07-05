const allowedActorUpdateAttrs = ["id", "avatar_url", "login"];
const actorsSortAttrs = {
  streak: "streak",
  events: "events"
};

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
    actor[`${actorsSortAttrs.streak}`] = 0;
    for (let index = 0; index < events.length; index++) {
      if (events[index + 1]) {
        if (
          actor.id === events[index].actor.id &&
          actor.id === events[index + 1].actor.id
        ) {
          const days =
            (new Date(events[index].created_at).getTime() -
              new Date(events[index + 1].created_at).getTime()) /
            (1000 * 3600 * 24);
          if (days <= 1) {
            actor[`${actorsSortAttrs.streak}`] =
              actor[`${actorsSortAttrs.streak}`] + 1;
          }
        }
      }
    }
  });
  return actors;
};

const actorEvents = (events) => {
  const actors = extractDistinctActors(events);
  actors.forEach((actor) => {
    actor[`${actorsSortAttrs.events}`] = 0;
    for (let index = 0; index < events.length; index++) {
      if (actor.id === events[index].actor.id) {
        actor[`${actorsSortAttrs.events}`] =
          actor[`${actorsSortAttrs.events}`] + 1;
      }
    }
  });
  return actors;
};

const sortActorByAttribute = (actors, attr) => {
  return actors.sort((a, b) => b[attr] - a[attr]);
};

const removeActorAttribute = (actors, attr) => {
  return actors.map((actor) => {
    delete actor[attr];
    return actor;
  });
};

const getActorsBystreak = (events) => {
  let actors = actorStreak(events);
  actors = sortActorByAttribute(actors, actorsSortAttrs.streak);
  actors = removeActorAttribute(actors, actorsSortAttrs.streak);
  return actors;
};

const getActorsByAssociatedEvents = (events) => {
  let actors = actorEvents(events);
  actors = sortActorByAttribute(actors, actorsSortAttrs.events);
  actors = removeActorAttribute(actors, actorsSortAttrs.events);
  return actors;
}


module.exports = {
  allowedActorUpdateAttrs,
  extractDistinctActors,
  extractAllActors,
  containsInvalidAttr,
  getActorsBystreak,
  getActorsByAssociatedEvents,
};
