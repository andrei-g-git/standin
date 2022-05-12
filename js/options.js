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

    // for (const a of document.querySelectorAll("div", "button")) {
    //     if (a.textContent.includes("Options")) {
    //       console.log(a.textContent)
    //     }
    //   }

    if(checkboxContainer){ 
        getDataFromStorage(chrome, ...domainKeys)
            .then(domainGroups => {
                if(Object.keys(domainGroups).length){

                    // const test = [...Object.values(domainGroups)];
                    // console.log(...Object.values(domainGroups))

                    createCheckboxGroups(
                        document, 
                        checkboxContainer, 
                        //...Object.values(domainGroups) //without spreading in a new array --- that creates a wrapper array with 1 item holding the domainGroups
                        Object.values(domainGroups),
                        Object.keys(domainGroups)
                    );                    
                } else {
                    console.log("did not yet load domains")
                }
            })
            .catch(err => console.error(err));        
    }


}

function createCheckboxGroups(doc, parent, /* ... */domainGroups, domainGroupNames){
    domainGroups.forEach((domainGroup, index) => {
        let checkboxGroup = doc.createElement("div");
        checkboxGroup.setAttribute("class", "checkbox-group");
        checkboxGroup.setAttribute("value", domainGroupNames[index]);
        checkboxGroup.setAttribute("name", domainGroupNames[index]);
        checkboxGroup = populateCheckboxGroup(doc, checkboxGroup, domainGroup, index);

        let groupLabel = doc.createElement("label");
        groupLabel.setAttribute("class", "checkbox-group-label");
        groupLabel.setAttribute("for", domainGroupNames[index]);
        groupLabel.innerHTML = domainGroupNames[index];

        let groupWithLabel = doc.createElement("div");
        groupWithLabel.setAttribute("class", "checkbox-group-and-label");

        groupWithLabel.appendChild(groupLabel);
        groupWithLabel.appendChild(checkboxGroup);

        parent.appendChild(groupWithLabel);
    });
    
}

function populateCheckboxGroup(doc, checkboxGroup, domainGroup, groupIndex){
    for(let i = 0; i < domainGroup.length; i++){
        checkboxGroup.appendChild(createCheckbox(doc, domainGroup[i], i, groupIndex));
    }

    return checkboxGroup;
}

function createCheckbox(doc, domain, index, groupIndex){
    let checkbox = doc.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "domain-checkbox");
    checkbox.setAttribute("name", "checbox-" + groupIndex + "-" + index);
    checkbox.setAttribute("id", "checbox-" + groupIndex + "-" + index);

    let label = doc.createElement("label");
    label.setAttribute("for", "checbox-" + groupIndex + "-" + index);
    label.innerHTML = domain;

    let checkboxAndLabel = doc.createElement("div");
    checkboxAndLabel.setAttribute("class", "checkbox-and-label");

    checkboxAndLabel.appendChild(checkbox);
    checkboxAndLabel.appendChild(label);

    return checkboxAndLabel;
}

async function getDataFromStorage(browser, ...keys){
    return new Promise((resolve, reject) => {
        browser.storage.local.get([...keys], function(data){
            resolve(data);
        });
    });
}