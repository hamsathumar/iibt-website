document.addEventListener("DOMContentLoaded", function () {
  var navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  // Set active on initial load based on current path
  try {
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  } catch (e) {}

  // Add click handler to update active class on navigation
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.forEach(function (navLink) {
        navLink.classList.remove("active");
      });
      link.classList.add("active");
    });
  });
});
