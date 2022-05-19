
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
            "https://youtube.com",
            "https://piped.kavin.rocks",
            "https://yewtu.be",
        ],
        twitterAlts: [
            "https://twitter.com",
            "https://nitter.net",
        ],
        redditAlts: [
            "https://reddit.com",
            "https://teddit.net"
        ],
        mediumAlts: [
            "https://medium.com",
            "https://scribe.rip"
        ],
        tiktokAlts: [
            "https://tiktok.com",
            "https://proxitok.herokuapp.com"
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
                dropdownLabel: "tiktok"
            }
        }          
    ]
}

const selectedStandins = {
    selectedYoutubeStandin: "youtube.com",
    selectedTwitterStandin: "twitter.com",
    selectedRedditStandin: "reddit.com",
    selectedMediumStandin: "medium.com",
    selectedTiktokStandin: "tiktok.com"
};

const allSelected = {
    selectedStandins: [
        {
            standin: "youtube.com", 
            handle: "youtube" //these are constant
        },
        {
            standin: "twitter.com",
            handle: "twitter"
        },
        {
            standin: "reddit.com",
            handle: "reddit"
        },
        {
            standin: "medium.com",
            handle: "medium"
        },
        {
            standin: "tiktok.com",
            handle: "tiktok"
        },                                
    ]
};

storePossibleDomains(domainsObject, chrome, "domains"); //use storeDataOnInstall, it's universal
//replace with
storeDataToStorage(chrome, getPopupDomains());

storeDataOnInstall(initialDropdownData, chrome, "defaultPopupDomains");

storeDataOnInstall(domainGroupProperties, chrome, "domainGroupProperties");

storeDataOnInstall(selectedStandins, chrome, /* "selectedStandins" */ "doesn't matter");

//storeDataOnInstall is useless, don't need to check if data already exists, it won't
storeDataToStorage(chrome, allSelected);

function storePossibleDomains(domainsObject, browser, key){
    getDataFromStorage2(chrome, key)   /// there's something odd going on here, it seems to get the correct domains from storage even when there shouln't be any (browser says the extension local storage is empty even after reload)
        .then((data) => {                   //I DON"T ACTUALLY HAVE TO MAKE SURE I DON"T OVERRIDE, THIS RUNS ON INSTALL SO IT NEVER DOES
            if( ! data || ! data[key]){
                storeDataToStorage(browser, domainsObject);
            }
        });
}

function storeDataOnInstall(initialData, browser, key){ //use this instead, 
    getDataFromStorage2(browser, key)   
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

async function getDataFromStorage2(browser, ...keys){  //I think these get bunched up in one big script, it seems like they become duplicates 
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

function getPopupDomains(){
    const popupDomainsReplacer = [ //replace popup domains with this
        {
            group: "youtube",
            domains: [
                "https://youtube.com",
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
            ]
        },
        {
            group: "twitter",
            domains: [
                "https://twitter.com",
                //nitter
                "https://nitter.net",
            ]
        },
        {
            group: "reddit",
            domains: [
                "https://reddit.com",
                //reddit
                "https://teddit.net/",
            ]
        },
        {
            group: "medium",
            domains: [
                "https://medium.com",
                //medium
                "https://scribe.rip/",
            ]
        },
        {
            group: "tiktok",
            domains: [
                "https://tiktok.com",
                //ticktock ... god forgive me for I have enabled cancer
                "https://proxitok.herokuapp.com/", 
            ]
        }                
    ];

    return {popupDomainsReplacer: popupDomainsReplacer};
}

function getYoutubeAlts(){
    return [
        "https://youtube.com",
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
        "https://twitter.com",
        //nitter
        "https://nitter.net",
    ];   
}


function getRedditAlts(){
    return [
        "https://reddit.com",
        //reddit
        "https://teddit.net/",
    ];    
} 


function getMediumAlts(){
    return [
        "https://medium.com",
        //medium
        "https://scribe.rip/",
    ];    
}


function getTicktockAlts(){
    return [
        "https://tiktok.com",
        //ticktock ... god forgive me for I have enabled cancer
        "https://proxitok.herokuapp.com/", 
    ];
}





