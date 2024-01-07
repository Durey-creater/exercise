document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let questions = [];
    const recentResults = []; // 直近の結果を保存する配列

    function updateDifficulty() {
        if (recentResults.length >= 5 && recentResults.filter(Boolean).length / 5 >= 0.8) {
            // 難易度を上げる処理をここに実装
            alert('難易度が上がりました！');
            // 難易度を上げた後の処理をここに実装
        }
    }

    fetch(location.href + 'questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestion(questions[currentQuestionIndex]);
        })
        .catch(error => {
            console.error('通信に失敗しました', error);
        });

    function displayQuestion(question) {
        const questionNumber = document.getElementById('question-number');
        const difficulty = document.getElementById('difficulty');
        const questionText = document.getElementById('question-text');
        const choicesList = document.getElementById('choices-list');
        const explanation = document.getElementById('answer-explanation');

        questionNumber.textContent = '問題 #' + (currentQuestionIndex + 1);
        difficulty.textContent = '難易度: ' + question.difficulty;
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
            correctAnswersCount++;
            recentResults.push(true);
            updateDifficulty();
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                displayQuestion(questions[currentQuestionIndex]);
            } else {
                document.getElementById('quiz-container').innerHTML = '<p>すべての問題が終了しました！</p>';
            }
        } else {
            recentResults.push(false);
            updateDifficulty();
            const explanation = document.getElementById('answer-explanation');
            explanation.textContent = "不正解。 " + question.explanation;
            explanation.style.display = 'block';
        }
        if (recentResults.length > 5) {
            recentResults.shift(); // 配列が5より大きくなったら、古い結果を削除
        }
    }
});
