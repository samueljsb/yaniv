// Config

function getPlayerNames () {
  const names = JSON.parse(window.sessionStorage.getItem('playerNames'))
  return names || ['Player 1', 'Player 2']
}

function setPlayerNames (names) {
  window.sessionStorage.setItem('playerNames', JSON.stringify(names))
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
  const table = document.createElement('table')
  table.setAttribute('class', 'table')
  table.setAttribute('id', 'scoreBoard')

  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  for (const name of playerNames) {
    const th = document.createElement('th')
    th.attributes.scope = 'col'
    th.textContent = name
    headerRow.appendChild(th)
  }
  thead.appendChild(headerRow)
  table.appendChild(thead)

  const currentScores = allScores[allScores.length - 1]
  const tbody = document.createElement('tbody')
  const tr = document.createElement('tr')
  for (const score of currentScores) {
    const td = document.createElement('td')
    td.textContent = score
    tr.appendChild(td)
  }
  tbody.appendChild(tr)
  table.appendChild(tbody)

  return table
}

// Score input

function getForm () { return document.getElementById('playerInputs') }

function buildPlayerInput (name) {
  const inputElement = document.createElement('input')
  inputElement.type = 'number'
  inputElement.inputMode = 'numeric'
  inputElement.className = 'form-control'
  inputElement.name = name

  const label = document.createElement('label')
  label.htmlFor = name
  label.textContent = name

  const div = document.createElement('div')
  div.className = 'form-floating mb-3'
  div.appendChild(inputElement)
  div.appendChild(label)

  return div
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
    input.value = ''
  }
}

// Score table

function renderGameHistory (playerNames, allScores) {
  const table = document.createElement('table')
  table.setAttribute('class', 'table')
  table.setAttribute('id', 'scoreTable')

  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  for (const name of playerNames) {
    const th = document.createElement('th')
    th.attributes.scope = 'col'
    th.textContent = name
    headerRow.appendChild(th)
  }
  thead.appendChild(headerRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  for (const scores of allScores) {
    const tr = document.createElement('tr')
    for (const score of scores) {
      const td = document.createElement('td')
      td.textContent = score
      tr.appendChild(td)
    }
    tbody.appendChild(tr)
  }
  table.appendChild(tbody)

  return table
}

// Game

function calculateScore (scores, totals) {
  const newTotals = []

  for (let i = 0; i < scores.length; i++) {
    let newTotal = totals[i] + scores[i]

    if (newTotal % 50 === 0) {
      newTotal = newTotal / 2
    }

    newTotals.push(newTotal)
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

  const gameHistoryContainer = document.getElementById('gameHistory')
  const newGameHistory = renderGameHistory(playerNames, allScores)
  gameHistoryContainer.replaceChildren(newGameHistory)
}

function main () {
  if (!getAllScores()) {
    window.location.replace('/yaniv/new')
  }

  renderTables()
  initialiseForm()

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
