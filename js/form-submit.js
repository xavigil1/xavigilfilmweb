document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const submitBtn = form.querySelector('#contact-submit');
  const feedback = document.getElementById('form-feedback');

  function showMessage(text, isError = false) {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.style.color = isError ? 'var(--color-red-deep, #c0392b)' : 'var(--color-green, #2ecc71)';
  }

  function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    showMessage('');
    const email = (form.querySelector('input[name="email"]') || {}).value || '';
    if (!validateEmail(email)) {
      showMessage('Introduce un correo válido.', true);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.orig = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
    }

    const action = form.action;
    const next = (form.querySelector('input[name="_next"]') || {}).value || './thank-you.html';

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        // success — redirect to thank you
        window.location.href = next;
        return;
      }

      // non-200 response
      showMessage('Error al enviar. Intenta de nuevo más tarde.', true);
    } catch (err) {
      // network/CORS error — fallback to native submit
      console.warn('Fetch submit failed, falling back to normal submit:', err);
      // Short delay to re-enable UI briefly before native submit
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.orig || 'Enviar';
      }
      form.submit();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.orig || 'Enviar';
    }
  }

  form.addEventListener('submit', handleSubmit);
});
