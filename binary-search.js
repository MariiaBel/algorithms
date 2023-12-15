(()=> {
    const numberListNode = document.getElementById('numberList')
    const amountNumbers = document.getElementById('amountNumbers')
    const restartBtn = document.getElementById('restartBtn')
    amountNumbers.addEventListener('change', (e) => initNumberList(e.target))
    restartBtn.addEventListener('click', () => initNumberList(amountNumbers))
    let hiddenNumber, min = 0, max, steps = 0;
    let listNode;

    initNumberList(amountNumbers)


    function initNumberList(node)  {
        let valueNumber = node.value
        min = Number(node.min)
        max = Number(node.max)
        steps = 0

        valueNumber = correctInputNumber(valueNumber, node)
        hiddenNumber = getRandomArbitrary(min, valueNumber)
        listNode = createList(valueNumber)
    }

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function correctInputNumber(number, inputNode) {
        let correctNumber = number

        if(number < min) correctNumber = min
        if(number > max) correctNumber =  max
        if(number < min || number > max) inputNode.value = correctNumber

        return correctNumber
    }
    
    
    function createList(valueNumber) {
        const ul = document.createElement('ul')
        ul.classList.add('number-list')
        for (let item = 0; item < valueNumber; item++) {
            const li = document.createElement('li')
            li.classList.add('number-list__item')
            li.innerText = item + 1
            li.dataset.number = item + 1
            ul.appendChild(li)
        }
        numberListNode.innerHTML = ''
        numberListNode.appendChild(ul)
        ul.addEventListener('click', onList)
        return ul
    }

    function onList(e) {
        if(e.target.dataset.hasOwnProperty('number')) {
            steps++
            const guessNumber = Number(e.target.dataset.number)
            if(guessNumber === hiddenNumber) {
                success(e.target)
            } else if(guessNumber < hiddenNumber) {
                removePrevNumbers(guessNumber)
            } else if(guessNumber > hiddenNumber) {
                removeNextNumbers(guessNumber)
            }
        }
    }

    function success(node) {
        node.classList.add('--success')

        setTimeout(() => {
            const ends = (steps > 1) ? 's' : ''
            listNode.innerText = `You guessed the number ${hiddenNumber} in ${steps} step${ends}!`
        }, 1000)
    }

    function fail(node) {
        node.classList.add('--fail')
        node.removeAttribute('data-number')
        node.innerText = 'x'
    }

    function removePrevNumbers(maxNumber) {
        for(nodeLi of listNode.childNodes) {
            if(nodeLi.dataset.hasOwnProperty('number')) {
                if(Number(nodeLi.dataset.number) <= maxNumber) {
                    fail(nodeLi)
                } else {
                    break;
                }
            }
        }
    }
    function removeNextNumbers(minNumber) {
        for(nodeLi of listNode.childNodes) {
            if(nodeLi.dataset.hasOwnProperty('number')) {
                if(Number(nodeLi.dataset.number) >= minNumber) {
                    fail(nodeLi)
                }
            }
        }
    }
})()

