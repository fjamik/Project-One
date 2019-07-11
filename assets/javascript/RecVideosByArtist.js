// Get username from sessionStorage and store it in global variable 'username' 
var username = sessionStorage.getItem("username");
console.log("Username in RecVideosByArtist.js from sessionstorage-> " + username);



/*************************************************************************************************
 * OnClick function that runs whenever the user clicks on any one of the Artists 
 * under the Recommended music section
 *************************************************************************************************/

$(".getByArtist").on("click", function () {

    console.log("Inside #recVideosOfArtists.onClick() in RecVideosByArtist.js");

    //Remove currently played video div
    $("#myVideo").empty();

    //Reset lyrics div
    $(".lyricsimg")
        .css("background-color", "transparent");
    $(".lyricsimg").empty();
    $("#showLyrics").empty();

    //Get the artist name from the "name" attribute of the artist's image clicked
    var artistName = ($(this).attr("name"));
    console.log("artistName: " + artistName);


    //Empty the user's playlist to add recomended music list
    $("tbody").empty();


    //Set the header of the table now to the respective Artist selected by the user 
    if (artistName === "beyonce"){
        $("#playlistHeader").text("Fan of Beyoncé");

        //Set playlist name
        setCurrentPlaylistName("beyonce");
    }

    else if (artistName === "JenniferLopez"){
        $("#playlistHeader").text("Fan of JLO");
        
        //Set playlist name
        setCurrentPlaylistName("JenniferLopez");
    }

    else if (artistName === "ArianaGrande"){
        $("#playlistHeader").text("Fan of Ariana Grande");
        
        //Set playlist name
        setCurrentPlaylistName("ArianaGrande");
    }
        
    else if (artistName === "michael-jackson") {
        $("#playlistHeader").text("Fan of Michael Jackson");
        
        //Set playlist name
        setCurrentPlaylistName("michael-jackson");
    }
        

    //Add link to "Go To My Playlist" for user to go back to his/her playlist
    $("#goToMyPlaylist")
        .text("My Playlist")
        .addClass("btn-link");


    database.ref(`${artistName}`).once("value", addVideosToPlaylist,
        // If any errors are experienced, log them to console.
        function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });


});
