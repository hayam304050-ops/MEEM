// ==========================================
// ⬇️ منطقة المنهج (Syllabus) ⬇️
// قم بإضافة الأبواب والدروس والأسئلة هنا
// ==========================================

const syllabus = [
    {
        chapter: "معلومات عامة",
        branches: [
            {
                title: "1. عواصم الدول",
                lesson: "💡 تذكر: عاصمة مصر هي القاهرة، وعاصمة السعودية هي الرياض.",
                questions: [
                    { q: "ما هي عاصمة مصر؟", options: ["الإسكندرية", "القاهرة", "الأقصر"], a: "القاهرة" },
                    { q: "ما هي عاصمة السعودية؟", options: ["جدة", "مكة", "الرياض"], a: "الرياض" }
                ]
            },
            {
                title: "2. الحيوانات",
                lesson: "💡 تذكر: الأسد يلقب بملك الغابة، والفهد هو أسرع الحيوانات البرية.",
                questions: [
                    { q: "من هو ملك الغابة؟", options: ["النمر", "الفيل", "الأسد"], a: "الأسد" },
                    { q: "ما هو أسرع حيوان بري؟", options: ["الفهد", "الحصان", "الغزال"], a: "الفهد" }
                ]
            }
        ]
    }
    // أضف المزيد من الأبواب هنا...
];

// ==========================================
// إعدادات السلالم والثعابين
// يمكنك تعديل أماكنها حسب رغبتك (من: إلى)
// ==========================================
const snakesAndLadders = {
    4: { to: 14, msg: "🪜 صعود السلم!" },
    9: { to: 31, msg: "🪜 قفزة رائعة!" },
    17: { to: 7, msg: "🐍 انزلاق الثعبان!" },
    20: { to: 38, msg: "🪜 صعود السلم!" },
    45: { to: 22, msg: "🐍 انزلاق الثعبان!" },
    54: { to: 88, msg: "🪜 قفزة عملاقة!" },
    62: { to: 19, msg: "🐍 انزلاق خطير!" },
    99: { to: 8, msg: "🐍 ثعبان النهاية!" }
};

// ==========================================
// متغيرات اللعبة الأساسية
// ==========================================
let cIdx = 0; 
let bIdx = 0; 
let qIdx = 0; 
let needsLesson = true; 
let currentPosition = 1;
let isMoving = false; 

