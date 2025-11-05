import { supabase, getCurrentUser, signOut } from './supabase.js';

let currentQuiz = null;
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;

async function loadQuiz() {
    const urlParams = new URLSearchParams(window.location.search);
    const lessonSlug = urlParams.get('lesson');

    if (!lessonSlug) {
        alert('No lesson specified');
        window.location.href = 'index.html';
        return;
    }

    try {
        const { data: lessons, error: lessonError } = await supabase
            .from('lessons')
            .select('id, title')
            .eq('slug', lessonSlug)
            .maybeSingle();

        if (lessonError || !lessons) {
            throw new Error('Lesson not found');
        }

        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select('*')
            .eq('lesson_id', lessons.id)
            .maybeSingle();

        if (quizError || !quiz) {
            throw new Error('Quiz not found for this lesson');
        }

        currentQuiz = quiz;

        const { data: quizQuestions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quiz.id)
            .order('order_num', { ascending: true });

        if (questionsError) throw questionsError;

        if (!quizQuestions || quizQuestions.length === 0) {
            await createSampleQuestions(quiz.id, lessonSlug);
            return loadQuiz();
        }

        questions = quizQuestions;

        document.getElementById('quiz-title').textContent = quiz.title;
        document.getElementById('quiz-description').textContent = quiz.description || 'Test your knowledge!';
        document.getElementById('total-questions').textContent = questions.length;

    } catch (error) {
        console.error('Error loading quiz:', error);
        alert('Failed to load quiz. Redirecting to home...');
        window.location.href = 'index.html';
    }
}

async function createSampleQuestions(quizId, lessonSlug) {
    const sampleQuestions = {
        'plastik-ifloslanish': [
            {
                question_text: "Plastik parchalanishi uchun taxminan qancha vaqt kerak?",
                options: ["10 yil", "50 yil", "500 yil", "5000 yil"],
                correct_answer: 2,
                order_num: 1
            },
            {
                question_text: "Qaysi plastik mahsulot eng ko'p ishlatiladi?",
                options: ["Plastik idishlar", "Plastik qoplar", "Plastik shishalar", "Barchasi"],
                correct_answer: 3,
                order_num: 2
            }
        ],
        'havo-ifloslanishi': [
            {
                question_text: "Havo ifloslanishining asosiy sababi nima?",
                options: ["O'rmon yonginlari", "Avtomobil chiqindilari", "Sanoat korxonalari", "Hammasi"],
                correct_answer: 3,
                order_num: 1
            }
        ]
    };

    const questionsToInsert = sampleQuestions[lessonSlug] || sampleQuestions['plastik-ifloslanish'];

    await supabase.from('quiz_questions').insert(
        questionsToInsert.map(q => ({
            ...q,
            quiz_id: quizId
        }))
    );
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('question-text').textContent = question.question_text;

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = progress + '%';

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });

    document.getElementById('next-btn').disabled = true;
}

function selectOption(selectedIndex) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === selectedIndex) {
            btn.classList.add('selected');
        }
    });

    userAnswers[currentQuestionIndex] = selectedIndex;
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    const question = questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];

    if (userAnswer === question.correct_answer) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

async function showResults() {
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';

    const percentage = Math.round((score / questions.length) * 100);

    document.getElementById('final-score').textContent = score;
    document.getElementById('final-total').textContent = questions.length;
    document.getElementById('percentage').textContent = percentage;

    let feedback = 'Keep learning!';
    if (percentage >= 90) feedback = 'Excellent work!';
    else if (percentage >= 70) feedback = 'Great job!';
    else if (percentage >= 50) feedback = 'Good effort!';

    document.getElementById('feedback-message').textContent = feedback;

    const user = await getCurrentUser();
    if (user && currentQuiz) {
        await supabase.from('quiz_results').insert([{
            user_id: user.id,
            quiz_id: currentQuiz.id,
            score: score,
            total_questions: questions.length,
            answers: userAnswers
        }]);
    }
}

document.getElementById('start-quiz-btn')?.addEventListener('click', () => {
    document.getElementById('quiz-intro').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    showQuestion();
});

document.getElementById('next-btn')?.addEventListener('click', nextQuestion);

document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const success = await signOut();
    if (success) {
        window.location.href = 'index.html';
    }
});

const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton?.addEventListener("click", () => {
    document.body.classList.toggle("show-mobile-menu");
});

menuCloseButton?.addEventListener("click", () => {
    document.body.classList.remove("show-mobile-menu");
});

loadQuiz();
