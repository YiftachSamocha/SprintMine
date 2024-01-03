'use strict'

var gLevel = {
    SIZE: 8,
    MINES: 14,
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: {
        bulbNum: 0,
        isHintMode: false
    },
    saves: 3,
    creation: false,
    prev: [],
}
var gBoard
var gCell = {
    isMine: false,
    isShown: false,
    count: 0
}
const MINE = `<img class="mine" src="img/mine.png" alt="">`
const FLAG = `<img class="flag" src="img/flag.png" alt="">`

const HAPPY = `<img class="flag" src="img/happy.png" alt="">`
const SAD = `<img class="flag" src="img/sad.png" alt="">`
const VICTORY = `<img class="flag" src="img/victory.png" alt="">`
// localStorage.setItem('beginner', 0)
// localStorage.setItem('medium', 0)
// localStorage.setItem('expret', 0)






function onInit() {
    resetGame()
    gBoard = buildEmptyBoard()
    renderBoard(gBoard)
}
function resetGame() {
    var elEnd = document.querySelector('.endgame')
    elEnd.classList.add('hidden')
    var elLives = document.querySelector('.lives')
    elLives.innerText = 'Lives: 3'
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = HAPPY
    var elLight1 = document.querySelector('.n1')
    if (elLight1.classList.contains('hidden')) {
        elLight1.classList.remove('hidden')
    }
    var elLight2 = document.querySelector('.n2')
    if (elLight2.classList.contains('hidden')) {
        elLight2.classList.remove('hidden')
    }
    var elLight3 = document.querySelector('.n3')
    if (elLight3.classList.contains('hidden')) {
        elLight3.classList.remove('hidden')
    }
    var elSaves = document.querySelector('.savesNum')
    elSaves.textContent = '3'
    var elSaves = document.querySelector('.saves')
    elSaves.classList.remove('hidden')
    var elCreate = document.querySelector('.create')
    elCreate.innerHTML = ''

    var storage1 = document.querySelector('.beginner')

    storage1.innerHTML = localStorage.getItem('beginner')
    var storage2 = document.querySelector('.medium')
    storage2.innerHTML = localStorage.getItem('medium')
    var storage3 = document.querySelector('.expret')
    storage3.innerHTML = localStorage.getItem('expret')
    var elMega = document.querySelector('.mega')
    elMega.classList.remove('hidden')
    const exterminator = document.querySelector('.exterminator')
    exterminator.classList.remove('hidden')
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.lives = 3
    gGame.saves = 3
    gGame.creation = false
    gSeconds = 0
    gMega = [{ row: -1, col: -1, }, { row: -1, col: -1 }]
    clearInterval(gTimerInterval)
    gTimerInterval = setInterval(timer, 1000)


}
function buildEmptyBoard() {
    var board = []
    //Creating empty board
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                count: 0,
                isShown: false,
                isMine: false,
                isFlag: false,
            }
        }
    }
    return board
}

function buildBoard(board, firstRowIndex, firstColIndex) {

    //Adding mines to the board
    var aroundIndexes = []
    for (var i = firstRowIndex - 1; i <= firstRowIndex + 1; i++) {
        for (var j = firstColIndex - 1; j <= firstColIndex + 1; j++) {
            if (i >= 0 && j >= 0 && i < gLevel.SIZE && j < gLevel.SIZE) {
                aroundIndexes.push({ row: i, col: j });
            }
        }
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        addMine(board, aroundIndexes)
    }


    //Counting 
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (board[i][j].isMine) {
                continue
            }
            var count = minesAroundCount(board, i, j)
            board[i][j].count = count
        }
    }
    return board



}
function addMine(board, firstCellNeighbors) {
    var i = getRandomInt(0, gLevel.SIZE - 1)
    var j = getRandomInt(0, gLevel.SIZE - 1)
    while (isAround(firstCellNeighbors, i, j) || board[i][j].isMine) {
        i = getRandomInt(0, gLevel.SIZE - 1)
        j = getRandomInt(0, gLevel.SIZE - 1)
    }
    board[i][j].isMine = true;

}
function isAround(neighbors, row, col) {
    for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i].row === row && neighbors[i].col === col) {
            return true
        }
    }
    return false
}


function minesAroundCount(board, row, col) {
    if (board[row][col].isMine) {
        return
    }
    var sum = 0
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === -1 || j === -1 || i === gLevel.SIZE || j === gLevel.SIZE) {
                continue
            }
            if (board[i][j].isMine) {
                sum++
            }
        }
    }
    return sum

}

function renderBoard() {
    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cellClass = 'loc' + i + '-' + j
            strHTML += `\t <td class="cell ${cellClass}" onclick="onCellClicked(${i},${j})" oncontextmenu="flag(${i},${j}); return false;"></td>\n`


        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML

}
function flag(row, col) {
    if (gGame.isOn === false) {
        return
    }
    if (gBoard[row][col].isShown) {
        return
    }
    if (gBoard[row][col].isFlag) {
        gBoard[row][col].isFlag = false
        var flagClass = '.loc' + row + '-' + col + ' .flag'
        var flag = document.querySelector(flagClass)
        flag.remove()
        gGame.markedCount--
        return
    }
    gBoard[row][col].isFlag = true
    gGame.markedCount++
    var cellClass = '.loc' + row + '-' + col
    var cell = document.querySelector(cellClass)
    cell.innerHTML = FLAG
    isVictory()

}

