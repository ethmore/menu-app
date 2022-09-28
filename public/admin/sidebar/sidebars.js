function getCookie(cookieName) {
  let cookie = {};
  document.cookie.split(';').forEach(function (el) {
    let [key, value] = el.split('=');
    cookie[key.trim()] = value;
  })
  return cookie[cookieName];
}

(function () {
  'use strict'
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})()

createSidebar();
function createSidebar() {
  const url = window.location.href;
  prettyEmail = getCookie("email").replace("%40", "@")

  //Main wrapper
  const wrapper = document.getElementById("jsSidebar");
  wrapper.id = "sidebar";

  const sidebarTop = document.createElement("div");
  sidebarTop.id = "sidebarTop"

  //mobile
  const menu = document.createElement("div")
  const menuImg = document.createElement("img")

  menu.id = "menuExpand"
  menuImg.src = "/media/menu-outline.svg"


  menu.appendChild(menuImg);





  //Logo
  const logo = document.createElement("a");
  logo.id = "logoWrapper"
  logo.href = "/";
  // logo.classList.add("d-flex", "align-items-center", "mb-3", "mb-md-0", "me-md-auto", "text-white", "text-decoration-none");
  logo.classList.add("mb-md-0", "me-md-auto");

  const logoImg = document.createElement("img");
  logoImg.src = "/media/accessibility.svg";
  logoImg.alt = "logo";
  logoImg.id = "logo";
  logoImg.className = "invert";

  const logoSpan = document.createElement("span");
  logoSpan.className = "fs-4";
  logoSpan.innerHTML = "MAC Cafe";

  logo.appendChild(logoImg);
  logo.appendChild(logoSpan);


  const hr = document.createElement("hr");

  //List
  const ul = document.createElement("ul");
  // ul.classList.add("nav", "nav-pills", "flex-column", "mb-auto");
  ul.classList.add("nav", "nav-pills");

  const categoryLi = document.createElement("li");
  categoryLi.className = ("nav-item");

  //Categories
  const categoryLink = document.createElement("a");
  categoryLink.href = "/admin/categories";
  categoryLink.classList.add("nav-link", "text-white");
  categoryLink.ariaCurrent = "page";
  if (url.indexOf("categories") > -1) {
    categoryLink.classList.add("active");
  }

  const categoryImage = document.createElement("img");
  categoryImage.src = "/media/book-outline.svg";
  categoryImage.alt = "";
  categoryImage.id = "categories-icon";
  categoryImage.className = "invert";

  const categorySpan = document.createElement("span");
  categorySpan.innerText = " Categories";

  categoryLink.appendChild(categoryImage)
  categoryLink.appendChild(categorySpan)
  categoryLi.appendChild(categoryLink)

  //All products
  const allProductsLi = document.createElement("li");
  allProductsLi.className = ("nav-item");

  const allProductsLink = document.createElement("a");
  allProductsLink.href = "/admin/products";
  allProductsLink.classList.add("nav-link", "text-white");
  if (url.indexOf("products") > -1) {
    allProductsLink.classList.add("active");
  }

  const allProductsImage = document.createElement("img");
  allProductsImage.src = "/media/bookmarks-outline.svg";
  allProductsImage.alt = "";
  allProductsImage.id = "products-icon";
  allProductsImage.className = "invert";

  const allProductsSpan = document.createElement("span");
  allProductsSpan.innerText = " All Products";

  //User
  const sidebarBottom = document.createElement("div");
  const user = document.createElement("p");
  user.innerText = prettyEmail;
  user.id = "user"


  allProductsLink.appendChild(allProductsImage)
  allProductsLink.appendChild(allProductsSpan)
  allProductsLi.appendChild(allProductsLink)

  ul.appendChild(categoryLi);
  ul.appendChild(allProductsLi);
  sidebarBottom.appendChild(user);

  sidebarTop.appendChild(logo);
  sidebarTop.appendChild(hr);
  sidebarTop.appendChild(ul);

  wrapper.appendChild(menu)
  wrapper.appendChild(sidebarTop);
  wrapper.appendChild(sidebarBottom);
}


let a = false

document.addEventListener("mouseup", function (evnt) {
  if (a && evnt.target.id != ("sidebar")) {
    const sideBar = document.getElementById("sidebar")
    sideBar.style = "width: 0px; transition: 0.1s;"

    const sideBarMenu = document.getElementById("menuExpand")
    sideBarMenu.style = "filter: invert(0); transition: 0.1s;"

    const sidebarTop = document.getElementById("sidebarTop")
    sidebarTop.style = "display: none; transition: 0.1s;"

    a = false
  }
});

document.getElementById("menuExpand").addEventListener("click", expandMenu);
function expandMenu() {
  const sideBar = document.getElementById("sidebar")
  sideBar.style = "width: 60px; transition: 0.1s;"

  const sideBarMenu = document.getElementById("menuExpand")
  sideBarMenu.style = "display: none; filter: invert(1); transition: 0.1s;"

  const sidebarTop = document.getElementById("sidebarTop")
  sidebarTop.style = "display: block; transition: 0.1s;"

  a = true
}