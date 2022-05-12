
document.addEventListener( 'DOMContentLoaded', init );

function init(){

    //LOAD video, twitter etc domain names here -- populate the drowdown
    // const dropdownData = chrome.storage.local.get("popupDomains", (data) => {
    //     //data.forEach(group => console.log(group))
    //     console.log(JSON.stringify(data["popupDomains"]))
    // })

    getDataFromStorage(chrome, "popupDomains")
        .then(data => {

            const popupDomains = data["popupDomains"]

            const youtubeDropdown = document.getElementById("youtube-dropdown");    

            if(youtubeDropdown !== null && youtubeDropdown !== undefined){

                populateDropdown(youtubeDropdown, /* videoDomainNames */popupDomains["youtubeAlts"], "youtube-dropdown");

                setDefaultStandinDomain(youtubeDropdown, "videoHost", "youtube.com")
                    .then(() => {
                        updateStorageOnChange(youtubeDropdown, "videoHost")
                            .catch(err => console.error(err));
                    })
                    .catch(err => console.error(err));

                //updateStorageOnChange(youtubeDropdown, "videoHost");

            } else {
                console.log("videos dropdown hasn't loaded into the document");
            }

            const switchVideoButton = document.getElementById("video-standin-button");

            openStandinOnClick(switchVideoButton, "videoHost", /* videoDomainNames */popupDomains["youtubeAlts"]);

            ////////////////////////////////////////////////////

            const socialDropdown = document.getElementById("twitter-dropdown");

            if(socialDropdown !== null && socialDropdown !== undefined){
                populateDropdown(socialDropdown, /* socialDomainNames */popupDomains["twitterAlts"], "twitter-dropdown");

                setDefaultStandinDomain(socialDropdown, "socialHost", "twitter.com")
                    .then(() => {
                        updateStorageOnChange(socialDropdown, "socialHost")
                            .catch(err => console.error(err));
                    })
                    .catch(err => console.error(err));

                //updateStorageOnChange(socialDropdown, "socialHost");

            } else {
                console.log("microblogging dropdown hasn't loaded into the document");
            }

            const switchSocialButton = document.getElementById("social-standin-button");

            openStandinOnClick(switchSocialButton, "socialHost", /* socialDomainNames */popupDomains["twitterAlts"]);


        }) //#################################################### for >>>   .then(data => {


    //test
    const optionsButton = document.getElementById("options-button");
    if(optionsButton){
        optionsButton.addEventListener("click", function(){
            /* browser */chrome.tabs.create({url: "options.html"}, () => console.log("options page should open"))
        });        
    }

}

async function getDataFromStorage(browser, ...keys){
    return new Promise((resolve, reject) => {
        browser.storage.local.get([...keys], function(data){
            resolve(data);
        });
    });
}

async function setDefaultStandinDomain(dropdown, key, defaultDomain){ //on fresh install this promise might fail 
    return new Promise((resolve, reject) => {                              
        /* await */ chrome.storage.local.get([key], function(data){
            if(! data[key] || ! data[key].length){
                chrome.storage.local.set({ [key]: defaultDomain});
                dropdown.value = defaultDomain;
            } else {
                dropdown.value = data[key];
            }   
            
            if( ! data) reject(); //I'm not too sure about this... maybe there isn't supposed to be a a data object on a fresh install ... but the functions dependednt on this promise seem to get called just fine in this event...
        });

        resolve(dropdown.value);
    });

}

function updateStorageOnChange(dropdown, key){  //on fresh install this promise might fail 
    dropdown.addEventListener("change", async function(event){
        return new Promise((resolve, reject) => {
            /* await */ chrome.storage.local.get([key], function(data){

                const abc = data[key]; //logging didn't work until I added this. It's weird man, nothing works right. You people are abusing functional programming

                console.log("stored video domain is:     " + data[key]);
                console.log("event target value:   " + event.target.value )

                chrome.storage.local.set({ [key]: event.target.value});

                resolve(data[key]);

                if( ! data[key]) reject();
            });

            
        }); 
    });  
}

const videoDomainNames = [   
    "youtube.com",
    "yewtu.be",
    "invidio.xamh.de",
    "piped.kavin.rocks",
    "youtu.be"      
];

const socialDomainNames = [
    "twitter.com",
    "nitter.net",
    "mobile.twitter.com"
];

const allValidDomains = [
    //piped
    "https://kavin.rocks",
    "https://silkky.cloud",
    "https://tokhmi.xyz",
    "https://moomoo.me",
    "https://il.ax",
    "https://syncpundit.com",
    "https://mha.fi",
    "https://mint.lgbt",
    "https://privacy.com.de",
    "https://notyourcomputer.net",
    //invidious
    "https://yewtu.be",
    "https://vid.puffyan.us",
    "https://invidious.snopyta.org",
    "https://invidious.kavin.rocks",
    "https://inv.riverside.rocks",
    "https://invidious.osi.kr",
    "https://y.com.sb",
    "https://tube.cthd.icu",
    "https://invidious.flokinet.to",
    "https://yt.artemislena.eu",
    "https://invidious.se...ivacy.com",
    "https://inv.bp.projectsegfau.lt",
    "https://invidious.lunar.icu",
    //nitter
    "https://nitter.net",
    //reddit
    "https://teddit.net/",
    //medium
    "https://scribe.rip/",
    //ticktock ... god forgive me for I have enabled cancer
    "https://proxitok.herokuapp.com/", 
];

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

function createStandinUrl(path, newDomain){
    let standin = "https://";

    standin += newDomain;

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
            option.innerHTML = domainsWithoutDefault[i];

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

                    chrome.tabs.query({active: true, currentWindow: true}, (allTabs) => {
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











