
document.addEventListener( 'DOMContentLoaded', init );

function init(){

    const youtubeDropdown = document.getElementById("youtube-dropdown");    

    if(youtubeDropdown !== null && youtubeDropdown !== undefined){

        populateDropdown(youtubeDropdown, uniqueVideoDomains, "youtube-dropdown");

        setDefaultStandinDomain(videoDomainNames, youtubeDropdown, "videoHost", "youtube"); 

        updateStorageOnChange(youtubeDropdown, "videoHost", videoDomainNames);

    } else {
        console.log("videos dropdown hasn't loaded into the document");
    }

    const switchVideoButton = document.getElementById("video-standin-button");

    openStandinOnClick(switchVideoButton, "videoHost", uniqueVideoDomains);

    ////////////////////////////////////////////////////

    const socialDropdown = document.getElementById("twitter-dropdown");

    if(socialDropdown !== null && socialDropdown !== undefined){
        populateDropdown(socialDropdown, uniqueSocialDomains, "twitter-dropdown");

        setDefaultStandinDomain(socialDomainNames, socialDropdown, "socialHost", "twitter");

        updateStorageOnChange(socialDropdown, "socialHost", socialDomainNames);

    } else {
        console.log("microblogging dropdown hasn't loaded into the document");
    }

    const switchSocialButton = document.getElementById("social-standin-button");

    openStandinOnClick(switchSocialButton, "socialHost", uniqueSocialDomains);
}











function setDefaultStandinDomain(domainNames, dropdown, key, defaultDomain){
    chrome.storage.local.get([key], function(data){
        if(! data[key] || ! data[key].length){
            chrome.storage.local.set({ [key]: domainNames[defaultDomain]});
            dropdown.value = domainNames[defaultDomain];
        } else {
            dropdown.value = domainNames[data[key]];
        }       
    });
}

function updateStorageOnChange(dropdown, key, allDomainNames){
    dropdown.addEventListener("change", function(event){

        chrome.storage.local.get([key], function(data){

            const abc = data[key]; //logging didn't work until I added this. It's weird man, nothing works right. You people are abusing functional programming

            console.log("stored video domain is:     " + data[key]);
            console.log("event target value:   " + event.target.value )
            console.log("value:     " + allDomainNames[event.target.value])

            chrome.storage.local.set({ [key]: allDomainNames[event.target.value]})
        });

        
    });  
}

const videoDomainNames = {
    "youtube": "youtube",
    "yewtu.be": "yewtu.be",
    "yewtube": "yewtu.be",
    "invidio.xamh": "invidio.xamh",
    "invidio": "invidio.xamh",
    "piped": "piped",
    "piped.kavin.rocks": "piped",
    "youtu.be": "youtu.be",    
};

const socialDomainNames = {
    "twitter": "twitter",
    "nitter": "nitter",
    "nitter.net": "nitter"
};


const videoDomainNamesValuesOnly = Object.values(videoDomainNames);
const uniqueVideoDomains = [... new Set(videoDomainNamesValuesOnly)];

const socialDomainNamesValuesOnly = Object.values(socialDomainNames);
const uniqueSocialDomains = [... new Set(socialDomainNamesValuesOnly)];

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
            standin += "invidio.xamh.de";
            break;
        case "piped": 
        case "piped.kavin.rocks": 
            standin += "piped.kavin.rocks";
            break;
        case "youtu.be":
            standin += "youtu.be";
            break;

        //social
        case "twitter":
        case "twitter.com":
            standin += "twitter.com";
            break;
        case "nitter":
        case "nitter.net":
            standin += "nitter.net";
            break;

        default:
            standin += "nope";//"youtube.com"
            break;
    }

    standin += "/" + path;
    return standin;
}

function populateDropdown(dropdown, uniqueDomains, id){
    const defaultDomainName = dropdown.options[0].value;
    const domainsWithoutDefault = uniqueDomains.filter(item => item !== defaultDomainName);
    if(domainsWithoutDefault.length){
        for(var i = 0; i < domainsWithoutDefault.length; i++){
            const option = document.createElement("option");
            option.setAttribute("class", id);
            option.setAttribute("value", domainsWithoutDefault[i]);
            option.innerHTML = domainsWithoutDefault[i].charAt(0).toUpperCase() + domainsWithoutDefault[i].slice(1);

            dropdown.appendChild(option);
        }            
    } else { 
        console.log("unique domain list empty"); 
    }
}

function openStandinOnClick(switchSiteButton, key, uniqueDomains){
    if(switchSiteButton !== null){
        switchSiteButton.addEventListener("click", function(event){
            console.log("clicked");

            chrome.storage.local.get([key], function(data){
                if(uniqueDomains.includes(data[key])){

                    chrome.tabs.query({active: true}, (allTabs) => {
                        const url = allTabs[0].url;

                        let hostName = checkForValidUrl(url);

                        if(hostName.length){

                            const path = extractPath(url, hostName);
                            console.log("PATH IS:    " + path);

                            if(path.length){

                                const standin = createStandinUrl(path, data[key]);

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











