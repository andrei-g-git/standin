document.addEventListener("DOMContentLoaded", init);

function init(){

    const domainKeys = [
        "youtubeAlts",
        "twitterAlts",
        "redditAlts",
        "mediumAlts",
        "ticktockAlts" 
    ];
    let checkboxContainer = document.getElementById("checkbox-container");

    for (const a of document.querySelectorAll("div", "button")) {
        if (a.textContent.includes("Options")) {
          console.log(a.textContent)
        }
      }

    if(checkboxContainer){ 
        getDataFromStorage(chrome, ...domainKeys)
            .then(domainGroups => {
                if(Object.keys(domainGroups).length){
                    createCheckboxGroups(
                        document, 
                        checkboxContainer, 
                        [...Object.keys(domainGroups)]
                    );                    
                } else {
                    console.log("did not yet load domains")
                }
            })
            .catch(err => console.error(err));        
    }


}

function createCheckboxGroups(doc, parent, ...domainGroups){
    domainGroups.forEach(domainGroup => {
        let checkboxGroup = doc.createElement("div");
        checkboxGroup.setAttribute("class", "checbox-group");
        checkboxGroup = populateCheckboxGroup(doc, checkboxGroup, domainGroup);
        parent.appendChild(checkboxGroup);
    });
    
}

function populateCheckboxGroup(doc, checkboxGroup, domainGroup){
    for(let i = 0; i < domainGroup.length; i++){
        checkboxGroup.appendChild(createCheckbox(doc, domainGroup[i], i));
    }

    return checkboxGroup;
}

function createCheckbox(doc, domain, index){
    let checkbox = doc.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "domain-checkbox");
    checkbox.setAttribute("name", "checbox-" + index);

    let label = doc.createElement("label");
    label.setAttribute("for", "checbox-" + index);
    label.innerHTML = domain;

    let checkboxAndLabel = doc.createElement("div");
    checkboxAndLabel.setAttribute("class", "checkbox-and-label");

    checkboxAndLabel.appendChild(checkbox);
    checkboxAndLabel.appendChild(label);

    return checkboxAndLabel;
}

async function getDataFromStorage(browser, ...keys){
    return new Promise((resolve, reject) => {
        /* browser */chrome.storage.local.get([...keys], function(data){
            resolve(data);
        });
    });
}