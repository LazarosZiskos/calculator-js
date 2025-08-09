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
    return "error-div-zero";
  } else {
    return a / b;
  }
}

function operate(op, num1, num2) {
  let a = parseFloat(num1);
  let b = parseFloat(num2);

  if (isNaN(a) || isNaN(b)) return 0;

  if (op === "+") {
    return add(a, b);
  } else if (op === "-") {
    return subtract(a, b);
  } else if (op === "*") {
    return multiply(a, b);
  } else if (op === "/") {
    return divide(a, b);
  } else {
    return b;
  }
}

let display = document.getElementById("display");
let buttons = document.querySelectorAll("button");

let current = "";
let previous = "";
let operator = null;
let justCalculated = false;

function updateDisplay(val) {
  if (val === "error-div-zero") {
    display.textContent = "You can't divide by zero!";
  } else if (val.toString().length > 12) {
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
  if (!isNaN(val) && val !== ".") {
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
  } else if (val === "+" || val === "-" || val === "*" || val === "/") {
    if (current === "" && previous !== "") {
      operator = val;
      updateDisplay(previous + " " + operator);
    } else {
      if (previous !== "" && operator !== null) {
        previous = operate(operator, previous, current);
        if (previous === "error-div-zero") {
          updateDisplay(previous);
          current = "";
          previous = "";
          operator = null;
          return;
        }
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
    if (result === "error-div-zero") {
      updateDisplay(result);
      current = "";
      previous = "";
      operator = null;
      return;
    }
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
    if (justCalculated) {
      current = "0.";
      justCalculated = false;
    } else if (!current.includes(".")) {
      if (current === "") {
        current = "0.";
      } else {
        current += ".";
      }
    }
    updateDisplay(current);
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
