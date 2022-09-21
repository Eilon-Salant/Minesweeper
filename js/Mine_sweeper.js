'use strict'

const MINE_IMG = '<img src="img/mine.png">'
const FLAG_IMG = '<img src="img/flag.png">'

var gBoard
var gLevel = { SIZE: 4, MINES: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
var gFirstClick = true
var gTimeInterval

function initGame() {
  gBoard = buildBoard()
  renderBoard(gBoard)
  gGame.isOn = true
}

function buildBoard() {
  var board = []

  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        isShown: false,
        isMine: false,
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

function gameLost() {
  gGame.isOn = false
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var elCell = document.querySelector(`.cell-${i}-${j}`)
      var cell = gBoard[i][j]

      if (!cell.isShown && !cell.isMine) {
        cell.isShown = true
        elCell.classList.add('shown')
      } else if (!cell.isShown && cell.isMine) {
        cell.isShown = true
        elCell.innerHTML = MINE_IMG
        elCell.classList.add('mine')
      }

      if (cell.minesAroundCount && !cell.isMine) {
        elCell.innerHTML = cell.minesAroundCount
      }
    }
  }
}

function checkGameOver() {
  var count = gLevel.MINES
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = gBoard[i][j]
      count++
      if (count === gLevel.SIZE ** 2) console.log('You win!')
      if ((cell.isMine && !cell.isMarked) || (!cell.isMine && !cell.isShown)) {
        return
      }
    }
  }
}

// doesnt work yet

// function expandShown(board, elCell, cellI, cellJ) {
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     if (i < 0 || i >= board.length) continue
//     for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//       if (j < 0 || j >= board[i].length) continue
//       if (i === cellI && j === cellJ) continue

//       var cell = board[cellI][cellJ]
//       if (!cell.minesAroundCount) {
//         board[i][j].isShown = true
//         elCell.classList.add('shown')
//         gGame.shownCount++
//       }
//     }
//   }
// }

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
      elCell.classList.add('mine')
      elCell.innerHTML = MINE_IMG
      gameLost()
    }
    cell.isShown = true
    elCell.classList.add('shown')
    gGame.shownCount++

    // console.log(gBoard)
    // console.log(elCell)

    // doesnt work yet
    // if (!cell.minesAroundCount && !gFirstClick) expandShown(gBoard, elCell, i, j)

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
    cellMarked(elCell, i, j)
  }
  checkGameOver()
}
