//Nuseir Yassin - Facebook Hackathon 2013. 


//GLOBAL VARIABLES
var phrases = [];
var new_elem = document.body
var node = [];
var string_inputed = "";
var chosen = "";
var general_location = 0;
var node_value = "";
var node_location = 0;



var shortcutsArray = [
    "@date",
    "@myname",
    "@tftc"
]

// chrome.extension.sendRequest({
//     type: "popup_var",  In my extensions, because I could often be different types of reqeusts, I use a type variable to identify them 
//     my_variable: dictionary

//     /* Whatever variable you are trying to send */
// });



$(new_elem).bind('keydown',function(e) {
        var activeEl = document.activeElement;
        var popup = document.getElementById("nuseir")
        if(activeEl.className == "Am aO9 Al editable LW-avf" || activeEl.className == "Am Al editable LW-avf") { 

            if(popup) {

                //IF ENTER
                if(e.keyCode == 13) {
                    e.preventDefault();
                    console.log(general_location)
                    if(general_location != 0) {
                        var text = getTextToAppend($('#nuseir ul')[0].children[chosen].innerText,  node_value.substr(general_location, node_value.length -1 ))    
                    } else {
                        var text = getTextToAppend($('#nuseir ul')[0].children[chosen].innerText,  node_value.substr(general_location, node_value.length))
                    }
                    if(node_location == 0) {
                        activeEl.firstChild.nodeValue = activeEl.firstChild.nodeValue + text;
                    } else {
                        activeEl.childNodes[node_location].innerText = node_value + text;    
                    }
                    activeEl.removeChild(popup)
                    general_location = 0;
                }

                //IF ARROW UP
                if(e.keyCode == 38) {
                if(chosen === "") {
                    chosen = 0;
                } else if(chosen > 0) {
                    chosen--;            
                }
                return false;
                }

                //IF ARROW DOWN
                if(e.keyCode == 40) {
                    if(chosen === "") {
                        chosen = 0;
                    } else if((chosen+1) < $('#nuseir ul')[0].children.length) {
                        chosen++; 
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
            

            if(activeEl.innerText != "") {

                var all_lines = activeEl.innerText.split('\n')

                var lastNode = findLastDiv(all_lines, activeEl)
                node = lastNode;
                if(!node.nodeValue) {
                    node_value = node.innerText;
                } else {
                    node_value = node.nodeValue
                }
                string_inputed = lastNode.innerHTML;
                if(!string_inputed) {
                    string_inputed = activeEl.firstChild.nodeValue;
                    node_value = activeEl.firstChild.nodeValue;
                }
                var analyzed_string = analyzeIt(string_inputed);
                
                if($.inArray(analyzed_string, shortcutsArray) !== -1) {
                    console.log("RESERVED KEYWORD!!!")
                    replaceShortCutWithInfo(analyzed_string, activeEl);
                } else {
                    processIt(analyzed_string, activeEl, phrases)            
                }
                
            }
        }   
})

function findLastDiv(all_lines, activeEl) {
    var offset;
    var popup = document.getElementById("nuseir")
    console.log(all_lines);


    if(popup) {
        offset = $('#nuseir ul')[0].children.length

    } else {
        offset = 0;
    }
    console.log(offset)
    if(all_lines.length > 2 + offset) {
        // console.log(activeEl.childNodes[all_lines.length - 2].innerText)
        if(activeEl.childNodes[all_lines.length - 2 - offset]) {
            node_location = all_lines.length - 2 - offset;
            return activeEl.childNodes[node_location]        
        }
        
    } else {
        console.log("FIRST LINE!!!!")
        node_location = all_lines.length - 1 - offset;
        console.log("NODE LOCATION " + node_location)
        console.log(activeEl.firstChild.nodeValue)

        return activeEl.firstChild.nodeValue;
    }
    
    
}
function analyzeIt(string_passed) {
    // console.log(string_passed)
    var split_string =string_passed.split(" ");
    var popup = document.getElementById("nuseir")
    if(!popup) {
        var last_word = split_string[split_string.length - 1]
        console.log(last_word)
        return last_word;    
    } else {
        var general = string_passed.substring(general_location);

        return general;
    }
    

}
function processIt(string_passed, elem, phrases) {
    phrases = [];
    chrome.extension.sendRequest({method: "getLocalStorage", key: "array"}, function(response) {
        console.log("LAODED MY SHIT BACK")
        var dictionary = response.array.split(",")
        console.log(dictionary)
        
        //ignore spaces
        if(/\s+$/.test(string_passed)) {
            string_passed = string_passed.substr(0, string_passed.length -1);    
        }
        dictionary.forEach(function(phrase) {
            if(phrase.toLowerCase().indexOf(string_passed.toLowerCase()) == 0) {
                if(phrase.length == string_passed.length) {
                    //do nothing
                } else {
                    general_location = string_inputed.toLowerCase().lastIndexOf(string_passed);
                    // console.log("GENERAL LOCATION" + "  " + general_location);
                    phrases.push(phrase);    
                }
            }
        })
        DisplayResults(phrases, elem);

    }); 
}

function replaceShortCutWithInfo(analyzed_string, activeEl) {
    
    var replacement;
    switch(analyzed_string) 
    {
        case "@date":
            replacement = new Date();
            var day = replacement.getUTCDate();
            var month = replacement.getMonth();
            var year = replacement.getFullYear();
            replacement = month + "/" + day + "/" + year;
            break;
        case "@myname":
            replacement = "Nuseir Yassin";
            break;
        case "@tftc":
            replacement = "Too frat to care";
            break;
    }

    if(node_location == 0) {
       var start = activeEl.firstChild.nodeValue.lastIndexOf(analyzed_string)
       activeEl.firstChild.nodeValue = activeEl.firstChild.nodeValue.substring(0, start) + " " + replacement;
    } else {
        var start = activeEl.childNodes[node_location].innerText.lastIndexOf(analyzed_string)
        activeEl.childNodes[node_location].innerText = node_value.substring(0, start) + " " + replacement;    
    }

}
function DisplayResults(results, elem) {
    var popup = document.getElementById("nuseir")
    if(popup) {
         elem.removeChild(popup)   
    }
    if(!results.length == 0) {
        var domDiv = document.createElement("div");
        domDiv.className = "autocompleter"
        domDiv.setAttribute('id', "nuseir")
        domDiv.style.width = "300px"
        domDiv.style.height = "auto"
        domDiv.style.backgroundColor = "white"
        domDiv.style.border = "1px solid gray"
        var appendingDiv = "<div><ul id='options', style='list-style-type: none; padding:8px; margin: 0; font-size: 1.2; font-style: sans-serif;' >";
        results.forEach(function(result) {
            appendingDiv = appendingDiv + "<li style='padding: 5px;'>" + result + "</li>"
        })
        appendingDiv = appendingDiv + "</ul>"
        domDiv.innerHTML = appendingDiv;
        
        // var  = document.getElementsByClassName("stopButton")[0];

        elem.appendChild(domDiv)    
        $('#nuseir ul')[0].children[chosen].style.backgroundColor = "#b3d4fc"
        $('#options li').bind('click', function() {
            var text = getTextToAppend($(this).text(), elem.firstChild.nodeValue.substr(general_location, elem.firstChild.nodeValue.length -1 ))
            node.nodeValue = node.nodeValue + text;
            elem.removeChild(domDiv)
        })
    }
}
function getTextToAppend(full_autocomplete, text_written) {
    return full_autocomplete.toLowerCase().slice(text_written.length);

}





