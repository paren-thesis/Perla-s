document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    // Function to toggle forms with animation
    function showForm(show, hide) {
        hide.classList.add("fade-in");
        setTimeout(() => {
            hide.classList.add("d-none");
            show.classList.remove("d-none");
            show.classList.add("fade-out");
        }, 300);
        
        setTimeout(() => {
            hide.classList.remove("fade-in");
            show.classList.remove("fade-out");
        }, 600);
    }

    // Show Register Form
    showRegisterLink.addEventListener("click", function (e) {
        e.preventDefault();
        showForm(registerForm, loginForm);
    });

    // Show Login Form
    showLoginLink.addEventListener("click", function (e) {
        e.preventDefault();
        showForm(loginForm, registerForm);
    });
});
