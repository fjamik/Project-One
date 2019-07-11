/************************************************************************************************
  * variable that will store the playlist currently loaded and it's setter and getter methods
  * This variable is declared in this file as this is the 1st js file loaded in music.html
  ************************************************************************************************/
 var currentPlaylistName = "My Playlist"; //Set to default

 function setCurrentPlaylistName(val) {
   currentPlaylistName = val;
 }
 function getCurrentPlaylistName() {
   return currentPlaylistName;
 }


   /************************************************************************************************
    * youtubeSearch()
    * Function that makes an ajax call to youtube api and gets the respose
    ************************************************************************************************/

   function youtubeSearch(song, artist) {

     console.log("Inside youtubeSearch()");
     console.log(song + " : " + artist);

     // This is our API key for YouTube app
     var APIKey = "your Api key";

     //var songAndArtist = "waka waka shakira";
     var songAndArtist = song + " " + artist;


     // Here we are building the URL we need to query the database
     var queryURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${songAndArtist}&key=${APIKey}`;

     
     // Here we run our AJAX call to the YouTube API
     $.ajax({
       type: "GET",
       url: queryURL,
       success: function (youTubeResp) {

         // console.log("----------");
         // console.log(youTubeResp);  //Log the resulting object
         // console.log("----------");

         //waka waka: "https://www.youtube.com/embed/pRpeEdMmmQ0"
         var videoId = youTubeResp.items[0].id.videoId;

         console.log("VideoId: " + videoId);

         $("#youtubesearch")
           .attr("src", `https://www.youtube.com/embed/${videoId}`);

       },
       error: function (request, status, error) {
         console.log(request.responseText);
       }

     });
   }