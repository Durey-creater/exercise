document.addEventListener('DOMContentLoaded', function() {
    let currentLevel = 1;
    let questions = [];
    let totalQuestionsAnswered = 0;
    const recentResults = []; // 直近の結果を保存する配列

    function getRandomQuestionOfLevel(level) {
        const questionNumber = document.getElementById('question-number');
        const questionsOfLevel = questions.filter(q => q.difficulty === level);
        totalQuestionsAnswered++; // 全体の問題数をインクリメント
        questionNumber.textContent = '問題 #' + totalQuestionsAnswered; // 修正：全体の問題数を表示

        return questionsOfLevel[Math.floor(Math.random() * questionsOfLevel.length)];
    }

    function updateDifficulty() {
        if (recentResults.length === 5) {
            const correctCount = recentResults.filter(Boolean).length;
            if (correctCount === 5) {
                alert('難易度が上がります！');
                currentLevel = Math.min(currentLevel + 1, 10); // 最大レベル10
            } else if ((correctCount === 0 || correctCount === 1) && currentLevel > 1) {
                alert('難易度が下がります！');
                currentLevel = Math.max(currentLevel - 1, 1); // 最低レベル1
            } else {
                alert('同じ難易度で続けます。');
            }
            recentResults.length = 0;
            displayQuestion(getRandomQuestionOfLevel(currentLevel));
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
        const nextQuestionButton = document.getElementById('next-question-button');
        
        questionNumber.textContent = '問題 #' + (recentResults.length + 1);
        difficulty.textContent = '難易度: ' + question.difficulty;
        questionText.textContent = question.text;
        choicesList.innerHTML = '';
        explanation.style.display = 'none';
        nextQuestionButton.style.display = 'none';
        
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

        totalQuestionsAnswered++; // 正解か不正解かを選んだ後にインクリメント

        if (choice === question.answer) {
            recentResults.push(true);
            explanation.textContent = "正解！ " + question.explanation;
        } else {
            recentResults.push(false);
            explanation.textContent = "不正解。 " + question.explanation;
        }

        const nextQuestionButton = document.getElementById('next-question-button');
        nextQuestionButton.style.display = 'block';
    }

    const nextQuestionButton = document.getElementById('next-question-button');
    nextQuestionButton.onclick = function() {
        if (recentResults.length === 5) {
            updateDifficulty();
        } else {
            displayQuestion(getRandomQuestionOfLevel(currentLevel));
        }
        nextQuestionButton.style.display = 'none'; // ボタンを再び非表示に
    };
});
