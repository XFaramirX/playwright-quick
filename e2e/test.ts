let a: string = "Hello Worlds";
let b: string = "Hello World";
let c: string = "Hello World";


console.log(a === b); // false

//q: What is the output of b?

function add(a: number, b: number): number {
    return a + b;
}

console.log(add(1, 2)); // 3

//create a function that takes in a string and returns the string in reverse
function reverseString(str: string) {
    return str.split("").reverse().join("");
}
