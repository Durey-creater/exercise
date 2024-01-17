document.addEventListener('DOMContentLoaded', function() {
    let currentLevel = 1;
    let questions = [];
    let totalQuestionsAnswered = 0;
    const recentResults = []; // 直近の結果を保存する配列
    const incorrectQuestions = [];

    // 質問を取得し、画面に表示する
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
        choicesList.innerHTML = '';
        explanation.style.display = 'none';
        nextQuestionButton.style.display = 'none';
        

        question.choices.jp.forEach((choiceJp, index) => {
            const choiceEn = question.choices.en[index];
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = choiceJp === choiceEn ? choiceJp : `${choiceJp} / ${choiceEn}`;
            button.onclick = () => chooseAnswer(question, choiceJp);
            li.appendChild(button);
            choicesList.appendChild(li);
        });

        explanation.innerHTML = `${question.explanation.jp}<br>${question.explanation.en}`;
    }

    // ユーザーの選択に応じて処理を行う
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

    // 難易度を更新する
    function updateDifficulty() {
        if (recentResults.length === 5) {
            const correctCount = recentResults.filter(Boolean).length;
            if (correctCount === 5) {
                currentLevel = Math.min(currentLevel + 1, 10);
                alert('難易度が上がります！');
            } else if ((correctCount === 0 || correctCount === 1) && currentLevel > 1) {
                currentLevel = Math.max(currentLevel - 1, 1);
                alert('難易度が下がります！');
            } else {
                alert('同じ難易度で続けます。');
            }
            recentResults.length = 0;
            displayNextQuestion();
        }
    }

    // 次の質問を表示する
    function displayNextQuestion() {
        const nextQuestion = getRandomQuestionOfLevel(currentLevel);
        displayQuestion(nextQuestion);
    }

    // レベルに基づいたランダムな質問を取得する
    function getRandomQuestionOfLevel(level) {
        const questionsOfLevel = questions.filter(q => q.difficulty === level);
        return questionsOfLevel[Math.floor(Math.random() * questionsOfLevel.length)];
    }

    // 不正解の質問を表示する
    function displayIncorrectQuestions() {
        const incorrectContainer = document.getElementById('incorrect-questions-container');
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

    // 問題を取得する
    fetch(location.href + 'questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayNextQuestion();
        })
        .catch(error => console.error('通信に失敗しました', error));

    // 不正解の質問を表示するボタンのイベントハンドラ
    const showIncorrectButton = document.getElementById('show-incorrect-questions-button');
    showIncorrectButton.addEventListener('click', () => {
        const incorrectContainer = document.getElementById('incorrect-questions-container');
        incorrectContainer.style.display = incorrectContainer.style.display === 'none' ? 'block' : 'none';
        displayIncorrectQuestions();
    });
});