const form = document.getElementById('register-form');
const msg = document.getElementById('register-msg');
const pwToggle = document.querySelector('.pw-toggle');
pwToggle.addEventListener('click', () => {
  const pw = document.getElementById('password');
  const icon = pwToggle.querySelector('i');
  if (pw.type === 'password') { pw.type = 'text'; icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
  else { pw.type = 'password'; icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (!name || !email || !password) { msg.textContent = 'Please fill required fields.'; return; }
  if (password !== confirmPassword) { msg.textContent = 'Passwords do not match.'; return; }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) { msg.textContent = data.message || 'Registration failed.'; return; }
    msg.style.color = '#2a8f3a';
    msg.textContent = 'Registered. Redirecting to login...';
    setTimeout(() => location.href = 'login.html', 1000);
  } catch (err) {
    msg.textContent = 'Network error.';
  }
});