document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let currentLevel = 1;
    let questions = [];
    const recentResults = []; // 直近の結果を保存する配列

    function getRandomQuestionOfLevel(level) {
        const questionsOfLevel = questions.filter(q => q.difficulty === level);
        return questionsOfLevel[Math.floor(Math.random() * questionsOfLevel.length)];
    }

    function updateDifficulty() {
        if (recentResults.length === 5) {
            const correctCount = recentResults.filter(Boolean).length;
            if (correctCount === 5) {
                alert('全問正解！難易度が上がります！');
                currentLevel = Math.min(currentLevel + 1, 10); // 最大レベル10
            } else if (correctCount <= 1 && currentLevel > 1) {
                alert('難易度が下がります！');
                currentLevel = Math.max(currentLevel - 1, 1); // 最低レベル1
            } else {
                alert('同じ難易度で続けます。');
            }
            recentResults.length = 0; // recentResultsをリセット
            currentQuestionIndex = 0; // 問題番号をリセット
            displayQuestion(getRandomQuestionOfLevel(currentLevel));
        } else {
            displayNextQuestion();
        }
    }

    function displayNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(questions[currentQuestionIndex]);
        } else {
            document.getElementById('quiz-container').innerHTML = '<p>すべての問題が終了しました！</p>';
        }
    }

    fetch(location.href + 'questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestion(getRandomQuestionOfLevel(currentLevel));
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
        const explanation = document.getElementById('answer-explanation');
        explanation.style.display = 'block';
        
        if (choice === question.answer) {
            recentResults.push(true);
            explanation.textContent = "正解！ " + question.explanation;
        } else {
            recentResults.push(false);
            explanation.textContent = "不正解。 " + question.explanation;
        }
        
        updateDifficulty();
    }
});
