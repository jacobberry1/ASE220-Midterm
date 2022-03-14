const baseURL = "http://localhost:3000";
var fname;
var lname;
var email;
var title;
var org;
var password;

//user clicks register
$("#register-form").on("submit", function (e) {
  e.preventDefault();
  fname = $("#fname").val();
  lname = $("#lname").val();
  email = $("#email").val();
  title = $("#email").val();
  org = $("#org").val();
  password = $("#password").val();
  registerUser(fname, lname, email, title, org, password);
});

//add user to JSON db
function registerUser(fname, lname, email, title, org, password) {
  $.ajax(`${baseURL}/accounts`, {
    type: "POST",
    data: {
      fname: fname,
      lname: lname,
      email: email,
      title: title,
      org: org,
      password: password,
      uploadedpcs: [],
      savedpcs: [],
      billing: "",
    }, // data to submit
    success: function (data) {
      setUserSession(data.id);
    },
    error: function (errorMessage) {
      console.log("Error" + errorMessage);
    },
  });
}

//user clicks log in
$("#login-form").on("submit", async function (e) {
  e.preventDefault();
  email = $("#loginemail").val();
  password = $("#loginpassword").val();
  validateUser(email, password);
});

//check if user has been registered yet
function validateUser(userEmail, userPassword) {
  $.ajax({
    url: `${baseURL}/accounts?email=${userEmail}&password=${userPassword}`,
    type: "GET",
    success: function (data) {
      if (data.length == 0) alert("Wrong credentials");
      else setUserSession(data[0].id);
    },
    error: function (errorMessage) {
      console.log("Error" + errorMessage);
    },
  });
}

// set userId in sessionStorage to keep user logged in when page reloads
function setUserSession(userId) {
  window.sessionStorage.setItem("userId", userId);
  console.log(sessionStorage.getItem("userId"));
  setUserDashboard(userId);
  window.location.href = "index.html";
}

//change the navbar for logged in user
function setUserDashboard(userId) {
  $("#register").remove();
  $("#login").remove();
  $(".navbar-nav").append(`<li id="upload" class="nav-item">
  <a class="nav-link" href="upload.html">Upload Podcast</a>
    </li>`);
  $(".navbar-nav").append(`<li id="account" class="nav-item">
  <a class="nav-link" href="account.html">Account</a>
    </li>`);
  $(".navbar-nav").append(`<li id="logout" class="nav-item">
    <a class="nav-link" href="#">Logout</a>
        </li>`);
}

//user clicks log out
$(document).on("click", "#logout", function () {
  $("#upload").remove();
  $("#account").remove();
  $("#logout").remove();
  window.sessionStorage.removeItem("userId");
  $(".navbar-nav").append(`<li id="register" class="nav-item">
  <a class="nav-link" href="register.html">Register</a>
    </li>`);
  $(".navbar-nav").append(`<li id="login" class="nav-item">
    <a class="nav-link" href="login.html">Login</a>
        </li>`);
  window.location.href = "login.html";
});

// checkSession for every page load to see if user is logged in yet
function checkSession() {
  if (window.sessionStorage.getItem("userId") == null) {
    console.log("Not login");
  } else {
    setUserDashboard();
  }
}
checkSession();
