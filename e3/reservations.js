/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

/*********/

//can't add argument to getSystemStatus
// You may edit getSystemStatus below.  You will need to call updateSystemStatus() here, which will write to the json file
const getSystemStatus = () => {
	const status = fs.readFileSync('status.json')
	const restaurants = getAllRestaurants() //array
	const reservations = getAllReservations()//array
	updateSystemStatus(restaurants, reservations)
	return JSON.parse(status) //return type of JSON
}

/* Helper functions to save JSON */
// You can add arguments to updateSystemStatus if you want.
const updateSystemStatus = (restaurants, reservations) => {
	const status = {}
	const file = fs.readFileSync('status.json')
	let origianal_status = JSON.parse(file)
	/* Add your code below */
	const numRest = restaurants.length
	const numResv = reservations.length
	//find the maximized reservations
	const maxResv = restaurants.reduce((max, restaurant) => {
		if(restaurant.numReservations>max){
			max = restaurant.numReservations
		}
		return max
	}, 0)

	const busiestRest = restaurants.filter(restaurant=>restaurant.numReservations === maxResv)
	//log("maxResv is",busiestRest)
	const busiestRestName =  busiestRest[0].name
	//what's system start time?
	const time = new Date()
	status["numRestaurants"] = numRest;
	status["totalReservations"] = numResv;
	status["currentBusiestRestaurantName"] = busiestRestName;
	status["systemStartTime"] = new Date(origianal_status.systemStartTime);
	//log("status", status)

	fs.writeFileSync('status.json', JSON.stringify(status))
	return status
}




// Saving an array of restaurants to a JSON file
const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */
	fs.writeFileSync('restaurants.json', JSON.stringify(restaurants))
};

// Saving an array of reservations to a JSON file
const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
	fs.writeFileSync('reservations.json',JSON.stringify(reservations))
};

/*********/

// Should return an array of length 0 or 1.
const addRestaurant = (name, description) => {
	// Check for duplicate names
	const restaurants = getAllRestaurants()
	const duplicate_restaurants = restaurants.filter(restaurant => restaurant.name === name)
	if(duplicate_restaurants.length !== 0){
		return [];
	}else{
		// if no duplicate names:
		const restaurant = {name: name, description: description, numReservations:0};
		//add the restaurant to restaurant.json
		restaurants.push(restaurant)
		saveRestaurantsToJSONFile(restaurants)
		return [restaurant];
	}
}

// should return the added reservation object
const addReservation = (restaurant, time, people) => {
	/* Add your code below */
	//const formattedTime = datetime.parse(time,"MMM DD YYYY HH:mm:ss")
	const formattedTime = new Date(time) //equilent to the above line
	const reservation = {restaurant: restaurant, time: formattedTime, people: people};
	//add reservation to reservation.json
	const reservations = getAllReservations() //the array in the json file
	reservations.push(reservation)
	saveReservationsToJSONFile(reservations)

	//add numofRes in restaurant.json
	//the restaurant must exist and has exactly one
	const restaurants = getAllRestaurants()
	const corresponding_restaurant = restaurants.filter(elem => elem.name === restaurant)
	//We can edit the objects in the array directly since they have the same reference
	corresponding_restaurant[0].numReservations++;
	saveRestaurantsToJSONFile(restaurants);
	return reservation;
}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	try {
		const restaurantsFromFile = fs.readFileSync('restaurants.json')
		return JSON.parse(restaurantsFromFile) //[{...},...]
	} catch (e) {
		//log("restaurants.json doesn't exist")
		return []
	}
};

// Should return the restaurant object if found, or an empty object if the restaurant is not found.
const getRestaurantByName = (name) => {
	/* Add your code below */
	const restaurants = getAllRestaurants()
	const restaurantWithName = restaurants.filter(restaurant => restaurant.name === name)// an array
	if(restaurantWithName.length === 0){
		//log("can't find the name of the restaurant")
		return null
	}else{
		return restaurantWithName[0]//an object
	}
};

