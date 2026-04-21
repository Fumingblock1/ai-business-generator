async function generateIdea() {
  const idea = document.getElementById('idea-input').value.trim();
  const btn = document.getElementById('generate-btn');
  const errorBox = document.getElementById('error-box');
  const resultSection = document.getElementById('result-section');
  const resultContent = document.getElementById('result-content');

  if (!idea) {
    showError('Please enter a business idea first!');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Generating...';
  errorBox.classList.add('hidden');
  resultSection.classList.add('hidden');

  try {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea })
    });

    const data = await response.json();

    if (data.error) {
      showError(data.error);
      return;
    }

    resultContent.innerHTML = formatResult(data.result);
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    showError('Something went wrong. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate Business Plan';
  }
}

function formatResult(text) {
  return text
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^[-*] (.+)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, ' ');
}

function showError(message) {
  const errorBox = document.getElementById('error-box');
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
}

function copyResult() {
  const text = document.getElementById('result-content').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy', 2000);
  });
}

function resetForm() {
  document.getElementById('idea-input').value = '';
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('error-box').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('idea-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) generateIdea();
  });
});