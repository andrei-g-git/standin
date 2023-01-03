document.addEventListener("DOMContentLoaded", init);

const groupLabelSuffix = " standins";

function init(){

    let checkboxContainer = document.getElementById("checkbox-container");

    if(checkboxContainer){ 
        getDataFromStorage/* 3 */(chrome, "supportedDomains", "popupDomains")
            .then( data => {
                const domainGroups = data["supportedDomains"];
                const groupsWithDefaultDomains = data["popupDomains"];
                if(domainGroups.length){

                    const groupNames = domainGroups.map(group => group.group);
                    const domains = domainGroups.map(group => group.domains);
                    const defaultDomains = groupsWithDefaultDomains.map(group => group.domains);
                    createCheckboxGroups(
                        document, 
                        checkboxContainer, 
                        domains,
                        defaultDomains,
                        groupNames
                    );                    
                } else {
                    console.log("did not yet load domains")
                }
                handleAllCheckboxGroups(document, "checkbox-and-label", handleCheckbox);
            })
            .catch(err => console.error(err));     
    }
}

function createCheckboxGroups(doc, parent, domainGroups, defaultDomainGroup, domainGroupNames){
    domainGroups.forEach((domainGroup, index) => {
        let checkboxGroup = doc.createElement("div");
        checkboxGroup.setAttribute("class", "checkbox-group");
        checkboxGroup.setAttribute("value", domainGroupNames[index]);
        checkboxGroup.setAttribute("name", domainGroupNames[index]);
        checkboxGroup = populateCheckboxGroup(doc, checkboxGroup, domainGroup, defaultDomainGroup, index);

        let groupLabel = doc.createElement("label");
        groupLabel.setAttribute("class", "checkbox-group-label");
        groupLabel.setAttribute("for", domainGroupNames[index]);
        groupLabel.setAttribute("value", domainGroupNames[index]);
        //groupLabel.innerHTML = domainGroupNames[index] + groupLabelSuffix;
        groupLabel.appendChild(doc.createTextNode(domainGroupNames[index] + groupLabelSuffix)); //there are excurity issues with assigning directly to the innerhtml, apparently

        let groupWithLabel = doc.createElement("div");
        groupWithLabel.setAttribute("class", "checkbox-group-and-label");

        groupWithLabel.appendChild(groupLabel);
        groupWithLabel.appendChild(checkboxGroup);

        parent.appendChild(groupWithLabel);
    });
    
}

function populateCheckboxGroup(doc, checkboxGroup, domainGroup, defaultDomainGroup, groupIndex){
    for(let i = 0; i < domainGroup.length; i++){
        checkboxGroup.appendChild(createCheckbox(doc, domainGroup[i], i, groupIndex, defaultDomainGroup/* [i] */));
    }

    return checkboxGroup;
}

function createCheckbox(doc, domain, index, groupIndex, defaultDomainGroupS){
    let checkbox = doc.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "domain-checkbox");
    checkbox.setAttribute("name", "checbox-" + groupIndex + "-" + index);
    checkbox.setAttribute("id", "checbox-" + groupIndex + "-" + index);

    let label = doc.createElement("label");
    label.setAttribute("class", "domain-label");
    label.setAttribute("for", "checbox-" + groupIndex + "-" + index);
    //label.innerHTML = domain;
    label.appendChild(doc.createTextNode(domain));

    let checkboxAndLabel = doc.createElement("div");
    checkboxAndLabel.setAttribute("class", "checkbox-and-label");
    checkboxAndLabel.setAttribute("id", "checkbox-and-label-" + groupIndex + "-" + index);

    
    defaultDomainGroupS.forEach((group, index) => {
        console.log(index)
        console.log(group)
        console.log(domain)
        if(group.includes(domain)){
            console.log("included")
            checkbox.checked = true; 
        }
    });


    checkboxAndLabel.appendChild(checkbox);
    checkboxAndLabel.appendChild(label);

    return checkboxAndLabel;
}

function handleCheckbox(checkboxAndLabel){
    let checkboxGroup = checkboxAndLabel.parentNode;
    let groupWithLabel = checkboxGroup.parentNode;
    let groupLabel = groupWithLabel.getElementsByTagName("label")[0];
    
    let label = checkboxAndLabel.getElementsByTagName("label")[0];
    let checkbox = checkboxAndLabel.getElementsByTagName("input")[0];

    checkbox.addEventListener("change", function(event){

        console.log(groupLabel.innerHTML);

        getDataFromStorage/* 3 */(chrome, "popupDomains")    //setting the browser from here goes against functional programming...
            .then(data => {
                let popupDomains = data["popupDomains"];
                let newPopupDomains = null;
                if(event.target.checked){
                    let groupLabelText = groupLabel.innerHTML.replace(groupLabelSuffix, "");
                    console.log("group label text without suffix:     " + groupLabelText);
                    newPopupDomains = addPopupDomain(popupDomains, label.innerHTML, groupLabelText);
                    console.log("true: " + label.innerHTML)

                } else {
                    newPopupDomains = removePopupDomain(popupDomains, label.innerHTML);

                    console.log("false: " + label.innerHTML)
                    console.log(JSON.stringify(newPopupDomains))
                }

                storeDataToStorage(chrome, {popupDomains: newPopupDomains})
            });


    });

}

function handleAllCheckboxGroups(doc, className, handleCheckboxCallback){
    let checkboxGroups = doc.getElementsByClassName(className);

    for(let i = 0; i < checkboxGroups.length; i++){
        handleCheckboxCallback(checkboxGroups[i]);
    }
}

// async function getDataFromStorage3(browser, ...keys){
//     return new Promise((resolve, reject) => {
//         browser.storage.local.get([...keys], function(data){
//             resolve(data);
//         });
//     });
// }

// async function storeDataToStorage(browser, data){
//     return new Promise((resolve, reject) => {
//         browser.storage.local.set(data, function(){
//             resolve("sent");
//         });
//     });
// }

function addPopupDomain(popupDomains, domain, domainGroupName){ //mucho repeato
    popupDomains.forEach(group => { 
        let groupHandle = group.group; 
        let realAltGroup = group.domains; 
        if(groupHandle === domainGroupName){
            if(realAltGroup.length &&   !    realAltGroup.includes(domain)){ 
                realAltGroup.push(domain)
            }            
        }
    });

    return popupDomains;    
}

function removePopupDomain(popupDomains, domain) {
    popupDomains.forEach(group => { 
        let realAltGroup = group.domains; 
        if(realAltGroup.length && realAltGroup.includes(domain)){ 
            realAltGroup.splice(
                realAltGroup.indexOf(domain),
                1
            );
        }
    });

    return popupDomains;
}