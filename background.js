/**
 * Handles requests sent by the content script.  Shows an infobar.
 */
function onRequest(request, sender, sendResponse) {
  // The number of matches is sent in the request - pass it to the
  // infobar.
  if (request.method == "getLocalStorage") {
    sendResponse({array: localStorage['array']});

  }

  if(request.type == "popup_var"){
      /* The type of message has been identified as the variable for our popup, let's save it to localStorage */
      localStorage["array"] = request.my_variable;
      console.log(" IM IN BACKGROUND!!!!!")

      // console.log(localStorage)
  }

  sendResponse({});
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
