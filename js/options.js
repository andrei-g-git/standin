document.addEventListener("DOMContentLoaded", init);

function init(){
    listenDomainSubmission(document, "video");
}

function listenDomainSubmission(doc, affix){
    let videoDomainForm = doc.getElementById(`${affix}-domain-form`);
    if(videoDomainForm){
        videoDomainForm.addEventListener("submit", function(event){
            event.preventDefault();

            const form = event.target;
            const textField = form.elements[`${affix}-domain-textfield`];

            console.log(textField.value);



            //validateDomain(domain, validDomains);
        });        
    }

}