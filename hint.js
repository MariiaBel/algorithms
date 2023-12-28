function correctInputNumber(inputNode) {
    let number = (inputNode.value) === '' ? -1 : Number(inputNode.value) // it is for ++ or -- symbols
    let correctNumber = number
    let min = Number(inputNode.min)
    let max = Number(inputNode.max)

    if(number < min) correctNumber = min
    if(number > max) correctNumber =  max
    if(number < min || inputNode.value > max) inputNode.value = correctNumber

    return correctNumber
}

export { correctInputNumber }