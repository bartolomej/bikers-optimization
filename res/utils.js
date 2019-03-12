function getNumbersArray(end) {
    let array = [];
    for (let i = 0; i < end; i++)
        array.push(i)
    return array;
}

function mergeWithoutDuplication(target, input) {
    let finalArray = target;
    for (let i = 0; i < input.length; i++)
      if (!target.includes(input[i])) finalArray.push(input[i]);
    return finalArray;
}

function randomNumbers(number, max, except = []) {
    let numbers = [];
    if (number >= max) return new Error("Cant generate distinct numbers");
    for (let i = 0; i < number; i ++) {
      	let randNumber = Math.floor(Math.random() * max);
        while (numbers.includes(randNumber) || except.includes(randNumber))
          	randNumber = Math.floor(Math.random() * max);
        numbers.push(randNumber);
    }
    return numbers;
}

function random(max) {
    return Math.floor(Math.random() * (max+1));
}

function getArraySum(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) sum += array[i];
    return sum;
}