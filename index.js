// Config

function getPlayerNames () {
  const urlParams = new URLSearchParams(window.location.search)
  const players = urlParams.get('players')

  if (players) {
    return players.split(',')
  } else {
    return ['Player 1', 'Player 2']
  }
}

// Score board

function getScoreBoard () { return document.getElementById('scoreBoard') }

function updateScoreBoard (table, scores) {
  const tbody = table.getElementsByTagName('tbody')[0]
  const row = tbody.getElementsByTagName('tr')[0]
  const cells = row.getElementsByTagName('td')

  for (let i = 0; i < scores.length; i++) {
    const cell = cells[i]
    cell.textContent = scores[i]
  }
}

// Score input

function getForm () { return document.getElementById('playerInputs') }

function buildPlayerInput (name) {
  const inputElement = document.createElement('input')
  inputElement.type = 'number'
  inputElement.className = 'form-control'
  inputElement.id = name
  inputElement.required = true

  const innerDiv = document.createElement('div')
  innerDiv.className = 'col-sm-10'
  innerDiv.appendChild(inputElement)

  const label = document.createElement('label')
  label.htmlFor = name
  label.className = 'col-sm-2 col-form-label'
  label.textContent = name

  const outerDiv = document.createElement('div')
  outerDiv.className = 'row mb-3'
  outerDiv.appendChild(label)
  outerDiv.appendChild(innerDiv)

  return outerDiv
}

function initialiseForm (form, playerNames) {
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

function getTable () { return document.getElementById('scoreTable') }

function initialiseTable (table, playerNames) {
  const thead = table.getElementsByTagName('thead')[0]
  const row = thead.getElementsByTagName('tr')[0]

  for (const name of playerNames) {
    const header = document.createElement('th')
    header.attributes.scope = 'col'
    header.textContent = name
    row.appendChild(header)
  }

  const tbody = table.getElementsByTagName('tbody')[0]
  const startRow = document.createElement('tr')
  tbody.appendChild(startRow)

  for (let i = 0; i < playerNames.length; i++) {
    const startingScore = document.createElement('td')
    startingScore.textContent = '0'
    startRow.appendChild(startingScore)
  }
}

function getTotalsFromTable (table) {
  const tbody = table.getElementsByTagName('tbody')[0]
  const rows = tbody.getElementsByTagName('tr')
  const row = rows[rows.length - 1]

  const cells = row.getElementsByTagName('td')

  const scores = []
  for (const cell of cells) {
    scores.push(parseInt(cell.textContent))
  }

  return scores
}

function addScoresToTable (table, scores) {
  const tbody = table.getElementsByTagName('tbody')[0]
  const row = document.createElement('tr')
  tbody.appendChild(row)

  for (const score of scores) {
    const td = document.createElement('td')
    td.textContent = score.toString()
    row.appendChild(td)
  }
}

// Game

function calculateScore (scores, totals) {
  const newTotals = []

  console.log(scores)
  console.log(totals)

  for (let i = 0; i < scores.length; i++) {
    let newTotal = totals[i] + scores[i]

    if (newTotal % 50 === 0) {
      newTotal = newTotal / 2
    }

    newTotals.push(newTotal)
  }

  console.log(newTotals)
  return newTotals
}

function submitScores () {
  const form = getForm()
  const scores = getScoresFromForm(form)

  const table = getTable()
  const totals = getTotalsFromTable(table)

  const newTotals = calculateScore(scores, totals)
  addScoresToTable(table, newTotals)

  const scoreBoard = getScoreBoard()
  updateScoreBoard(scoreBoard, newTotals)

  clearForm(form)
}

function main () {
  const playerNames = getPlayerNames()

  const scoreBoard = getScoreBoard()
  initialiseTable(scoreBoard, playerNames)

  const form = getForm()
  initialiseForm(form, playerNames)

  const table = getTable()
  initialiseTable(table, playerNames)

  const submitButton = document.getElementById('submitScores')
  submitButton.addEventListener('click', submitScores)
}

main()
