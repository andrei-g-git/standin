
document.addEventListener( 'DOMContentLoaded', init );

function init(){

    getDataFromStorage(chrome, "popupDomains")
        .then(data => {

            const popupDomains = data["popupDomains"];
            const justDomainGroupArrays = popupDomains.map(group => group.domains);
            const justGroupNames = popupDomains.map(group => group.group);

            let dropdownContainer = document.getElementById("dropdown-container");

            populateDropdownContainer(
                justDomainGroupArrays,
                justGroupNames, 
                document,
                dropdownContainer,
                chrome,
                createDropdownAndLabel,
                createOption,
                updateStorageOnChange,
                setSelectedOptions
            );

            // let buttonContainer = document.getElementById("standin-button-container");
            // populateSwitchButtonContainer(
            //     buttonContainer, 
            //     "selectedStandins", 
            //     popupDomains, 
            //     chrome, 
            //     document, 
            //     createSwitchButton
            // );       

        }); 

    const optionsButton = document.getElementById("options-button");
    if(optionsButton){
        optionsButton.addEventListener("click", function(){
            chrome.tabs.create({url: "options.html"}, () => console.log("options page should open"))
        });        
    }

}

function populateSwitchButtonContainer(buttonContainer, selectedStandinsKey, popupDomains, browser, doc, createSwitchButton){
    if(buttonContainer){
        browser.storage.local.get([selectedStandinsKey], function(data){
            const selectedStandins = data[selectedStandinsKey];
            console.log(JSON.stringify(selectedStandins));

            for(let i = 0; i < selectedStandins.length; i++){
                const standin = selectedStandins[i].standin;
                const groupName = selectedStandins[i].handle;
                const domains = popupDomains[i].domains; //assume that the standin and popupDomain arrays are 1:1, probably a bad idea...

                let buttonWrapper = createSwitchButton(doc, groupName); //I should pass these as callbacks
                let button = buttonWrapper.getElementsByTagName("button")[0];
                buttonContainer.appendChild(buttonWrapper);

                button.addEventListener("click", function(event){
                    const abc = 123;
                    createStandinUrl(browser, standin, domains)
                        .then(newUrl => {
                            if(newUrl){
                                browser
                                .tabs
                                .create({
                                    url: newUrl
                                }) 
                            }
                        })

                });
            }
        });        
    } else {
        console.log("the standin button container has not yet loaded into the document")
    }
}

function createSwitchButton(doc, groupName){
    console.log("GROUP HANDLE:   " + groupName)
    let buttonWrapper = doc.createElement("div");
    buttonWrapper.setAttribute("class", "switch-site-button");
    buttonWrapper.setAttribute("id", groupName + "-standin-button");
    let icon = doc.createElement("img");
    icon.setAttribute("src", `assets/${groupName}Standin.png`);
    icon.setAttribute("alt", "btn");
    let button = doc.createElement("button");

    buttonWrapper.appendChild(icon);
    buttonWrapper.appendChild(button);

    return buttonWrapper;
}

