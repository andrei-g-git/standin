const contextMenuItem = {
    "id": "standin-context",
    "title": "Standin",
    "contexts": ["all"]
};
let browser = chrome; //doesn't support promisses

browser
    .contextMenus
    .create(contextMenuItem);

browser
    .contextMenus
    .onClicked
    .addListener((event) => handleContextClick(event, browser, domainList));

function handleContextClick(event, browser, domainList){ //apparently I can't name the domainList argument the same as this domains parameter here ... error:  redeclaration of formal parameter ...weird


    const validDomain = validateClickedLink(event.linkUrl, domainList);

    const path = extractUrlPath(event.linkUrl, validDomain);

    // const standinDomain = await loadStandinDomainName(validDomain, browser);

    // openStandinlink(standinDomain, path, browser, event);

    //testWrapper(validDomain, browser, path, event, loadStandinDomainName);

    loadStandinDomainName(validDomain, browser)
        .then((domain) => {
            openStandinlink(domain, path, browser, event);
        })

}    

const domainList = [
    "https://youtube.com",
    "https://youtu.be",
    "https://yewtu.be",
    "https://invidio.xamh.de",
    "https://piped.kavin.rocks",
    "https://twitter.com",
    "https://nitter.net"
];

function onError(error){
    console.log(error);
}

function validateClickedLink(url, domainList){
    let validDomain;
    if(url && url.length){
        let withoutWWW = url.replace("www.", ""); 
        for(let i = 0; i < domainList.length; i++){
            if(withoutWWW.includes(domainList[i])){
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
        const withoutProtocol = validDomain.replace("https://", "");
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

async function loadStandinDomainName(sourceDomain, browser){
    let key = "videoHost";
    if(sourceDomain.includes("twitter") || sourceDomain.includes("nitter")){
        key = "socialHost";
    }

    let domain;

    return new Promise((resolve, reject) => {
        browser.storage.local.get([key], function(data){
            const storedHostName = data[key];

            if(storedHostName){
                domain = "https://";
                switch(storedHostName){ //repeating in popup.js, but can't export/import as module with plain html and js ... maybe I can save a map in local storage ... and that domain map could be editable by the user ...
                    case "youtube":
                        domain += "youtube.com";
                        break;
                    case "yewtu.be":
                    case "yewtube":
                        domain += "yewtu.be";
                        break;
                    case "invidio.xamh": 
                    case "invidio": 
                        domain += "invidio.xamh.de";
                        break;
                    case "piped": 
                    case "piped.kavin.rocks": 
                        domain += "piped.kavin.rocks";
                        break;
                    case "youtu.be":
                        domain += "youtu.be";
                        break;
            
                    //social
                    case "twitter":
                    case "twitter.com":
                        domain += "twitter.com";
                        break;
                    case "nitter":
                    case "nitter.net":
                        domain += "nitter.net";
                        break;
            
                    default:
                        domain += "nope";
                        break;//"youtube.com"
                }

                resolve(domain);
            } else {
                console.log("couldn't retrieve your chosen standin domain name")
                reject();
            }

        });

    });
}

async function testWrapper(validDomain, browser, path, event, callback){ //don't need, can use then()
    let standinDomain = await callback(validDomain, browser)

    openStandinlink(standinDomain, path, browser, event);
}