// Should return an array - check to make sure reservations.json exists
const getAllReservations = () => {
  /* Add your code below */
	try {
		const reservationsFromFile = fs.readFileSync('reservations.json')
		return JSON.parse(reservationsFromFile) //[{...},...]
	} catch (e) {
		//log("reservations.json doesn't exist")
		return []
	}
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	const reservations = getAllReservations()
	const reservationWithName = reservations.filter(reservation => reservation.restaurant=== name)
	if(reservationWithName.length === 0){
		//log("can't find the reservations for that specified restaurant")
		return []
	}else{
		//sort the array using array.sort()
		reservationWithName.sort(function (r1, r2) {
			if(r1.time < r2.time){
				return -1;
			}else if(r1.time > r2.time){
				return 1;
			}
			return 0;
		})
		return reservationWithName  //the array may contains multiple reservations of that specified restaurant
	}
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	const reservations = getAllReservations()
	//show all of the reservations for the next hour from that timenode app.js --hourResv "Mar 17 2019 16:30:00"
	//log(time)
	const givenTime = new Date(time)
	//const date1 = new Date(givenTime.getFullYear(), givenTime.getMonth(), givenTime.getDate(), givenTime.getHours()
		//, givenTime.getMinutes(),givenTime.getSeconds());
	//log("given time is ", givenTime)
	const reservationWithTime = []
	for(let i = 0;i<reservations.length;i++){

		const testTime = new Date(reservations[i].time)
		//const date2  = new Date(testTime.getFullYear(), testTime.getMonth(), testTime.getDate(), testTime.getHours()
			//, testTime.getMinutes(),testTime.getSeconds());
		const diff_hour = datetime.subtract(testTime,givenTime).toHours()
		//log("diff is",diff_hour)
		if(diff_hour < 1 && diff_hour >= 0){
			reservationWithTime.push(reservations[i])
			//log("add this res")
		}
	}

	if(reservationWithTime.length === 0){
		//log("can't find the reservations for that specified time")
		return []
	}else{
		return reservationWithTime  //the array may contains multiple reservations of that specified time period
	}
}

// should return a reservation object
const checkOffEarliestReservation = (restaurantName) => {
	const reservations = getAllReservations() // an array
	//log("before remove",reservations)
	const reservationsForRestaurant = getAllReservationsForRestaurant(restaurantName)// a sorted array
	const checkedOffReservation = reservationsForRestaurant[0];
	//modify reservation.json
	let countMove = 0;
	for (let i = 0; i < reservations.length;i++){
		const name = (reservations[i].restaurant === restaurantName)
		const time = (reservations[i].time === reservationsForRestaurant[0].time)
		//log("timeto remove is",reservationsForRestaurant[0])
		const people = (reservations[i].people === reservationsForRestaurant[0].people)

		if(((name && time)&&people)&&(countMove === 0)){
			reservations.splice(reservations.indexOf(reservations[i]), 1 );
			//log("remove this reservation")
			countMove = 1;
		}
	}
	//log("after remove", reservations)
	//this will rewrite the contents in the json file
	saveReservationsToJSONFile(reservations)

	//modify restaurant.json
	const restaurants = getAllRestaurants()
	//log("before",restaurants)
	const restaurantWithName = restaurants.filter(restaurant => restaurant.name === restaurantName)// an array with 1 elem
	restaurantWithName[0].numReservations--;
	saveRestaurantsToJSONFile(restaurants)
	//log("after",restaurants)

 	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use a functional array method
	const reservations = getAllReservations()
	//log("before",reservations)
	const reservationsWithName = reservations.filter((res) => res.restaurant === restaurant)
	const reservationsMap = reservationsWithName.map(function (reservation) {
		const time = new Date(reservation.time)
		//!!!1Make sure you are replacing the value and not just writing an expression.
		reservation.time = datetime.addMinutes(time,minutes)
		return datetime.addMinutes(time,minutes)=== reservation.time
	})
	//when saving: we will stringify the time=> so do not stringify it in map function
	saveReservationsToJSONFile(reservations)
	const reservations2 = getAllReservations()
	//log("after",reservations2)
	const output = getAllReservationsForRestaurant(restaurant)

	return output

}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}

