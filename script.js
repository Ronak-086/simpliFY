// Required DOM elements
const form = document.getElementById('simplify-form');
const simplifyBtn = document.getElementById('simplify-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const resultSection = document.getElementById('result-section');
const resultText = document.getElementById('result-text');
const copyBtn = document.getElementById('copy-btn');
const shareBtn = document.getElementById('share-btn');
const resetBtn = document.getElementById('reset-btn');
const topicInput = document.getElementById('topic');
const levelInput = document.getElementById('level');

// Axios + Gemini API Calling Code
const apiKey = ; // ⚠️ Only expose in safe environments

async function simplifyText(text, level) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: `Explain this like I'm a ${level}: ${text}` }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    return result;

  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return "⚠️ Error fetching response from Gemini.";
  }
}

// Form submit handler with integrated Axios call
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  simplifyBtn.disabled = true;
  loadingSpinner.classList.remove('hidden');
  simplifyBtn.querySelector('span').textContent = "Simplifying...";

  const text = topicInput.value.trim();
  const level = levelInput.value;

  const explanation = await simplifyText(text, level);

  resultText.textContent = explanation;
  resultSection.classList.remove('hidden');
  resultSection.classList.add('fade-in-up');
  form.classList.add('pointer-events-none', 'opacity-60');
  loadingSpinner.classList.add('hidden');
  simplifyBtn.disabled = false;
  simplifyBtn.querySelector('span').textContent = "Simplify it!";
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(resultText.textContent)
    .then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.innerHTML = `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="8" y="8" width="8" height="8" rx="2" stroke-width="2" stroke="currentColor" />
            <path d="M16 8V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke-width="2" stroke="currentColor" />
          </svg> Copy`;
      }, 1200);
    });
});

// Share functionality
shareBtn.addEventListener('click', async () => {
  if (navigator.share) {
    await navigator.share({
      title: "Simplified Explanation",
      text: resultText.textContent,
      url: location.href,
    });
  } else {
    alert("Sharing is not supported in this browser.");
  }
});

// Reset form
resetBtn.addEventListener('click', () => {
  resultSection.classList.add('hidden');
  form.classList.remove('pointer-events-none', 'opacity-60');
  topicInput.value = '';
  topicInput.focus();
});


