//Nuseir Yassin - Facebook Hackathon 2013. 


//GLOBAL VARIABLES
var phrases = [];
var new_elem = document.body
var node = [];
var string_inputed = "";
var chosen = 0;
var first_match_index = 0;
var node_location = 0;
var xmldata = "";
var xmlhttp = "";
var last_word;
var CaretMain;
var shortcutsArray = [];


chrome.extension.sendRequest({method: "initialize"});

$(new_elem).bind('keydown',function(e) {
        var activeEl = document.activeElement;
        var popup = document.getElementById("nuseir")
        if(activeEl.className == "Am aO9 Al editable LW-avf" || activeEl.className == "Am Al editable LW-avf") { 

            if(popup) {

                //IF ENTER
                if(e.keyCode == 13) {
                    e.preventDefault();
                    console.log("INDEX IS " + first_match_index + " and node value is : " + node.nodeValue)
                    var amount_to_slice = node.nodeValue.substring(first_match_index, node.nodeValue.length -1 );
                    console.log(amount_to_slice)
                    var text = getTextToAppend($('#nuseir ul')[0].children[chosen].innerText,  amount_to_slice);
                    node.nodeValue = node.nodeValue + text;
                    node.parentElement.removeChild(popup)
                    putCaretToFrontPosition();
                    chosen = 0;
                    first_match_index = 0;
                    
                }

                //IF ARROW UP
                if(e.keyCode == 38) {
                    if(chosen > 0) {
                        chosen--;            
                    } else {
                        chosen = $('#nuseir ul')[0].children.length;
                    }
                    return false;
                }
                //IF ARROW DOWN
                if(e.keyCode == 40) {
                    if((chosen+1) < $('#nuseir ul')[0].children.length) {
                        chosen++; 
                    } else {
                        chosen = 0;
                    }
                    return false;
                }
        }   
    }
})


$(new_elem).bind('keyup',function(e) {
        var activeEl = document.activeElement;
        var popup = document.getElementById("nuseir")
        if(activeEl.className == "Am aO9 Al editable LW-avf" || activeEl.className == "Am Al editable LW-avf") {
            CaretMain =document.getSelection();
            node = CaretMain.baseNode
            if(e.keyCode != 32 && node.nodeValue != null && CaretMain.baseOffset == node.nodeValue.length ) {
                console.log("caret at length")
                string_inputed = node.nodeValue;
                
                var analyzed_string = getLastWord(string_inputed, activeEl);
                if (/\S/.test(analyzed_string)) {
                    // string is not empty and not just whitespace
                    updateShortcutsArray();
                    if(!xmldata) {
                        if($.inArray(analyzed_string, shortcutsArray) !== -1) {
                            replaceShortCutWithInfo(analyzed_string, activeEl);
                        } else {
                            FindMatchesFromDicAndDisplayResults(analyzed_string, activeEl)   
                        }
                    }    
                } else {
                    //backspace issues
                    if(popup) {
                        node.parentElement.removeChild(popup)    
                    }
                    

                } 
            } else {
                console.log("caret not at right position ")

                if(popup && e.keyCode!=32) {
                    console.log(e.keyCode)
                    console.log("POP UP IS HERE")
                    node.removeChild(popup)
                    // if(node.parentElement.className == "Am aO9 Al editable LW-avf" || node.parentElement.className == "Am Al editable LW-avf") {
                    //     console.log(node.parentElement)
                    //     node.removeChild(popup)    
                    // } else {
                    //     node.removeChild(popup)
                    // }
                    
                }

            }
        
        }   
})
function updateShortcutsArray() {
    chrome.extension.sendRequest({method: "getLocalStorage", key: "shortcuts"}, function(response) {
        shortcutsArray = [];
         var all_data = JSON.parse(response.array);
         all_data.forEach(function(shortcut) {
            shortcutsArray.push(shortcut.key)
         })
    })
}
function getLastWord(string_passed, activeEl) {
    if(CaretMain.baseOffset != 0) {
        var string_passed = string_passed.substring(0, CaretMain.baseOffset)    
    }

    var popup = document.getElementById("nuseir")
     
    if(popup) {
        var last_phrase = string_passed.substring(first_match_index);
        return last_phrase;
    } else {
        
        var count = [];
        count = string_passed.match(/@/g);
        if(count) {
            if(count.length == 2) {
                var first = string_passed.indexOf('@');
                var last = string_passed.lastIndexOf('@');

                if(!xmlhttp) {
                    searchWolframAlpha(string_passed, string_passed.substring(first + 1, last), activeEl);
                }    
            }
        }
        //return last word
        var split_string =string_passed.split(" ");    
        var last_word_extracted = split_string[split_string.length - 1]
        if(last_word_extracted) {
            last_word = last_word_extracted;
        } else {
            activeEl.removeChild(popup)
        }
        return last_word_extracted;
    }
}

