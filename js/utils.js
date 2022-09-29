'use strict'

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function gameTimer() {
  var elClock = document.getElementById('clock')
  var realStartTime = Date.now() // @CR: startTime?
  gTimeInterval = setInterval(function () {
    gGame.secsPassed = Date.now() - realStartTime
    var sec = Math.floor(gGame.secsPassed / 1000) % 60
    var min = Math.floor(gGame.secsPassed / 60000) % 60
    var hour = Math.floor(gGame.secsPassed / 3600000) % 24
    elClock.innerHTML = `${padNum(hour)}:${padNum(min)}:${padNum(sec)}`
  }, 1000)
}

function padNum(number) {
  return (number < 10 ? '0' : '') + number // @CR: cutie!🍒
}

function gameStats() {
  var elShownSpan = document.getElementById('shown-div')
  var elMarkedSpan = document.getElementById('marked-div')
  gGame.shownCount = 0
  gGame.markedCount = 0
  gStatsInterval = setInterval(() => {
    elShownSpan.innerText = `Tiles revealed: ${gGame.shownCount}`
    elMarkedSpan.innerText = `Mines marked: ${gGame.markedCount}`
  }, 50)
}

// need to modify
function revealAllCells() {
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

function levelClicked(elLevel) { // CR: Could have just sent 'easy', 'medium' or 'hard' and not the element.
  if (gGame.level === elLevel.innerHTML) return
  if (elLevel.innerHTML === 'Easy') {
    gGame.level = 'Easy' // @CR: gGame.level = elLevel.innerHTML would make it more dynamic.
    gLevel = { SIZE: 4, MINES: 2, LIVES: 1 }
    document.getElementById('heart2').classList.add('hidden')
    document.getElementById('heart3').classList.add('hidden')
  } else if (elLevel.innerHTML === 'Medium') {
    document.getElementById('heart3').classList.add('hidden')
    gGame.level = 'Medium'
    gLevel = { SIZE: 8, MINES: 14, LIVES: 2 }
  } else {
    gGame.level = 'Hard'
    gLevel = { SIZE: 12, MINES: 32, LIVES: 3 }
  }
  gCurrLevel = { ...gLevel }
  playAgain()
}

function safeClick() {
  var spanNum = +document.getElementById('safe-span').innerText
  if (gFirstClick || spanNum === 0) return
  var elSpan = document.getElementById('safe-span')
  spanNum--
  elSpan.innerText = `${spanNum}`

  var safeCells = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = gBoard[i][j]
      if (!cell.isMine && !cell.isShown) safeCells.push({ cell: cell, i: i, j: j })
    }
  }
  var randomNum = getRandomIntInclusive(0, safeCells.length - 1)
  var randomI = safeCells[randomNum].i
  var randomJ = safeCells[randomNum].j
  document.querySelector(`.cell-${randomI}-${randomJ}`).classList.add('safe')
  setTimeout(() => {
    document.querySelector(`.cell-${randomI}-${randomJ}`).classList.remove('safe')
  }, 2000)
}

function hintsClick() {
  var spanNum = +document.getElementById('hints-span').innerText
  if (gFirstClick || spanNum === 0) return
  var elSpan = document.getElementById('hints-span')
  spanNum--
  elSpan.innerText = `${spanNum}`
  document.querySelector('body').classList.add('light-bulb')
  document.querySelector('.hints').classList.add('light-bulb')
}

function lightBulbClick(cellI, cellJ) {
  document.querySelector('body').classList.remove('light-bulb')
  document.querySelector('.hints').classList.remove('light-bulb')
  var cellsPos = []

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue
      var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
      var cell = gBoard[i][j]

      if (!cell.isShown && !cell.isMine) {
        elCurrCell.classList.add('revealed')
        cellsPos.push({ cell: elCurrCell })
      }
      //
      else if (!cell.isShown && cell.isMine) {
        elCurrCell.innerHTML = MINE_IMG
        elCurrCell.classList.add('revealed')
        cellsPos.push({ cell: elCurrCell })
      }

      console.log(cellsPos[0].cell)
      setTimeout(() => {
        for (var i = 0; i < cellsPos.length; i++) {
          elCurrCell = cellsPos[i].cell
          elCurrCell.classList.remove('revealed')
          elCurrCell.innerHTML = ''
        }
      }, 1000)
    }
  }
}