window.onload = () => {
    createBoard();
    populateIndex();
    positionPlayerAtStart();
};

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let row = 9; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            let num = (row % 2 === 0) ? (row * 10 + 10 - col) : (row * 10 + col + 1);
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${num}`;
            cell.innerText = num;
            
            // إضافة أيقونات السلالم والثعابين للمربعات
            if(snakesAndLadders[num]) {
                cell.innerText += snakesAndLadders[num].to > num ? " 🪜" : " 🐍";
            }
            board.appendChild(cell);
        }
    }
}

// دالة لضبط مكان اللاعب باستخدام الإحداثيات (Top, Left) بدلاً من AppendChild لحركة سلسة
function movePlayerTo(position, isJumping = false) {
    const player = document.getElementById('player');
    const targetCell = document.getElementById(`cell-${position}`);
    const board = document.getElementById('board');
    
    if (targetCell && board) {
        const cellRect = targetCell.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        
        // حساب الموضع النسبي داخل الرقعة
        const top = cellRect.top - boardRect.top + (cellRect.height - player.offsetHeight) / 2;
        const left = cellRect.left - boardRect.left + (cellRect.width - player.offsetWidth) / 2;
        
        player.style.top = `${top}px`;
        player.style.left = `${left}px`;
        
        if (isJumping) {
            player.classList.add('jumping');
            setTimeout(() => player.classList.remove('jumping'), 150);
        }
    }
}

function positionPlayerAtStart() {
    // تأخير بسيط لضمان تحميل أبعاد الرقعة
    setTimeout(() => {
        movePlayerTo(1);
    }, 100);
}

// تحديث مكان اللاعب عند تغيير حجم الشاشة
window.onresize = () => {
    movePlayerTo(currentPosition);
};

function populateIndex() {
    const select = document.getElementById('lesson-index');
    select.innerHTML = '';
    syllabus.forEach((chap, cIndex) => {
        let optGroup = document.createElement('optgroup');
        optGroup.label = chap.chapter;
        chap.branches.forEach((branch, bIndex) => {
            let opt = document.createElement('option');
            opt.value = `${cIndex}-${bIndex}`;
            opt.innerText = branch.title;
            optGroup.appendChild(opt);
        });
        select.appendChild(optGroup);
    });
}

function jumpToLesson() {
    const val = document.getElementById('lesson-index').value;
    const [c, b] = val.split('-');
    cIdx = parseInt(c);
    bIdx = parseInt(b);
    qIdx = 0;
    needsLesson = true;
    showFeedback("تم التبديل بنجاح 🔄");
}

function drawQuestion() {
    if(isMoving) return;
    if (cIdx >= syllabus.length) {
        alert("🎉 لقد أتممت جميع الأسئلة!");
        return;
    }
    document.getElementById('lesson-index').value = `${cIdx}-${bIdx}`;
    
    if (needsLesson) showLessonUI(false);
    else showQuestion();
}

function showLessonUI(isRetry) {
    const branchData = syllabus[cIdx].branches[bIdx];
    document.getElementById('lesson-title').innerText = branchData.title;
    
    let textToShow = branchData.lesson;
    if (isRetry) {
        document.getElementById('lesson-title').innerText = "❌ إجابة خاطئة!";
        textToShow = "راجع الشرح جيداً قبل المحاولة:\n\n" + textToShow;
    }
    
    document.getElementById('lesson-text').innerText = textToShow;
    document.getElementById('lesson-section').classList.remove('hidden');
    document.getElementById('question-section').classList.add('hidden');
    document.getElementById('quiz-modal').classList.remove('hidden');
}

function showQuestion() {
    const chapterData = syllabus[cIdx];
    const branchData = chapterData.branches[bIdx];
    const questionData = branchData.questions[qIdx];
    
    document.getElementById('chapter-branch-label').innerText = `${chapterData.chapter} - ${branchData.title}`;
    document.getElementById('question-counter').innerText = `السؤال ${qIdx + 1} من ${branchData.questions.length}`;
    document.getElementById('question-text').innerText = questionData.q;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    questionData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, questionData.a);
        optionsDiv.appendChild(btn);
    });
    
    document.getElementById('lesson-section').classList.add('hidden');
    document.getElementById('question-section').classList.remove('hidden');
    document.getElementById('quiz-modal').classList.remove('hidden');
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        document.getElementById('quiz-modal').classList.add('hidden');
        showFeedback("✅ إجابة صحيحة!");
        
        document.getElementById('ask-btn').disabled = true;
        document.getElementById('dice-btn').disabled = false;
        
        qIdx++;
        needsLesson = false;
        
        if (qIdx >= syllabus[cIdx].branches[bIdx].questions.length) {
            qIdx = 0;
            bIdx++;
            needsLesson = true; 
            if (bIdx >= syllabus[cIdx].branches.length) {
                bIdx = 0;
                cIdx++;
            }
        }
    } else {
        needsLesson = true;
        showLessonUI(true);
    }
}

function showFeedback(text) {
    const feedback = document.getElementById('feedback-message');
    feedback.innerText = text;
    feedback.classList.remove('hidden');
    feedback.style.animation = 'none';
    feedback.offsetHeight; 
    feedback.style.animation = 'popIn 1.5s ease-out forwards';
}

function rollDice() {
    const diceDisplay = document.getElementById('dice-display');
    const diceBtn = document.getElementById('dice-btn');
    
    diceBtn.disabled = true;
    isMoving = true; 
    diceDisplay.classList.add('rolling');
    
    setTimeout(() => {
        diceDisplay.classList.remove('rolling');
        const diceValue = Math.floor(Math.random() * 6) + 1;
        const diceIcons = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        diceDisplay.innerText = diceIcons[diceValue - 1];
        
        let targetPosition = currentPosition + diceValue;
        if(targetPosition > 100) targetPosition = 100; // الحد الأقصى
        
        movePlayerStepByStep(currentPosition, targetPosition, () => {
            currentPosition = targetPosition;
            
            // التحقق من السلالم والثعابين
            setTimeout(() => {
                if (snakesAndLadders[currentPosition]) {
                    const jumpData = snakesAndLadders[currentPosition];
                    showFeedback(jumpData.msg);
                    
                    movePlayerStepByStep(currentPosition, jumpData.to, () => {
                        currentPosition = jumpData.to;
                        finishMove();
                    });
                } else {
                    finishMove();
                }
            }, 400);
        });
    }, 1000);
}

function finishMove() {
    isMoving = false;
    if(currentPosition === 100) {
        showFeedback("🎉 مبروووك! وصلت للنهاية!");
    } else {
        document.getElementById('ask-btn').disabled = false;
    }
}

function movePlayerStepByStep(start, end, onComplete) {
    let current = start;
    let step = (end > start) ? 1 : -1; 
    
    let timer = setInterval(() => {
        if (current !== end) {
            current += step;
            movePlayerTo(current, true); // true لتشغيل تأثير القفز
        } else {
            clearInterval(timer);
            if(onComplete) onComplete();
        }
    }, 300); // سرعة حركة اللاعب بين المربعات
}



// ⬇️ منطقة المنهج (Syllabus) ⬇️
// قم بإضافة الأبواب والدروس والأسئلة هنا
// ==========================================

const syllabus = [
    {
        chapter: "معلومات عامة",
        branches: [
            {
                title: "1. عواصم الدول",
                lesson: "💡 تذكر: عاصمة مصر هي القاهرة، وعاصمة السعودية هي الرياض.",
                questions: [
                    { q: "ما هي عاصمة مصر؟", options: ["الإسكندرية", "القاهرة", "الأقصر"], a: "القاهرة" },
                    { q: "ما هي عاصمة السعودية؟", options: ["جدة", "مكة", "الرياض"], a: "الرياض" }
                ]
            },
            {
                title: "2. الحيوانات",
                lesson: "💡 تذكر: الأسد يلقب بملك الغابة، والفهد هو أسرع الحيوانات البرية.",
                questions: [
                    { q: "من هو ملك الغابة؟", options: ["النمر", "الفيل", "الأسد"], a: "الأسد" },
                    { q: "ما هو أسرع حيوان بري؟", options: ["الفهد", "الحصان", "الغزال"], a: "الفهد" }
                ]
            }
        ]
    }
    // أضف المزيد من الأبواب هنا...
];

// ==========================================
// إعدادات السلالم والثعابين
// يمكنك تعديل أماكنها حسب رغبتك (من: إلى)
// ==========================================
const snakesAndLadders = {
    4: { to: 14, msg: "🪜 صعود السلم!" },
    9: { to: 31, msg: "🪜 قفزة رائعة!" },
    17: { to: 7, msg: "🐍 انزلاق الثعبان!" },
    20: { to: 38, msg: "🪜 صعود السلم!" },
    45: { to: 22, msg: "🐍 انزلاق الثعبان!" },
    54: { to: 88, msg: "🪜 قفزة عملاقة!" },
    62: { to: 19, msg: "🐍 انزلاق خطير!" },
    99: { to: 8, msg: "🐍 ثعبان النهاية!" }
};

// ==========================================
// متغيرات اللعبة الأساسية
// ==========================================
let cIdx = 0; 
let bIdx = 0; 
let qIdx = 0; 
let needsLesson = true; 
let currentPosition = 1;
let isMoving = false; 

window.onload = () => {
    createBoard();
    populateIndex();
    positionPlayerAtStart();
};

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let row = 9; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            let num = (row % 2 === 0) ? (row * 10 + 10 - col) : (row * 10 + col + 1);
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${num}`;
            cell.innerText = num;
            
            // إضافة أيقونات السلالم والثعابين للمربعات
            if(snakesAndLadders[num]) {
                cell.innerText += snakesAndLadders[num].to > num ? " 🪜" : " 🐍";
            }
            board.appendChild(cell);
        }
    }
}

