'use strict'

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function gameTimer() {
  var elClock = document.getElementById('clock')
  var realStartTime = Date.now()
  gTimeInterval = setInterval(function () {
    gGame.secsPassed = Date.now() - realStartTime
    var sec = Math.floor(gGame.secsPassed / 1000) % 60
    var min = Math.floor(gGame.secsPassed / 60000) % 60
    var hour = Math.floor(gGame.secsPassed / 3600000) % 24
    elClock.innerHTML = `${padNum(hour)}:${padNum(min)}:${padNum(sec)}`
  }, 1000)
}

function padNum(number) {
  return (number < 10 ? '0' : '') + number
}

function gameStats() {
  var elShownSpan = document.getElementById('shown-div')
  var elMarkedSpan = document.getElementById('marked-div')
  gGame.shownCount = 0
  gGame.markedCount = 0
  gStatsInterval = setInterval(() => {
    elShownSpan.innerText = `Mines revealed: ${gGame.shownCount}`
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

function levelClicked(elLevel) {
  if (gGame.level === elLevel.innerHTML) return
  if (elLevel.innerHTML === 'Easy') {
    gGame.level = 'Easy'
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
