'use strict'
const LIGHT_ON = `<img class="light-on" src="img/lightOn.png" alt="">`
const LIGHT_OFF = `<img class="light-off" src="img/lightOff.png" alt="">`
var gTimerInterval
var gSeconds = 0
var gMega = [{ row: -1, col: -1, }, { row: -1, col: -1 }]



function hint(num) {
    if (gGame.isOn === false) {
        return
    }
    if (isEmpty(gBoard)) {
        alert('Start the game first!')
        return
    }
    if(gGame.hints.isHintMode){
        var hint = document.querySelector('.n' + num)
        hint.innerHTML = LIGHT_OFF
        gGame.hints.isHintMode= false
        return
    }
    
    var hint = document.querySelector('.n' + num)
    hint.innerHTML = LIGHT_ON
    gGame.hints.bulbNum = num

}
function peek(row, col) {

    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === -1 || j === -1 || i === gLevel.SIZE || j === gLevel.SIZE) {
                continue
            }
            var cellClass = '.loc' + i + '-' + j
            var elCell = document.querySelector(cellClass)
            if (gBoard[i][j].isShown === true) {
                continue
            }
            if (gBoard[i][j].isMine) {
                elCell.innerHTML = MINE
            }
            else {
                if (gBoard[i][j].count !== 0) {
                    elCell.textContent = gBoard[i][j].count
                }
            }
            elCell.classList.add('peeked')

        }
    }
    gGame.hints.isHintMode= true
}
function unPeek(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === -1 || j === -1 || i === gLevel.SIZE || j === gLevel.SIZE) {
                continue
            }
            var cellClass = '.loc' + i + '-' + j
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
    gGame.hints.isHintMode= false
    var light = document.querySelector('.n' + gGame.hints.bulbNum)
    light.innerHTML = LIGHT_OFF
    light.classList.add('hidden')
    gGame.hints.bulbNum = 0
}
function safe() {
    if (isEmpty(gBoard)) {
        alert('Start the game first!')
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
    var elSafe = document.querySelector('.loc' + i + '-' + j)
    elSafe.classList.add('safe')

    setTimeout(function () {
        elSafe.classList.remove('safe')
    }, 1000)
    gGame.saves--
    var numOfSaves = document.querySelector('.savesNum')
    numOfSaves.textContent = gGame.saves
    if(gGame.saves===0){
        const elSaves= document.querySelector('.saves')
        elSaves.classList.add('hidden')
    }
}
function create() {
    if (gGame.creation) {
        return
    }

    gGame.isOn = false

    gGame.creation = true
    var minesCount = gLevel.MINES
    var minesToAdd = document.querySelector('.minesToAdd')

    minesToAdd.innerHTML = `Mines to add: <span class="numOfMines">${minesCount}</span>`

    gBoard = buildEmptyBoard()
    renderBoard()
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var elCell = document.querySelector('.loc' + i + '-' + j)
            elCell.classList.add('opened')

        }
    }

}

function addMineManuelly(row, col) {
    if (gBoard[row][col].isMine) {
        return
    }
    if (!gGame.creation) {
        return
    }
    var elCell = document.querySelector('.loc' + row + '-' + col)
    elCell.innerHTML = MINE
    gBoard[row][col].isMine = true
    var numOfMines = document.querySelector('.numOfMines')
    var count = parseInt(numOfMines.innerHTML)
    count--
    numOfMines.innerHTML = count
    if (count === 0) {
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                var elCell = document.querySelector('.loc' + i + '-' + j)
                elCell.classList.remove('opened')
                elCell.innerHTML = ''
                var count = minesAroundCount(gBoard, i, j)
                gBoard[i][j].count = count
                var elCreate = document.querySelector('.minesToAdd')
                elCreate.textContent = ''
                resetGame()



            }
        }
    }
}
function undo() {
    if (gGame.prev.length === 0) {
        alert('Start the game first!')
        return
    }
    if (gGame.prev.length === 1) {
        return
    }
    if (gGame.isOn === false) {
        return
    }
    var lastPrev = gGame.prev[gGame.prev.length - 1]
    for (var i = 0; i < lastPrev.length; i++) {
        var row = lastPrev[i].row
        var col = lastPrev[i].col
        gBoard[row][col].isShown = false
        var elCell = document.querySelector('.loc' + row + '-' + col)
        elCell.classList.remove('opened')
        elCell.textContent = ''

    }
    gGame.prev.pop()

}

function timer() {
    const elTimer = document.querySelector('.timer')
    gSeconds++
    elTimer.textContent = gSeconds

}
function addStorage(res) {

    var storageLevel = ''

    switch (gLevel.MINES) {
        case 2:
            storageLevel = 'beginner'
            break
        case 14:
            storageLevel = 'medium'
            break
        case 32:
            storageLevel = 'expret'
            break
    }

    if (res > localStorage.getItem(storageLevel) && localStorage.getItem(storageLevel) === 0) {
        return
    }
    localStorage.setItem(storageLevel, res)
    var storage = document.querySelector('.' + storageLevel)
    storage.innerHTML = localStorage.getItem(storageLevel)

}
function megaMode() {
    if (isEmpty(gBoard)) {
        alert('Start the game first!')
        return
    }
    const elMega = document.querySelector('.mega')
    elMega.classList.add('megaHinted')
}
function mega(start, end) {
    for (var i = start.row; i <= end.row; i++) {
        for (var j = start.col; j <= end.col; j++) {
            var cellClass = '.loc' + i + '-' + j
            var elCell = document.querySelector(cellClass)
            if (gBoard[i][j].isShown) {
                continue
            }
            if (gBoard[i][j].isMine) {
                elCell.innerHTML = MINE
            }
            else {
                if (gBoard[i][j].count !== 0) {
                    elCell.textContent = gBoard[i][j].count
                }
            }
            elCell.classList.add('peeked')
        }
    }

    setTimeout(function () {
        unMega(start, end)
    }, 2000)

}
function unMega(start, end) {
    for (var i = start.row; i <= end.row; i++) {
        for (var j = start.col; j <= end.col; j++) {
            var cellClass = '.loc' + i + '-' + j
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
    const elMega = document.querySelector('.mega')
    elMega.classList.remove('megaHinted')
    elMega.classList.add('hidden')

}
function exterminator() {
    if (isEmpty(gBoard)) {
        alert('Start the game first!')
        return
    }
    var allMines = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                allMines.push({ row: i, col: j, })
            }
        }
    }
    if(allMines.length<=3){
        alert('You are so close! Try to win by yourself')
        return
    }
    for(var i=0; i<3;i++){
        var mineIndex =getRandomInt(0,allMines.length-1)
        var mine= allMines.slice(mineIndex,mineIndex+1)
        allMines.splice(mineIndex,1)
        const removedRow= mine[0].row
        const removedCol= mine[0].col
        gBoard[removedRow][removedCol].isMine= false
        gBoard[removedRow][removedCol].count= 0
    }
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                continue
            }
            var count = minesAroundCount(gBoard, i, j)
            gBoard[i][j].count = count
            if(gBoard[i][j].isShown){
                var elCell= document.querySelector('.loc'+i+'-'+j)
                if (gBoard[i][j].count !== 0) {
                    elCell.textContent = gBoard[i][j].count
                }
                else{
                    elCell.textContent= ''
                }
                
                
            }
        }
    }
    alert('3 Mines have been exterminated!')
    const exterminator= document.querySelector('.exterminator')
    exterminator.classList.add('hidden')
    


}
function dark(){

}