let wordDisplay = document.getElementById('word-display')
let wordInput = document.getElementById('word-input')
let timerSelect = document.getElementById('timer-select')
let wpmSelect = document.getElementById('wpm-select')
let newButton = document.getElementById('button-new')
let imgLight = document.getElementById('img-light')
let infoWPM= document.getElementById('div-info-wpm')
let infoTime = document.getElementById('div-info-time')

let currWord = null
let totalChars = 0
let correctChars = 0
let timeLeft = 0
let intervalID = -1

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


function jumpToNextWord(correct) {
    wordInput.value = ''
    if(!currWord) return
    currWord.className = ''
    if(correct) {
        currWord.className = 'correct'
        correctChars += currWord.value.length
    }
    else currWord.className = 'wrong'
    totalChars += currWord.value.length
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
        totalChars -= currWord.value.length
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
    if(timeLeft == 0) {
        startRace()
    }
    word1 = wordInput.value
    word2 = currWord.value.slice(0, word1.length)
    currWord.className = word1 === word2 ? 'highlight' : 'wrong'
    wordInput.className = word1 === word2 ? 'input-normal' : 'input-wrong'
    // if space entered
    if(e.inputType == "insertText" && e.data == " ") {
        let bool = currWord.compare(word1.slice(0, -1))
        jumpToNextWord(bool)
        wordInput.value = ''
        wordInput.className = 'input-normal'
    }
}

async function makeText(filePath, charTarget) {
    let response = await fetch(filePath)
    if (response.status == 200) {
        let json = await response.json()
        let numberOfWordsLibrary = json["english"].length
        let text = ""
        let chars = 0
        while(chars <= charTarget) {
            let random = Math.floor(Math.random() * numberOfWordsLibrary)
            word = json["english"][random]
            text += word + " "
            chars += word.length
        }
        return text.slice(0, -1)
    }
    return ""
}

function displayText(text) {
    while(wordDisplay.firstChild) wordDisplay.firstChild.remove()
    wordInput.className = 'input-normal'
    let words = text.split(' ')
    words.forEach(value => {
        raceWord = new RaceWord(value)
        wordDisplay.appendChild(raceWord)
    })
    currWord = wordDisplay.firstChild
    currWord.classList.add('highlight')
}

async function startRace() {
    imgLight.src = "images/green.png"
    intervalID = setInterval(updateRace, 1000)
    timeLeft = parseInt(timerSelect.value)
    infoTime.innerHTML = "Time: " + timeLeft  
    timerSelect.disabled = true
}

async function updateRace() {
    timeLeft -= 1
    if (timeLeft > 0) {
        let words = correctChars / 5
        let time = (parseInt(timerSelect.value) - timeLeft) / 60
        let wpm = Math.floor(words / time)
        infoWPM.innerHTML = "WPM: " + wpm
        infoTime.innerHTML = "Time: " + timeLeft
    } else {
        raceFinished()
        wordInput.disabled = true
    }
}

function raceFinished() {
    if (intervalID != -1) {
        clearInterval(intervalID)
    }
    imgLight.src = "images/red.png"
    infoTime.innerHTML = "Time: " + 0
    intervalID = -1
    wordInput.value = ""
}

function fullReset(text) {
    if (intervalID != -1) {
        clearInterval(intervalID)
    }
    imgLight.src = "images/red.png"
    intervalID = -1
    totalChars = 0
    correctChars = 0
    infoWPM.innerHTML = "WPM: XX"
    infoTime.innerHTML = "Time: XX"
    timerSelect.disabled = false
    wordInput.value = ""
    wordInput.disabled = false
    displayText(text)
}

async function onReset(e) {
    let targetWPM = parseInt(wpmSelect.value)
    let text = await makeText("words/random.json", charsForWPM(targetWPM, timerSelect.value/60))
    fullReset(text)
    wordInput.focus()
}

function charsForWPM(wpm, time) {
    return wpm * time * 5
}

async function main() {
    wordInput.onkeyup = onWordInputKeyUp
    wordInput.addEventListener("input", onWordInputChange)
    newButton.onclick = onReset
    timerSelect.onchange = onReset
    wpmSelect.onchange = onReset
    onReset(1)
}

main()
