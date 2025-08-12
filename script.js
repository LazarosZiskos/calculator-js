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
  const a = parseFloat(num1);
  const b = parseFloat(num2);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;

  const fn = OPS[op];
  return fn ? fn(a, b) : b;
}

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const buttons = document.querySelectorAll("button");

let current = "";
let previous = "";
let operator = null;
let justCalculated = false;

const isDigit = (v) => /^[0-9]$/.test(v);
const isOperator = (v) => v in OPS;

function formatResult(val) {
  if (val === "error-div-zero") return "You can't divide by zero!";
  const str = val.toString();
  if (str.length > 12 && !isNaN(val)) {
    return parseFloat(val).toFixed(4);
  }
  return str;
}

function buildExpression({ withEquals = false } = {}) {
  if (!previous && !operator && !current) return "";
  const a = previous ?? "";
  const op = operator ?? "";
  const b = current ?? "";
  const core = [a, op, b].filter(Boolean).join(" ");
  return withEquals && op && b ? core + " =" : core;
}

function refreshDisplays({ showEquals = false } = {}) {
  expressionEl.textContent = buildExpression({ withEquals: showEquals }) || " ";
  resultEl.textContent = formatResult(current || previous || 0);
}

function clearAll() {
  current = "";
  previous = "";
  operator = null;
  justCalculated = false;
  expressionEl.textContent = " ";
  resultEl.textContent = "0";
}

function setOperator(nextOp) {
  if (nextOp === "-" && current === "" && previous === "") {
    current = "-";
    return refreshDisplays();
  }

  if (previous !== "" && current === "") {
    operator = nextOp;
    return refreshDisplays();
  }

  if (previous !== "" && operator && current !== "") {
    const result = operate(operator, previous, current);
    if (result === "error-div-zero") return handleDivideByZero();
    previous = result.toString();
    current = "";
  } else {
    previous = current || previous;
    current = "";
  }

  operator = nextOp;
  justCalculated = false;
  refreshDisplays();
}

function appendDigit(d) {
  if (justCalculated) {
    current = d;
    justCalculated = false;
  } else {
    current += d;
  }
  refreshDisplays();
}

function appendDecimal() {
  if (justCalculated) {
    current = "0.";
    justCalculated = false;
  } else if (!current.includes(".")) {
    current = current === "" ? "0." : current + ".";
  }
  refreshDisplays();
}

function compute() {
  if (!operator || previous === "" || current === "") return;

  const result = operate(operator, previous, current);
  if (result === "error-div-zero") return handleDivideByZero();

  current = result.toString();
  previous = "";
  operator = null;
  justCalculated = true;

  expressionEl.textContent = buildExpression({ withEquals: true }) || " ";
  resultEl.textContent = formatResult(current);
}

function handleDivideByZero() {
  current = "";
  previous = "";
  operator = null;
  justCalculated = false;
  expressionEl.textContent = " ";
  resultEl.textContent = "You can't divide by zero!";
}

function backspace() {
  if (justCalculated) {
    justCalculated = false;
  }
  current = current.slice(0, -1);
  if (current === "" || current === "-") {
    resultEl.textContent = "0";
  }
  refreshDisplays();
}

function handleClick(val) {
  const actions = {
    ".": appendDecimal,
    "=": compute,
    C: clearAll,
    "⌫": backspace,
    "+": () => setOperator("+"),
    "-": () => setOperator("-"),
    "*": () => setOperator("*"),
    "/": () => setOperator("/"),
  };

  if (isDigit(val)) return appendDigit(val);

  const act = actions[val];
  if (act) return act();
}

buttons.forEach((btn) =>
  btn.addEventListener("click", () => handleClick(btn.textContent))
);

window.addEventListener("keydown", (e) => {
  const k = e.key;

  if (k === "Enter") return handleClick("=");

  if (k === "Backspace") return handleClick("⌫");
  if (k.toLowerCase() === "c") return handleClick("C");

  if (isDigit(k) || isOperator(k) || k === "." || k === "=") {
    handleClick(k);
  }
});
