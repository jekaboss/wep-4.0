import "./app.js";
const playlist = document.getElementById("modern-playlist");
const iframe = document.getElementById("youtube-player");
function removeActiveClass() {
  playlist.querySelectorAll("li").forEach((item) => {
    item.classList.remove("active");
  });
}
playlist.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const videoId = item.getAttribute("data-video-id");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    removeActiveClass();
    item.classList.add("active");
    console.log(`Switching to video ID: ${videoId}`);
  });
});
