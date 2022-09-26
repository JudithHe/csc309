/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' 
		//in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	const newBookName = document.querySelector('#newBookName').value;
	const newBookAuthor = document.querySelector('#newBookAuthor').value;
	const newBookGenre = document.querySelector('#newBookGenre').value;
	//no need to change book's value in this block any more! Use const is enough 
	const book = new Book(newBookName, newBookAuthor, newBookGenre);
	libraryBooks.push(book);

	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(book);
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const bookId = parseInt(document.querySelector('#loanBookId').value);  
	const patronCardNum = parseInt(document.querySelector('#loanCardNum').value);

	// Add patron to the book's patron property
	try{
		libraryBooks[bookId].patron = patrons[patronCardNum];
	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(libraryBooks[bookId]);

	// Start the book loan timer.
	libraryBooks[bookId].setLoanTime();
	//console.log('successful!')
	}catch{
		log("Such book or patron doesn't exist!")
	}

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	if(e.target.classList.contains('return')){
	// Call removeBookFromPatronTable()
		// Use Id to represent book! Every <> is a layer in DOM.
		const bookId = parseInt(e.target.parentElement.parentElement.firstElementChild.innerText);
		const book = libraryBooks[bookId];
		removeBookFromPatronTable(book);
	// Change the book object to have a patron of 'null'
		book.patron = null;
	}

}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const patronName = document.querySelector('#newPatronName').value;
	const newPatron = new Patron(patronName);
	patrons.push(newPatron);
	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(newPatron);
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	const bookId = parseInt(document.querySelector('#bookInfoId').value);
	const book = libraryBooks[bookId];
	// Call displayBookInfo()	
	displayBookInfo(book);
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/
// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	var row = bookTable.insertRow(bookTable.rows.length);
	//console.log(bookTable.rows);
	var tableBookID = row.insertCell(0);
	var tableTitle = row.insertCell(1);
	var tablePatronCardNumber = row.insertCell(2);
	tableBookID.innerHTML = book.bookId;
	tableTitle.innerHTML = "<strong>" + book.title + "</strong>";
	//book.patron will be given null value if no patron exist!
	tablePatronCardNumber.innerHTML = book.patron;


}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	bookInfo.children[0].innerHTML = "<p>Book Id: <span>"+book.bookId+"</span></p>";
	bookInfo.children[1].innerHTML = "<p>Title: <span>"+book.title+"</span></p>";
	bookInfo.children[2].innerHTML = "<p>Author: <span>"+book.author+"</span></p>";
	bookInfo.children[3].innerHTML = "<p>Genre: <span>"+book.genre+"</span></p>";
	if(book.patron !== null){
		bookInfo.children[4].innerHTML = "<p>Currently loaned out to: <span>"+book.patron.name+"</span></p>";
	}else{
		bookInfo.children[4].innerHTML = "<p>Currently loaned out to: <span>N/A</span></p>";
	}
	
}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	//patron List: patronEntries is listed by the patron's card Number
	try{
		var targetPatron = patronEntries.children[book.patron.cardNumber];
		var newRow = document.createElement("tr");
		newRow.innerHTML =	"<td>\n" +  book.bookId + "\n</td>\n"
							+ "<td>\n<strong>" +  book.title + "</strong>\n</td>\n"
							+ "<td>\n <span class=\"green\">Within due date</span>\n</td>\n"
							+ "<td>\n<button class=\"return\">return</button>\n</td>\n"
							

		targetPatron.lastElementChild.children[0].appendChild(newRow);
		bookTable.children[0].children[book.bookId+1].lastElementChild.innerHTML = book.patron.cardNumber;
	}catch{
		log("such book or patron doesn't exist!")
	}

}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	var newPatron = document.createElement("div");
	newPatron.className = 'patron';
	newPatron.innerHTML = "<p>Name: <span class='bold'>" + patron.name + "</span></p>" + 
	 		"<p>Card Number: <span class='bold'>" + patron.cardNumber + "</span></p>" +
	 		"<h4>Books on loan:</h4>";
	var table = document.createElement("table");
	table.className = 'patronLoansTable';
	table.innerHTML = "<tbody>\n"+ "<tr>\n"
						+ "<th>\n" + "BookID" + "\n</th>\n"
						+ "<th>\n" + "Title" + "\n</th>\n"
						+ "<th>\n" + "Status" + "\n</th>\n"
						+ "<th>\n" + "Return" + "\n</th>\n"
						+ "</tr>\n"
						+ "</tbody>\n";

	newPatron.appendChild(table);
	patronEntries.appendChild(newPatron);

}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const patronidx = book.patron.cardNumber;
	const targetTable = patronEntries.children[patronidx].lastElementChild.children[0];
	//bookId+1 is loan context

	//!!!after remove a child from the table, the length of the table must be updated immediately
	for (let bookidx = 1; bookidx < targetTable.children.length; bookidx++) {
		//console.log(targetTable.children[bookidx].firstElementChild);
		if(parseInt(targetTable.children[bookidx].firstElementChild.innerText) === book.bookId){
			targetTable.removeChild(targetTable.children[bookidx]);
		}
		//console.log(bookidx);
	}
	bookTable.children[0].children[book.bookId+1].lastElementChild.innerHTML = "";
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	const patronidx = book.patron.cardNumber;
	const targetTable = patronEntries.children[patronidx].lastElementChild.children[0];
	//log(targetTable);<tbody>
	const len = targetTable.children.length;
	for (let bookidx = 1; bookidx < len; bookidx++) {
		//log(parseInt(targetTable.children[bookidx].firstElementChild.innerText));
		//log(book.bookId);
		if(parseInt(targetTable.children[bookidx].firstElementChild.innerText) === book.bookId){
			targetTable.children[bookidx].children[2].innerHTML = "<span class=\"red\">Overdue</span>";
		}
	}
	
}

