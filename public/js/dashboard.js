// Cusor effect 
document.addEventListener('mousemove', (e) => {
    const dot = document.createElement('div');
    dot.classList.add('cursor-dot');
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;

    document.body.appendChild(dot);

    // Remove after animation
    setTimeout(() => {
        dot.remove();
    }, 500);
});




// Active for nav btn 
// Active for nav btn
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', function() {
    // Save clicked href into localStorage
    localStorage.setItem('activeNav', this.getAttribute('href'));
  });
});

// On page load, restore active link
window.addEventListener('DOMContentLoaded', () => {
  const activeNav = localStorage.getItem('activeNav');
  let matched = false;

  document.querySelectorAll('.nav-item').forEach(link => {
    link.classList.remove('active');

    // Match with actual URL pathname OR stored activeNav
    if (
      link.getAttribute('href') === window.location.pathname || 
      link.getAttribute('href') === activeNav
    ) {
      link.classList.add('active');
      matched = true;
    }
  });

  // If current page is NOT in nav, clear saved activeNav
  if (!matched) {
    localStorage.removeItem('activeNav');
  }
});








// Toggle for profile 
  const toggleBtn = document.getElementById("profileToggle");
    const dropdown = document.getElementById("profileDropdown");

    // Toggle dropdown on avatar click
    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });

    


    // paste like from clipboard 
     document.querySelector(".paste-btn").addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText(); // read clipboard
      const input = document.getElementById("tweet-link");
      input.value = text; // paste into input field
      input.focus();
    } catch (err) {
      alert("Failed to read clipboard. Please allow clipboard permissions.");
    }
  });