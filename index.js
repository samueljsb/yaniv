// Config

function getPlayerNames () {
  const names = JSON.parse(window.sessionStorage.getItem('playerNames'))
  return names || ['Player 1', 'Player 2']
}

function setPlayerNames (names) {
  window.sessionStorage.setItem('playerNames', JSON.stringify(names))
}

function getDisabledPlayers () {
  const names = JSON.parse(window.sessionStorage.getItem('disabledPlayers'))
  return names || []
}

function setDisabledPlayers (names) {
  window.sessionStorage.setItem('disabledPlayers', JSON.stringify(names))
}

function saveScores (scores) {
  window.sessionStorage.setItem('scores', JSON.stringify(scores))
}

function getAllScores () {
  const scores = JSON.parse(window.sessionStorage.getItem('scores'))
  return scores
}

function currentScores () {
  const allScores = getAllScores()
  return allScores[allScores.length - 1]
}

function recordRound (newScores) {
  const scores = getAllScores()
  scores.push(newScores)
  saveScores(scores)
}

// New game

function showNewGameDialog () {
  document.getElementById('newGameDialog').showModal()
}

function startNewGame () {
  const playerNames = document.getElementById('playerNames').value.trim().split('\n')
  setPlayerNames(playerNames)

  initialiseForm()
  resetScores()
}

// Score board

function renderScoreBoard (playerNames, allScores) {
  const scoreBoardTemplate = document.querySelector('#scoreBoardTemplate')
  const scoreBoard = scoreBoardTemplate.content.firstElementChild.cloneNode(true)

  const currentScores = allScores[allScores.length - 1]
  for (let i = 0; i < playerNames.length; i++) {
    const name = playerNames[i]
    const score = currentScores[i]

    const scoreBoardRowTemplate = document.querySelector('#scoreBoardRowTemplate')
    const newRow = scoreBoardRowTemplate.content.firstElementChild.cloneNode(true)

    newRow.querySelector('th').textContent = name
    newRow.querySelector('td').textContent = score

    scoreBoard.querySelector('tbody').appendChild(newRow)
  }

  return scoreBoard
}

// Score input

function getForm () { return document.getElementById('playerInputs') }

function disablePlayer (name) {
  const disabledPlayers = new Set(getDisabledPlayers())
  disabledPlayers.add(name)
  setDisabledPlayers([...disabledPlayers])

  const input = document.querySelector(`#input--${name}`)
  input.value = '0'
  input.disabled = true
}

function enablePlayer (name) {
  const disabledPlayers = new Set(getDisabledPlayers())
  disabledPlayers.delete(name)
  setDisabledPlayers([...disabledPlayers])

  const input = document.querySelector(`#input--${name}`)
  input.value = ''
  input.disabled = false
}

function toggleDisabled (name) {
  getDisabledPlayers().includes(name) ? enablePlayer(name) : disablePlayer(name)
}

function buildPlayerInput (name) {
  const playerInputTemplate = document.querySelector('#playerInputTemplate')

  const playerInput = playerInputTemplate.content.firstElementChild.cloneNode(true)

  const input = playerInput.querySelector('input')
  input.name = name
  input.id = `input--${name}`
  if (getDisabledPlayers().includes(name)) {
    input.value = '0'
    input.disabled = true
  }
  const label = playerInput.querySelector('label')
  label.htmlFor = name
  label.textContent = name

  const disableButton = playerInput.querySelector('button')
  disableButton.addEventListener('click', () => toggleDisabled(name))

  return playerInput
}

function initialiseForm () {
  const form = getForm()

  form.innerHTML = ''

  const playerNames = getPlayerNames()
  for (const name of playerNames) {
    const el = buildPlayerInput(name)
    form.appendChild(el)
  }
}

function getScoresFromForm (form) {
  const inputs = form.getElementsByTagName('input')

  const scores = []
  for (const input of inputs) {
    const score = parseInt(input.value)
    if (isNaN(score)) {
      throw new Error()
    } else {
      scores.push(score)
    }
  }

  return scores
}

function clearForm (form) {
  const inputs = form.getElementsByTagName('input')

  for (const input of inputs) {
    if (getDisabledPlayers().includes(input.name)) {
      input.value = '0'
    } else {
      input.value = ''
    }
  }
}

// Score table

function renderGameHistory (playerNames, allScores) {
  const gameHistoryTemplate = document.querySelector('#gameHistoryTemplate')
  const gameHistory = gameHistoryTemplate.content.firstElementChild.cloneNode(true)

  const headerRow = gameHistory.querySelector('thead>tr')
  for (const name of playerNames) {
    const th = document.createElement('th')
    th.attributes.scope = 'col'
    th.textContent = name
    headerRow.appendChild(th)
  }

  const tbody = gameHistory.querySelector('tbody')
  for (const scores of allScores) {
    const tr = document.createElement('tr')
    for (const score of scores) {
      const td = document.createElement('td')
      td.textContent = score
      tr.appendChild(td)
    }
    tbody.appendChild(tr)
  }

  return gameHistory
}

// Game

function updateScore (totalSoFar, newPoints) {
  if (newPoints === 0) {
    return totalSoFar
  }

  let newTotal = totalSoFar + newPoints

  if (newTotal % 50 === 0) {
    newTotal = newTotal / 2
  }

  return newTotal
}

function calculateScore (scores, totals) {
  const newTotals = []

  for (let i = 0; i < scores.length; i++) {
    newTotals.push(
      updateScore(totals[i], scores[i])
    )
  }

  return newTotals
}

function submitScores () {
  const form = getForm()
  const scores = getScoresFromForm(form)

  const totals = currentScores()
  const newTotals = calculateScore(scores, totals)
  recordRound(newTotals)

  renderTables()
  clearForm(form)
}

function resetScores () {
  const playerNames = getPlayerNames()
  const initialScores = new Array(playerNames.length).fill(0)
  saveScores([initialScores])
  setDisabledPlayers([])

  initialiseForm()
  renderTables()
}

function undoLastRound () {
  const allScores = getAllScores()
  allScores.pop()
  saveScores(allScores)

  renderTables()
}

function renderTables () {
  const playerNames = getPlayerNames()
  const allScores = getAllScores()

  const scoreBoardContainer = document.getElementById('scoreBoard')
  const newScoreBoard = renderScoreBoard(playerNames, allScores)
  scoreBoardContainer.replaceChildren(newScoreBoard)

  const gameHistory = document.getElementById('gameHistory')
  const newGameHistory = renderGameHistory(playerNames, allScores)
  gameHistory.replaceWith(newGameHistory)
}

function main () {
  if (!getAllScores()) {
    resetScores()
    showNewGameDialog()
  }

  renderTables()
  initialiseForm()

  const newGameButton = document.getElementById('newGameButton')
  newGameButton.addEventListener('click', showNewGameDialog)

  const startGameButton = document.getElementById('startNewGameButton')
  startGameButton.addEventListener('click', startNewGame)

  const submitButton = document.getElementById('submitScores')
  submitButton.addEventListener('click', submitScores)
  submitButton.addEventListener('submit', submitScores)

  const resetButton = document.getElementById('resetScores')
  resetButton.addEventListener('click', resetScores)

  const undoButton = document.getElementById('undoLastRound')
  undoButton.addEventListener('click', undoLastRound)
}

main()
