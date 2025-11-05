import { supabase, getCurrentUser, getUserProfile, signOut } from './supabase.js';

async function loadProfile() {
    const user = await getCurrentUser();

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const profile = await getUserProfile(user.id);

    if (profile) {
        document.getElementById('user-name').textContent = profile.name || 'User';
        document.getElementById('user-email').textContent = profile.email;

        const memberDate = new Date(profile.created_at);
        document.getElementById('member-date').textContent = memberDate.toLocaleDateString();
    }

    const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true);

    document.getElementById('lessons-completed').textContent = progressData?.length || 0;

    const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('*, quizzes(title, lesson_id, lessons(title))')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

    document.getElementById('quizzes-taken').textContent = quizResults?.length || 0;

    const { data: commentsData } = await supabase
        .from('comments')
        .select('id')
        .eq('user_id', user.id);

    document.getElementById('comments-count').textContent = commentsData?.length || 0;

    const resultsContainer = document.getElementById('quiz-results');
    if (quizResults && quizResults.length > 0) {
        resultsContainer.innerHTML = quizResults.map(result => {
            const percentage = Math.round((result.score / result.total_questions) * 100);
            const date = new Date(result.completed_at).toLocaleDateString();
            const quizTitle = result.quizzes?.title || 'Quiz';

            return `
                <div class="quiz-result-item">
                    <div>
                        <h3>${quizTitle}</h3>
                        <p>${date}</p>
                    </div>
                    <div class="quiz-score">
                        <div class="score">${percentage}%</div>
                        <p>${result.score}/${result.total_questions}</p>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        resultsContainer.innerHTML = '<p class="loading-text">No quiz results yet. Start learning!</p>';
    }
}

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

loadProfile();
