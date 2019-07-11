// Initialize Firebase
var config = {
    apiKey: "You Api key",
    authDomain: "firebasedomain",
    databaseURL: "firebaseUrl",
    projectId: "Projectname",
    storageBucket: "spot",
    messagingSenderId: "ID"
};
firebase.initializeApp(config);

var database = firebase.database();

//------------------------------------------------------------------------------------------------------

//GLOBAL variables declared/defined here:

//Variable to store global data 'username'
var username = "";

//Variable that hold song id of currently playing song
var currentVideoId = "";

//Variable that holds true 
var songObjAlreadyAddedFlag = false;
//------------------------------------------------------------------------------------------------------

$(document).ready(function () {

    // Get username from sessionStorage and store it in global variable 'username' 
    username = sessionStorage.getItem("username");
    console.log("Username in music.js from sessionstorage-> " + username);
    $("#username-text").text(username);

    /************************************************************************************************
     * OnClick event listner that captures song and artist searched by the user
     ************************************************************************************************/

    $("#mySearchBtn").on("click", addSongToFirebase);

    function addSongToFirebase() {

        console.log("Inside addSongToFirebase() in music.js");

        //Get song and artist from input boxes
        var inputSong = $("#song-input").val().trim();
        var inputArtist = $("#artist-input").val().trim();

        //Both song and artist name is mandatory so do not proceed if either one is null
        if (inputSong === "" || inputArtist === "") {

            if (inputSong === "")
                $("#song-input").attr("placeholder", "Enter valid song!");

            if (inputArtist === "")
                $("#artist-input").attr("placeholder", "Enter valid artist!");

            return;
        }

        //Now code has both song name and artist name
        console.log(inputSong + " : " + inputArtist);

        //Add both in an object
        var songObj = {
            song: inputSong,
            artist: inputArtist,
            songObjKey: "" //Initially this key will be empty and will be populated on "database.ref().on("child_added".." event
        };
        //************************ */
        // //Case: If user is in Recommended videos section and then searches for a song and clicks on Add to my playlist then run function to load user's playlist and add element to it
        // if (getCurrentPlaylistName() !== "My Playlist") {
        //     loadMyPlaylist();
        // }
        //************************ */
        // //If 'username' is present 'key' will reference to that obj else create an object whith name 'username'
        // var rootRef = database.ref();
        // var key = rootRef.child(`${username}`);
        // console.log("key = " + key);


        // Store 'songObj' in username's playlist in firebase DB, 
        //after which the control will go to "child-added" event
        database.ref(`/${username}`).push(songObj);


        //Clear sond and artist input fields
        $("#song-input").val("");
        $("#artist-input").val("");
    }




    /************************************************************************************************
     * OnClick event listner that triggers only when a child is added and populates only 
     * data of that new child 
     ************************************************************************************************/

    database.ref(`/${username}`).on("child_added", childAddedEvent,
        // If any errors are experienced, log them to console.
        function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    function childAddedEvent(childSnapshot) {

        console.log("In childAddedEvent() in music.js");

        //Remove link that says "Go to my Playlist" as now the user will be shown his/her actual Playlist
        $("#goToMyPlaylist").empty();

        //Apend string at the table header
        $("#playlistHeader").text("My Playlist");

        //Get the Object (Key) of the songObj to be associated with Delete, Play, Close and lyrics button
        var objectName = childSnapshot.key;
        console.log("objectName: " + objectName);

        //If user is currently in Recommended Playlist, then inside this child-added event load the user's
        //playlist with new song added in it
        if (getCurrentPlaylistName() !== "My Playlist") {

            console.log("Calling loadMyPlaylist() from music.js");

            songObjAlreadyAddedFlag = true;

            //Also set the objects child "songObjKey" set to it for further reference
            database.ref(`${username}/${objectName}/songObjKey`).set(objectName, loadMyPlaylist);


        }

        //Check to se if songObjKey is already added for the new sond then do not add again
        if (songObjAlreadyAddedFlag === true) {

            console.log("songObjAlreadyAddedFlag: " + songObjAlreadyAddedFlag);
            songObjAlreadyAddedFlag = false; //Reset flag
            createTable(objectName);
        }

        //Also set the objects child "songObjKey" set to it for further reference
        database.ref(`${username}/${objectName}/songObjKey`).set(objectName, function() {
            createTable(objectName);
        });

    } //End of childAddedEvent(childSnapshot)

    function createTable(objectName) {

        console.log("In createTable() in music.js");

        // query database for song info
        database.ref(`${username}/${objectName}`).once("value", function (snapshot) {

            // console.log(snapshot.val());

            //Get all objects from DB
            var songObj = snapshot.val();

            console.log(songObj.song + " : " + songObj.artist + " : " + songObj.songObjKey);


            //------------------------------------ Create Table row --------------------------------------
            //create a table row 
            var $tr = $("<tr>");

            //create <td> for the song & artist
            //add content from childSnapshot.val() to corresponding <td> tags
            var $tdSongArtist = $("<td>").text(songObj.song + ", " + songObj.artist);
            $tdSongArtist
                .attr("keyData", songObj.songObjKey)
                .attr("id", "playVideo")
                .attr("data-toggle", "tooltip")
                .attr("data-placement", "top")
                .attr("title", "Play Video");


            var $tdCloseBtn = $("<td>");
            $tdCloseBtn
                .attr("keyData", songObj.songObjKey)
                .attr("id", "closeVideoLyrics")
                .attr("data-toggle", "tooltip")
                .attr("data-placement", "top")
                .attr("title", "Close Video & Lyrics")
                .html(`<i class="fas fa-window-close"></i>`);


            var $tdLyricsBtn = $("<td>");
            $tdLyricsBtn
                .attr("keyData", songObj.songObjKey)
                .attr("id", "lyrics")
                .attr("data-toggle", "tooltip")
                .attr("data-placement", "top")
                .attr("title", "Show Lyrics")
                .html(`<i class="fas fa-music"></i>`);


            var $tdRemoveBtn = $("<td>");
            $tdRemoveBtn
                .attr("keyData", songObj.songObjKey)
                .attr("id", "delete")
                .attr("data-toggle", "tooltip")
                .attr("data-placement", "top")
                .attr("title", "Delete Song from Playlist")
                .html(`<i class="far fa-trash-alt"></i>`);


            $tr.append($tdSongArtist, $tdLyricsBtn, $tdCloseBtn, $tdRemoveBtn);
            // $tr.append($tdSongArtist, $tdPlayBtn, $tdCloseBtn, $tdLyricsBtn, $tdRemoveBtn);

            //lastly append entire table you created to $("tbody")
            $("tbody").prepend($tr);

        });

    } //End of createTable()

    /************************************************************************************************
     * OnClick event listner that triggers only when user wants to Play video of the song selected 
     ************************************************************************************************/

    // Set up event listener for Play video button 
    $("tbody").on("click", "#playVideo", playVideo);

    function playVideo(event) {

        console.log("Inside playVideo event in music.js");

        //Close video and/or lyrics div (if open)
        closeVideoLyrics();


        //Variable to store key value
        var keyVal = $(this).attr("keyData");
        console.log("keyVal to be played: " + keyVal);

        //If user clicks the Play btn of same song that is already playing/open then do nothing
        if (keyVal === currentVideoId) {
            return;
        }

        //Store song id in the global variable 
        currentVideoId = keyVal;




        var rootRef = "";
        //If playlistHeader does not mention "My Playlist", that is user is trying 
        //to populate Recommended videos then path of firebase will not include 'username'
        if ($("#playlistHeader").text() !== "My Playlist") {
            rootRef = getCurrentPlaylistName();
        } else {
            rootRef = username;
        }
        console.log("rootRef: " + rootRef);
        console.log(keyVal);
        //User wants to play video from his Playlist
        database.ref(`${rootRef}/${keyVal}`).once("value", function (snapshot) {
            console.log("reached here");
            console.log(snapshot.val());
            console.log(snapshot.val().song + " : " + snapshot.val().artist);

            $("<iframe>")
                .addClass("p-3")
                .attr("id", "youtubesearch")
                .attr("width", "420")
                .attr("height", "345")
                .css("border-radius", "30px")
                .css("border", "5px solid brown")
                .appendTo($("#myVideo"));


            //Call youtubeSearch() function with song and artist as inputs to play the video
            youtubeSearch(snapshot.val().song, snapshot.val().artist);
        });


    } //End of playVideo()


    /*************************************************************************************************
     * OnClick event listner that triggers only when user wants to delete a song from the playlist 
     *************************************************************************************************/
    // Set up event listener for Delete button 
    $("tbody").on("click", "#delete", deleteSongData);

    function deleteSongData(event) {

        console.log("Inside deleteSongData() in music.js");

        //Close video and/or lyrics div (if open)
        closeVideoLyrics();

        //Variable to store key value
        var keyVal = $(this).attr("keyData");
        console.log("keyVal to be deleted: " + keyVal);

        var rootRef = database.ref().child(`${username}`);
        var dataRef = rootRef.child(`${keyVal}`);
        dataRef.once("value", function (snapshot) {
            console.log(snapshot.val());
        });

        //Remove song from the list in DB
        dataRef.remove()
            .then(function () {
                console.log("Remove succeeded.")
            })
            .catch(function (error) {
                console.log("Remove failed: " + error.message)
            });


        //Empty tbody data to refresh the entire user playlist
        $("tbody").empty();

        //Get the new playlist and reconstruct the playlist in UI
        rootRef = database.ref().child(`${username}`);
        rootRef.once("value", function (snapshot) {

            console.log(snapshot.val());
            console.log("-------snapshot over-------");

            snapshot.forEach(function (child) {
                // console.log(child.key+": "+child.val());
                childAddedEvent(child);
            });

        });

    } // End of deleteSongData(event) function


    /************************************************************************************************
     * OnClick event listner that triggers only when user wants to view the song lyrics 
     ************************************************************************************************/

    // Set up event listener for Lyrics button 
    $("tbody").on("click", "#lyrics", showSongLyrics);

    function showSongLyrics(event) {

        console.log("Inside showSongLyrics() in music.js");

        //Reset lyrics div
        $(".lyricsimg")
            .css("background-color", "transparent");
        $(".lyricsimg").empty();
        $("#showLyrics").empty();


        //Variable to store key value
        var keyVal = $(this).attr("keyData");
        console.log("keyVal used to get lyrics: " + keyVal);

        var rootRef = "";
        //If playlistHeader does not mention "My Playlist", that is user is trying 
        //to populate Recommended videos then path of firebase will not include 'username'
        if ($("#playlistHeader").text() !== "My Playlist") {
            rootRef = getCurrentPlaylistName();
        } else {
            rootRef = username;
        }

        //User wants to play video from his Playlist
        database.ref(`${rootRef}/${keyVal}`).once("value", function (snapshot) {

            // console.log(snapshot.val());
            console.log("Calling searchLyrics() from lyrics.js");
            console.log(snapshot.val().song + " : " + snapshot.val().artist);

            //Call getLyrics function with song and artist as inputs to display the lyrics
            searchLyrics(snapshot.val().song, snapshot.val().artist);
        });

    } //End of showSongLyrics()

    /************************************************************************************************
     * OnClick event listner that triggers when user wants to close the video panel
     ************************************************************************************************/

    // Set up event listener for Close video btn 
    $("tbody").on("click", "#closeVideoLyrics", closeVideoLyrics);

    function closeVideoLyrics() {

        console.log("Inside closeVideoLyrics onClick function in music.js");

        //Remove currently played video div
        $("#myVideo").empty();

        //Reset lyrics div
        $(".lyricsimg")
            .css("background-color", "transparent");
        $(".lyricsimg").empty();
        $("#showLyrics").empty();

    };
    //End of closeVideoLyrics onClick functionality


    /*************************************************************************************************
     * OnClick event listner that triggers when user selects Recommended Music based on current weather
     *************************************************************************************************/

    $("#getRecommendedWeatherSongs").on("click", function () {

        console.log("Inside getRecommendedWeatherSongs onClick function in music.js");

        //Close video and/or lyrics div (if open)
        closeVideoLyrics();

        recommendedMusicByWeather();

    });

    /************************************************************************************************
     * OnClick event listner that triggers when user wants to logout and signup using 
     * different username/email-id 
     ************************************************************************************************/

    $("#myLogoutBtn").on("click", function () {

        console.log("Inside myLogoutBtn onClick function in music.js");
        // Clear sessionStorage
        sessionStorage.clear();

        // Set username into sessionStorage as empty string
        sessionStorage.setItem("username", "");

        window.location.href = "../../index.html";
    });


    /*************************************************************************************************
     * A custom script is used to activate tooltips
     *************************************************************************************************/

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });


});
//End of document ready
