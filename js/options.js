document.addEventListener("DOMContentLoaded", init);

function init(){

}

function populateChecboxes(){
    
}

function createChecboxGroup(index, domain){
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "domain-checkbox");
    checkbox.setAttribute("name", "checbox-" + index);

    let label = document.createElement("label");
    label.setAttribute("for", "checbox-" + index);
    label.innerHTML = domain;
}

async function getDataFromStorage(browser, ...keys){
    return new Promise((resolve, reject) => {
        browser.storage.local.get([...keys], function(data){
            resolve(data);
        });
    });
}