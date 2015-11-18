// Copyright (c) 2015 by Bryan Giglio. All rights reserved.
// Template from http://stackoverflow.com/questions/20019958/chrome-extension-how-to-send-data-from-content-script-to-popup-html

// Inform the background page that this tab should have a page-action
chrome.runtime.sendMessage({
    from:    'content',
    subject: 'showPageAction'
});

function getTextWithSelector(selector, separatorString, separatorInterval) {
    // This funtion recieves two strings as input
    // The first string is the selectors to search for and the second is the 
    // separator used between multiple found tags.

    // Default separatorInterval to 1.
    if (!separatorInterval) {
        var separatorInterval = 1;
        console.log('hello');
    }
    console.log('hello2');

    // Initialize default value
    var textResult = 'Not found.';
    var queryResult = document.querySelectorAll(selector);
    console.log('Selector = ' + selector + '<br>SepString = ' + separatorString + '<br>SepInt' + separatorInterval);
    console.log('query length = ' + queryResult.length);

    if (queryResult.length === 1) {
        textResult = (String(queryResult[0].textContent)).trim();
        console.log('hello3');
    }


    else if (queryResult.length > 1) {
        console.log('hello4');
        textResult = '';
        for (var index = 0; index < (queryResult.length-separatorInterval); index += separatorInterval) {
            console.log('index = ' + index);
            for (var subIndex = 0; subIndex < separatorInterval; ++subIndex) {
                textResult = textResult + (String(queryResult[index+subIndex].textContent)).trim();
                console.log('subIndex = ' + subIndex);
                console.log(textResult);

            };

            textResult = textResult + separatorString;
            console.log('index = ' + index);

            console.log(textResult);


        };
        console.log('index = ' + index);

        for (var subIndex = 0; subIndex < separatorInterval; ++subIndex) {
                textResult = textResult + (String(queryResult[index+subIndex].textContent)).trim();
        };
    };

    return textResult

};

// function getTextWithSelector(selector, separatorString) {
//     // This funtion recieves two strings as input
//     // The first string is the selectors to search for and the second is the 
//     // separator used between multiple found tags.

//     // Initialize default value
//     var textResult = 'Not found.';
//     var queryResult = document.querySelectorAll(selector);
//     if (queryResult.length == 1) {
//         textResult = (String(queryResult[0].textContent)).trim();
//     }
//     else if (queryResult.length > 1) {
//         textResult = '';
//         for (var index = 0; index < queryResult.length-1; ++index) {
//             textResult = textResult + (String(queryResult[index].textContent)).trim() + separatorString;
//         };
//         textResult = textResult + (String(queryResult[index].textContent)).trim();
//     };

//     return textResult

// };


function formatBiblioDescriptionListPairs (descriptionList, separatorString) {
    var textResult = '';
    for (var index = 0; index < descriptionList.length-2; index+2) {
        textResult = textResult + descriptionList[index].trim() + descriptionList[index+1].trim() + separatorString;
    };
    textResult = textResult + descriptionList[index].trim() + descriptionList[index+1].trim();

    return textResult;
};

function scrubTabAndLineWhiteSpace (inputString) {
    var outputString = '';
    for (var index = 0 ; index < inputString.length ; ++index) {
        outputString = outputString + inputString[index].replace(/\n|\r|\0|\t/, '');
    };
    return outputString
};

function parseIEEE() {


    var title = getTextWithSelector('.title h1', '');
    console.log(title);

    var authors = getTextWithSelector('div.art-authors a', ' ; ');
    console.log(authors);

    var biblioWhole = getTextWithSelector('div.article-ftr', '');
    //console.log(biblioWhole);

    var biblioBottom = getTextWithSelector('div.article-ftr div:nth-child(n+4)', '');
    //console.log(biblioBottom);

    var biblioTop = biblioWhole.replace(biblioBottom, '');
    console.log(biblioTop);
    biblioTop = scrubTabAndLineWhiteSpace(biblioTop);
    console.log(biblioTop);
    //console.log(biblioTop);

    // var biblioTopClean = '';
    // for (var index = 0 ; index < biblioTop.length ; ++index) {
    //     biblioTopClean = biblioTopClean + biblioTop[index].replace(/\n|\r|\0|\t/, '');
    // };

    // console.log(biblioTopClean);

    // var biblioBottom1 = getTextWithSelector('div.article-info dl:nth-child(1)', '');
    // console.log(scrubTabAndLineWhiteSpace(biblioBottom1));
 
    // var biblioBottom2 = getTextWithSelector('div.article-info dl:nth-child(2)', '');
    // console.log(scrubTabAndLineWhiteSpace(biblioBottom2));

    var biblioBottom = getTextWithSelector('div.article-info dl > *', ' ; ', 2);

    console.log(biblioBottom);
    console.log(scrubTabAndLineWhiteSpace(biblioBottom));

    biblioFull = biblioTop + " ; " + biblioBottom;

    // console.log('Tab Test = ' + (/\t/).test(biblioTop));
    // console.log('First White Test = ' + (/^\s/).test(biblioTop));
    // console.log('Last White Test = ' + (/\s$/).test(biblioTop));
    // console.log('Null Test = ' + (/\0/).test(biblioTop));
    // console.log('Carriage Return Test = ' + (/\r/).test(biblioTop));
    // console.log('New Line Test = ' + (/\n/).test(biblioTop));







    var abstract = getTextWithSelector('div.article p', '');
    console.log(abstract);

    output = [title, authors, biblioFull, abstract];

    return output;



};




// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    // First, validate the message's structure
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
        // Collect the necessary data 

        // Initialize result output text for no result found.
        var combinedResultText = 'N/A';
        var titleText = 'Title: N/A';
        var authorNameText = 'Author(s): N/A';
        var biblioDataText = 'Bibliographic Data: N/A';
        var sourceDataText = 'Location by: N/A';
        var abstractText = 'Abstract: N/A';

        
        // Extract page URL to determine DOM parsing method
        var url = window.location.href;        

        // Check for IEEE results page URLs
        if ((/ieeexplore.ieee.org\/xpl\/articleDetails.jsp/).test(url)) {
            //combinedResultText = parseIEEE();
            var extractedDOMData = parseIEEE();
            var locatedVia = 'Located via IEEE Xplore';

            combinedResultText = extractedDOMData[0] + '<br>' + extractedDOMData[1] + '<br>' + extractedDOMData[2] + '<br>' + locatedVia + '<br>' + extractedDOMData[3];
            console.log('insideresultpage');
            console.log(combinedResultText);
        };

        // // Check for second version of Google Patents     
        // else if ((/tbm=pts/).test(url)) {
        //     // Find elements containing patent data
        //     patentlinks = document.querySelectorAll('._Rm');

        //     if (patentlinks.length > 1) {
        //         results = '';
        //     }

        //     // Check for advertisement in first element and skip it
        //     if (!((/google.com/).test(patentlinks[0].textContent))) {
        //         var start = 1;
        //     } else {var start = 0};

        //     // Remove HTML and junk and build list of patent numbers
        //     for (var index = start ; index < patentlinks.length ; index++) {
        //         var patenturl = String(patentlinks[index].textContent);

        //         results = results + patenturl.replace('www.google.com/patents/', '').replace('?cl=en', '') + '<br>';
        //     }
        // };

        var domInfo = {
            contents: combinedResultText
            //total:   document.querySelectorAll('*').length,
            //url: url
        };
    
        // Directly respond to the sender (popup), 
        // through the specified callback */
        response(domInfo);
    }
});