// Copyright (c) 2015 by Bryan Giglio. All rights reserved.
// Template from http://stackoverflow.com/questions/20019958/chrome-extension-how-to-send-data-from-content-script-to-popup-html

// Update the relevant fields with the new data
function setDOMInfo(info) {
    document.getElementById('results').innerHTML = info.contents;
    //document.getElementById('total').textContent = info.total;
    //document.getElementById('url').textContent = info.url;
};

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
    // ...query for the active tab...
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', subject: 'DOMInfo'},
            // ...also specifying a callback to be called 
            //    from the receiving end (content script)
            setDOMInfo);
    });
});

// Send pageview data to Google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0]; a.async=1; a.src=g;m.parentNode.insertBefore(a,m)}) (window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-69937631-2', 'auto');
ga('set', 'checkProtocolTask', function(){});
ga('send', 'pageview', '/popup.html');
