/**
 * Handles requests sent by the content script.  Shows an infobar.
 */
function onRequest(request, sender, sendResponse) {
  // The number of matches is sent in the request - pass it to the
  // infobar.
  if(request.method == "initialize") {
    initialize();
  }
  if (request.method == "getLocalStorage") {
      if(request.key == "array") {
        sendResponse({array: localStorage['array']});    
      }

      if(request.key == "shortcuts") {
       sendResponse({array: localStorage['shortcuts']});     
      }
    

  }

  if(request.type == "popup_var"){
      /* The type of message has been identified as the variable for our popup, let's save it to localStorage */
      localStorage["array"] = request.my_variable;
      console.log(" IM IN BACKGROUND!!!!!")

      // console.log(localStorage)
  }

  sendResponse({});
};

function initialize(request, sender, sendResponse) {
    var dictionary = [
      "Thank you for your email.",
      "Looking forward to hearing back from you.",
      "Hope this email finds you well",
      "Have a good weekend!",
      "Let me know if I could be of any more help",
      "Dear Sir/Madam",
      "Best Regards"
  ]
  var varsdic = [
      {"key": "@testname", "value": "Nuseir Yassin"}
  ]
  if(!localStorage['array']) {
      localStorage["array"] = dictionary;
      localStorage["shortcuts"] = JSON.stringify(varsdic)
  }
  console.log("Initialized.")
  sendResponse({});
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
