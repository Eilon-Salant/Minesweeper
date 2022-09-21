'use strict'

const BOMB_IMG = '<img src="img/bomb.png">'
const FLAG_IMG = '<img src="img/flag.png">'

var gBoard
var gLevel = { SIZE: 4, MINES: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

function initGame() {
  gBoard = buildBoard()
  renderBoard(gBoard)
  gGame.isOn = true
}

function buildBoard() {
  var board = []

  for (var i = 0; i < 4; i++) {
    board[i] = []
    for (var j = 0; j < 4; j++) {
      board[i][j] = {
        isShown: false,
        isMine: false,
        isMarked: false,
        minesAroundCount: 0,
      }
    }
  }

  setRandomMines(gLevel.MINES, gLevel.SIZE, board)

  setMinesNegsCount(board)
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
      if (board[i][j].isMine && board[i][j].isShown) strHTML += BOMB_IMG
      else if (!board[i][j].isMine) board[i][j].innertext = board[i][j].minesAroundCount
    }
    strHTML += '\n</tr>'
  }
  //   console.log(strHTML)
  elBoard.innerHTML = strHTML
}

function gameLost() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var elCell = document.querySelector(`.cell-${i}-${j}`)
      var cell = gBoard[i][j]

      if (!cell.isShown && !cell.isMine) {
        cell.isShown = true
        elCell.classList.add('shown')
      } else if (!cell.isShown && cell.isMine) {
        cell.isShown = true
        elCell.innerHTML = BOMB_IMG
        elCell.classList.add('mine')
      }

      if (cell.minesAroundCount && !cell.isMine) {
        elCell.innerHTML = cell.minesAroundCount
      }
    }
  }
}

function setRandomMines(numOfMines, gameSize, board) {
  var minesCount = 0

  while (minesCount < numOfMines) {
    var cellI = getRandomIntInclusive(0, gameSize - 1)
    var cellJ = getRandomIntInclusive(0, gameSize - 1)
    if (!board[cellI][cellJ].isMine) {
      board[cellI][cellJ].isMine = true
      minesCount++
    }
  }
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      board[i][j].minesAroundCount = countNeighbors(i, j, board)
    }
  }
}

function countNeighbors(cellI, cellJ, board) {
  var neighborsCount = 0

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (board[i][j].isMine) neighborsCount++
    }
  }
  return neighborsCount
}

function cellMarked(elCell, i, j) {
  var cell = gBoard[i][j]
  if (cell.isMarked) {
    cell.isMarked = false
    elCell.innerHTML = ''
  } else {
    cell.isMarked = true
    elCell.innerHTML = FLAG_IMG
  }
}

function clickedCell(elCell, i, j) {
  var cell = gBoard[i][j]
  var elCell = elCell

  elCell.onclick = () => {
    if (cell.isShown || cell.isMarked) return
    if (cell.isMine) {
      elCell.classList.add('mine')
      elCell.innerHTML = BOMB_IMG
      gameLost()
    }
    cell.isShown = true
    elCell.classList.add('shown')

    console.log(gBoard)
    console.log(elCell)

    if (cell.minesAroundCount) {
      console.log(cell.minesAroundCount)
      elCell.innerHTML = cell.minesAroundCount
    }
  }
  elCell.oncontextmenu = () => {
    cellMarked(elCell, i, j)
  }
}
