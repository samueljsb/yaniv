function readPlayerNames () {
  return document.getElementById('playerNames').value.trim().split('\n')
}

function setPlayerNames (names) {
  window.sessionStorage.setItem('playerNames', JSON.stringify(names))
}

function startGame () {
  const names = readPlayerNames()
  setPlayerNames(names)

  window.location.replace('/yaniv')
}

function main () {
  const startGameButton = document.getElementById('startGame')
  startGameButton.addEventListener('click', startGame)
  startGameButton.addEventListener('submit', startGame)
}

main()
