
document.addEventListener( 'DOMContentLoaded', init );

function init(){

    const youtubeDropdown = document.getElementById("youtube-dropdown");    

    if(youtubeDropdown !== null){

        const defaultDomainName = youtubeDropdown.options[0].value;
        const domainsWithoutDefault = uniqueDomains.filter(item => item !== defaultDomainName);
        if(domainsWithoutDefault.length){
            for(var i = 0; i < domainsWithoutDefault.length; i++){
                const option = document.createElement("option");
                option.setAttribute("class", "dropdown-option");
                option.setAttribute("value", domainsWithoutDefault[i]);
                option.innerHTML = domainsWithoutDefault[i].charAt(0).toUpperCase() + domainsWithoutDefault[i].slice(1);

                youtubeDropdown.appendChild(option);
            }            
        } else { 
            console.log("unique domain list empty"); 
        }


        setDefaultVideoDomain(domainNames, youtubeDropdown);

        youtubeDropdown.addEventListener("change", function(event){

            chrome.storage.local.get("videoHost", function(data){

                const abc = data.videoHost; //logging didn't work until I added this. It's weird man, nothing works right. You people are abusing functional programming

                console.log("stored video domain is:     " + data.videoHost);
                console.log("event target value:   " + event.target.value )
                console.log("value:     " + domainNames[event.target.value])

                chrome.storage.local.set({ "videoHost": domainNames[event.target.value]})
            });

            
        });    
    } else {
        console.log("videos dropdown hasn't loaded into the document");
    }


    const switchSiteButton = document.getElementById("switch-site-button");
    if(switchSiteButton !== null){
        switchSiteButton.addEventListener("click", function(event){
            console.log("clicked");

            chrome.storage.local.get("videoHost", function(data){
                if(uniqueDomains.includes(data.videoHost)){

                    chrome.tabs.query({active: true}, (allTabs) => {
                        const url = allTabs[0].url;

                        let hostName = checkForValidUrl(url);

                        if(hostName.length){

                            const path = extractPath(url, hostName);
                            console.log("PATH IS:    " + path);

                            if(path.length){

                                const standin = createStandinUrl(path, data.videoHost);

                                if(standin.length){

                                    ////////////////////////////
                                    chrome
                                        .tabs
                                        .create({
                                            url: standin
                                        })
                                    /////////////////////////////
                                } else {
                                    console.log("something went wrong while finalizing the standin link")
                                }
                            } else {
                                console.log("something went wrong while extracting the common url path")
                            } 
                        } else {
                            console.log("something went wrong while extracting the host name")
                        }
                    });

                } else {
                    console.log("domain name picked is invalid")
                }
            });

        });
    } else {
        console.log("url switch button hasn't loaded into the document");
    }

}



function setDefaultVideoDomain(domainNames, dropdown){
    chrome.storage.local.get("videoHost", function(data){
        if(! data.videoHost || ! data.videoHost.length){
            chrome.storage.local.set({ "videoHost": domainNames["youtube"]});
            dropdown.value = domainNames["youtube"];
        } else {
            dropdown.value = domainNames[data.videoHost];
        }       
    });

}


const domainNames = {
    "youtube": "youtube",
    "yewtu.be": "yewtu.be",
    "yewtube": "yewtu.be",
    "invidio.xamh": "invidio.xamh",
    "invidio": "invidio.xamh",
    "piped": "piped",
    "piped.kavin.rocks": "piped",
    "youtu.be": "youtu.be",    
};


const domainNamesValuesOnly = Object.values(domainNames);//domainNames.map(item => Object.values(item)[0]);

const uniqueDomains = [... new Set(domainNamesValuesOnly)];

// uniqueDomains.forEach(function(item){
//     console.log(item)
// })


function checkForValidUrl(url){
    if(url && url.length){
        let hostName = ""
        if(url.includes("https://")){
            hostName = url.replace("https://", "");
            if(hostName.substring(0, 4) === "www."){
                hostName = hostName.substring(4);
            }
            if(hostName.includes("/")){
                const slashIndex = hostName.indexOf("/");
                hostName = hostName.substring(0, slashIndex);

            } else {
                    console.log("url doesn't appear to link to any specific media")
            }


        } else {
            console.log("url has no protocol or valid certificate")
        }

        return hostName;
    } else {
        console.log("no url provided")
    }

    return "";
}

function extractPath(url, hostName){ 
    const pathStart = url.indexOf(hostName) + hostName.length + 1;
    return url.substring(pathStart);
}

function createStandinUrl(path, newDomainHandle){
    let standin = "https://";

    switch(newDomainHandle){ //this could have been a map or object...
        case "youtube":
            standin += "youtube.com";
            break;
        case "yewtu.be":
        case "yewtube":
            standin += "yewtu.be";
            break;
        case "invidio.xamh": 
        case "invidio": 
            standin += "invidio.xamh";
            break;
        case "piped": 
        case "piped.kavin.rocks": 
            standin += "piped.kavin.rocks";
            break;
        case "youtu.be":
            standin += "youtu.be";
            break;
        default:
            standin += "youtube.com"
            break;
    }

    standin += "/" + path;
    return standin;
}











