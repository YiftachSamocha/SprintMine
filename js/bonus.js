'use strict'
const LIGHT_ON = `<img class="light-on" src="img/light1.jpg" alt="">`
const LIGHT_OFF = `<img class="light-off" src="img/light2.jpg" alt="">`


function hint(num) {
    if (gGame.isOn === false) {
        return
    }
    if(isEmpty(gBoard)){
        alert('Start the game first you piece of shit')
        return
    }
    if (gGame.hints > 0) {
        var hint = document.querySelector('.n' + num)
        hint.innerHTML = LIGHT_OFF
        gGame.hints = 0
        return
    }
    var hint = document.querySelector('.n' + num)
    hint.innerHTML = LIGHT_ON
    gGame.hints = num

}
function peek(row, col) {

    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === -1 || j === -1 || i === gLevel.SIZE || j === gLevel.SIZE) {
                continue
            }
            var cellClass = '.loc' + i + j
            var elCell = document.querySelector(cellClass)
            if (gBoard[i][j].isShown === true) {
                continue
            }
            if (gBoard[i][j].isMine) {
                elCell.innerHTML = BOMB
            }
            else {
                if (gBoard[i][j].count !== 0) {
                    elCell.textContent = gBoard[i][j].count
                }
            }
            elCell.classList.add('peeked')

        }
    }
}
function unPeek(row, col) {

    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === -1 || j === -1 || i === gLevel.SIZE || j === gLevel.SIZE) {
                continue
            }
            var cellClass = '.loc' + i + j
            var elCell = document.querySelector(cellClass)
            if (gBoard[i][j].isShown === true) {
                continue
            }
            if (elCell.classList.contains('peeked')) {
                elCell.classList.remove('peeked')
                elCell.textContent = ''
            }


        }
    }

    var light = document.querySelector('.n' + gGame.hints)
    light.innerHTML = LIGHT_OFF
    light.classList.add('hidden')
    gGame.hints = 0
}
function safeClick() {
    if (isEmpty(gBoard)) {
        alert('Start the game first you piece of shit')
        return
    }
    if (gGame.isOn === false) {
        return
    }
    if (gGame.saves === 0) {
        return
    }
    var i = getRandomInt(0, gLevel.SIZE - 1)
    var j = getRandomInt(0, gLevel.SIZE - 1)

    while (gBoard[i][j].isShown || gBoard[i][j].isMine) {
        i = getRandomInt(0, gLevel.SIZE - 1)
        j = getRandomInt(0, gLevel.SIZE - 1)
    }
    var elSafe = document.querySelector('.loc' + i + j)
    elSafe.classList.add('safe')

    setTimeout(function () {
        elSafe.classList.remove('safe')
    }, 3000)
    gGame.saves--
    var numOfSaves = document.querySelector('.savesNum')
    numOfSaves.textContent = gGame.saves
}
