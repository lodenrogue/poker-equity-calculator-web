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
}
