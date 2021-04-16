let text = 'Hello World This is ME testing'
let text1 = 'hello world test this car'
let text2 = 'hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car hello world test this car'
let wordDisplay = document.getElementById('word_display')
let wordInput = document.getElementById('word_input')
let currWord = null


function removeChildren(parent) {
    while(parent.firstChild) {
        parent.firstChild.remove()
    }
}

        /*
        if(key === 'Enter') {
            console.log(wordInput.value)
        } else if(key === current.innerHTML) {
            if(key === ' ') wordInput.value = ''
            current.className = ''
            current.classList.add('correct')
            current = current.nextSibling
            current.classList.add('highlight')
        } else if(key === 'Backspace') {
            current.className = ''
            current = current.previousSibling
            current.className = ''
            current.classList.add('highlight')
        } else if(key !== current.innerHTML) {
            current.className = ''
            current.classList.add('wrong')
            current = current.nextSibling
            current.classList.add('highlight')
        }
        */

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

function onWordInputChange(e) {
    if(e.key.length == 1) {
        if(e.key == ' ') {
            jumpToNextWord(false)
        } else {
            console.log('typed a character')
            word1 = wordInput.value + e.key
            word2 = currWord.innerHTML.slice(0, word1.length)
            currWord.className = word1 === word2 ? 'highlight' : 'wrong'
            console.log(word1)
            console.log(word2)
        }
    } else if(e.key == 'Backspace') {
        //jumpToPreviousWord()
    }
}

function displayText(text) {
    removeChildren(wordDisplay)
    let words = text.split(' ')
    words.forEach(word => {
        let span = document.createElement('span')
        span.innerHTML = word + '\u00A0'
        wordDisplay.appendChild(span)
    })
}

function init() {
    wordInput.value = ''
    displayText(text2)
    //displayText(text1)
    currWord = wordDisplay.firstChild
    currWord.classList.add('highlight')
    wordInput.onkeydown = onWordInputChange
    wordInput.focus()
}

init()