// دالة لضبط مكان اللاعب باستخدام الإحداثيات (Top, Left) بدلاً من AppendChild لحركة سلسة
function movePlayerTo(position, isJumping = false) {
    const player = document.getElementById('player');
    const targetCell = document.getElementById(`cell-${position}`);
    const board = document.getElementById('board');
    
    if (targetCell && board) {
        const cellRect = targetCell.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        
        // حساب الموضع النسبي داخل الرقعة
        const top = cellRect.top - boardRect.top + (cellRect.height - player.offsetHeight) / 2;
        const left = cellRect.left - boardRect.left + (cellRect.width - player.offsetWidth) / 2;
        
        player.style.top = `${top}px`;
        player.style.left = `${left}px`;
        
        if (isJumping) {
            player.classList.add('jumping');
            setTimeout(() => player.classList.remove('jumping'), 150);
        }
    }
}

function positionPlayerAtStart() {
    // تأخير بسيط لضمان تحميل أبعاد الرقعة
    setTimeout(() => {
        movePlayerTo(1);
    }, 100);
}

// تحديث مكان اللاعب عند تغيير حجم الشاشة
window.onresize = () => {
    movePlayerTo(currentPosition);
};

function populateIndex() {
    const select = document.getElementById('lesson-index');
    select.innerHTML = '';
    syllabus.forEach((chap, cIndex) => {
        let optGroup = document.createElement('optgroup');
        optGroup.label = chap.chapter;
        chap.branches.forEach((branch, bIndex) => {
            let opt = document.createElement('option');
            opt.value = `${cIndex}-${bIndex}`;
            opt.innerText = branch.title;
            optGroup.appendChild(opt);
        });
        select.appendChild(optGroup);
    });
}

