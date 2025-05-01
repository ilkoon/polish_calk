class Stack {
    constructor() {
        this.items = [];
        this.length = 0;
        this.rang = 0;
    }
    
    push(element) {
        this.items.push(element);
        this.length++;
    }
    
    pop() {
        if (this.isEmpty()) return null;
        this.length--;
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}

function isExpressionNotEmpty(expression) {
    return expression.length > 0;
}

function isExpressionBracketBalanced(expression) {
    let counter = 0;
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === '(') counter++;
        if (expression[i] === ')') counter--;
    }
    return counter === 0;
}

function isExpressionNotContainsIllegalCharacters(expression) {
    const allowedChars = /^[a-z+\-*/^()]+$/;
    return allowedChars.test(expression);
}

function validateExpression(expression) {
    if (!isExpressionNotEmpty(expression)) {
        return "Ошибка: выражение не может быть пустым";
    }
    
    if (!isExpressionBracketBalanced(expression)) {
        return "Ошибка: несбалансированные скобки";
    }
    
    if (!isExpressionNotContainsIllegalCharacters(expression)) {
        return "Ошибка: выражение содержит недопустимые символы";
    }
    
    return null;
}

function getStackPriority(character) {
    switch (character) {
        case '+': case '-': return 2;
        case '*': case '/': return 4;
        case '(': return 0;
        case '^': return 5;
        default: return 8; // для букв
    }
}

function getPriority(character) {
    switch (character) {
        case '+': case '-': return 1;
        case '*': case '/': return 3;
        case '(': return 9;
        case '^': return 6;
        default: return 7; // для букв
    }
}

function calculationOfRang(stack, character) {
    if (/[a-z]/.test(character)) {
        stack.rang++;
    } else {
        stack.rang--;
    }
}

function reverseExpression(expression) {
    let reversed = expression.split('').reverse().join('');
    return reversed.replace(/\(/g, 'temp').replace(/\)/g, '(').replace(/temp/g, ')');
}

function convertToSuffix(stack, expression) {
    stack.rang = 0;
    let finalAnswer = '';
    
    // Первый символ сразу в стек
    stack.push(expression[0]);
    
    for (let i = 1; i < expression.length; i++) {
        const currentChar = expression[i];
        
        if (currentChar === ')') {
            while (stack.peek() !== '(') {
                calculationOfRang(stack, stack.peek());
                finalAnswer += stack.pop();
            }
            stack.pop(); // Удаляем '(' из стека
        } else {
            if (getPriority(currentChar) > getStackPriority(stack.peek())) {
                stack.push(currentChar);
            } else {
                while (!stack.isEmpty() && getPriority(currentChar) <= getStackPriority(stack.peek())) {
                    calculationOfRang(stack, stack.peek());
                    finalAnswer += stack.pop();
                }
                stack.push(currentChar);
            }
        }
    }
    
    // Выталкиваем оставшиеся элементы из стека
    while (!stack.isEmpty()) {
        calculationOfRang(stack, stack.peek());
        finalAnswer += stack.pop();
    }
    
    return finalAnswer;
}

function convertToPrefix(expression) {
    const reversed = reverseExpression(expression);
    const stack = new Stack();
    const suffix = convertToSuffix(stack, reversed);
    return reverseExpression(suffix);
}

// Обработчики событий
document.getElementById('toPostfix').addEventListener('click', () => {
    const expression = document.getElementById('expression').value;
    const errorElement = document.getElementById('error');
    
    const error = validateExpression(expression);
    if (error) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
        return;
    }
    
    errorElement.style.display = 'none';
    const stack = new Stack();
    const result = convertToSuffix(stack, expression);
    
    document.getElementById('result').textContent = result;
    document.getElementById('rang').textContent = stack.rang;
});

document.getElementById('toPrefix').addEventListener('click', () => {
    const expression = document.getElementById('expression').value;
    const errorElement = document.getElementById('error');
    
    const error = validateExpression(expression);
    if (error) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
        return;
    }
    
    errorElement.style.display = 'none';
    const result = convertToPrefix(expression);
    
    // Для префиксной нотации нужно вычислить ранг отдельно
    const stackForRang = new Stack();
    convertToSuffix(stackForRang, reverseExpression(expression));
    
    document.getElementById('result').textContent = result;
    document.getElementById('rang').textContent = stackForRang.rang;
});