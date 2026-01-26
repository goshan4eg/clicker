document.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 GameNet loaded");

  const postButtons = document.querySelectorAll('.post-actions button');
  postButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      alert(`You clicked on ${btn.textContent}`);
    });
  });

  const newPostBtn = document.querySelector('.new-post-btn');
  newPostBtn.addEventListener('click', () => {
    alert("New Post Modal - Feature coming soon!");
  });
});