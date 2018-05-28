//Declare variables
let cards = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"]
 
let deck = $(".deck");
let card = $(".card");

let openCards = []; //Contains currently open cards, cleared after two are selected [see flipCard() and checkCards()]
let openCardClasses = []; //Contains card picture classes, compared to check if cards match, cleared after two are selected [see flipCard() and checkCards()]
let moves = 0; //Number of moves that have been made
let matches = 0; //Number of matches made so far
let seconds = 0; //Number of seconds since game began
let timer; //Initialize timer variable for later use
let canSelect = true; //Used to prevent users from selecting cards during timeout after wrong match
let started = false; //Whether the game has begun (first card clicked) or not, used for the timer
let score = 3; //Score starts at 3 by default (three stars) and decreases after a certain amount of moves (see below)
const twoStars = 9; //Limit for 3-star score, after this you get a two star score
const oneStar = 16; //Limit for 2-star score, after this you get a one star score

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
	$(".restart").click(gameRestart);
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
		//The if statement below checks to see if you're clicking on the same card again
		if ($(this).hasClass("open") || $(this).hasClass("match")) {
			//console.log("Nothing happens!");
		} else {
			$(this).addClass("open show"); //"Flips" over the card
			openCards.push($(this)); //Adds the clicked card into openCards list
			openCardClasses.push($(this).children().attr("class")); //Adds the clicked card's image into openCardClasses list
			checkCards();
		}
		if (started == false) {
			started = true;
			startTimer();
		}
	}
}

function checkCards() {
	if (openCardClasses.length == 2) {
		canSelect = false; //Player can't select a card right after two are picked
		if (openCardClasses[0] == openCardClasses[1]) {
			//console.log("You got a match!")
			openCards[0].toggleClass("open show match shake"); //Change first card to "match" class, remove "open" and "show" classes, and add shake class
			openCards[1].toggleClass("open show match shake"); //Change second card to "match" class, remove "open" and "show" classes, and add shake class
			
			openCards = []; //Reset openCards list
			openCardClasses = []; //Reset openCardClasses list
			canSelect = true; //Player can now select another card
			addMove();
			matches += 1;
			//console.log(matches);
			
			//Check to see if the game has been won (all eight matches made)
			if (matches === 8) {
				openModal();
				stopTimer();
			}
		} else {
			//console.log("Not a match...")
			openCards[0].addClass("shake");
			openCards[1].addClass("shake");
			setTimeout(function() {
				openCards[0].toggleClass("open show shake"); //Remove "open" and "show" classes from first card, as well as reset "shake" class
				openCards[1].toggleClass("open show shake"); //Remove "open" and "show" classes from second card, as well as reset "shake" class
				
				openCards = []; //Reset openCards list
				openCardClasses = []; //Reset openCardClasses list
				canSelect = true; //Player can now select another card (after a 1 second delay)
			}, 1000);
			addMove();
		}
	} else {
        $(this).addClass("open show"); //Add "open" and "show" classes to the first open card selected
	}
}

function addMove() {
	moves += 1;
	if (moves == 1) {
		$(".moves").text(moves + " Move");
	} else {
		$(".moves").text(moves + " Moves");
	}
	calculateScore(); //Calculates score each move
}

function gameRestart() {
	//Empty deck and then generate a new one
	$(".deck").empty();
	generateDeck();
	
	//Reset variables
	openCards = [];
	openCardClasses = [];
	moves = 0;
	seconds = 0;
	canSelect = true;
	started = false;
	$(".card").click(flipCard);
	
	//Reset moves counter
	$(".moves").text(moves + " Moves");
	//Reset timer
	$(".timer").text(seconds + " Seconds");
	stopTimer();
	//Reset score
	resetScore();
}

function timerFunction() {
	if (started == true) {
		seconds += 1;
		if (seconds == 1) {
			$(".timer").text(seconds + " Second");
		} else {
			$(".timer").text(seconds + " Seconds");
		}
	}
};

function startTimer() {
	timer = setInterval(timerFunction, 1000);
}

function stopTimer() {
	clearInterval(timer);
}

function calculateScore() {
	if (moves > twoStars && moves <= oneStar) {
		score = 2 //Score is now two stars
		$(".star3").css("display", "none"); //Hide the third star
	} else if (moves > oneStar) {
		score = 1; //Score is now one star
		$(".star2").css("display", "none"); //Hide the second star
	} else {
		score = 3
	}
}

function resetScore() {
	score = 3;
	$(".star2").css("display", "inline-block");
	$(".star3").css("display", "inline-block");
}

//Modal Configuration (Modified from https://www.w3schools.com/howto/howto_css_modals.asp)

var modal = $("#modal");
var modalCloseBtn = $(".close")[0];
var tryAgainBtn = $(".try-again");

function openModal() {
    modal.css("display", "block");
}

modalCloseBtn.onclick = function() {
    modal.css("display", "none");
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.css("display", "none");
    }
}

tryAgainBtn.click(function() {
	modal.css("display", "none");
	gameRestart();
});
