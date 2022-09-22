'use strict'

const MINE_IMG = '<img src="img/mine.png">'
const FLAG_IMG = '<img src="img/flag.png">'

var gBoard
var gLevel
var gGame
var gFirstClick
var gTimeInterval
var gCurrLevel

function initGame() {
  gGame = { isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0 }
  gFirstClick = true
  gLevel = { SIZE: 4, MINES: 2, LIVES: 1 }
  gCurrLevel = { ...gLevel }
  gBoard = buildBoard()
  renderBoard(gBoard)
}

function buildBoard() {
  var board = []

  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        isShown: false,
        isMine: false,
        isSaved: false,
        isMarked: false,
        minesAroundCount: 0,
      }
    }
  }

  //   console.table(board)
  return board
}

function renderBoard(board) {
  var elBoard = document.querySelector('.board')
  var strHTML = ''

  for (var i = 0; i < board.length; i++) {
    strHTML += '\n<tr>\n'
    for (var j = 0; j < board[i].length; j++) {
      const currCell = board[i][j]

      strHTML += `\t<td class="cell cell-${i}-${j}" onmouseup="clickedCell(this, ${i}, ${j})" >\n`
      if (currCell.isMine && currCell.isShown) strHTML += MINE_IMG
      else if (!currCell.isMine) currCell.innertext = currCell.minesAroundCount
    }
    strHTML += '\n</tr>'
  }
  //   console.log(strHTML)
  elBoard.innerHTML = strHTML
}

function playAgain() {
  clearInterval(gTimeInterval)
  gBoard = buildBoard()
  renderBoard(gBoard)
  gGame.isOn = true
  document.getElementById('clock').innerHTML = '00:00:00'
  document.getElementById('emoji').innerHTML = '&#128515;'
  gLevel.LIVES = gCurrLevel.LIVES
  for (var i = 1; i <= gLevel.LIVES; i++) {
    var elHeart = document.getElementById(`heart${i}`)
    elHeart.classList.remove('hidden')
    // if (elHeart.classList) {

    // }
  }

  gGame.isShown = 0
  gGame.isMarked = 0
  gFirstClick = true
}

function gameLost() {
  gGame.isOn = false
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var elCell = document.querySelector(`.cell-${i}-${j}`)
      var cell = gBoard[i][j]

      if (!cell.isShown && cell.isMine) {
        cell.isShown = true
        elCell.innerHTML = MINE_IMG
        elCell.classList.add('mine')
      }
      // need to take off (add .hidden) to last heart
      // document.getElementById(`heart${gLevel.LIVES - 1}`).classList.add('hidden')
      clearInterval(gTimeInterval)
    }
  }
  var emoji = document.getElementById('emoji')
  emoji.innerHTML = '&#129327;'
  console.log('Game lost')
}

function checkGameOver() {
  for (var i = 0; i < gLevel.SIZE - 1; i++) {
    for (var j = 0; j < gLevel.SIZE - 1; j++) {
      var cell = gBoard[i][j]
      if ((!cell.isMine && !cell.isShown) || (cell.isMine && !cell.isShown && !cell.isMarked && !cell.isSaved)) return
    }
  }
  gGame.isOn = false
  clearInterval(gTimeInterval)
  var emoji = document.getElementById('emoji')
  emoji.innerHTML = '&#128526;'
  console.log('You win!')
}

// doesnt work yet

function expandShown(board, elCell, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
      var cell = board[i][j]
      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue

      if (!cell.isShown) {
        cell.isShown = true
        elCurrCell.classList.add('shown')
        gGame.shownCount++
        if (cell.minesAroundCount && !cell.isMine) {
          elCurrCell.innerHTML = cell.minesAroundCount
        }
      }
    }
  }
}

function setRandomMines(numOfMines, gameSize, board) {
  var minesCount = 0

  while (minesCount < numOfMines) {
    var cellI = getRandomIntInclusive(0, gameSize - 1)
    var cellJ = getRandomIntInclusive(0, gameSize - 1)
    var cell = board[cellI][cellJ]

    if (!cell.isMine && !cell.isShown) {
      cell.isMine = true
      minesCount++
    }
  }
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      board[i][j].minesAroundCount = countNegsMines(i, j, board)
    }
  }
}

function countNegsMines(cellI, cellJ, board) {
  var negsMinesCount = 0

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue
      var cell = board[i][j]
      if (cell.isMine) negsMinesCount++
    }
  }
  return negsMinesCount
}

function cellMarked(elCell, i, j) {
  if (!gGame.isOn) return
  var cell = gBoard[i][j]
  if (!cell.isShown) {
    if (cell.isMarked) {
      cell.isMarked = false
      elCell.innerHTML = ''
      gGame.markedCount--
    } else {
      cell.isMarked = true
      elCell.innerHTML = FLAG_IMG
      gGame.markedCount++
    }
  }
}

function clickedCell(elCell, i, j) {
  if (!gGame.isOn) return
  var cell = gBoard[i][j]
  var elCell = elCell

  elCell.onclick = () => {
    if (cell.isShown || cell.isMarked) return

    if (cell.isMine) {
      if (gLevel.LIVES > 1) {
        document.getElementById(`heart${gLevel.LIVES}`).classList.add('hidden')
        gLevel.LIVES--
        elCell.classList.add('mine')
        elCell.innerHTML = MINE_IMG
        cell.isSaved = true
        return
      }
      elCell.classList.add('mine')
      elCell.innerHTML = MINE_IMG
      gameLost()
    } else {
      cell.isShown = true
      elCell.classList.add('shown')
      gGame.shownCount++
      checkGameOver()
    }

    // console.log(gBoard)
    // console.log(elCell)

    if (!cell.minesAroundCount && !gFirstClick) expandShown(gBoard, elCell, i, j)

    if (cell.minesAroundCount && !cell.isMine) {
      elCell.innerHTML = cell.minesAroundCount
    }

    if (gFirstClick) {
      setRandomMines(gLevel.MINES, gLevel.SIZE, gBoard)
      setMinesNegsCount(gBoard)
      gameTimer()
      gFirstClick = false
    }
  }
  elCell.oncontextmenu = () => {
    if (!gGame.isOn) return
    cellMarked(elCell, i, j)
    checkGameOver()
  }
}
