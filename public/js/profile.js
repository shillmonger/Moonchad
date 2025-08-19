// Calculator 
const MAX_USER_BALANCE = 50000; // tokens

const RATES = {
    TOKEN_TO_USD: 0.001,
    LIKE_TO_USD: 0.10,
    LIKE_TO_TOKENS: 100
};

function calculateConversions() {
    const inputAmount = parseFloat(document.getElementById('inputAmount').value) || 0;

    // get selected toggle button
    const inputType = document.querySelector('.toggle-btn.active').dataset.type;

    let tokens = 0;
    let usd = 0;
    let likes = 0;

    switch (inputType) {
        case 'tokens':
            tokens = inputAmount;
            usd = tokens * RATES.TOKEN_TO_USD;
            likes = tokens / RATES.LIKE_TO_TOKENS;
            break;
        case 'usd':
            usd = inputAmount;
            tokens = usd / RATES.TOKEN_TO_USD;
            likes = usd / RATES.LIKE_TO_USD;
            break;
        case 'likes':
            likes = inputAmount;
            tokens = likes * RATES.LIKE_TO_TOKENS;
            usd = likes * RATES.LIKE_TO_USD;
            break;
    }

    // Always show all conversion values
    document.getElementById('outputTokens').textContent = formatNumber(tokens);
    document.getElementById('outputUSD').textContent = '$' + usd.toFixed(2);
    document.getElementById('outputLikes').textContent = formatNumber(likes);
}

function formatNumber(num) {
    if (num === 0) return '0';
    if (num < 1) return num.toFixed(6).replace(/\.?0+$/, '');
    if (num < 1000) return num.toFixed(2).replace(/\.?0+$/, '');
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    return (num / 1000000).toFixed(1) + 'M';
}

function setMaxBalance() {
    document.getElementById('inputAmount').value = MAX_USER_BALANCE;

    // force select Tokens toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.toggle-btn[data-type="tokens"]').classList.add('active');

    calculateConversions();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('inputAmount').value = '10000';

    // default: tokens active
    document.querySelector('.toggle-btn[data-type="tokens"]').classList.add('active');

    // add event listeners for toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateConversions();
        });
    });

    calculateConversions();
});






// Show wallet in nav bar 
document.addEventListener("DOMContentLoaded", async () => {
  const btn = document.querySelector(".submite");

  try {
    const res = await fetch("/wallet/me");
    const data = await res.json();

    if (data.walletAddress) {
      // Slice first 15 chars for display
      const shortWallet = data.walletAddress.slice(0, 15) + "...";
      btn.textContent = shortWallet;
    }
  } catch (err) {
    console.error("Error fetching wallet:", err);
  }
});
