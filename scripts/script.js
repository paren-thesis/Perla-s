let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
const totalSlides = slides.length;

function showSlide(index) {
  if (index >= totalSlides) slideIndex = 0;
  if (index < 0) slideIndex = totalSlides - 1;
  document.querySelector(".slider").style.transform = `translateX(-${
    slideIndex * 100
  }%)`;
}

function moveSlide(direction) {
  slideIndex += direction;
  showSlide(slideIndex);
}

function autoSlide() {
  moveSlide(1);
  setTimeout(autoSlide, 5000); // Change slide every 5 seconds
}

document.addEventListener("DOMContentLoaded", () => {
  showSlide(slideIndex);
  autoSlide();

  // Function to navigate to menu page
  window.goToMenu = function () {
    window.location.href = "menu.html"; // Adjust path if needed
  };
});



document.querySelector('.hamburger').addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('active');
});

