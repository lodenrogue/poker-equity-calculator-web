class UIController {

    constructor() {
	this.createPlayers();
	this.initializeButtons();
    }

    createPlayers() {
	const playerList = document.querySelector("player-list");
	let playerHTML = '';

	for (let i = 1; i <= MAX_PLAYERS; i++) {
	playerHTML += `
	    <player>
		<label>Player ${i}</label>
		<button id="random-button-${i}">RD</button>
		<input type="text" class="hand-input" id="hand-input-${i}">
		<input type="text" class="output-equity" readonly>
	    </player>`;
	}

	playerList.innerHTML = playerHTML;
    }

    initializeButtons() {
	this.initializeRandomButtons();
	this.initializeClearButton();
	this.initializeEvaluateButton();
    }

    initializeRandomButtons() {
	for (let i = 1; i <= MAX_PLAYERS; i++) {
	    const button = document.querySelector(`#random-button-${i}`);

	    button.addEventListener('click', () => {
		const handInput = document.querySelector(`#hand-input-${i}`);
		handInput.value = "random";
	    });
	}
    }

    initializeClearButton() {
	const button = document.querySelector("#btn-clear");

	button.addEventListener("click", () => {
	    for (let i = 1; i <= MAX_PLAYERS; i++) {
		const handInput = document.querySelector(`#hand-input-${i}`);
		handInput.value = "";
	    }
	});
    }

    initializeEvaluateButton() {
	const button = document.querySelector("#btn-evaluate");

	button.addEventListener("click", () => {
	    const players = this.getPlayers();
	    const board = this.getBoard();

	    //const evaluatedPlayers = game.evaluate(players, board);
	    //updateEquity(evaluatedPlayers);
	});
    }

    getBoard() {
	const boardInput = document.querySelector("#board-input");
	return boardInput.value;
    }

    getPlayers() {
	let players = [];

	for (let i = 1; i <= MAX_PLAYERS; i++) {
	    const handInput = document.querySelector(`#hand-input-${i}`);
	    const hand = handInput.value

	    if(hand) {
		players.push({
		    "id": i,
		    "hand": hand
		});
	    }
	}

	return players;
    }
}
