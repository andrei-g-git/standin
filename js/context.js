const contextMenuItem = {
    "id": "standin-context",
    "title": "Standin",
    "contexts": ["all"]
};
let browser = chrome; //doesn't support promisses   ---- or does it...

browser
    .contextMenus
    .create(contextMenuItem);

browser
    .contextMenus
    .onClicked
    .addListener((event) => handleContextClick(event, browser, getDomainNames, "domains"));

function handleContextClick(event, browser, getDomainNames, domainsKey){ 

    getDomainNames(browser, domainsKey)
        .then(domainList => {
            const validDomain = validateClickedLink(event.linkUrl, domainList);

            const path = extractUrlPath(event.linkUrl, validDomain);

            loadStandinDomainName(validDomain, "selectedStandins", "popupDomainsReplacer", browser)
                .then((domain) => {
                    openStandinlink(domain, path, browser, event);
                });
        });


}    


async function getDomainNames(browser, domainsKey){
    return new Promise((resolve, reject) => {
        getDataFromStorage(browser, domainsKey)
            .then(data => {
                let urls = data[domainsKey];
                if(! urls || ! urls.length) reject();
                const domainList = urls.map(url => url.replace("https://", ""));
                resolve(domainList);
            });
    });

} 


function onError(error){
    console.log(error);
}

function validateClickedLink(url, domainList){
    let validDomain;
    if(url && url.length){
        for(let i = 0; i < domainList.length; i++){
            if(url.includes(domainList[i])){
                validDomain = domainList[i];
                break
            }
        }
    } else {
        console.log("must click on a link")
    }

    return validDomain;
}

function extractUrlPath(url, validDomain){
    let path;
    if(validDomain){
        const withoutProtocol = validDomain;
        const pathIndex = url.indexOf(withoutProtocol) + withoutProtocol.length; //this should start before the "/"
        path = url.substring(pathIndex);
        console.log(path)
    } else {
        console.log("the link does not match with the list of supported domains, link is: " + validDomain);
    }

    return path;
}

function openStandinlink(domain, path, browser, event){
    if(domain && path){
        const standin = domain + path;
        

        if(event.menuItemId === "standin-context"){
            console.log("STANDIN IS: " + standin);
            browser
                .tabs
                .create({
                    url: standin
                })
        }
    } else {
        console.log("standin domain and (or) path are invalid");
    }
}

async function loadStandinDomainName(sourceDomain, selectedKey, domainsKey, browser){
    // let key = "selectedYoutubeStandin"; //this is rigid and clunky, obviously I'll have to replace it
    // if(sourceDomain.includes("twitter") || sourceDomain.includes("nitter")){
    //     key = "selectedTwitterStandin";
    // }
    // if(sourceDomain.includes("reddit") || sourceDomain.includes("teddit")){
    //     key = "selectedRedditStandin";
    // }   
    // if(sourceDomain.includes("medium") || sourceDomain.includes("scribe")){
    //     key = "selectedMediumStandin";
    // }        
    // if(sourceDomain.includes("tiktok") || sourceDomain.includes("proxitok")){
    //     key = "selectedTiktokStandin";
    // } 
    

    let domain;

    return new Promise((resolve, reject) => {
        browser.storage.local.get([selectedKey, domainsKey], function(data){

            //new
            //const selectedStandins = data[key];
            const popupDomains = data[domainsKey];
            const selectedStandins = data[selectedKey];
            let handle;
            for(let i = 0; i < popupDomains.length; i++){
                const group = popupDomains[i].group;
                const domains = popupDomains[i].domains;
                for(let j = 0; j < domains.length; j++){
                    if(domains[j].includes(sourceDomain)){
                        handle = group;
                        break;
                    }
                }
            }
            //
            const storedHostName = selectedStandins
                .filter(object => object.handle === handle)[0]
                .standin;

            if(storedHostName){
                domain = "https://";

                domain += storedHostName;

                resolve(domain);
            } else {
                console.log("couldn't retrieve your chosen standin domain name")
                reject();
            }

        });

    });
}

async function getDataFromStorage(browser, ...keys){
    return new Promise((resolve, reject) => {
        browser.storage.local.get([...keys], function(data){
            resolve(data);
        });
    });
}