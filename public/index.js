'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

console.log(bars);
console.log(events);
console.log(actors);

// Step 1 : Euro People
events.forEach(function (event) {
    bars.forEach(function (bar) {
        if (bar.id == event.barId) {
            event.price = bar.pricePerHour*event.time + bar.pricePerPerson*event.persons;
        }
    });
})

// Step 2 : Send more, pay less 
events.forEach(function (event) {
    if (event.persons > 10 && event.persons <= 20) {
        event.price = 0.9 * event.price;
    }
    else if (event.persons > 20 && event.persons <= 60) {
        event.price = 0.7 * event.price;
    }
    else if (event.persons > 60) {
        event.price = 0.5 * event.price;
    }
});

// Step 3 : Give me all your money
events.forEach(function (event) {
    var commission = 0.3 * event.price;
    event.commission.insurance = 0.5 * commission;
    event.commission.treasury = event.persons;
    event.commission.privateaser = commission - event.commission.treasury - event.commission.insurance;
})

// Step 4 : The famous deductible
events.forEach(function (event) {
    if (event.options.deductibleReduction) {
        event.price = event.price + event.persons;
    }
})

// Step 5 : Pay the actors
actors.forEach(function (actor) {
    events.forEach(function (event) {
        if (event.id == actor.eventId) {
            actor.payment[0].amount = event.price;
            var commission = event.commission.insurance + event.commission.privateaser + event.commission.treasury;
            actor.payment[1].amount = event.price - commission;
            actor.payment[2].amount = event.commission.insurance;
            actor.payment[3].amount = event.commission.treasury;
            actor.payment[4].amount = event.commission.privateaser;
            if (event.options.deductibleReduction) {
                actor.payment[4].amount += event.persons;
            }
        }
    })
})