function jumpToLesson() {
    const val = document.getElementById('lesson-index').value;
    const [c, b] = val.split('-');
    cIdx = parseInt(c);
    bIdx = parseInt(b);
    qIdx = 0;
    needsLesson = true;
    showFeedback("تم التبديل بنجاح 🔄");
}

function drawQuestion() {
    if(isMoving) return;
    if (cIdx >= syllabus.length) {
        alert("🎉 لقد أتممت جميع الأسئلة!");
        return;
    }
    document.getElementById('lesson-index').value = `${cIdx}-${bIdx}`;
    
    if (needsLesson) showLessonUI(false);
    else showQuestion();
}

function showLessonUI(isRetry) {
    const branchData = syllabus[cIdx].branches[bIdx];
    document.getElementById('lesson-title').innerText = branchData.title;
    
    let textToShow = branchData.lesson;
    if (isRetry) {
        document.getElementById('lesson-title').innerText = "❌ إجابة خاطئة!";
        textToShow = "راجع الشرح جيداً قبل المحاولة:\n\n" + textToShow;
    }
    
    document.getElementById('lesson-text').innerText = textToShow;
    document.getElementById('lesson-section').classList.remove('hidden');
    document.getElementById('question-section').classList.add('hidden');
    document.getElementById('quiz-modal').classList.remove('hidden');
}

function showQuestion() {
    const chapterData = syllabus[cIdx];
    const branchData = chapterData.branches[bIdx];
    const questionData = branchData.questions[qIdx];
    
    document.getElementById('chapter-branch-label').innerText = `${chapterData.chapter} - ${branchData.title}`;
    document.getElementById('question-counter').innerText = `السؤال ${qIdx + 1} من ${branchData.questions.length}`;
    document.getElementById('question-text').innerText = questionData.q;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    questionData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, questionData.a);
        optionsDiv.appendChild(btn);
    });
    
    document.getElementById('lesson-section').classList.add('hidden');
    document.getElementById('question-section').classList.remove('hidden');
    document.getElementById('quiz-modal').classList.remove('hidden');
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        document.getElementById('quiz-modal').classList.add('hidden');
        showFeedback("✅ إجابة صحيحة!");
        
        document.getElementById('ask-btn').disabled = true;
        document.getElementById('dice-btn').disabled = false;
        
        qIdx++;
        needsLesson = false;
        
        if (qIdx >= syllabus[cIdx].branches[bIdx].questions.length) {
            qIdx = 0;
            bIdx++;
            needsLesson = true; 
            if (bIdx >= syllabus[cIdx].branches.length) {
                bIdx = 0;
                cIdx++;
            }
        }
    } else {
        needsLesson = true;
        showLessonUI(true);
    }
}

function showFeedback(text) {
    const feedback = document.getElementById('feedback-message');
    feedback.innerText = text;
    feedback.classList.remove('hidden');
    feedback.style.animation = 'none';
    feedback.offsetHeight; 
    feedback.style.animation = 'popIn 1.5s ease-out forwards';
}

function rollDice() {
    const diceDisplay = document.getElementById('dice-display');
    const diceBtn = document.getElementById('dice-btn');
    
    diceBtn.disabled = true;
    isMoving = true; 
    diceDisplay.classList.add('rolling');
    
    setTimeout(() => {
        diceDisplay.classList.remove('rolling');
        const diceValue = Math.floor(Math.random() * 6) + 1;
        const diceIcons = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        diceDisplay.innerText = diceIcons[diceValue - 1];
        
        let targetPosition = currentPosition + diceValue;
        if(targetPosition > 100) targetPosition = 100; // الحد الأقصى
        
        movePlayerStepByStep(currentPosition, targetPosition, () => {
            currentPosition = targetPosition;
            
            // التحقق من السلالم والثعابين
            setTimeout(() => {
                if (snakesAndLadders[currentPosition]) {
                    const jumpData = snakesAndLadders[currentPosition];
                    showFeedback(jumpData.msg);
                    
                    movePlayerStepByStep(currentPosition, jumpData.to, () => {
                        currentPosition = jumpData.to;
                        finishMove();
                    });
                } else {
                    finishMove();
                }
            }, 400);
        });
    }, 1000);
}

function finishMove() {
    isMoving = false;
    if(currentPosition === 100) {
        showFeedback("🎉 مبروووك! وصلت للنهاية!");
    } else {
        document.getElementById('ask-btn').disabled = false;
    }
}

function movePlayerStepByStep(start, end, onComplete) {
    let current = start;
    let step = (end > start) ? 1 : -1; 
    
    let timer = setInterval(() => {
        if (current !== end) {
            current += step;
            movePlayerTo(current, true); // true لتشغيل تأثير القفز
        } else {
            clearInterval(timer);
            if(onComplete) onComplete();
        }
    }, 300); // سرعة حركة اللاعب بين المربعات
}
