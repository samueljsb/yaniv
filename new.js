function playerNames () {
  return document.getElementById('playerNames').value.trim().split('\n')
}

function startGame () {
  const names = playerNames()
  const joinedNames = names.join(',')

  const urlParams = new URLSearchParams()
  urlParams.set('players', joinedNames)

  window.location.replace(`/?${urlParams.toString()}`)
}

function main () {
  const startGameButton = document.getElementById('startGame')
  startGameButton.addEventListener('click', startGame)
}

main()
