const formulasTable = {
    "formula-check-1 grade-6": { theme: "Пропорція", formula: "a/b=c/d" },
    "formula-check-2 grade-6": { theme: "Пропорція", formula: "ad=bc" },
    "formula-check-3 grade-6": { theme: "Дроби", formula: "a/c+b/c=(a+b)/c" },
    "formula-check-4 grade-6": { theme: "Дроби", formula: "a/c-b/c=(a-b)/c" },
    "formula-check-5 grade-6": { theme: "Дроби", formula: "a/b·c/d=(a·c)/(b·d)" },
    "formula-check-6 grade-6": { theme: "Дроби", formula: "(a/b)/(c/d)=(a/b)·(d/c)=(a·d)/(b·c)" },
    "formula-check-7 grade-6": { theme: "Пропорційна залежність", formula: "y=k·x" },
    "formula-check-8 grade-6": { theme: "Пропорційна залежність", formula: "y=k/x" },
    "formula-check-9 grade-6": { theme: "Відсотки", formula: "a=(b·100)/p" },
    "formula-check-10 grade-6": { theme: "Відсотки", formula: "1%=a·(1/100)" },
    "formula-check-11 grade-6": { theme: "Відсотки", formula: "p%=a·(p/100)" },
    "formula-check-12 grade-6": { theme: "Модуль", formula: "|-a|=a" },
    "formula-check-13 grade-6": { theme: "Модуль", formula: "|a|=a, a>=0" },
    "formula-check-14 grade-6": { theme: "Модуль", formula: "|ab|=|a|·|b|" },
    "formula-check-15 grade-6": { theme: "Модуль", formula: "|a|=-a, a<0" },
    "formula-check-16 grade-6": { theme: "Віднімання раціональних чисел", formula: "a-b=a+(-b)" },
    "formula-check-17 grade-6": { theme: "Винесення спільного множника за дужки", formula: "a·b=b·a" },
    "formula-check-18 grade-6": { theme: "Винесення спільного множника за дужки", formula: "(a·b)·c=a·(b·c)" },
    "formula-check-19 grade-6": { theme: "Винесення спільного множника за дужки", formula: "(a+b)·c = a·c+b·c" },
    "formula-check-20 grade-7": { theme: "Степінь з натуральним показником", formula: "an=a·a·….·a, n>1" },
    "formula-check-21 grade-7": { theme: "Степінь з натуральним показником", formula: "a1=a" },
    "formula-check-22 grade-7": { theme: "Властивості степеня", formula: "an·am=a^(n+m)" },
    "formula-check-23 grade-7": { theme: "Властивості степеня", formula: "(an)/am=a^(n−m)" },
    "formula-check-24 grade-7": { theme: "Властивості степеня", formula: "(an)^m=a^(n·m)" },
    "formula-check-25 grade-7": { theme: "Властивості степеня", formula: "(ab)^n=an·bn" },
    "formula-check-26 grade-7": { theme: "Властивості степеня", formula: "(a/b)^n=an/bn" },
    "formula-check-27 grade-7": { theme: "Формули скороченого множення", formula: "(a+b)^2=a2+2ab+b2" },
    "formula-check-28 grade-7": { theme: "Формули скороченого множення", formula: "(a−b)^2=a2−2ab+b2" },
    "formula-check-29 grade-7": { theme: "Формули скороченого множення", formula: "(a−b)(a+b)=a2−b2" },
    "formula-check-30 grade-7": { theme: "Формули скороченого множення", formula: "a3+b3=(a+b)(a2-ab+b2)" },
    "formula-check-31 grade-7": { theme: "Формули скороченого множення", formula: "a3-b3=(a-b)(a2+ab+b2)" },
    "formula-check-32 grade-7": { theme: "Лінійні рівняння з однією змінною", formula: "ax=b" },
    "formula-check-33 grade-7": { theme: "Лінійні рівняння з однією змінною", formula: "x=a/b, a<>0" },
    "formula-check-34 grade-7": { theme: "Лінійні рівняння з однією змінною", formula: "0x=b, a=0" },
    "formula-check-35 grade-8": { theme: "Квадратні рівняння", formula: "ax2+bx+c=0" },
    "formula-check-36 grade-8": { theme: "Квадратні рівняння", formula: "D=b2-4ac" },
    "formula-check-37 grade-8": { theme: "Квадратні рівняння", formula: "x1=(-b+sqrt(D))/(2a)" },
    "formula-check-38 grade-8": { theme: "Квадратні рівняння", formula: "x2=(-b-sqrt(D))/(2a)" },
    "formula-check-39 grade-8": { theme: "Квадратні рівняння", formula: "ax2+bc+c=a(x-x1)(x-x2)" },
    "formula-check-40 grade-8": { theme: "Арифметичний квадратний корінь", formula: "(sqrt(a))^2=a (a>=0)" },
    "formula-check-41 grade-8": { theme: "Арифметичний квадратний корінь", formula: "(sqrt(a)^2)=|a|" },
    "formula-check-42 grade-8": { theme: "Арифметичний квадратний корінь", formula: "sqrt(a·b)=sqrt(a)·sqrt(b)" },
    "formula-check-43 grade-8": { theme: "Арифметичний квадратний корінь", formula: "sqrt(a/b)=sqrt(a)/sqrt(b)" },
    "formula-check-44 grade-8": { theme: "Арифметичний квадратний корінь", formula: "sqrt(a2-b2)=sqrt(a-b)(a+b)" },
    "formula-check-45 grade-8": { theme: "Степінь з від'ємним показником", formula: "a^(-n)=1/(an)" },
    "formula-check-46 grade-9": { theme: "Нерівності", formula: "a>b, c>d" },
    "formula-check-47 grade-9": { theme: "Нерівності", formula: "a+c>b+d" },
    "formula-check-48 grade-9": { theme: "Нерівності", formula: "ac>bd" },
    "formula-check-49 grade-9": { theme: "Арифметична прогресія", formula: "an=a1+d·(n-1)" },
    "formula-check-50 grade-9": { theme: "Арифметична прогресія", formula: "an=(a(n-1)+a(n+1))/2" },
    "formula-check-51 grade-9": { theme: "Арифметична прогресія", formula: "Sn=((a1+an)·n)/2" },
    "formula-check-52 grade-9": { theme: "Арифметична прогресія", formula: "Sn=((2a1+d·(n-1))·n)/2" },
    "formula-check-53 grade-9": { theme: "Арифметична прогресія", formula: "a(n+1)=an+d" },
    "formula-check-54 grade-9": { theme: "Геометрична прогресія", formula: "bn=b1·q^(n-1)" },
    "formula-check-55 grade-9": { theme: "Геометрична прогресія", formula: "(bn)^2=b(n-1)·b(n+1)" },
    "formula-check-56 grade-9": { theme: "Геометрична прогресія", formula: "Sn=(b1·(qn-1))/(q-1)" },
    "formula-check-57 grade-9": { theme: "Геометрична прогресія", formula: "b(n+1)=bn·q" },
    "formula-check-58 grade-9": { theme: "Геометрична прогресія", formula: "S=b1/(1-q)" },
    "formula-check-59 grade-9": { theme: "Ймовірність", formula: "P(A)=m/n" },
    "formula-check-60 grade-10": { theme: "Корінь n-го степеня", formula: "root((sqrt(a))^(2k+1), 2k+1)=a" },
    "formula-check-61 grade-10": { theme: "Корінь n-го степеня", formula: "root(ab, n)=root(a, n)·root(b, n)" },
    "formula-check-62 grade-10": { theme: "Корінь n-го степеня", formula: "root(a/b, n)=(root(a, n))/(root(b,n))" },
    "formula-check-63 grade-10": { theme: "Корінь n-го степеня", formula: "(root(a, n))^k=root(ak, n)" },
    "formula-check-64 grade-10": { theme: "Корінь n-го степеня", formula: "root(root(a, k), n)=root(a, nk)" },
    "formula-check-65 grade-10": { theme: "Корінь n-го степеня", formula: "root(ak, nk)=root(a, n)" },
    "formula-check-66 grade-10": { theme: "Тригонометричні функції(властивості)", formula: "tg(x)=sin(x)/cos(x)" },
    "formula-check-67 grade-10": { theme: "Тригонометричні функції(властивості)", formula: "sin(x)=sin(x+2pin)" },
    "formula-check-68 grade-10": { theme: "Тригонометричні функції(властивості)", formula: "cos(x)=cos(x+2pin)" },
    "formula-check-69 grade-10": { theme: "Тригонометричні функції(властивості)", formula: "tg(x)=tg(x+pin)" },
    "formula-check-70 grade-10": { theme: "Тригонометричні функції(властивості)", formula: "cos(-x)=cos(x)" },
    "formula-check-71 grade-10": { theme: "Тригонометричні функції(властивості)", formula: "sin(-x)=-sin(x)" },
    "formula-check-72 grade-10": { theme: "Тригонометричні функції(властивості)", formula: "sin2(x)+cos2(x)=1" },
    "formula-check-73 grade-10": { theme: "Тригонометричні функції(властивості)", formula: "1+tg2(x)=1/(cos2(x)" },
    "formula-check-74 grade-10": { theme: "Формули додавання", formula: "cos(x-y)=cos(x)·cos(y)+sin(x)·sin(y)" },
    "formula-check-75 grade-10": { theme: "Формули додавання", formula: "cos(x+y)=cos(x)·cos(y)−sin(x)·sin(y)" },
    "formula-check-76 grade-10": { theme: "Формули додавання", formula: "sin(x+y)=sin(x)·cos(y)+cos(x)·sin(y)" },
    "formula-check-77 grade-10": { theme: "Формули додавання", formula: "sin(x−y)=sin(x)·cos(y)−cos(x)·sin(y)" },
    "formula-check-78 grade-10": { theme: "Формули додавання", formula: "tg(x+y)=(tg(x)+tg(y))/(1-tg(x)·tg(y))" },
    "formula-check-79 grade-10": { theme: "Формули додавання", formula: "tg(x-y)=(tg(x)-tg(y))/(1+tg(x)·tg(y))" },
    "formula-check-80 grade-10": { theme: "Формули додавання", formula: "cos(2x)=cos2(x)-sin2(x)" },
    "formula-check-81 grade-10": { theme: "Формули додавання", formula: "cos(2x)=2·cos2(x)-1" },
    "formula-check-82 grade-10": { theme: "Формули додавання", formula: "cos(2x)=1-2·sin2(x)" },
    "formula-check-83 grade-10": { theme: "Формули додавання", formula: "sin(2x)=2·sin(x)·cos(x)" },
    "formula-check-84 grade-10": { theme: "Рівняння", formula: "cos(x)=b" },
    "formula-check-85 grade-10": { theme: "Рівняння", formula: "x=+-arccos(b)+2pin" },
    "formula-check-86 grade-10": { theme: "Рівняння", formula: "sin(x)=b" },
    "formula-check-87 grade-10": { theme: "Рівняння", formula: "x=((-1)^n)·arcsin(b)+pin" },
    "formula-check-88 grade-10": { theme: "Рівняння", formula: "tg(x)=b" },
    "formula-check-89 grade-10": { theme: "Рівняння", formula: "x=arctg(b)+pin" },
    "formula-check-90 grade-10": { theme: "Рівняння", formula: "ctg(x)=b" },
    "formula-check-91 grade-10": { theme: "Рівняння", formula: "x=arcctg(b)+pin" },
    "formula-check-92 grade-10": { theme: "Правила диферінцювання", formula: "(f+g)'=f'+g'" },
    "formula-check-93 grade-10": { theme: "Правила диферінцювання", formula: "(f·g)'=f'·g'+f'·g'" },
    "formula-check-94 grade-10": { theme: "Правила диферінцювання", formula: "(f/g)'=(f'·g-f·g')/g2" },
    "formula-check-95 grade-11": { theme: "Логарифми", formula: "log_a(b·c)=log_a(b)+log_a©" },
    "formula-check-96 grade-11": { theme: "Логарифми", formula: "log_a(b/c)=log_a(b)-log_a(c)" },
    "formula-check-97 grade-11": { theme: "Логарифми", formula: "log_a(bc)=c·log_a(b)" },
    "formula-check-98 grade-11": { theme: "Логарифми", formula: "log_a(root(b), n)=(log_a(b))/n" },
};


