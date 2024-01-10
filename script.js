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
            const questionNumber = document.getElementById('question-number'); // ここで定義
            const difficulty = document.getElementById('difficulty');
            const questionText = document.getElementById('question-text');
            const choicesList = document.getElementById('choices-list');
            const explanation = document.getElementById('answer-explanation');
            const nextQuestionButton = document.getElementById('next-question-button');
        
            totalQuestionsAnswered++; // 全体の問題数をインクリメント
            questionNumber.textContent = '問題 #' + totalQuestionsAnswered; // 修正：全体の問題数を表示
        
            // 以下のコードは変更なし...        
        
            difficulty.textContent = '難易度: ' + question.difficulty;
            questionText.innerHTML = `${question.text.jp}<br>${question.text.en}`;
            choicesList.innerHTML = '';
            explanation.style.display = 'none';
            nextQuestionButton.style.display = 'none';
        
            choicesList.innerHTML = '';
            question.choices.jp.forEach((choice, index) => {
                const li = document.createElement('li');
                const button = document.createElement('button');
                button.textContent = `${choice} / ${question.choices.en[index]}`;
                button.onclick = function() { chooseAnswer(choice, question.answer.jp); };
                li.appendChild(button);
                choicesList.appendChild(li);
            });

            explanation.innerHTML = `${question.explanation.jp}<br>${question.explanation.en}`;
        }
        
        function chooseAnswer(choice, question) {
            const explanation = document.getElementById('answer-explanation'); // この行は1回だけ宣言
            explanation.style.display = 'block';
        
            if (choice === question.answer) {
                recentResults.push(true);
                explanation.innerHTML = "正解！ " + question.explanation.replace(/\n/g, '<br>'); // 正解の解説も改行を <br> に置換
            } else {
                recentResults.push(false);
                explanation.innerHTML = "不正解。 " + question.explanation.replace(/\n/g, '<br>'); // 不正解の解説も改行を <br> に置換
                incorrectQuestions.push(question);
            }
        
            const nextQuestionButton = document.getElementById('next-question-button');
            nextQuestionButton.style.display = 'block';
        }
        
    
    const showIncorrectButton = document.getElementById('show-incorrect-questions-button');
    const incorrectContainer = document.getElementById('incorrect-questions-container');
    showIncorrectButton.addEventListener('click', function() {
        // 不正解の問題一覧の表示状態をトグル
        if (incorrectContainer.style.display === 'none' || incorrectContainer.style.display === '') {
            displayIncorrectQuestions(); // 間違った問題を表示する関数
            incorrectContainer.style.display = 'block'; // 一覧を表示
        } else {
            incorrectContainer.style.display = 'none'; // 一覧を非表示
        }
    });
    function displayIncorrectQuestions() {
        incorrectContainer.innerHTML = ''; // コンテナをクリア
        if (incorrectQuestions.length === 0) {
            incorrectContainer.textContent = '間違った問題はありません。';
            return;
        }
        incorrectQuestions.forEach(question => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>問題:</strong> ${question.text} <br>
                             <strong>解答:</strong> ${question.answer} <br>
                             <strong>解説:</strong> ${question.explanation} <br><br>`;
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