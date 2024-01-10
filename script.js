document.addEventListener('DOMContentLoaded', function() {
    let currentLevel = 1;
    let questions = [];
    let totalQuestionsAnswered = 0;
    const recentResults = []; // 直近の結果を保存する配列
    const incorrectQuestions = [];

    function getRandomQuestionOfLevel(level) {
        const questionsOfLevel = questions.filter(q => q.difficulty === level);
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
        
        totalQuestionsAnswered++;
        questionNumber.textContent = '問題 #' + totalQuestionsAnswered;
        
        difficulty.textContent = '難易度: ' + question.difficulty;
        questionText.innerHTML = `${question.text.jp}<br>${question.text.en}`;
        explanation.style.display = 'none';
        nextQuestionButton.style.display = 'none';
        
        choicesList.innerHTML = '';
        question.choices.jp.forEach((choiceJp, index) => {
        const choiceEn = question.choices.en[index];
        const li = document.createElement('li');
        const button = document.createElement('button');
        
        // 日本語と英語の選択肢が異なる場合のみ、両方を表示
        if (choiceJp !== choiceEn) {
            button.textContent = `${choiceJp} / ${choiceEn}`;
        } else {
            button.textContent = choiceJp; // 同じ場合、日本語の選択肢のみを表示
        }
        button.onclick = function() { chooseAnswer(question, choiceJp); };
        li.appendChild(button);
        choicesList.appendChild(li);
    });

    // その他のコード...
}

        explanation.innerHTML = `${question.explanation.jp}<br>${question.explanation.en}`;
    }

    function chooseAnswer(question, choice) {
        const explanation = document.getElementById('answer-explanation');
        explanation.style.display = 'block';
        
        if (choice === question.answer.jp) {
            recentResults.push(true);
            explanation.innerHTML = "正解！ " + question.explanation.jp + "<br>" + question.explanation.en;
        } else {
            recentResults.push(false);
            explanation.innerHTML = "不正解。 " + question.explanation.jp + "<br>" + question.explanation.en;
            incorrectQuestions.push(question);
        }
        
        const nextQuestionButton = document.getElementById('next-question-button');
        nextQuestionButton.style.display = 'block';
    }

    const showIncorrectButton = document.getElementById('show-incorrect-questions-button');
    const incorrectContainer = document.getElementById('incorrect-questions-container');
    showIncorrectButton.addEventListener('click', function() {
        if (incorrectContainer.style.display === 'none' || incorrectContainer.style.display === '') {
            displayIncorrectQuestions();
            incorrectContainer.style.display = 'block';
        } else {
            incorrectContainer.style.display = 'none';
        }
    });

    function displayIncorrectQuestions() {
        incorrectContainer.innerHTML = '';
        if (incorrectQuestions.length === 0) {
            incorrectContainer.textContent = '間違った問題はありません。';
            return;
        }
        incorrectQuestions.forEach(question => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>問題:</strong> ${question.text.jp}<br>${question.text.en}<br>
                             <strong>解答:</strong> ${question.answer.jp}<br>
                             <strong>解説:</strong> ${question.explanation.jp}<br>${question.explanation.en}<br><br>`;
            incorrectContainer.appendChild(div);
        });
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