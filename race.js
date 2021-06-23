// temp variables
let text = 'Hello World This is ME testing'
let text1 = 'hello world test this car'
let text2 = 'hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car'


let wordDisplay = document.getElementById('word-display')
let wordInput = document.getElementById('word-input')
let timerSelect = document.getElementById('timer-select')
let currWord = null
let started = false
let correctWords = 0
let correctChars = 0

class RaceWord extends HTMLElement {
    constructor(value) {
        super()
        this.value = value
        this.innerHTML = value + '\u00A0'
    }

    compare(value) {
        return this.value === value
    }
}
window.customElements.define('race-word', RaceWord)


function removeChildren(parent) {
    while(parent.firstChild) {
        parent.firstChild.remove()
    }
}

function jumpToNextWord(correct) {
    wordInput.value = ''
    if(!currWord) return
    currWord.className = ''
    if(correct) {
        currWord.className = 'correct'
        correctWords += 1
        correctChars += currWord.value.length
    }
    else currWord.className = 'wrong'
    if(!currWord.nextSibling) return
    currWord = currWord.nextSibling
    currWord.className = 'highlight'
}

function jumpToPreviousWord() {
    wordInput.value = ''
    if(!currWord) return
    if(!currWord.previousSibling) return
    if(currWord.previousSibling.className == 'correct') return
    if(currWord.className == 'wrong') {
        currWord.className = 'highlight'
    } else {
        currWord.className = ''
        currWord = currWord.previousSibling
        currWord.className = 'highlight'
    }
}

function onWordInputKeyUp(e) {
    if(e.key == ' ') {
        word1 = wordInput.value
        word2 = currWord.value.slice(0, word1.length)
        console.log("test, word1: " + word1)
        console.log("test, word2: " + word2)
        let bool = currWord.compare(word1.slice(0, -1))
        console.log(bool)
        jumpToNextWord(bool)
        wordInput.value = ''
    }
}

function onWordInputKeyDown(e) {
    if(started == false) {
        setTimeout(test, timerSelect.value * 1000)
        started = true
    }
    if(e.key.length == 1) {
        word1 = wordInput.value + e.key
        word2 = currWord.value.slice(0, word1.length)
        console.log("onWorldInputChange, word1: " + word1)
        console.log("onWorldInputChange, word2: " + word2)
        if(e.key != ' ') {
            currWord.className = word1 === word2 ? 'highlight' : 'wrong'
        }
    } else if(e.key == 'Backspace') {
        word1 = wordInput.value
        word2 = currWord.value.slice(0, word1.length)
        jumpToPreviousWord()
        currWord.className = word1 === word2 ? 'highlight' : 'wrong'
    }
}

function displayText(text) {
    removeChildren(wordDisplay)
    wordInput.value = ''
    let words = text.split(' ')
    words.forEach(value => {
        race_word = new RaceWord(value)
        wordDisplay.appendChild(race_word)
    })
    currWord = wordDisplay.firstChild
    currWord.classList.add('highlight')
}

function test() {
    console.log("testing timeout")
    let wpm = (correctChars/5) / (timerSelect.value / 60)
    alert("Correct words: " + correctWords + "\nCorrect characters: " + correctChars + "\nWPM: " + wpm)
    started = false
    correctWords = 0
    correctChars = 0
    displayText(text2)
}

function main() {
    displayText(text2)
    wordInput.onkeydown = onWordInputKeyDown
    wordInput.onkeyup = onWordInputKeyUp
    wordInput.focus()
}

main()
