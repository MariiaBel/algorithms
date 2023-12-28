import { correctInputNumber } from './../hint.js'

const numbersNode = document.querySelectorAll('#numbers input')
const sortBtnNode = document.getElementById('sortBtn')
const numbersContainerNode = document.getElementById('numbersContainer')
let numbersListNode, numberOfLevels, leftLevel, rightLevel;
const n = numbersNode.length

sortBtnNode.addEventListener('click', sortNumbers)

numbersNode.forEach(numberNode => {
    numberNode.addEventListener('change', handleNumberChanges)
})

function handleNumberChanges(e) {
    correctInputNumber(e.target)
}


async function sortNumbers() {
    toggleDisabledInputs()
    toggleDisabledBtn()
    numberOfLevels = 0
    leftLevel = 0
    rightLevel = 0

    numbersListNode = createListNumbers()

    await quickSort(numbersListNode.childNodes, 0, numbersListNode.childNodes.length)
    
    numberOfLevels = leftLevel > rightLevel ? leftLevel : rightLevel
    showNumberOfLevels()
    toggleDisabledInputs()
    toggleDisabledBtn()
 
}

async function quickSort(nodeList, start, end) {
    if(nodeList.length >= 2) {
        const { lessNumberNodes, biggerNumberNodes } = await compareNumbers(start, end)

        if(lessNumberNodes.length !== 0) {
            leftLevel++
            cleanClasses(lessNumberNodes)
            await quickSort(lessNumberNodes, start, start + lessNumberNodes.length)
        }

        if(biggerNumberNodes.length !== 0) {
            rightLevel++
            cleanClasses(biggerNumberNodes)
            await quickSort(biggerNumberNodes, end - biggerNumberNodes.length, end)
        }

        // numberOfLevels++;
    } else {
        return true
    }
    
}
async function compareNumbers(start, end) {
    const pivotNode = numbersListNode.childNodes[end -1]
    await doStep(animatePivot.bind(null, pivotNode))

    const biggerNumberNodes = []
    const lessNumberNodes = []

    await doStep(() => {
        for(let index = start; index < end - 1; index++) {
            if(Number(numbersListNode.childNodes[index].dataset.number) <= Number(pivotNode.dataset.number)) {
                animateLeftNode(index)
                lessNumberNodes.push(numbersListNode.childNodes[index])
            } else {
                animateRightNode(index)
                biggerNumberNodes.push(numbersListNode.childNodes[index])
            }
        }
    })
    await doStep(() => {
        insertAfter(biggerNumberNodes, pivotNode)
    })
    await doStep(() => {})

    return { lessNumberNodes, biggerNumberNodes }
}

function insertAfter(newNodes, existingNode) {
    for(let newNode of newNodes) {
        numbersListNode.insertBefore(newNode, existingNode.nextSibling);
    }
}

function animatePivot(node) {
    node.classList.add('--pivot')
}

function animateLeftNode(index) {
    const node = numbersListNode.childNodes[index]
    node.classList.add('--left')
}

function animateRightNode(index) {
    const node = numbersListNode.childNodes[index]
    node.classList.add('--right')
}

function cleanClasses(nodes) {
    for(let node of nodes) {
        node.classList = 'number-list__item'
    }
}

function createListNumbers() {
    const ul = document.createElement('ul')
    ul.classList.add('number-list')
    for(const numberNode of numbersNode) {
        const li = document.createElement('li')
        li.classList.add('number-list__item')
        li.innerText = numberNode.value
        li.dataset.number = numberNode.value
        ul.appendChild(li)
    }
    numbersContainerNode.innerHTML = ''
    numbersContainerNode.appendChild(ul)
    return ul
}

function toggleDisabledInputs() {
    numbersNode.forEach(numberNode => {
        numberNode.disabled = !numberNode.disabled
    })
}

function toggleDisabledBtn() {
    sortBtnNode.disabled = !sortBtnNode.disabled
}

function showNumberOfLevels() {
    const p = document.createElement('p')
    p.innerHTML = `
        Average-case running times: O(n*logn) = <strong>${ n * Math.ceil(Math.log2(n))}</strong>, where n = ${n}. <br /> 
        Number of Levels (depth): ${numberOfLevels}. <br /> 
        Running times: n * depth = <strong>${n * numberOfLevels}</strong>.
    `
    numbersContainerNode.appendChild(p)
}

function doStep(callback) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = callback() 
            resolve(result)
        }, 700)
    })
}