function populateTable(data) {
    const tableBody = document.querySelector('#formulas-table tbody'); // Reference the table's body
    tableBody.innerHTML = ''; // Clear any existing rows

    Object.keys(data.checked_formulas).forEach(formulaKey => {
        const formulaData = formulasTable[formulaKey];

        if (formulaData) {
            const row = document.createElement('tr');

            // First column: Actual formula
            const formulaCell = document.createElement('td');
            formulaCell.textContent = getActualFormula(formulaKey);
            row.appendChild(formulaCell);

            // Second column: Theme
            const themeCell = document.createElement('td');
            themeCell.textContent = formulaData.theme;
            row.appendChild(themeCell);

            tableBody.appendChild(row);
        } else {
            console.error(`Formula key "${formulaKey}" not found in formulasTable.`);
        }
    });
    console.log("Table populated with formulas and themes.");
}


function getActualFormula(formulaKey) {
    // Check if the formulaKey exists in formulasTable
    if (formulasTable[formulaKey]) {
        return formulasTable[formulaKey].formula; // Return the text formula
    } else {
        console.error(`Formula key "${formulaKey}" not found in formulasTable.`);
        return "Formula not found"; // Return a fallback message
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const formulasTable = document.getElementById('formulas-table'); // Reference the table
    let isFullscreen = false; // Track fullscreen state

    // Function to enter fullscreen
    function enterFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
        isFullscreen = true; // Mark as fullscreen
    }


    // Monitor fullscreen exit
    function monitorFullscreenExit() {
        const fullscreenElement = document.fullscreenElement ||
                                  document.webkitFullscreenElement ||
                                  document.mozFullScreenElement ||
                                  document.msFullscreenElement;
    
        if (!fullscreenElement && isFullscreen) {
            console.log("Fullscreen exit detected."); // Log the event
            alert("You have tried to exit fullscreen, this has been logged")
            // Send a POST request to the Flask server with the userID and classUUID
            fetch('/fullscreen_exit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Indicate JSON payload
                },
                body: JSON.stringify({
                    userID: userID, // Include userID
                    classUUID: classUUID // Include classUUID
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log("Server successfully notified.");
                } else {
                    console.error("Failed to notify server.");
                }
            })
            .catch(error => console.error("Error sending data to server:", error));
    
            // Hide all elements except the fullscreen button
            


            formulasTable.style.display = 'none';

    
            // Show the fullscreen button
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            if (fullscreenBtn) {
                fullscreenBtn.style.display = 'block'; // Make the button visible
            }
     // Show a JS alert
            isFullscreen = false; // Reset fullscreen state
        }
    }
    
    

    // Event listener for the fullscreen button
    fullscreenBtn.addEventListener('click', () => {
        enterFullscreen();
        fullscreenBtn.style.display = 'none'; // Hide the fullscreen button
        formulasTable.style.display = 'table'; // Show the table

        // Fetch and populate formulas
        fetch(`/get_checked_formulas?class_uuid=${classUUID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const tableBody = formulasTable.querySelector('tbody');
                    tableBody.innerHTML = ''; // Clear any existing rows
                    populateTable(data);

                    console.log("Table populated with formulas.");
                } else {
                    alert("Failed to load formulas: " + data.message);
                }
            })
            .catch(error => console.error("Error fetching formulas:", error));
    });

    // Detect fullscreen exit events
    document.addEventListener('fullscreenchange', monitorFullscreenExit);
    document.addEventListener('webkitfullscreenchange', monitorFullscreenExit); // Safari
    document.addEventListener('mozfullscreenchange', monitorFullscreenExit); // Firefox
    document.addEventListener('MSFullscreenChange', monitorFullscreenExit); // IE/Edge
});