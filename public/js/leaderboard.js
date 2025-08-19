// Count down from monday to sunday 
function updateCountdown() {
    const now = new Date();

    // Find next Monday 00:00
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7)); 
    nextMonday.setHours(0, 0, 0, 0);

    // End of current week = Sunday 23:59:59
    const endOfWeek = new Date(nextMonday.getTime() - 1000);

    const diff = endOfWeek - now;

    if (diff <= 0) {
      // Reset automatically when countdown ends
      location.reload();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById("countdown-days").textContent = days;
    document.getElementById("countdown-hours").textContent = hours;
    document.getElementById("countdown-mins").textContent = mins;
    document.getElementById("countdown-secs").textContent = secs;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();





//   <!-- Search Filter Script -->
  const searchInput = document.getElementById("searchInput");
  const rows = document.querySelectorAll(".user-row");

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();

    rows.forEach(row => {
      const handle = row.querySelector(".handle").textContent.toLowerCase();
      if (handle.includes(query)) {
        row.style.display = "grid"; // keep grid layout
      } else {
        row.style.display = "none";
      }
    });
  });
