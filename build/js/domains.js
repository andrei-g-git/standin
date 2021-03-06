chrome.runtime.onInstalled.addListener(({reason}) => {
    console.log("installed, reason = ", reason);
    
    const allSelected = {
        selectedStandins: [
            {
                standin: "piped.kavin.rocks",
                handle: "youtube" //these are constant
            },
            {
                standin: "nitter.net",
                handle: "twitter"
            },
            {
                standin: "teddid.net",
                handle: "reddit"
            },
            {
                standin: "scribe.rip",
                handle: "medium"
            },
            {
                standin: "proxitok.herokuapp.com",
                handle: "tiktok"
            },  
            {
                standin: "i.bcow.xyz",
                handle: "imgur",
                title: "test url"
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

});



function storePossibleDomains(domainsObject, browser, key){
    getDataFromStorage2(chrome, key)   
        .then((data) => {                   //I DON"T ACTUALLY HAVE TO MAKE SURE I DON"T OVERRIDE, THIS RUNS ON INSTALL SO IT NEVER DOES
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


                "https://nitter.42l.fr",
                "https://nitter.pussthecat.org",
                "https://nitter.kavin.rocks",
                "https://nitter.unixfox.eu",
                "https://nitter.namazso.eu",
                "https://nitter.hu",
                "https://nitter.moomoo.me",
                "https://nitter.it",
                "https://twitter.censors.us",
                "https://nitter.grimneko.de",
                "https://nitter.ca",
                "https://twitter.076.ne.jp ",
                "https://nitter.fly.dev ",
                "https://notabird.site ",
                "https://nitter.weiler.rocks",
                "https://nitter.sethforprivacy.com",
                "https://nttr.stream",
                "https://nitter.cutelab.space",
                "https://nitter.nl",
                "https://nitter.mint.lgbt",
                "https://nitter.bus-hit.me",
                "https://nitter.esmailelbob.xyz",
                "https://tw.artemislena.eu",
                "https://de.nttr.stream",
                "https://nitter.winscloud.net",
                "https://nitter.tiekoetter.com",
                "https://nitter.spaceint.fr",
                "https://twtr.bch.bar",
                "https://nitter.privacy.com.de",
                "https://nitter.mastodon.pro",
                "https://nitter.notraxx.ch",
                "https://nitter.poast.org",
                "https://nitter.bird.froth.zone",
                "https://nitter.dcs0.hu",
                "https://twitter.dr460nf1r3.org",
                "https://twitter.beparanoid.de",
                "https://n.ramle.be",
                "https://nitter.cz",
                "https://nitter.privacydev.net",
                "https://tweet.lambda.dance",
                "https://nitter.ebnar.xyz",
                "https://nitter.kylrth.com",
                "https://nitter.oishi-ra.men",
                "https://nitter.foss.wtf",
                "https://nitter.priv.pw",
                "https://t.com.sb",
                "https://nt.vern.cc",
                "https://nitter.wef.lol",
                "https://nitter.tokhmi.xyz",
                "https://nitter.catalyst.sx",

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
                //scribe
                "https://scribe.rip",
                "https://scribe.froth.zone",
                "https://scribe.bus-hit.me",
                "https://scribe.citizen4.eu",
                "https://scribe.nixnet.services",
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


