class UIController {

    constructor() {
	this.createPlayers();
	this.initializeButtons();
	this.game = new Game();
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
		<input type="text" class="output-equity" readonly id="output-equity-${i}">
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
		handInput.value = handInput.value == "random" ? "" : "random";
	    });
	}
    }

    initializeClearButton() {
	const button = document.querySelector("#btn-clear");

	button.addEventListener("click", () => {
	    const boardInput = document.querySelector("#board-input");
	    boardInput.value = "";

	    for (let i = 1; i <= MAX_PLAYERS; i++) {
		const handInput = document.querySelector(`#hand-input-${i}`);
		const equityOutput = document.querySelector(`#output-equity-${i}`);

		handInput.value = "";
		equityOutput.value = "";
	    }
	});
    }

    initializeEvaluateButton() {
	const button = document.querySelector("#btn-evaluate");

	button.addEventListener("click", () => {
	    const players = this.getPlayers();
	    const board = this.getBoard();

	    const playerEquity = this.game.evaluate(players, board);
	    const equityOutput = document.querySelector("#output-equity-1");
	    equityOutput.value = playerEquity;
	});
    }

    getBoard() {
	const boardInput = document.querySelector("#board-input");
	const rawBoard = boardInput.value;
	const board = [];
	
	for(let i = 0; i < rawBoard.length / 2; i++) {
	    if(i >= 5) break;
	    const offset = i * 2;
	    board.push(rawBoard.slice(offset, offset + 2))
	}
	return board;
    }

    getPlayers() {
	let players = [];

	for (let i = 1; i <= MAX_PLAYERS; i++) {
	    const handInput = document.querySelector(`#hand-input-${i}`);
	    const hand = handInput.value

	    if(hand) {
		players.push({
		    "id": i,
		    "hand": this.getHandCards(hand)
		});
	    }
	}

	return players;
    }

    getHandCards(hand) {
	if (hand == "random") return ["random"];
	if (hand.length == 2) return [hand];
	return [hand.slice(0, 2), hand.slice(2, 4)];
    }
}
