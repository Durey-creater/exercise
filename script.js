// script.js
document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let questions = [];

    fetch('./questions.json', { mode: 'no-cors'})
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestion(questions[currentQuestionIndex]);
        });

    function displayQuestion(question) {
        const questionText = document.getElementById('question-text');
        const choicesList = document.getElementById('choices-list');
        const explanation = document.getElementById('answer-explanation');

        questionText.textContent = question.text;
        choicesList.innerHTML = '';
        explanation.style.display = 'none';

        question.choices.forEach(function(choice) {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = choice;
            button.onclick = function() { chooseAnswer(choice, question); };
            li.appendChild(button);
            choicesList.appendChild(li);
        });
    }

    function chooseAnswer(choice, question) {
        if (choice === question.answer) {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                displayQuestion(questions[currentQuestionIndex]);
            } else {
                document.getElementById('quiz-container').innerHTML = '<p>すべての問題が終了しました！</p>';
            }
        } else {
            const explanation = document.getElementById('answer-explanation');
            explanation.textContent = "不正解。 " + question.explanation;
            explanation.style.display = 'block';
        }
    }
});
