document.addEventListener('DOMContentLoaded', () => {
  // Navigation toggle for mobile
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Support form validation (if form exists)
  const supportForm = document.getElementById('support-form');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const nameInput = supportForm.querySelector('input[name="name"]');
      const emailInput = supportForm.querySelector('input[name="email"]');
      const messageInput = supportForm.querySelector('textarea[name="message"]');

      clearErrors();

      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        valid = false;
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        valid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email');
        valid = false;
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required');
        valid = false;
      }

      if (valid) {
        // For now, just alert success (no backend)
        alert('Thank you for contacting us! We will get back to you soon.');
        supportForm.reset();
      }
    });
  }

  function showError(input, message) {
    const errorElem = document.createElement('div');
    errorElem.className = 'error-message';
    errorElem.textContent = message;
    input.parentNode.appendChild(errorElem);
    input.classList.add('input-error');
  }

  function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(e => e.remove());
    const inputs = document.querySelectorAll('.input-error');
    inputs.forEach(i => i.classList.remove('input-error'));
  }

  function validateEmail(email) {
    // Simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }
});