function onCellClicked(row, col) {
    if (gGame.creation) {
        addMineManuelly(row, col)
        return
    }
    if(gGame.hints.isHintMode){
        return
    }
    if (isEmpty(gBoard)) {
        gBoard = buildBoard(gBoard, row, col)
    }
    if (gGame.isOn === false) {
        return
    }
    if (gBoard[row][col].isShown) {
        return
    }
    if (gBoard[row][col].isFlag) {
        return
    }
    const elMega = document.querySelector('.mega')
    if (elMega.classList.contains('megaHinted')) {
        if (gMega[0].row === -1) {

            gMega[0].row = row
            gMega[0].col = col
            var elStart = document.querySelector('.loc' + row + '-' + col)
            elStart.classList.add('peeked')
        }
        else {
            if (gMega[0].row > row || gMega[0].col > col) {
                return
            }
            if (gMega[1].row !== -1) {
                return
            }
            gMega[1].row = row
            gMega[1].col = col
            var elEnd = document.querySelector('.loc' + row + '-' + col)
            elEnd.classList.add('peeked')

            mega(gMega[0], gMega[1])


        }
        return
    }
    var elCell = document.querySelector('.loc' + row + '-' + col)
    if (elCell.classList.contains('peeked')) {
        return
    }


    if (elCell.classList.contains('safe')) {
        return
    }
    if (gGame.hints > 0) {
        peek(row, col)
        setTimeout(function () {
            unPeek(row, col)
        }, 1000)
        return

    }

    if (gBoard[row][col].isMine) {

        minePressed()
        return

    }

    if (gBoard[row][col].count !== 0) {
        markCell(row, col)
        gGame.prev.push([{ row: row, col: col, }])
    }
    else {
        gGame.prev.push([])
        expandShown(gBoard, row, col)
    }
    isVictory()




}

function markCell(i, j) {
    var cellClass = '.loc' + i + '-' + j
    var elCell = document.querySelector(cellClass)

    if (elCell.classList.contains('opened')) {
        return
    }

    elCell.classList.add('opened')
    if (gBoard[i][j].isMine) {
        elCell.innerHTML = MINE

        return
    }

    if (gBoard[i][j].count !== 0) {
        elCell.textContent = gBoard[i][j].count
    }
    if (gBoard[i][j].isShown === false) {
        gGame.shownCount++
        gBoard[i][j].isShown = true
    }







}
function isVictory() {
    var cellsLeft = gLevel.SIZE ** 2 - gLevel.MINES
    if (gGame.markedCount === gLevel.MINES) {
        if (gGame.shownCount === cellsLeft) {
            gGame.isOn = false
            var end = document.querySelector('.endgame')
            end.classList.remove('hidden')
            end.textContent = 'YOU WON! CONGRATULATIONS'
            var smiley = document.querySelector('.smiley')
            smiley.innerHTML = VICTORY
            clearInterval(gTimerInterval)
            addStorage(gSeconds)


            return true
        }

    }
    return false
}


function minePressed() {
    gGame.lives--
    var lives = document.querySelector('.lives')
    lives.textContent = 'Lives: ' + gGame.lives
    if (gGame.lives === 0) {
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                if (gBoard[i][j].isMine) {
                    markCell(i, j)
                }

            }
        }
        gameOver()
        return
    }
    alert('Mine pressed! ' + gGame.lives + ' more lives left')

}
function gameOver() {
    gGame.isOn = false
    var end = document.querySelector('.endgame')
    end.classList.remove('hidden')
    end.textContent = 'GAME OVER! YOU LOST!'
    var smiley = document.querySelector('.smiley')
    smiley.innerHTML = SAD
    clearInterval(gTimerInterval)


}
function changeLevel(level) {
    switch (level) {
        case 1:
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break
        case 2:
            gLevel.SIZE = 8
            gLevel.MINES = 14
            break
        case 3:
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break
    }
    onInit()

}
function expandShown(board, row, col) {
    if (row === -1 || col === -1 || row === gLevel.SIZE || col === gLevel.SIZE) {
        return
    }
    if (board[row][col].isMine) {
        return
    }
    if (board[row][col].isShown) {
        return
    }
    if (board[row][col].count > 0) {
        gGame.prev[gGame.prev.length - 1].push({ row: row, col: col, })
        markCell(row, col)
        return
    }
    markCell(row, col)
    gGame.prev[gGame.prev.length - 1].push({ row: row, col: col, })
    expandShown(board, row - 1, col - 1)
    expandShown(board, row - 1, col)
    expandShown(board, row - 1, col + 1)
    expandShown(board, row, col - 1)
    expandShown(board, row, col + 1)
    expandShown(board, row + 1, col - 1)
    expandShown(board, row + 1, col)
    expandShown(board, row + 1, col + 1)





}


function isEmpty(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) {
                return false
            }
        }
    }
    return true
}
function getRandomInt(min, max) {

    return Math.floor(Math.random() * (max - min + 1) + min)
}