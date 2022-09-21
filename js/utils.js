'use strict'

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

var elClock = document.querySelector('#clock')
var gameStartTime = 0 // game-milliseconds;
var realStartTime = Date.now() // real milliseconds

function gameTimer() {
  gTimeInterval = setInterval(function () {
    var gameTime = gameStartTime + (Date.now() - realStartTime)
    var sec = Math.floor(gameTime / 1000) % 60
    var min = Math.floor(gameTime / 60000) % 60
    var hour = Math.floor(gameTime / 3600000) % 24
    // output in hh:mm:ss format:
    elClock.textContent = `${padNum(hour)}:${padNum(min)}:${padNum(sec)}`
  }, 50)

  function padNum(number) {
    return (number < 10 ? '0' : '') + number
  }
}
