import { supabase, getCurrentUser, getUserProfile } from './supabase.js';

export async function loadComments(lessonId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const { data: comments, error } = await supabase
            .from('comments')
            .select(`
                *,
                profiles (
                    name,
                    email
                )
            `)
            .eq('lesson_id', lessonId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const user = await getCurrentUser();
        const userId = user?.id;

        if (!comments || comments.length === 0) {
            container.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }

        container.innerHTML = comments.map(comment => {
            const isOwner = userId && comment.user_id === userId;
            const commentDate = new Date(comment.created_at).toLocaleDateString();
            const userName = comment.profiles?.name || 'Anonymous';

            return `
                <div class="comment-item" data-comment-id="${comment.id}">
                    <div class="comment-header">
                        <div class="comment-author">
                            <i class="fas fa-user-circle"></i>
                            <span class="author-name">${userName}</span>
                            <span class="comment-date">${commentDate}</span>
                        </div>
                        ${isOwner ? `
                            <div class="comment-actions">
                                <button class="edit-comment-btn" data-comment-id="${comment.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-comment-btn" data-comment-id="${comment.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <p class="comment-content">${comment.content}</p>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteComment(btn.dataset.commentId, lessonId, containerId));
        });

        container.querySelectorAll('.edit-comment-btn').forEach(btn => {
            btn.addEventListener('click', () => editComment(btn.dataset.commentId, lessonId, containerId));
        });

    } catch (error) {
        console.error('Error loading comments:', error);
        container.innerHTML = '<p class="error-message">Failed to load comments.</p>';
    }
}

export async function addComment(lessonId, content, containerId) {
    const user = await getCurrentUser();

    if (!user) {
        alert('Please login to comment');
        window.location.href = 'login.html';
        return false;
    }

    try {
        const { error } = await supabase
            .from('comments')
            .insert([
                {
                    lesson_id: lessonId,
                    user_id: user.id,
                    content: content
                }
            ]);

        if (error) throw error;

        await loadComments(lessonId, containerId);
        return true;
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
        return false;
    }
}

async function deleteComment(commentId, lessonId, containerId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) throw error;

        await loadComments(lessonId, containerId);
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment.');
    }
}

async function editComment(commentId, lessonId, containerId) {
    const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
    const contentElement = commentItem.querySelector('.comment-content');
    const currentContent = contentElement.textContent;

    const newContent = prompt('Edit your comment:', currentContent);

    if (!newContent || newContent.trim() === '' || newContent === currentContent) return;

    try {
        const { error } = await supabase
            .from('comments')
            .update({
                content: newContent.trim(),
                updated_at: new Date().toISOString()
            })
            .eq('id', commentId);

        if (error) throw error;

        await loadComments(lessonId, containerId);
    } catch (error) {
        console.error('Error editing comment:', error);
        alert('Failed to edit comment.');
    }
}

export function setupCommentForm(formId, lessonId, containerId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const textarea = form.querySelector('textarea[name="comment"]');
        const content = textarea.value.trim();

        if (!content) {
            alert('Please enter a comment');
            return;
        }

        const success = await addComment(lessonId, content, containerId);
        if (success) {
            textarea.value = '';
        }
    });
}
