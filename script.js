const panels = document.querySelectorAll(".tool-panel");
const toolCards = document.querySelectorAll(".tool-card");

function showTool(id) {
    panels.forEach(panel => panel.classList.remove("active"));

    toolCards.forEach(card => card.classList.remove("active-tool"));

    document.getElementById(id).classList.add("active");

    event.currentTarget.classList.add("active-tool");

    document.querySelector(".tool-area").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* THEME */

const themeBtn = document.getElementById("themeBtn");

themeBtn.onclick = function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
};

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
}


/* CALCULATOR */

let calcDisplay = document.getElementById("calcDisplay");

function calcInput(value) {
    calcDisplay.value += value;
}

function clearCalc() {
    calcDisplay.value = "";
}

function deleteCalc() {
    calcDisplay.value = calcDisplay.value.slice(0, -1);
}

function calculate() {

    try {

        let expression = calcDisplay.value;

        if (!expression) return;

        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!isFinite(result)) {
            calcDisplay.value = "Error";
            return;
        }

        calcDisplay.value = result;

        saveHistory(expression + " = " + result);

    } catch {
        calcDisplay.value = "Error";
    }
}

function saveHistory(value) {

    let history =
        JSON.parse(localStorage.getItem("calcHistory")) || [];

    history.unshift(value);

    history = history.slice(0, 10);

    localStorage.setItem(
        "calcHistory",
        JSON.stringify(history)
    );

    displayHistory();
}

function displayHistory() {

    let history =
        JSON.parse(localStorage.getItem("calcHistory")) || [];

    let box = document.getElementById("history");

    box.innerHTML = "";

    history.forEach(item => {

        let div = document.createElement("div");

        div.className = "history-item";

        div.textContent = item;

        box.appendChild(div);
    });
}

function clearHistory() {

    localStorage.removeItem("calcHistory");

    displayHistory();
}

displayHistory();


/* PERCENTAGE */

function calculatePercentage() {

    let obtained =
        Number(document.getElementById("obtained").value);

    let total =
        Number(document.getElementById("total").value);

    let result =
        document.getElementById("percentageResult");

    if (obtained < 0 || total <= 0 || obtained > total) {

        result.textContent =
            "Please enter valid marks.";

        return;
    }

    let percentage =
        (obtained / total) * 100;

    result.innerHTML =
        `🎉 Your Percentage: <strong>${percentage.toFixed(2)}%</strong>`;
}

function resetPercentage() {

    document.getElementById("obtained").value = "";
    document.getElementById("total").value = "";
    document.getElementById("percentageResult").innerHTML = "";
}


/* CGPA */

function cgpaToPercentage() {

    let cgpa =
        Number(document.getElementById("cgpaValue").value);

    let factor =
        Number(document.getElementById("cgpaFactor").value);

    let result =
        document.getElementById("cgpaResult");

    if (cgpa <= 0 || factor <= 0) {

        result.textContent = "Enter valid values.";

        return;
    }

    let percentage = cgpa * factor;

    result.innerHTML =
        `📊 Percentage: <strong>${percentage.toFixed(2)}%</strong>`;
}

function percentageToCgpa() {

    let percentage =
        Number(document.getElementById("percentageValue").value);

    let factor =
        Number(document.getElementById("percentageFactor").value);

    let result =
        document.getElementById("percentageCgpaResult");

    if (percentage < 0 || factor <= 0) {

        result.textContent = "Enter valid values.";

        return;
    }

    let cgpa = percentage / factor;

    result.innerHTML =
        `🎓 CGPA: <strong>${cgpa.toFixed(2)}</strong>`;
}


/* SUBJECT MARKS */

function addSubject() {

    let container =
        document.getElementById("subjects");

    let row =
        document.createElement("div");

    row.className = "subject-row";

    row.innerHTML = `
        <input type="text" placeholder="Subject">
        <input type="number" class="subject-obtained" placeholder="Obtained">
        <input type="number" class="subject-total" placeholder="Total">
        <button onclick="removeSubject(this)">×</button>
    `;

    container.appendChild(row);
}

function removeSubject(button) {

    let rows =
        document.querySelectorAll(".subject-row");

    if (rows.length > 1) {
        button.parentElement.remove();
    }
}