async function createStandinUrl(browser, standin, domains){
    return new Promise(resolve => {
        browser.tabs.query({active: true, currentWindow: true}, (allTabs) => {
            const url = allTabs[0].url;
            const protocol = url.slice(0, 8);
            if(protocol === "https://"){
                const withoutProtocolAndWWW = url
                    .replace(protocol, "")
                    .replace("www.", "");
                const slashPos = withoutProtocolAndWWW.indexOf("/");
                const domainName = withoutProtocolAndWWW.slice(0, slashPos);
                console.log("without protocol and www:   " + withoutProtocolAndWWW + "\n" + "slashPos:    " + slashPos + "\n" + "domain name:   " + domainName)
                if(domainName && domainName.length){
                    const validDomains = domains.filter(domain => domain.includes(domainName));
                    console.log("valid domains:   " + validDomains);
                    if(validDomains.length){
                        const path = withoutProtocolAndWWW.slice(slashPos);
                        const fullStandinUrl = "https://" + standin + path;
                        console.log("full standin url:    " + fullStandinUrl);
                        resolve(fullStandinUrl);                 
                    }

                } 
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

async function setDefaultStandinDomain(dropdown, key, defaultDomain){ //on fresh install this promise might fail 
    return new Promise((resolve, reject) => {                              
        chrome.storage.local.get([key], function(data){
            if(! data[key] || ! data[key].length){
                chrome.storage.local.set({ [key]: defaultDomain});
                dropdown.value = defaultDomain;
            } else {
                dropdown.value = data[key];
            }   
            
            if( ! data) reject(); 
        });

        resolve(dropdown.value);
    });

}

function updateStorageOnChange(dropdown, key, groupHandle){  //on fresh install this promise might fail 
    dropdown.addEventListener("change", async function(event){
        return new Promise((resolve, reject) => { //so there's no point returning a promise here, I don't know how to capture the promise since the anonymous function returns it, not updateStorageOnChange -- I can't call .then() on the latter
            chrome.storage.local.get([key], function(data){
                const selectedStandins = data[key]; 

                for(let i = 0; i < selectedStandins.length; i++){
                    console.log(selectedStandins[i].standin)
                    if(selectedStandins[i].handle === groupHandle){
                        selectedStandins[i].standin = event.target.value;
                    }
                }
                chrome.storage.local.set({selectedStandins: selectedStandins}, function(data){
                    resolve(data[key]);    
                })
            });
        }); 
    });  
}

function populateDropdownContainer(
    popupDomains,
    groupNames,
    doc,
    dropdownContainer,
    browser,
    createDropdownAndLabelCallback,
    createOptionCallback,
    updateStorageOnChangeCallback,
    setSelectedOptionsCallback
){
    groupNames.forEach((groupName, index) => {
        const domains = popupDomains[index];
        const dropdownId = groupName + "-dropdown";
        let dropdownAndLabel = createDropdownAndLabelCallback(
            dropdownId, 
            groupName, 
            domains, 
            doc, 
            createOptionCallback, 
            updateStorageOnChangeCallback, 
            setSelectedOptionsCallback, 
            browser
        );

        dropdownContainer.appendChild(dropdownAndLabel);
    }); 
}

function createDropdownAndLabel(id, name, domains, doc, createOption, updateStorageOnChangeCallback, setSelectedOptionsCallback, browser){
    //no label, labels aren't trendy

    let dropdown = doc.createElement("select");
    dropdown.setAttribute("id", id);
    dropdown.setAttribute("class", "dropdown");

    updateStorageOnChangeCallback(dropdown, "selectedStandins", name) 

    domains.forEach(domain => {
        let domainName = domain
            .replace("https://", "")
            .replace("www.", "");

        let option = createOption(domainName, doc);

        dropdown.appendChild(option);
    });

    //new
    let standinButton = createSwitchButton(doc, name);

    let dropdownAndLabel = doc.createElement("div");
    dropdownAndLabel.setAttribute("class", "dropdown-and-label"); //this is just a wrapper for the dropdown so I can remove it's default stylings
    dropdownAndLabel.appendChild(dropdown);

    //new
    let container = doc.createElement("div");
    container.setAttribute("class", "dropdown-and-label-container");
    container.appendChild(dropdownAndLabel);
    container.appendChild(standinButton);

    //no bueno
    getDataFromStorage(chrome, "selectedStandins")
        .then(
            data => {
                const selectedStandins = data["selectedStandins"];
                const standinObject = selectedStandins.filter(standinObject => standinObject.handle === name)[0];
                const standin = standinObject.standin;

                standinButton.addEventListener("click", function(event){
                    createStandinUrl(browser, standin, domains)
                        .then(newUrl => {
                            if(newUrl){
                                browser
                                .tabs
                                .create({
                                    url: newUrl
                                }) 
                            }
                        })
                });                
            }
        )


    setSelectedOptionsCallback("selectedStandins", name, dropdown, browser);

    //return dropdownAndLabel;
    return container;
}

function createOption(value, doc){
    let option = doc.createElement("option");
    option.setAttribute("class", "dropdown-option");
    option.setAttribute("value", value);
    //option.innerHTML = value;
    option.appendChild(doc.createTextNode(value)); //mozilla doesn't like assigning directly to innerhtml, security issues etc

    return option;
}

function setSelectedOptions(key, domainHandle, dropdown, browser){
    browser.storage.local.get([key], function(data){
        const selectedStandins = data[key];
        selectedStandins.forEach(standinObject => {
            if(standinObject.handle === domainHandle){
                const standin = standinObject.standin;
                const optionsArray = Array.from(dropdown.options);
                for(let i = 0; i < optionsArray.length; i++){
                    const option = optionsArray[i];
                    if(option.innerHTML.includes(standin)){
                        dropdown.selectedIndex = i;  
                    }
                }
            }
        })
    })
}











