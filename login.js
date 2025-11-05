import { supabase } from './js/supabase.js';

const loginForm = document.getElementById('login-form');
const loginMsg = document.getElementById('login-msg');

document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginMsg.textContent = '';
  loginMsg.style.color = '#b00020';

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;

  if (!email || !password) {
    loginMsg.textContent = 'Enter email and password.';
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      loginMsg.textContent = error.message;
      return;
    }

    loginMsg.style.color = '#2a8f3a';
    loginMsg.textContent = 'Login successful! Redirecting...';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  } catch (err) {
    console.error('Login error:', err);
    loginMsg.textContent = 'An unexpected error occurred. Please try again.';
  }
});