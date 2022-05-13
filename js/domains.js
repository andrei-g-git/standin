const allDomains = mergeAllDomains(
    getYoutubeAlts(),
    getTwitterAlts(),
    getRedditAlts(),
    getMediumAlts(),
    getTicktockAlts()
);

const domainsObject = {
    domains: allDomains,
    youtubeAlts: getYoutubeAlts(),
    twitterAlts: getTwitterAlts(),
    redditAlts: getRedditAlts(),
    mediumAlts: getMediumAlts(),
    ticktockAlts: getTicktockAlts()    
};

const initialDropdownData = {
    popupDomains: {
        youtubeAlts: [
            "https://piped.kavin.rocks",
            "https://yewtu.be",
        ],
        twitterAlts: [
            "https://nitter.net",
        ],
        redditAlts: [

        ],
        mediumAlts: [

        ],
        ticktockAlts: [

        ]        
    }

};

const domainGroupProperties = {
    domainGroupProperties: [
        {
            youtubeAlts: {
                    dropdownId: "youtube-dropdown",
                    dropdownLabel: "youtube" 
        
            }
        },
        {
            twitterAlts: {
                dropdownId: "twitter-dropdown",
                dropdownLabel: "twitter"
            }
        },
        {
            redditAlts: {
                dropdownId: "reddit-dropdown",
                dropdownLabel: "reddit"
            }
        },
        {
            mediumAlts: {
                dropdownId: "medium-dropdown",
                dropdownLabel: "medium"
            }
        },
        {
            ticktockAlts: {
                dropdownId: "ticktock-dropdown",
                dropdownLabel: "ticktock"
            }
        }          
    ]
}

const selectedStandins = {
    selectedYoutubeStandin: "youtube.com",
    selectedTwitterStandin: "twitter.com",
    selectedRedditStandin: "reddit.com",
    selectedMediumStandin: "medium.com",
    selectedTicktockStandin: "ticktock.com"
}

storePossibleDomains(domainsObject, chrome, "domains"); //use storeDataOnInstall, it's universal

storeDataOnInstall(initialDropdownData, chrome, "defaultPopupDomains");

storeDataOnInstall(domainGroupProperties, chrome, "domainGroupProperties");

storeDataOnInstall(selectedStandins, chrome, "selectedStandins");

function storePossibleDomains(domainsObject, browser, key){
    getDataFromStorage(chrome, key)   /// there's something odd going on here, it seems to get the correct domains from storage even when there shouln't be any (browser says the extension local storage is empty even after reload)
        .then((data) => {
            if( ! data || ! data[key]){
                storeDataToStorage(browser, domainsObject);
            }
        });
}

function storeDataOnInstall(initialData, browser, key){ //use this instead, 
    getDataFromStorage(browser, key)   
    .then((data) => {
        if( ! data || ! data[key]){
            storeDataToStorage(browser, initialData);
        }
    });    
}

function mergeAllDomains(...args){
    let allDomains = Array.prototype.concat(...args);
    console.log(allDomains)
    return allDomains;
}

async function getDataFromStorage(browser, ...keys){
    return new Promise((resolve, reject) => {
        browser.storage.local.get([...keys], function(data){
            resolve(data);
        });
    });
}

async function storeDataToStorage(browser, data){
    return new Promise((resolve, reject) => {
        browser.storage.local.set(data, function(){
            resolve("sent");
        });
    });
}

function getYoutubeAlts(){
    return [
        //piped
        "https://piped.kavin.rocks",
        "https://piped.silkky.cloud",
        "https://piped.tokhmi.xyz",
        "https://piped.moomoo.me",
        "https://piped.syncpundit.com",
        "https://piped.mha.fi",
        "https://piped.privacy.com.de",
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
        "https:/invidious.xamh.de",
    ];
}  

function getTwitterAlts(){
    return [
        //nitter
        "https://nitter.net",
    ];   
}


function getRedditAlts(){
    return [
        //reddit
        "https://teddit.net/",
    ];    
} 


function getMediumAlts(){
    return [
        //medium
        "https://scribe.rip/",
    ];    
}


function getTicktockAlts(){
    return [
        //ticktock ... god forgive me for I have enabled cancer
        "https://proxitok.herokuapp.com/", 
    ];
}





