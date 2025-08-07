function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Nice try! Can't divide by zero.";
  } else {
    return a / b;
  }
}

function operate(op, num1, num2) {
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);

  if (op === "+") {
    return add(num1, num2);
  } else if (op === "-") {
    return subtract(num1, num2);
  } else if (op === "*") {
    return multiply(num1, num2);
  } else if (op === "/") {
    return divide(num1, num2);
  } else {
    return num2;
  }
}

let display = document.getElementById("display");
let buttons = document.querySelectorAll("button");

let current = "";
let previous = "";
let operator = null;
let justCalculated = false;

function updateDisplay(val) {
  if (val.toString().length > 12) {
    display.textContent = parseFloat(val).toFixed(4);
  } else {
    display.textContent = val;
  }
}

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    handleClick(buttons[i].textContent);
  });
}

function handleClick(val) {
  if (!isNaN(val)) {
    if (justCalculated) {
      current = val;
      justCalculated = false;
    } else {
      current += val;
    }
    updateDisplay(current);
  } else if (val === "-" && current === "") {
    current = "-";
    updateDisplay(current);
  } else if (
    val === "+" ||
    val === "*" ||
    val === "/" ||
    (val === "-" && current !== "")
  ) {
    if (current === "" && previous !== "") {
      operator = val;
      updateDisplay(previous + " " + operator);
    } else {
      if (previous !== "" && operator !== null) {
        previous = operate(operator, previous, current);
      } else {
        previous = current;
      }
      operator = val;
      current = "";
      updateDisplay(previous + " " + operator);
    }
  } else if (val === "=") {
    if (current === "" || operator === null || previous === "") {
      return;
    }
    let result = operate(operator, previous, current);
    updateDisplay(result);
    current = result.toString();
    previous = "";
    operator = null;
    justCalculated = true;
  } else if (val === "C") {
    current = "";
    previous = "";
    operator = null;
    updateDisplay("0");
  } else if (val === ".") {
    if (!current.includes(".")) {
      current += ".";
      updateDisplay(current);
    }
  } else if (val === "⌫") {
    current = current.slice(0, -1);
    if (current === "") {
      updateDisplay("0");
    } else {
      updateDisplay(current);
    }
  }
}

window.addEventListener("keydown", function (e) {
  let key = e.key;
  if (
    (key >= 0 && key <= 9) ||
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/" ||
    key === "." ||
    key === "=" ||
    key === "Enter"
  ) {
    if (key === "Enter") {
      handleClick("=");
    } else {
      handleClick(key);
    }
  } else if (key === "Backspace") {
    handleClick("\u232b");
  } else if (key.toLowerCase() === "c") {
    handleClick("C");
  }
});
