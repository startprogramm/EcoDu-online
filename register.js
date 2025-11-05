import { supabase } from './js/supabase.js';

const form = document.getElementById('register-form');
const msg = document.getElementById('register-msg');
const pwToggle = document.querySelector('.pw-toggle');

pwToggle.addEventListener('click', () => {
  const pw = document.getElementById('password');
  const icon = pwToggle.querySelector('i');
  if (pw.type === 'password') {
    pw.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    pw.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  msg.style.color = '#b00020';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (!name || !email || !password) {
    msg.textContent = 'Please fill required fields.';
    return;
  }

  if (password.length < 6) {
    msg.textContent = 'Password must be at least 6 characters.';
    return;
  }

  if (password !== confirmPassword) {
    msg.textContent = 'Passwords do not match.';
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      msg.textContent = error.message;
      return;
    }

    msg.style.color = '#2a8f3a';
    msg.textContent = 'Registration successful! Redirecting to login...';
    form.reset();
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  } catch (err) {
    console.error('Registration error:', err);
    msg.textContent = 'An unexpected error occurred. Please try again.';
  }
});