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
                // All recent 5 answers are correct, increase difficulty level
                alert('難易度が上がります！');
                currentLevel = Math.min(currentLevel + 1, 10); // Maximum level 10
            } else if ((correctCount === 0 || correctCount === 1) && currentLevel > 1) {
                // Less than or equal to 1 out of last 5 answers are correct, decrease difficulty level
                alert('難易度が下がります！');
                currentLevel = Math.max(currentLevel - 1, 1); // Minimum level 1
            } else {
                // Otherwise, keep the same difficulty level
                alert('同じ難易度で続けます。');
            }
            // Reset the recent results for the new difficulty level
            recentResults.length = 0;
            // Display a random question of the new difficulty level
            displayQuestion(getRandomQuestionOfLevel(currentLevel));
        }
    }

    // function displayNextQuestion() {
    //     currentQuestionIndex++;
    //     if (currentQuestionIndex < questions.length) {
    //         displayQuestion(questions[currentQuestionIndex]);
    //     } else {
    //         document.getElementById('quiz-container').innerHTML = '<p>すべての問題が終了しました！</p>';
    //     }
    // }

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
            
            questionNumber.textContent = '問題 #' + (currentQuestionIndex + 1);  // ここを修正
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

    if (recentResults.length === 5) {
        // Update difficulty if 5 questions have been answered
        updateDifficulty();
    } else {
        // Display a new random question of the same difficulty level
        setTimeout(function() { // Set timeout to allow the answer explanation to be read
            displayQuestion(getRandomQuestionOfLevel(currentLevel));
        }, 2000); // 2000 ms delay before showing the next question
    }
    }
});