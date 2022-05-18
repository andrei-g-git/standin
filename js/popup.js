
sayCheese();
sayCheese();
sayCheese();

document.addEventListener( 'DOMContentLoaded', init );

function init(){

    getDataFromStorage(chrome, "popupDomains")
        .then(data => {

            const popupDomains = data["popupDomains"];

            let dropdownContainer = document.getElementById("dropdown-container");

            populateDropdownContainer(
                popupDomains,
                domainGroupDropdownIdPairs,
                document,
                dropdownContainer,
                createDropdownAndLabel,
                createOption,
                updateStorageOnChange
            );

            const switchVideoButton = document.getElementById("video-standin-button");

            openStandinOnClick(switchVideoButton, "videoHost", popupDomains["youtubeAlts"]);

            ////////////////////////////////////////////////////


            const switchSocialButton = document.getElementById("social-standin-button");

            openStandinOnClick(switchSocialButton, "socialHost", popupDomains["twitterAlts"]);

            ////////////////////// replace with this
            //populateSwitchButtonContainer(buttonContainer, deleteThis, popupDomains, chrome);       

        }); 


    //test
    const optionsButton = document.getElementById("options-button");
    if(optionsButton){
        optionsButton.addEventListener("click", function(){
            /* browser */chrome.tabs.create({url: "options.html"}, () => console.log("options page should open"))
        });        
    }

}

function populateSwitchButtonContainer(buttonContainer, groupAndStandinPairs, popupDomains, browser, doc){
    for(let i = 0; i < groupAndStandinPairs.length; i++){
        const domainHandle = groupAndStandinPairs[i].getTheThingHere11111111111111111111111111111111111
    }
}

function createSwitchButton(doc, domainHandle){
    let button = doc.createElement("button");
    button.setAttribute("class", "switch-site-button");
    button.innerHTML = "Switch " + domainHandle + " host";

    return button;
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
        chrome.storage.local.get([key], function(data){
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
            chrome.storage.local.get([key], function(data){

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

const domainGroupDropdownIdPairs = [   
    {youtubeAlts: "youtube-dropdown"},
    {twitterAlts: "twitter-dropdown"},
    {redditAlts: "reddit-dropdown"},
    {mediumAlts: "medium-dropdown"},
    {tiktokAlts: "tiktok-dropdown"}
]


function populateDropdownContainer(
    popupDomains,
    domainGroupDropdownIdPairs,
    doc,
    dropdownContainer,
    createDropdownAndLabelCallback,
    createOptionCallback,
    updateStorageOnChangeCallback
){
    domainGroupDropdownIdPairs.forEach(groupAndId => {
        const [groupName, dropdownId] = Object.entries(groupAndId)[0];
        const domains = popupDomains[groupName];

        console.log(`---GROUP NAME: ${groupName} \n ---DROPDOWN ID: ${dropdownId} \n ---DOMAINS: ${JSON.stringify(domains)}`);

        //should get the dropdown name instead of using the "somethingAlt" format
        let dropdownAndLabel = createDropdownAndLabelCallback(dropdownId, groupName, domains, doc, createOptionCallback, updateStorageOnChangeCallback);

        dropdownContainer.appendChild(dropdownAndLabel);
    }); 
}

function createDropdownAndLabel(id, name, domains, doc, createOption, updateStorageOnChange){
    let label = doc.createElement("label");
    label.setAttribute("class", "dropdown-label");
    label.setAttribute("for", id);
    label.innerHTML = name;

    let dropdown = doc.createElement("select");
    dropdown.setAttribute("id", id);
    dropdown.setAttribute("class", "dropdown");
    
    //DELETE AND PASS PROPER STANDIN KEY
    //and pass actual dropdown name instead if "whateverAlt"
    const deleteThis = {
        youtubeAlts: "selectedYoutubeStandin",
        twitterAlts: "selectedTwitterStandin",
        redditAlts: "selectedRedditStandin",
        mediumAlts: "selectedMediumStandin",
        tiktokAlts: "selectedTiktokStandin",
    }
    updateStorageOnChange(dropdown, deleteThis[name]) ////////////////////////////////////

    domains.forEach(domain => {
        let domainName = domain
            .replace("https://", "")
            .replace("www.", "");

        let option = createOption(domainName, doc);

        dropdown.appendChild(option);
    });

    let dropdownAndLabel = doc.createElement("div");
    dropdownAndLabel.setAttribute("class", "dropdown-and-label");
    dropdownAndLabel.appendChild(label);
    dropdownAndLabel.appendChild(dropdown);

    return dropdownAndLabel;
}

function createOption(value, doc){
    let option = doc.createElement("option");
    option.setAttribute("class", "dropdown-option");
    option.setAttribute("value", value);
    option.innerHTML = value;

    return option;
}

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
    let standin;// = "https://";

    standin += newDomain;

    standin += "/" + path;
    return standin;
}

function populateDropdown(dropdown, uniqueDomains, id){
    const defaultDomainName = dropdown.options[0].value;
    const domainsWithoutDefault = uniqueDomains.filter(item => item !== defaultDomainName);
    if(domainsWithoutDefault.length){
        for(var i = 0; i < domainsWithoutDefault.length; i++){
            let domainHandle = domainsWithoutDefault[i];
            domainHandle = domainHandle.replace("https://", "");
            domainHandle = domainHandle.replace("www.");

            const option = document.createElement("option");
            option.setAttribute("class", id);
            option.setAttribute("value", domainHandle);
            option.innerHTML = domainHandle;

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











