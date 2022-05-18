document.addEventListener("DOMContentLoaded", init);

function init(){

    const domainKeys = [
        "youtubeAlts",
        "twitterAlts",
        "redditAlts",
        "mediumAlts",
        "tiktokAlts" 
    ];
    let checkboxContainer = document.getElementById("checkbox-container");

    if(checkboxContainer){ 
        getDataFromStorage(chrome, ...domainKeys)
            .then(domainGroups => {
                if(Object.keys(domainGroups).length){

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


                handleAllCheckboxGroups(document, "checkbox-and-label", handleCheckbox);


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
        groupLabel.setAttribute("value", domainGroupNames[index]);
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
    label.setAttribute("class", "domain-label");
    label.setAttribute("for", "checbox-" + groupIndex + "-" + index);
    label.innerHTML = domain;

    let checkboxAndLabel = doc.createElement("div");
    checkboxAndLabel.setAttribute("class", "checkbox-and-label");
    checkboxAndLabel.setAttribute("id", "checkbox-and-label-" + groupIndex + "-" + index);

    checkboxAndLabel.appendChild(checkbox);
    checkboxAndLabel.appendChild(label);

    return checkboxAndLabel;
}

function handleCheckbox(checkboxAndLabel){
    //I guess queryselectorall only works on the entire document?...
    // let label = checkboxAndLabel.querySelectorAll("label, div[class*='label']");
    // let checkbox = checkboxAndLabel.querySelectorAll("input, div[class*='checkbox'], div[class*='check-box'], div[class*='check']")

    let checkboxGroup = checkboxAndLabel.parentNode;
    let groupWithLabel = checkboxGroup.parentNode;
    let groupLabel = groupWithLabel.getElementsByTagName("label")[0];
    

    let label = checkboxAndLabel.getElementsByTagName("label")[0];
    let checkbox = checkboxAndLabel.getElementsByTagName("input")[0];

    checkbox.addEventListener("change", function(event){

        console.log(groupLabel.innerHTML);

        getDataFromStorage(chrome, "popupDomains")    //setting the browser from here goes against functional programming...
            .then(data => {
                let popupDomains = data["popupDomains"];

                let newPopupDomains = null;

                if(event.target.checked){
                    console.log("true: " + label.innerHTML)

                    newPopupDomains = addPopupDomain(popupDomains, label.innerHTML, groupLabel.innerHTML);

                } else {
                    console.log("false: " + label.innerHTML)

                    newPopupDomains = removePopupDomain(popupDomains, label.innerHTML);

                    console.log(JSON.stringify(newPopupDomains))
                }

                storeDataToStorage(chrome, {popupDomains, newPopupDomains})
            });


    });

}

function handleAllCheckboxGroups(doc, className, handleCheckboxCallback){
    let checkboxGroups = doc.getElementsByClassName(className);

    for(let i = 0; i < checkboxGroups.length; i++){
        handleCheckboxCallback(checkboxGroups[i]);
    }
}

async function getDataFromStorage(browser, ...keys){
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

function addPopupDomain(popupDomains, domain, domainGroupName){ //mucho repeato
    Object.entries(popupDomains).forEach(altGroup => { 
        let groupHandle = altGroup[0];
        let realAltGroup = altGroup[1];
        const abc = 123;
        if(groupHandle === domainGroupName){
            if(altGroup.length &&   !    realAltGroup.includes(domain)){ 

                realAltGroup.push(domain)
            }            
        }
    });

    return popupDomains;    
}

function removePopupDomain(popupDomains, domain) {
    Object.entries(popupDomains).forEach(altGroup => { // IF NESTED ENTRIES IT WILL RETURN THE PARENT ENTRY AS item 0 AND item 1 AS THE CHILD ENTRIES
        let realAltGroup = altGroup[1];
        const abc = 123;
        if(altGroup.length && realAltGroup.includes(domain)){ //for some reason indexOf doesn't work, it just skips everything

            realAltGroup.splice(
                realAltGroup.indexOf(domain),
                1
            );
        }
    });

    return popupDomains;
}