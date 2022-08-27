console.log("start of the bg script")

chrome.runtime.onMessage.addListener(payload => {

    console.log("message received from the delete bg script")

    chrome.downloads.download(
        payload,
        () => console.log("should open file explorer")
    );
})