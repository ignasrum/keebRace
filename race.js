let words = ['word', 'test', 'hello']
let wordInput = document.getElementById('word_input')
let text = null
let current = null


function onInput() {
    current.classList.add('highlight')
    wordInput.addEventListener('keyup', ({key}) => {
        if(key === 'Enter') {
            console.log(wordInput.value)
        }
        else if(key === current.innerHTML) {
            if(key === ' ') wordInput.value = ''
            current.className = ''
            current.classList.add('correct')
            current = current.nextSibling
            current.classList.add('highlight')
        }
        else if(key === 'Backspace') {
            current.className = ''
            current = current.previousSibling
            current.className = ''
            current.classList.add('highlight')
        }
        else if(key !== current.innerHTML) {
            current.className = ''
            current.classList.add('wrong')
            current = current.nextSibling
            current.classList.add('highlight')
        }
    })
}

function displayWords(words) {
    let wordDisplay = document.getElementById('word_display')
    let div = document.createElement('div')
    words.forEach(word => {
        for(let letter of word) {
            let span = document.createElement('span')
            span.innerHTML = letter
            div.appendChild(span)
        }
        let span = document.createElement('span')
        span.innerHTML = ' '
        div.appendChild(span)
    })
    wordDisplay.appendChild(div)
    text = div
}

function init() {
    wordInput.value = ' '
    displayWords(words)
    current = text.firstChild
    onInput()
}

init()