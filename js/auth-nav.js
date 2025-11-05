import { supabase, getCurrentUser, signOut } from './supabase.js';

async function updateNavigation() {
    const user = await getCurrentUser();
    const authNavItems = document.getElementById('auth-nav-items');

    if (user && authNavItems) {
        authNavItems.innerHTML = `
            <a href="profile.html" class="nav-link">Profile</a>
        `;

        const logoutItem = document.createElement('li');
        logoutItem.className = 'nav-item';
        logoutItem.innerHTML = '<a href="#" id="nav-logout-btn" class="nav-link">Logout</a>';
        authNavItems.parentElement.appendChild(logoutItem);

        document.getElementById('nav-logout-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            const success = await signOut();
            if (success) {
                window.location.reload();
            }
        });
    }
}

updateNavigation();
