let wordDisplay = document.getElementById('word-display')
let wordInput = document.getElementById('word-input')
let timerSelect = document.getElementById('timer-select')
let wordSelect = document.getElementById('word-select')
let redoButton = document.getElementById('button-redo')
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
    if(e.key == "Backspace") {
        if (wordInput.value.length == 0) {
            jumpToPreviousWord()
        }
    }
}

function onWordInputChange(e) {
    console.log(e)
    if(started == false) {
        setTimeout(test, parseInt(timerSelect.value) * 1000)
        started = true
    }
    word1 = wordInput.value
    word2 = currWord.value.slice(0, word1.length)
    currWord.className = word1 === word2 ? 'highlight' : 'wrong'
    console.log("test2, word1: " + word1)
    console.log("test2, word2: " + word2)
    if(e.inputType == "insertText" && e.data == " ") {
        let bool = currWord.compare(word1.slice(0, -1))
        console.log(bool)
        jumpToNextWord(bool)
        wordInput.value = ''
    }
    if(e.inputType == "deleteContentBackward") {
        console.log("BACKSPACE")
    }
}

function generateRandomInt(from, to) {
    return Math.floor(Math.random() * to)
}

async function fetchFile(filePath) {
    let numberOfWords = parseInt(wordSelect.value)

    let response = await fetch(filePath)
    if (response.status == 200) {
        let json = await response.json()
        let arr = [...Array(numberOfWords).keys()]
        let numberOfWordsLibrary = json["english"].length
        let text = ""
        arr.forEach(i => {
            let random = generateRandomInt(0, numberOfWordsLibrary) 
            text += json["english"][random] + " "
        })
        return text.slice(0, -1)
    }
    return ""
}

function displayText(text) {
    removeChildren(wordDisplay)
    wordInput.value = ''
    let words = text.split(' ')
    words.forEach(value => {
        raceWord = new RaceWord(value)
        wordDisplay.appendChild(raceWord)
    })
    currWord = wordDisplay.firstChild
    currWord.classList.add('highlight')
}

async function test() {
    console.log("testing timeout")
    let wpm = (correctChars / 5) / (parseInt(timerSelect.value) / 60)
    alert("Correct words: " + correctWords + "\nCorrect characters: " + correctChars + "\nWPM: " + wpm)
    started = false
    correctWords = 0
    correctChars = 0
    let text = await fetchFile("words/random.json")
    displayText(text)
}

function reset(text) {
    started = false
    displayText(text)
}

async function onWordSelectChange(e) {
    let text = await fetchFile("words/random.json")
    reset(text)
}

async function main() {
    let text = await fetchFile("words/random.json")
    displayText(text)
    wordInput.onkeyup = onWordInputKeyUp
    wordInput.addEventListener("input", onWordInputChange)
    wordSelect.onchange = onWordSelectChange
    wordInput.focus()
}

main()
