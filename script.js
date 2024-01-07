document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionIndex = 0;
    let questions = [];
    const recentResults = []; // 直近の結果を保存する配列

    function updateDifficulty() {
        const correctCount = recentResults.filter(Boolean).length;
        if (recentResults.length === 5) {
            if (correctCount === 5) {
                alert('全問正解！難易度が上がります！');
                // 難易度を上げる処理をここに実装
            } else if (correctCount <= 1) {
                alert('難易度が下がります！');
                // 難易度を下げる処理をここに実装
            } else {
                alert('同じ難易度で続けます。');
                // 難易度を維持する処理をここに実装
            }
            recentResults.length = 0; // recentResultsをリセット
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
        difficulty.textContent = '難易度: ' + question.difficulty; // 数値型の難易度を表示
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
        
        if (recentResults.length >= 5) {
            recentResults.shift(); // 配列が5より大きくなったら、古い結果を削除
        }

        // 次の問題に進むかどうかの判定
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(questions[currentQuestionIndex]);
        } else {
            document.getElementById('quiz-container').innerHTML = '<p>すべての問題が終了しました！</p>';
        }
    }
});