function calculateMarks() {

    let obtained =
        document.querySelectorAll(".subject-obtained");

    let total =
        document.querySelectorAll(".subject-total");

    let obtainedTotal = 0;
    let totalTotal = 0;

    for (let i = 0; i < obtained.length; i++) {

        let o = Number(obtained[i].value);
        let t = Number(total[i].value);

        if (o < 0 || t <= 0 || o > t) {

            document.getElementById("marksResult").textContent =
                "Please enter valid marks for all subjects.";

            return;
        }

        obtainedTotal += o;
        totalTotal += t;
    }

    let percentage =
        (obtainedTotal / totalTotal) * 100;

    document.getElementById("marksResult").innerHTML = `
        📚 Total Obtained: <strong>${obtainedTotal}</strong><br><br>
        📖 Total Marks: <strong>${totalTotal}</strong><br><br>
        🎯 Percentage: <strong>${percentage.toFixed(2)}%</strong>
    `;
}


/* SALARY */

function calculateSalary() {

    let basic =
        Number(document.getElementById("basicSalary").value) || 0;

    let daPercent =
        Number(document.getElementById("daPercent").value) || 0;

    let hraPercent =
        Number(document.getElementById("hraPercent").value) || 0;

    let other =
        Number(document.getElementById("otherAllowance").value) || 0;

    let deductions =
        Number(document.getElementById("deductions").value) || 0;

    let da =
        basic * daPercent / 100;

    let hra =
        basic * hraPercent / 100;

    let gross =
        basic + da + hra + other;

    let net =
        gross - deductions;

    document.getElementById("salaryBasic").textContent =
        money(basic);

    document.getElementById("salaryDA").textContent =
        money(da);

    document.getElementById("salaryHRA").textContent =
        money(hra);

    document.getElementById("salaryOther").textContent =
        money(other);

    document.getElementById("grossSalary").textContent =
        money(gross);

    document.getElementById("netSalary").textContent =
        money(net);
}

function money(value) {

    return "₹" + value.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}


/* AGE */

function calculateAge() {

    let dobValue =
        document.getElementById("dob").value;

    let result =
        document.getElementById("ageResult");

    if (!dobValue) {

        result.textContent =
            "Please select your date of birth.";

        return;
    }

    let dob =
        new Date(dobValue);

    let today =
        new Date();

    if (dob > today) {

        result.textContent =
            "Date of birth cannot be in the future.";

        return;
    }

    let years =
        today.getFullYear() - dob.getFullYear();

    let months =
        today.getMonth() - dob.getMonth();

    let days =
        today.getDate() - dob.getDate();

    if (days < 0) {

        months--;

        let previousMonth =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            );

        days += previousMonth.getDate();
    }

    if (months < 0) {

        years--;

        months += 12;
    }

    result.innerHTML = `
        🎂 You are
        <strong>${years} years, ${months} months and ${days} days</strong> old.
    `;
}


/* TIMER */

let timerSeconds = 25 * 60;
let timerInterval = null;

function updateTimer() {

    let minutes =
        Math.floor(timerSeconds / 60);

    let seconds =
        timerSeconds % 60;

    document.getElementById("timerDisplay").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function setTimer(minutes) {

    clearInterval(timerInterval);

    timerSeconds = minutes * 60;

    updateTimer();

    document.getElementById("timerMessage").textContent =
        "Ready? Let's focus! 🚀";
}

function startTimer() {

    if (timerInterval) return;

    timerInterval =
        setInterval(() => {

            if (timerSeconds > 0) {

                timerSeconds--;

                updateTimer();

            } else {

                clearInterval(timerInterval);

                timerInterval = null;

                document.getElementById("timerMessage").textContent =
                    "🎉 Time's up! Great work!";
            }

        }, 1000);
}

function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    document.getElementById("timerMessage").textContent =
        "⏸️ Timer paused.";
}

function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timerSeconds = 25 * 60;

    updateTimer();

    document.getElementById("timerMessage").textContent =
        "Stay focused. You've got this! 💪";
}

updateTimer();


/* NUMBER CONVERTER */

function convertNumber() {

    let number =
        Number(document.getElementById("decimalNumber").value);

    if (!Number.isInteger(number) || number < 0) {

        document.getElementById("binaryResult").textContent = "Invalid";
        document.getElementById("octalResult").textContent = "Invalid";
        document.getElementById("hexResult").textContent = "Invalid";

        return;
    }

    document.getElementById("binaryResult").textContent =
        number.toString(2);

    document.getElementById("octalResult").textContent =
        number.toString(8);

    document.getElementById("hexResult").textContent =
        number.toString(16).toUpperCase();
}


/* KEYBOARD CALCULATOR */

document.addEventListener("keydown", function(e) {

    let key = e.key;

    if (
        "0123456789+-*/.%".includes(key)
    ) {

        calcInput(key);
    }

    if (key === "Enter") {

        calculate();
    }

    if (key === "Escape") {

        clearCalc();
    }

    if (key === "Backspace") {

        deleteCalc();
    }
});
