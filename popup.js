document.addEventListener( 'DOMContentLoaded', init );


function init(){

    console.log("inside onload")

    const youtubeDropdown = document.getElementById("youtube-dropdown"); 
    if(youtubeDropdown !== null){

        console.log(youtubeDropdown.value)

        youtubeDropdown.addEventListener("change", function(event){
            console.log("##########event listner added")
            console.log("#######" + event.target.value)
        });    
    }

};