function searchWolframAlpha(full_string, query_string, activeEl) {
    var url = "http://api.wolframalpha.com/v2/query?input=#query#&appid=WA98HE-2AT2K78RJ4"
    url = url.replace("#query#", query_string);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",url,false);  // the third param sets async=false
    xmlhttp.send();
    xmldata = xmlhttp.responseXML;
    var results = "";
    var foundEl = false
     $(xmldata).find("pod").each(function() {
        if($(this).attr('id') == "Result"){
            foundEl = $(this);
        }
     })
     if(foundEl){
            var result = foundEl[0].childNodes[1]
            var result = $(result).text();
            DisplayWolframResults(full_string, query_string, result)
    } else {
            DisplayWolframResults(full_string, query_string, "No Results Found")
    }
     xmldata = "";
     xmlhttp = "";
}

function DisplayWolframResults(full_string, query, result) {
    full_string = full_string.replace("@" + query + "@", result)
    console.log(full_string)
    full_string = full_string.replace(/[\r\n]/g, '');
    var string_new = full_string.replace("@" + query + "@", result);    
    node.nodeValue = string_new;
    putCaretToFrontPosition();
}
function FindMatchesFromDicAndDisplayResults(string_passed, phrases, activeEl) {
    var local_phrases = [];
    chrome.extension.sendRequest({method: "getLocalStorage", key: "array"}, function(response) {
        var dictionary = response.array.split(",")
        //ignore spaces
        if(/\s+$/.test(string_passed)) {
            string_passed = string_passed.substr(0, string_passed.length -1);    

        }
        console.log(string_passed)
        dictionary.forEach(function(phrase) {
            if(phrase.toLowerCase().indexOf(string_passed.toLowerCase()) == 0) {
                if(phrase.length != string_passed.length) {
                console.log("match at " + phrase)

                    first_match_index = string_inputed.toLowerCase().lastIndexOf(string_passed.toLowerCase());
                    console.log(first_match_index)
                    local_phrases.push(phrase);    
                }

            }
        })

        DisplayResults(local_phrases, activeEl);

    })
}

function replaceShortCutWithInfo(analyzed_string, activeEl) {
    
    chrome.extension.sendRequest({method: "getLocalStorage", key: "shortcuts"}, function(response) {

        console.log("ARRAY OF SHORTCUTS")

        var replacement;
        var shortcuts = JSON.parse(response.array);
        console.log(shortcuts)
        shortcuts.forEach(function(shortcut){
            if(shortcut.key == analyzed_string) {
                replacement = shortcut.value;
            }
        })

        var start = node.nodeValue.lastIndexOf(analyzed_string)
        node.nodeValue = node.nodeValue.substring(0, start) + " " + replacement;
        putCaretToFrontPosition();    
        
    })
        
}
function DisplayResults(results, elem) {
    var popup = document.getElementById("nuseir")
    var elem = document.activeElement;

    if(popup) {
         node.parentElement.removeChild(popup)   
    }
    if(!results.length == 0) {
        var domDiv = document.createElement("div");
        domDiv.className = "autocompleter"
        domDiv.setAttribute('id', "nuseir")
        domDiv.style.width = "300px"
        domDiv.style.height = "auto"
        domDiv.style.backgroundColor = "white"
        domDiv.style.border = "1px solid gray"
        var appendingDiv = "<div>"
        + "<ul id='options', style='list-style-type: none; padding:8px; margin: 0; font-size: 1.2; font-style: sans-serif;' >";
        results.forEach(function(result) {
            appendingDiv = appendingDiv + "<li style='padding: 5px;'>" + result + "</li>"
        })
        appendingDiv = appendingDiv + "</ul></div>"
        domDiv.innerHTML = appendingDiv;
        
        node.parentElement.appendChild(domDiv)    
        // chosen = 0;
        
        $('#nuseir ul')[0].children[chosen].style.backgroundColor = "#b3d4fc"
        // $('#nuseir').attr('readonly', 'true');

        $('#options li').bind('click', function() {
            var amount_to_slice = node.nodeValue.substring(first_match_index, node.nodeValue.length -1 );
            var text = getTextToAppend($('#nuseir ul')[0].children[chosen].innerText,  amount_to_slice);    
            node.nodeValue = node.nodeValue + text;
            console.log(node)
            node.parentElement.removeChild(popup)
            putCaretToFrontPosition();
            chosen = 0;
            first_match_index = 0;  
        })
    }
}
function getTextToAppend(full_autocomplete, text_written) {
    
    return full_autocomplete.toLowerCase().slice(text_written.length + 1);

}
function putCaretToFrontPosition() {
    var selection = CaretMain;        
    var range = document.createRange();
    console.log(range)
    range.selectNodeContents(node);
    range.setStart(node, node.nodeValue.length);
    selection.removeAllRanges();
    selection.addRange(range);
}




