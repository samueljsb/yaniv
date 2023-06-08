function readPlayerNames () {
  return document.getElementById('playerNames').value.trim().split('\n')
}

function startGame () {
  const names = readPlayerNames()
  const joinedNames = names.join(',')

  const urlParams = new URLSearchParams()
  urlParams.set('players', joinedNames)

  window.location.replace(`/yaniv?${urlParams.toString()}`)
}

function main () {
  const startGameButton = document.getElementById('startGame')
  startGameButton.addEventListener('click', startGame)
  startGameButton.addEventListener('submit', startGame)
}

main()
