

const allSelected = {
    selectedStandins: [
        {
            standin: "piped.kavin.rocks",//"youtube.com", 
            handle: "youtube" //these are constant
        },
        {
            standin: "nitter.net",//"twitter.com",
            handle: "twitter"
        },
        {
            standin: "teddid.net",//"reddit.com",
            handle: "reddit"
        },
        {
            standin: "scribe.rip",//"medium.com",
            handle: "medium"
        },
        {
            standin: "proxitok.herokuapp.com",//"tiktok.com",
            handle: "tiktok"
        },  
        {
            standin: "i.bcow.xyz",
            handle: "imgur"
        }  
        // {
        //     standin: "reuters.com",
        //     handle: "reuters"
        // },                              
    ]
};

storeDataToStorage(chrome, {domains: getBunchedUpDomains(getSupportedDomains, "supportedDomains")}); 

storeDataToStorage(chrome, getSupportedDomains());

storeDataToStorage(chrome, getDefaultPopupDomains());

storeDataToStorage(chrome, allSelected);

function storePossibleDomains(domainsObject, browser, key){
    getDataFromStorage2(chrome, key)   
        .then((data) => {                   //I DON"T ACTUALLY HAVE TO MAKE SURE I DON"T OVERRIDE, THIS RUNS ON INSTALL SO IT NEVER DOES
            if( ! data || ! data[key]){
                storeDataToStorage(browser, domainsObject);
            }
        });
}

// function storeDataOnInstall(initialData, browser, key){ 
//     getDataFromStorage2(browser, key)   
//     .then((data) => {
//         if( ! data || ! data[key]){
//             storeDataToStorage(browser, initialData);
//         }
//     });    
// }

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

function getSupportedDomains(){
    const supportedDomains = [ 
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
                "https://invidious.xamh.de",
                //youtu.be
                "https://youtu.be"
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
                "https://teddit.net",
                "https://libredd.it"
            ]
        },
        {
            group: "medium",
            domains: [
                "https://medium.com",
                //medium
                "https://scribe.rip",
            ]
        },
        {
            group: "tiktok",
            domains: [
                "https://tiktok.com",
                //ticktock ... god forgive me for I have enabled cancer
                "https://proxitok.herokuapp.com", 
            ]
        },
        {
            group: "imgur",
            domains: [
                //rimgo
                "https://imgur.com",
                "https://i.bcow.xyz",
                "https://rimgo.pussthecat.org",
                "https://rimgo.totaldarkness.net",
                "https://rimgo.bus-hit.me",
                "https://rimgo.esmailelbob.xyz",
                "https://rimgo.lunar.icu",
                "https://i.actionsack.com",
                "https://rimgo.privacydev.net",
                "https://imgur.artemislena.eu",
                "https://rimgo.encrypted-data.xyz",
                //imgin
                "https://imgin.voidnet.tech"
            ]
        }
        //DELETE
        // {
        //     group: "reuters",
        //     domains: [
        //         "https://reuters.com",
        //         "https://boxcat.site", 
        //     ]
        // }    
        
        
    ];

    return {supportedDomains: supportedDomains};
}

function getDefaultPopupDomains(){
    const popupDomains = [ 
        {
            group: "youtube",
            domains: [
                "https://youtube.com",
                //piped
                "https://piped.kavin.rocks",
                //invidious
                "https://yewtu.be",
                "https://invidio.xamh.de",
                //youtu.be
                "https://youtu.be"
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
                "https://teddit.net",
                "https://libredd.it"
            ]
        },
        {
            group: "medium",
            domains: [
                "https://medium.com",
                //medium
                "https://scribe.rip",
            ]
        },
        {
            group: "tiktok",
            domains: [
                "https://tiktok.com",
                //ticktock ... god forgive me for I have enabled cancer
                "https://proxitok.herokuapp.com", 
            ]
        },
        {
            group: "imgur",
            domains: [
                "https://imgur.com",
                //rimgo
                "https://i.bcow.xyz",
                //imgin
                "https://imgin.voidnet.tech"
            ]
        }
        //testing, delete
        //DELETE
        // {
        //     group: "reuters",
        //     domains: [
        //         "https://reuters.com",
        //         "https://boxcat.site", 
        //     ]
        // }                         
    ];

    return {popupDomains: popupDomains};
}

function getBunchedUpDomains(getDomains, key){
    const domainData = getDomains();
    const domains = domainData[key];
    const arrayGroups = domains.map(object => object.domains);
    const bunchedUpDomains = [];
    arrayGroups.forEach(group => {
        bunchedUpDomains.push.apply(bunchedUpDomains, group);
    });
    console.log("bunched up domains:   " + bunchedUpDomains);
    return bunchedUpDomains;
}


