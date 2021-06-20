// temp variables
let text = 'Hello World This is ME testing'
let text1 = 'hello world test this car'
let text2 = 'hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car'


let wordDisplay = document.getElementById('word_display')
let wordInput = document.getElementById('word_input')
let currWord = null


class RaceWord extends HTMLElement {
    constructor(string) {
        super()
        this.string = string
        this.innerHTML = string + '\u00A0'
    }

    compare(string) {
        return this.string === string
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
    if(correct) currWord.className = 'correct'
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
        word2 = currWord.innerHTML.slice(0, word1.length)
        console.log("test, word1: " + word1)
        console.log("test, word2: " + word2)
        let bool = currWord.compare(word1.slice(0, -1))
        console.log(bool)
        jumpToNextWord(bool)
        wordInput.value = ''
    }
}

function onWordInputKeyDown(e) {
    if(e.key.length == 1) {
        word1 = wordInput.value + e.key
        word2 = currWord.innerHTML.slice(0, word1.length)
        console.log("onWorldInputChange, word1: " + word1)
        console.log("onWorldInputChange, word2: " + word2)
        if(e.key != ' ') {
            currWord.className = word1 === word2 ? 'highlight' : 'wrong'
        }
    } else if(e.key == 'Backspace') {
        word1 = wordInput.value
        word2 = currWord.innerHTML.slice(0, word1.length)
        jumpToPreviousWord()
        currWord.className = word1 === word2 ? 'highlight' : 'wrong'
    }
}

function displayText(text) {
    removeChildren(wordDisplay)
    let words = text.split(' ')
    words.forEach(string => {
        race_word = new RaceWord(string)
        wordDisplay.appendChild(race_word)
    })
}

function main() {
    wordInput.value = ''
    displayText(text2)
    currWord = wordDisplay.firstChild
    currWord.classList.add('highlight')
    wordInput.onkeydown = onWordInputKeyDown
    wordInput.onkeyup = onWordInputKeyUp
    wordInput.focus()
}

main()
