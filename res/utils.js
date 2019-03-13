function getNumbersArray(end) {
    let array = [];
    for (let i = 0; i < end; i++)
        array.push(i)
    return array;
}

function mergeWithoutDuplication(target, input) {
    let finalArray = target.slice();
    for (let i = 0; i < input.length; i++)
      if (!target.includes(input[i])) finalArray.push(input[i]);
    return finalArray;
}

function randomDistinctNumbers(numberOf, maxValue, except = []) {
    let numbers = [];
    if (numberOf > maxValue) throw new Error("Cant generate distinct numbers");
    for (let i = 0; i < numberOf; i ++) {
      	let randNumber = Math.floor(Math.random() * maxValue + 1);
        while (numbers.includes(randNumber) || except.includes(randNumber))
          	randNumber = Math.floor(Math.random() * maxValue + 1);
        numbers.push(randNumber);
    }
    return numbers;
}

function random(maxValue) {
    return Math.floor(Math.random() * (maxValue+1));
}

function getArraySum(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) sum += array[i];
    return sum;
}

module.exports = {
    getNumbersArray: getNumbersArray,
    mergeWithoutDuplication: mergeWithoutDuplication,
    randomDistinctNumbers: randomDistinctNumbers,
    getArraySum: getArraySum,
    random: random
};