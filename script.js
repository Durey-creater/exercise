document.addEventListener('DOMContentLoaded', function() {
    let currentLevel = 1;
    let questions = [];
    const recentResults = []; // 直近の結果を保存する配列

    function getRandomQuestionOfLevel(level) {
        const questionsOfLevel = questions.filter(q => parseInt(q.difficulty) === level);
        return questionsOfLevel[Math.floor(Math.random() * questionsOfLevel.length)];
    }

    function updateDifficulty() {
        const correctCount = recentResults.filter(Boolean).length;
        if (correctCount === 5) {
            currentLevel = Math.min(currentLevel + 1, 10); // 最大レベル10
            recentResults.length = 0; // recentResultsをリセット
            alert('全問正解！難易度が上がります！');
        } else if (correctCount <= 1 && currentLevel > 1) {
            currentLevel = Math.max(currentLevel - 1, 1); // 最低レベル1
            recentResults.length = 0; // recentResultsをリセット
            alert('難易度が下がります！');
        }

        displayNextQuestion();
    }

    function displayNextQuestion() {
        displayQuestion(getRandomQuestionOfLevel(currentLevel));
    }

    // ... fetchとdisplayQuestion関数 ...

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
        
        if (recentResults.length < 5) {
            displayNextQuestion();
        } else {
            updateDifficulty();
        }
    }
});
