const playerList = document.querySelector("player-list");
let playerHTML = '';

for (let i = 1; i <= 9; i++) {
  playerHTML += `
    <player id="player-${i}">
      <label>Player ${i}</label>
      <button>RD</button>
      <input type="text" class="input-hand">
      <input type="text" class="output-equity" readonly>
    </player>`;
}

playerList.innerHTML += playerHTML;
