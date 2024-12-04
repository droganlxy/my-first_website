// script.js
let currentInput = '';
let shouldResetDisplay = false;
let history = [];
let expression = []; // 存储完整表达式

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
        expression = [];
    }
    currentInput += num;
    updateDisplay();
}

function setOperator(operator) {
    if (currentInput === '' && expression.length === 0) return;
    
    // 如果当前有输入，将其添加到表达式中
    if (currentInput !== '') {
        expression.push(currentInput);
        currentInput = '';
    }
    
    // 如果表达式最后一个是运算符，则替换它
    if (expression.length > 0 && isOperator(expression[expression.length - 1])) {
        expression[expression.length - 1] = operator;
    } else {
        expression.push(operator);
    }
    
    updateDisplay();
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function calculate() {
    if (currentInput !== '') {
        expression.push(currentInput);
        currentInput = '';
    }
    
    if (expression.length === 0) return;
    
    // 保存原始表达式用于显示
    const originalExpression = [...expression];
    
    // 创建表达式副本进行计算
    let calcExpression = [...expression];
    
    // 先处理所有的乘除法
    let i = 1;
    while (i < calcExpression.length - 1) {
        if (calcExpression[i] === '*' || calcExpression[i] === '/') {
            const prev = parseFloat(calcExpression[i - 1]);
            const next = parseFloat(calcExpression[i + 1]);
            let result;
            
            if (calcExpression[i] === '*') {
                result = prev * next;
            } else {
                if (next === 0) {
                    currentInput = '错误';
                    updateDisplay();
                    return;
                }
                result = prev / next;
            }
            
            calcExpression.splice(i - 1, 3, result.toString());
            i = 1;
        } else {
            i += 2;
        }
    }
    
    // 处理加减法
    let result = parseFloat(calcExpression[0]);
    for (i = 1; i < calcExpression.length; i += 2) {
        const operator = calcExpression[i];
        const operand = parseFloat(calcExpression[i + 1]);
        
        if (operator === '+') {
            result += operand;
        } else if (operator === '-') {
            result -= operand;
        }
    }
    
    // 格式化计算表达式，将 * 和 / 替换为 × 和 ÷
    const formattedExpression = originalExpression.map(item => {
        if (item === '*') return '×';
        if (item === '/') return '÷';
        return item;
    });
    
    // 添加到历史记录
    const calculation = formattedExpression.join(' ') + ' = ' + result;
    addToHistory(calculation);
    
    // 更新显示
    currentInput = result.toString();
    expression = [];
    shouldResetDisplay = true;
    updateDisplay();
}

function addToHistory(calculation) {
    history.unshift(calculation); // 在开头添加新的计算记录
    if (history.length > 10) { // 限制历史记录最多显示10条
        history.pop();
    }
    updateHistory();
}

function updateHistory() {
    const historyList = document.getElementById('history-list');
    if (historyList) {
        historyList.innerHTML = history
            .map(entry => `<li>${entry}</li>`)
            .join('');
    }
}

function handleFunction(func) {
    if (!currentInput && expression.length === 0) return;
    
    let num = parseFloat(currentInput || '0');
    let result;
    let calculation = '';
    
    switch(func) {
        case 'sqrt':
            if (num < 0) {
                currentInput = '错误';
            } else {
                result = Math.sqrt(num);
                calculation = `√${num} = ${result}`;
                currentInput = result.toString();
            }
            break;
            
        case 'negate':
            result = -num;
            calculation = `-(${num}) = ${result}`;
            currentInput = result.toString();
            break;
            
        case 'percent':
            result = num / 100;
            calculation = `${num}% = ${result}`;
            currentInput = result.toString();
            break;
            
        case '1/x':
            if (num === 0) {
                currentInput = '错误';
            } else {
                result = 1 / num;
                calculation = `1/${num} = ${result}`;
                currentInput = result.toString();
            }
            break;
    }
    
    if (calculation) {
        addToHistory(calculation);
    }
    
    updateDisplay();
}

function clearAll() {
    currentInput = '';
    expression = [];
    shouldResetDisplay = false;
    // 不清除历史记录
    updateDisplay();
}

function backspace() {
    if (currentInput !== '') {
        currentInput = currentInput.slice(0, -1);
    } else if (expression.length > 0) {
        // 如果当前输入为空，则删除表达式的最后一个元素
        expression.pop();
    }
    updateDisplay();
}

function updateDisplay() {
    const display = document.getElementById('result');
    let displayValue = expression.join(' ');
    if (currentInput !== '') {
        displayValue += (displayValue ? ' ' : '') + currentInput;
    }
    display.value = displayValue || '0';
}

// 初始化显示
updateDisplay();