//Declare variables
let cards = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"]
 
let deck = $(".deck");
let card = $(".card");

let openCards = []; //Contains currently open cards, cleared after two are selected [see flipCard() and checkCards()]
let openCardClasses = []; //Contains card picture classes, compared to check if cards match, cleared after two are selected [see flipCard() and checkCards()]
let moves = 0; //Number of moves that have been made
let seconds = 0; //Number of seconds since game began
let canSelect = true; //Used to prevent users from selecting cards during timeout after wrong match
const twoStars = 20; //Limit for 3-star score
const oneStar = 28; //Limit for 2-star score

//Create card element and add HTML inside the deck
function createCard(cardClass) {
	deck.append(`<li class="card"><i class="${cardClass}"></i></li>`);
}
 
 //Shuffles card list, creates each card, and adds their HTML to the page
function generateDeck() {
    shuffle(cards).forEach(createCard);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Generate new deck when the DOM is loaded
$(document).ready(function() {
    generateDeck();
	$(".card").click(flipCard);
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function flipCard() {
	if (canSelect == true){
		$(this).addClass("open show"); //"Flips" over the card
		openCards.push($(this)); //Adds the clicked card into openCards list
		openCardClasses.push($(this).children().attr("class")); //Adds the clicked card's image into openCardClasses list
		checkCards();
		
		moves += 1;
		if (moves == 1) {
			$(".moves").text(moves + " Move");
		} else {
			$(".moves").text(moves + " Moves");
		}
	}
}

function checkCards() {
	if (openCardClasses.length == 2) {
		canSelect = false; //Player can't select a card right after two are picked
		if (openCardClasses[0] == openCardClasses[1]) {
			console.log("You got a match!")
			openCards[0].toggleClass("open show match"); //Change first card to "match" class and remove "open" and "show" classes
			openCards[1].toggleClass("open show match"); //Change second card to "match" class and remove "open" and "show" classes
			
			openCards = []; //Reset openCards list
			openCardClasses = []; //Reset openCardClasses list
			canSelect = true; //Player can now select another card
		} else {
			console.log("Not a match...")
			
			setTimeout(function() {
				openCards[0].toggleClass("open show"); //Remove "open" and "show" classes from first card
				openCards[1].toggleClass("open show"); //Remove "open" and "show" classes from second card
				
				openCards = []; //Reset openCards list
				openCardClasses = []; //Reset openCardClasses list
				canSelect = true; //Player can now select another card (after a 1 second delay)
			}, 1000);
		}
	} else {
        $(this).addClass("open show"); //Add "open" and "show" classes to the first open card selected
	}
}
