class UIController {

    constructor() {
	this.createPlayers();
	this.initializeHandInputs();
	this.initializeBoardInput();
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

    attachPokerInputValidation(inputField, maxChars) {
	const isRank = char => /[2-9AKQJT]/i.test(char);
	const isSuit = char => /[CHSD]/i.test(char);

	inputField.addEventListener('input', (event) => {
            const cursorPosition = inputField.selectionStart;
            const currentInputValue = inputField.value;

            let formattedValue = '';
            let expectRank = true;

            for (const char of currentInputValue) {
		if (formattedValue.length === maxChars) break;

		if (expectRank && isRank(char)) {
                    formattedValue += char.toUpperCase();
                    expectRank = false;
		} else if (!expectRank && isSuit(char)) {
                    formattedValue += char.toLowerCase();
                    expectRank = true;
		}
            }

            if (currentInputValue !== formattedValue) {
		const lengthDifference = currentInputValue.length - formattedValue.length;
		const adjustedPosition = Math.max(0, cursorPosition - lengthDifference);

		inputField.value = formattedValue;
		inputField.setSelectionRange(adjustedPosition, adjustedPosition);
            }
	});
    }

    initializeBoardInput() {
	const boardInput = document.getElementById("board-input");
	if (boardInput) {
            this.attachPokerInputValidation(boardInput, 10);
	}
    }

    initializeHandInputs() {
	for (let i = 1; i <= MAX_PLAYERS; i++) {
            const playerInput = document.getElementById(`hand-input-${i}`);
            if (playerInput) {
		this.attachPokerInputValidation(playerInput, 4);
            }
	}
    }

    initializeButtons() {
	this.initializeRandomButtons();
	this.initializeClearButton();
	this.initializeEvaluateButton();
    }

    initializeRandomButtons() {
	for (let i = 1; i <= MAX_PLAYERS; i++) {
	    const button = document.querySelector(`#random-button-${i}`);
	    const handInput = document.querySelector(`#hand-input-${i}`);

	    button.addEventListener('click', () => {
		if(i === 1) {
		    handInput.value = handInput.value == "random" ? "" : "random";
		} else if(i === 2) {
		    const thirdHandInput = document.querySelector("#hand-input-3");

		    if (thirdHandInput.value != "random") {
			handInput.value = handInput.value == "random" ? "" : "random";
		    }
		} else {
		    handInput.value = "random";
		}

		if (i > 1) {
		    for(let j = 2; j <= MAX_PLAYERS; j++) {
			if (j === i) continue;

			const otherHandInput = document.querySelector(`#hand-input-${j}`);
			otherHandInput.value = j < i ? "random" : "";
		    }
		}
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
	if (hand.length === 2) return [hand];
	return [hand.slice(0, 2), hand.slice(2, 4)];
    }
}
