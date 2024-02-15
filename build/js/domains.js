chrome.runtime.onInstalled.addListener(({reason}) => {
    console.log("installed, reason = ", reason);

    const allSelected = {
        selectedStandins: [
            {
                standin: "piped.kavin.rocks",
                handle: "youtube" //these are constant
            },
            {
                standin: "nitter.freedit.eu",
                handle: "twitter"
            },
            {
                standin: "reddit.lol",
                handle: "reddit"
            },
            {
                standin: "scribe.rip",
                handle: "medium"
            },
            {
                standin: "proxitok.pabloferreiro.es",
                handle: "tiktok"
            },
            {
                standin: "imgur.artemislena.eu",
                handle: "imgur",
                title: "imgur"
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
    getDataFromStorage(chrome, key)
        .then((data) => {                   //it may seem like it's redundant since this runs on install and the data wouldn't be overidden, but it is when the background script is non-persistent so I suppose it's fine
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

function getSupportedDomains(){
    const supportedDomains = [ //would a json file be better?
        {
            group: "youtube",
            domains: [
                "https://youtube.com",
                "https://youtu.be",
                //piped
                "https://pipedapi.kavin.rocks",
                "https://pipedapi.tokhmi.xyz",
                "https://pipedapi.moomoo.me",
                "https://pipedapi.syncpundit.io",
                "https://api-piped.mha.fi",
                "https://piped-api.garudalinux.org",
                "https://pipedapi.rivo.lol",
                "https://pipedapi.leptons.xyz",
                "https://piped-api.lunar.icu",
                "https://ytapi.dc09.ru",
                "https://pipedapi.colinslegacy.com",
                "https://yapi.vyper.me",
                "https://api.looleh.xyz",
                "https://piped-api.cfe.re",
                "https://pipedapi.r4fo.com",
                "https://pipedapi-libre.kavin.rocks",
                "https://pa.mint.lgbt",
                "https://pa.il.ax",
                "https://piped-api.privacy.com.de",
                "https://api.piped.projectsegfau.lt",
                "https://pipedapi.in.projectsegfau.lt",
                "https://pipedapi.us.projectsegfau.lt",
                "https://watchapi.whatever.social",
                "https://api.piped.privacydev.net",
                "https://pipedapi.palveluntarjoaja.eu",
                "https://pipedapi.smnz.de",
                "https://pipedapi.adminforge.de",
                "https://pipedapi.qdi.fi",
                "https://piped-api.hostux.net",
                "https://pdapi.vern.cc",
                "https://pipedapi.pfcd.me",
                "https://pipedapi.frontendfriendly.xyz",
                "https://api.piped.yt",
                "https://pipedapi.astartes.nl",
                "https://pipedapi.osphost.fi",
                "https://pipedapi.simpleprivacy.fr",
                "https://pipedapi.drgns.space",
                "https://piapi.ggtyler.dev",
                "https://api.watch.pluto.lat",
                "https://piped-backend.seitan-ayoub.lol",
                "https://pipedapi.owo.si",
                "https://pipedapi.12a.app",
                "https://api.piped.minionflo.net",
                "https://pipedapi.nezumi.party",
                "https://pipedapi.ngn.tf",
                //invidious
                "https://yewtu.be",
                "https://vid.puffyan.us",
                "https://yt.artemislena.eu",
                "https://invidious.flokinet.to",
                "https://invidious.projectsegfau.lt",
                "https://invidious.slipfox.xyz",
                "https://invidious.privacydev.net",
                "https://iv.melmac.space",
                "https://iv.ggtyler.dev",
                "https://invidious.lunar.icu",
                "https://inv.nadeko.net",
                "https://inv.tux.pizza",
                "https://invidious.protokolla.fi",
                "https://iv.nboeck.de",
                "https://invidious.private.coffee",
                "https://yt.drgnz.club",
                "https://iv.datura.network",
                "https://invidious.fdn.fr",
                "https://invidious.perennialte.ch",
                "https://yt.cdaut.de",
                "https://invidious.drgns.space",
                "https://inv.us.projectsegfau.lt",
                "https://invidious.einfachzocken.eu",
                "https://invidious.nerdvpn.de",
                "https://inv.n8pjl.ca",
                "https://youtube.owacon.moe",
                "https://invidious.jing.rocks",
                //cloudtube
                "https://tube.cadence.moe",
                //invuedious - invidious wrapper
                "https://bocchilorenzo.github.io/invuedious/watch/IL2P1IB-2nc"

            ]
        },
        {
            group: "twitter",
            domains: [
                "https://twitter.com",
                //nitter
                "https://nitter.freedit.eu",
                "https://nitter.unixfox.eu",
                "https://nitter.lanterne-rouge.info",
                "https://nitter.esmailelbob.xyz",
                "https://nitter.woodland.cafe",
                "https://nitter.x86-64-unknown-linux-gnu.zip",
                "https://nitter.privacydev.net",
                "https://nitter.perennialte.ch",
                "https://nitter.moomoo.me",
                "https://nitter.kylrth.com",
                "https://nitter.mint.lgbt",
                "https://nitter.adminforge.de",
                "https://nitter.eu.projectsegfau.lt",
                "https://nitter.cz",
                "https://n.opnxng.com",
                "https://nitter.projectsegfau.lt",
                "https://nitter.in.projectsegfau.lt",
                "https://nitter.us.projectsegfau.lt",
                "https://nitter.oksocial.net",
                "https://nitter.soopy.moe",
                "https://nitter.fdn.fr",
                "https://nitter.private.coffee",
                "https://nitter.nohost.network",
                "https://nitter.holo-mix.com",
                "https://nitter.tux.pizza",
                "https://nitter.no-logs.com",
                "https://nitter.rawbit.ninja",
                "https://nitter.jakefrosty.com",
                "https://n.populas.no",
                "https://nitter.1d4.us",
                "https://nitter.ktachibana.party",
                "https://nitter.catsarch.com",
                "https://nitter.io.lol",
                "https://nitter.poast.org",
                "https://nitter.salastil.com",
                "https://nitter.net",
                "https://nitter.d420.de",
                "https://nitter.manasiwibi.com",
                "https://n.biendeo.com",
                "https://nitter.tinfoil-hat.net",
                "https://nitter.dafriser.be",
                "https://nt.ggtyler.dev",
                "https://nitter.hostux.net",
                "https://nitter.kling.gg",
                "https://nitter.qwik.space",
                "https://nitter.kavin.rocks",
                "https://nitter.altgr.xyz",
                "https://nitter.simpleprivacy.fr",
                "https://nitter.tiekoetter.com",
                "https://bird.habedieeh.re",
                "https://nitter.it",
                "https://tweet.lambda.dance",
                "https://n.sneed.network",
                "https://nitter.nixnet.services",
                "https://nitter.at",
                "https://nitter.inpt.fr",
                "https://t.com.sb",
                "https://nitter.lunar.icu",
                "https://nitter.bird.froth.zone",
                "https://nitter.twei.space",
                "https://nitter.fediflix.org",
                "https://nitter.datura.network",

            ]
        },
        {
            group: "reddit",
            domains: [
                "https://reddit.com",
                //teddit
                "https://teddit.net",
                "https://teddit.ggc-project.de",
                "https://teddit.zaggy.nl",
                "https://teddit.tinfoil-hat.net",
                "https://teddit.domain.glass",
                "https://snoo.ioens.is",
                "https://teddit.httpjames.space",
                "https://teddit.xbdm.fun",
                "https://incogsnoo.com",
                "https://teddit.pussthecat.org",
                "https://reddit.lol",
                "https://teddit.sethforprivacy.com",
                "https://teddit.adminforge.de",
                "https://teddit.bus-hit.me",
                "https://teddit.froth.zone",
                "https://rdt.trom.tf/",
                "https://teddit.encrypted-data.xyz",
                "https://i.opnxng.com",
                "https://teddit.tokhmi.xyz",
                "https://teddit.garudalinux.org",
                "https://teddit.privacytools.io",
                "https://td.vern.cc",
                "https://teddit.rawbit.ninja",
                "https://teddit.hostux.net",
                "https://teddit.no-logs.com/",
                "https://teddit.projectsegfau.lt",
                "https://teddit.laserdisc.tokyo",
                "https://t.sneed.network",
                //libreddit
                "https://safereddit.com",
                "https://reddit.invak.id",
                "https://reddit.simo.sh",
                "https://libreddit.strongthany.cc",
                "https://libreddit.pussthecat.org",
                "https://libreddit.northboot.xyz",
                "https://lr.vern.cc",
                "https://libreddit.privacydev.net",
                "https://l.opnxng.com",
                "https://libreddit.projectsegfau.lt",
                "https://libreddit.oxymagnesium.com",
                "https://lr.artemislena.eu",
                "https://discuss.whatever.social",
                "https://lr.aeong.one",
                "https://libreddit.bus-hit.me",
                "https://libreddit.lunar.icu",
                "https://snoo.habedieeh.re",
                "https://libreddit.tux.pizza",
                //xeddit
                "https://xeddit.com",
                //reddit-frontend
                "https://jpf-reddit.netlify.app",
                //troddit
                "https://www.troddit.com"
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
                //libmedium
                "https://md.vern.cc",
                "https://libmedium.batsense.net",
                "https://medium.hostux.net",
                "https://md.xbdm.fun",
            ]
        },
        {
            group: "tiktok", //sorry...
            domains: [
                "https://tiktok.com",
                //proxitok
                "https://proxitok.pabloferreiro.es",
                "https://proxitok.pussthecat.org",
                "https://tok.habedieeh.re",
                "https://proxitok.esmailelbob.xyz",
                "https://proxitok.privacydev.net",
                "https://tok.artemislena.eu",
                "https://tok.adminforge.de",
                "https://tik.hostux.net",
                "https://tt.vern.cc",
                "https://cringe.whatever.social",
                "https://proxitok.lunar.icu",
                "https://proxitok.privacy.com.de",
                "https://cringe.whateveritworks.org",
                "https://cringe.seitan-ayoub.lol",
                "https://proxitok.kyun.li",
                "https://cringe.datura.network",
                "https://tt.opnxng.com",
                "https://proxitok.tinfoil-hat.net",
                "https://tiktok.wpme.pl",
                "https://proxitok.r4fo.com",
                "https://proxitok.belloworld.it",
            ]
        },
        {
            group: "imgur",
            domains: [
                //rimgo
                "https://imgur.com",
                //?
                "https://i.bcow.xyz",
                //rimgo etc
                "https://rimgo.totaldarkness.net",
                "https://imgur.artemislena.eu",
                "https://i.habedieeh.re",
                "https://ri.nadeko.net",
                "https://rimgo.lunar.icu",
                "https://imgur.010032.xyz",
                "https://rimgo.kling.gg",
                "https://rimgo.projectsegfau.lt",
                "https://rimgo.eu.projectsegfau.lt",
                "https://rimgo.us.projectsegfau.lt",
                "https://rimgo.in.projectsegfau.lt",
                "https://rimgo.whateveritworks.org",
                "https://rimgo.nohost.network",
                "https://rimgo.catsarch.com",
                "https://rimgo.drgns.space",
                "https://rimgo.quantenzitrone.eu",
                "https://rimgo.frylo.net",
                "https://rimgo.ducks.party",
                "https://rimgo.perennialte.ch",
                //imgin
                "https://imgin.voidnet.tech"
            ]
        }
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
                "https://youtu.be",
                //piped
                "https://piped.kavin.rocks",
                "https://pipedapi.moomoo.me",
                "https://pipedapi.tokhmi.xyz",
                //invidious
                "https://yewtu.be",
                "https://invidious.fdn.fr",
                "https://vid.puffyan.us",
                //cloudtube
                "https://tube.cadence.moe",
            ]
        },
        {
            group: "twitter",
            domains: [
                "https://twitter.com",
                //nitter
                "nitter.freedit.eu",
                "nitter.unixfox.eu",
                "nitter.woodland.cafe",
            ]
        },
        {
            group: "reddit",
            domains: [
                "https://reddit.com",
                //teddit
                "https://reddit.lol",
                "https://teddit.zaggy.nl",
                //libreddit
                "https://safereddit.com",
                "https://libreddit.pussthecat.org",
            ]
        },
        {
            group: "medium",
            domains: [
                "https://medium.com",
                //medium
                "https://scribe.rip",
                //libmedium
                "https://md.vern.cc"
            ]
        },
        {
            group: "tiktok", // :(
            domains: [
                "https://tiktok.com",
                //proxitok
                "https://proxitok.pabloferreiro.es",
                "https://tt.vern.cc/",
            ]
        },
        {
            group: "imgur",
            domains: [
                "https://imgur.com",
                //rimgo
                "https://imgur.artemislena.eu/",
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
    //console.log("bunched up domains:   " + bunchedUpDomains);
    return bunchedUpDomains;
}


