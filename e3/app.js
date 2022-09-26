/* E3 app.js */
'use strict';

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');

// datetime available if needed
const datetime = require('date-and-time') 

const yargs_argv = yargs.argv
//log(yargs_argv) // uncomment to see what is in the argument array

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	if (rest.length > 0) {
		/* complete */
        log(`Added restaurant ${rest[0].name}.`)
	} else {
		/* complete */ 
        log("Duplicate restaurant not added.")
	}
}

if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);
	//log(resv.time)
	//resv.time is 2018-11-17T17:15:00.000Z
	const formattedTime  = datetime.format(resv.time, 'MMM DD YYYY [at] h:mm A')
	// Produce output below
	log(`Added reservation at ${resv.restaurant} on ${formattedTime} for ${resv.people} people.`)
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	// Produce output below
	//log(restaurants)
	let output = ""
	for (let i = 0; i < restaurants.length; i++) {
		const formatRest = restaurants[i].name + ": " + restaurants[i].description + " - "+
			restaurants[i].numReservations + " active reservations" + "\n"
		output = output + formatRest
	}
	log(output)
}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurantByName(yargs_argv['restInfo']);
	//log(restaurants)
	// Produce output below
	const formatRest = restaurants.name + ": " + restaurants.description + " - "+
		restaurants.numReservations + " active reservations"
	log(formatRest)
}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary

	// Produce output below
	let output = "Reservations for "+restaurantName+":\n";
	for(let i = 0; i<reservationsForRestaurant.length;i++){
		//log("type1",  reservationsForRestaurant[i].time)//->type is string
		const Time = new Date(reservationsForRestaurant[i].time)
		const formattedTime  = datetime.format(Time, 'MMM DD YYYY, h:mm A')
		output = output + "- " + formattedTime + ", table for " + reservationsForRestaurant[i].people + "\n"
	}
	log(output)
}


if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary
	//log(reservationsForRestaurant)
	// Produce output below
	let output = "Reservations in the next hour:\n";
	for(let i = 0; i<reservationsForRestaurant.length;i++){
		//log("type1",  reservationsForRestaurant[i].time)//->type is string
		const Time = new Date(reservationsForRestaurant[i].time)
		const formattedTime  = datetime.format(Time, 'MMM DD YYYY, h:mm A')
		output += "- "+ reservationsForRestaurant[i].restaurant+ ": " + formattedTime +
			", table for " + reservationsForRestaurant[i].people + "\n"
	}
	log(output)

}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	//log("earliestReservation",earliestReservation)
	// Produce output below
	const time = new Date(earliestReservation.time)
	const formattedTime  = datetime.format(time, 'MMM DD YYYY, h:mm A')
	const output = `Checked off reservation on ${formattedTime}, table for ${earliestReservation.people}`
	log(output)
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	

	// Produce output below
	let output = "Reservations for "+args[0]+":\n";
	for(let i = 0; i<resv.length;i++){
		//log("type1",  reservationsForRestaurant[i].time)//->type is string
		const Time = new Date(resv[i].time)
		const formattedTime  = datetime.format(Time, 'MMM DD YYYY, h:mm A')
		output = output + "- " + formattedTime + ", table for " + resv[i].people + "\n"
	}
	log(output)
	
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()
	//log(status)
	// Produce output below
    let output = `Number of restaurants: ${status.numRestaurants}\n`
    output+= `Number of total reservations: ${status.totalReservations}\n`
    output+=`Busiest restaurant: ${status.currentBusiestRestaurantName}\n`
    const formattedTime = datetime.format(new Date(status.systemStartTime),"MMM DD YYYY, h:mm A")
    output+=`System started at: ${formattedTime}`
    log(output)
}

