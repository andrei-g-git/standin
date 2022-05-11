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

storePossibleDomains(domainsObject, chrome, "domains");

function storePossibleDomains(domainsObject, browser, key){
    getDataFromStorage(chrome, key)   /// there's something odd going on here, it seems to get the correct domains from storage even when there shouln't be any (browser says the extension local storage is empty even after reload)
        .then((data) => {
            if( ! data || ! data[key]){
                storeDataToStorage(browser, domainsObject);
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





