document.addEventListener('DOMContentLoaded', function() {
    let currentLevel = 1;
    let questions = [];
    let totalQuestionsAnswered = 0;
    const recentResults = []; // 直近の結果を保存する配列
    const incorrectQuestions = [];

    // 問題を取得し、画面に表示する
    function displayQuestion(question) {
        updateQuestionDisplay(question);
        updateChoicesList(question);
        resetExplanationAndNextButton();
    }

    // 問題の表示を更新する
    function updateQuestionDisplay(question) {
        const questionNumber = document.getElementById('question-number');
        const difficulty = document.getElementById('difficulty');
        const questionText = document.getElementById('question-text');

        totalQuestionsAnswered++;
        questionNumber.textContent = '問題 #' + totalQuestionsAnswered;
        difficulty.textContent = '難易度: ' + question.difficulty;
        questionText.innerHTML = `${question.text.jp}<br>${question.text.en}`;
    }

    // 選択肢リストを更新する
    function updateChoicesList(question) {
        const choicesList = document.getElementById('choices-list');
        choicesList.innerHTML = '';

        question.choices.jp.forEach((choiceJp, index) => {
            const choiceEn = question.choices.en[index];
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = choiceJp === choiceEn ? choiceJp : `${choiceJp} / ${choiceEn}`;
            button.onclick = () => chooseAnswer(question, choiceJp);
            li.appendChild(button);
            choicesList.appendChild(li);
        });
    }

    // 解説と次の質問ボタンの表示をリセットする
    function resetExplanationAndNextButton() {
        const explanation = document.getElementById('answer-explanation');
        const nextQuestionButton = document.getElementById('next-question-button');
        explanation.style.display = 'none';
        nextQuestionButton.style.display = 'none';
    }

    // ユーザーの選択に応じて処理を行う
    function chooseAnswer(question, choice) {
        const explanation = document.getElementById('answer-explanation');
        explanation.style.display = 'block';
        explanation.innerHTML = choice === question.answer.jp ? 
                            "正解！ " + question.explanation.jp + "<br>" + question.explanation.en :
                            "不正解。 " + question.explanation.jp + "<br>" + question.explanation.en;

        recentResults.push(choice === question.answer.jp);
        if (!recentResults[recentResults.length - 1]) {
            incorrectQuestions.push(question);
        }

        // 次の質問ボタン
        const nextQuestionButton = document.getElementById('next-question-button');
        nextQuestionButton.onclick = function() {
            if (recentResults.length === 5) {
                updateDifficulty();
            } else {
                displayNextQuestion();
            }
        };
        nextQuestionButton.style.display = 'block';
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

    // 難易度を更新し、次の質問を表示する
    function updateDifficulty() {
        const correctCount = recentResults.filter(Boolean).length;
        updateLevel(correctCount);
        recentResults.length = 0;
        displayNextQuestion();
    }

    // レベルを更新する
    function updateLevel(correctCount) {
        if (correctCount === 5) {
            currentLevel = Math.min(currentLevel + 1, 10);
            alert('難易度が上がります！');
        } else if (correctCount <= 1 && currentLevel > 1) {
            currentLevel = Math.max(currentLevel - 1, 1);
            alert('難易度が下がります！');
        } else {
            alert('同じ難易度で続けます。');
        }
    }

    // 問題を取得し、最初の質問を表示する
    fetch(location.href + 'questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayNextQuestion();
        })
        .catch(error => console.error('通信に失敗しました', error));

    // 不正解の質問一覧を表示・非表示する
    const showIncorrectButton = document.getElementById('show-incorrect-questions-button');
    showIncorrectButton.addEventListener('click', () => {
        const incorrectContainer = document.getElementById('incorrect-questions-container');
        incorrectContainer.style.display = incorrectContainer.style.display === 'none' ? 'block' : 'none';
        displayIncorrectQuestions();
    });

    // 不正解の質問一覧を表示する
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
});