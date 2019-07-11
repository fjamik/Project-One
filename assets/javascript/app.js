//Global variable that takes in username and used in other js files
var username = "";



$(document).ready(function () {

   // set up event listener for form submit to capture username/email-id
   $("#username-form").on("submit", function (event) {
       event.preventDefault();

       var username = $("#name-input").val().trim();

       console.log("Playlist requested by: " + username);

       //If username entered by the user is an empty string
       if (username === "") {
           $("#alertLabel")
               .text("Please enter your Username / Email-Id !!!")
               .css("color", "red");
       } else {
           //Store username for this session

           // Clear sessionStorage
           sessionStorage.clear();

           // Store username into sessionStorage
           sessionStorage.setItem("username", username);

           window.location.href = "assets/html/music.html";
       }

   });

});
