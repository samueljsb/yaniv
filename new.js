function readPlayerNames () {
  return document.getElementById('playerNames').value.trim().split('\n')
}

function setPlayerNames (names) {
  window.sessionStorage.setItem('playerNames', JSON.stringify(names))
}

function initScores (numPlayers) {
  const initialScores = new Array(numPlayers).fill(0)
  window.sessionStorage.setItem('scores', JSON.stringify([initialScores]))
}

function startGame () {
  const names = readPlayerNames()
  setPlayerNames(names)
  initScores(names.length)

  window.location.replace('/yaniv')
}

function main () {
  const startGameButton = document.getElementById('startGame')
  startGameButton.addEventListener('click', startGame)
  startGameButton.addEventListener('submit', startGame)
}

main()
