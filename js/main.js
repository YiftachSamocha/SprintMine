'use strict'

var gLevel = {
    SIZE: 8,
    MINES: 10,
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 0,
    saves:3,
}
var gBoard
var gCell = {
    isMine: false,
    isShown: false,
    count: 0
}
const BOMB = `<img class="bomb" src="img/mine.jpg" alt="">`
const FLAG = `<img class="flag" src="img/flag.png" alt="">`

const HAPPY = `<img class="flag" src="img/happy.jpg" alt="">`
const SAD = `<img class="flag" src="img/sad.jpg" alt="">`
const VICTORY = `<img class="flag" src="img/victory.jpg" alt="">`



function onInit() {
    resetGame()
    gBoard = buildEmptyBoard()
    renderBoard(gBoard)

    

}
function resetGame(){
    var elEnd = document.querySelector('.endgame')
    elEnd.classList.add('hidden')
    var elLives = document.querySelector('.lives')
    elLives.innerText = 'You have 3 lives'
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = HAPPY
    var elLight1 = document.querySelector('.n1')
    if(elLight1.classList.contains('hidden')){
        elLight1.classList.remove('hidden')
    }
    var elLight2 = document.querySelector('.n2')
    if(elLight2.classList.contains('hidden')){
        elLight2.classList.remove('hidden')
    }
    var elLight3 = document.querySelector('.n3')
    if(elLight3.classList.contains('hidden')){
        elLight3.classList.remove('hidden')
    }
    var elSaves= document.querySelector('.savesNum')
    elSaves.textContent= '3'

    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.lives = 3
    gGame.saves= 3
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

    for (var i = 0; i < gLevel.MINES; i++) {
        addMine(board, firstRowIndex, firstColIndex)
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
function addMine(board, firstRowIndex, firstColIndex) {
    var i
    var j
    do {
        i = getRandomInt(0, gLevel.SIZE - 1)
        j = getRandomInt(0, gLevel.SIZE - 1)
    } while (board[i][j].isMine || (i === firstRowIndex && j === firstColIndex))
    board[i][j].isMine = true

}





function minesAroundCount(board, row, col) {
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

function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cellClass = 'loc' + i + j
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
        var flagClass = '.loc' + row + col + ' .flag'
        var flag = document.querySelector(flagClass)
        flag.remove()
        gGame.markedCount--
        return
    }
    gBoard[row][col].isFlag = true
    gGame.markedCount++
    var cellClass = '.loc' + row + col
    var cell = document.querySelector(cellClass)
    cell.innerHTML = FLAG
    isVictory()

}

function onCellClicked(row, col) {
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
    if (gGame.hints>0) {
        peek(row, col)
        setTimeout(function () {
            unPeek(row, col)
        }, 1000)
        return

    }
    var elCell= document.querySelector('.loc'+row+col)
    if(elCell.classList.contains('safe')){
        return
    }

    if (gBoard[row][col].isMine) {
        minePressed()
        return

    }

    if (gBoard[row][col].count !== 0) {
        markCell(row, col)
    }
    else {
        for (var i = row - 1; i <= row + 1; i++) {
            for (var j = col - 1; j <= col + 1; j++) {
                if (i === -1 || j === -1 || i === gLevel.SIZE || j === gLevel.SIZE) {
                    continue
                }

                if (gBoard[i][j].isMine === false) {

                    markCell(i, j)

                }
            }
        }
    }
    isVictory()




}

function markCell(i, j) {
    var cellClass = '.loc' + i + j
    var elCell = document.querySelector(cellClass)

    elCell.classList.add('opened')
    if (gBoard[i][j].isMine) {
        elCell.innerHTML = BOMB

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

            return true
        }

    }
    return false
}


function minePressed() {
    gGame.lives--
    var lives = document.querySelector('.lives')
    lives.textContent = 'You have ' + gGame.lives + ' lives'
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
    alert('Hey! What are you doing?? Now ' + gGame.lives + ' more lives left')

}
function gameOver() {
    gGame.isOn = false
    var end = document.querySelector('.endgame')
    end.classList.remove('hidden')
    end.textContent = 'GAME OVER! YOU LOST!'
    var smiley = document.querySelector('.smiley')
    smiley.innerHTML = SAD

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
function expandShown(board, elCell, i, j) {

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
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}