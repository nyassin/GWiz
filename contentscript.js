//Nuseir Yassin - Facebook Hackathon 2013. 


//GLOBAL VARIABLES
var phrases = [];
var new_elem = document.body
var node = [];
var string_inputed = "";
var chosen = 0;
var first_match_index = 0;
var node_value = "";
var node_location = 0;
var xmldata = "";
var xmlhttp = "";
var last_word;
var CaretMain;
var shortcutsArray = [
    "@date",
    "@myname",
    "@tftc",
    "@wsig"
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
                console.log(node_value)
                if(e.keyCode == 13) {
                    e.preventDefault();
                    console.log("INDEX IS " + first_match_index + " and node value is : " + node.nodeValue)
                    var amount_to_slice = node.nodeValue.substring(first_match_index, node.nodeValue.length -1 );
                    console.log(amount_to_slice)
                    if(first_match_index == 0) {

                        var text = getTextToAppend($('#nuseir ul')[0].children[chosen].innerText,  amount_to_slice)    
                    } else {
                        var text = getTextToAppend($('#nuseir ul')[0].children[chosen].innerText,  node.nodeValue.substring(first_match_index, node.nodeValue.length -1))
                    }
                    node.nodeValue = node.nodeValue + text;
                    node.parentElement.removeChild(popup)
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
            console.log(CaretMain)
            

            if(e.keyCode != 32) {

                node = CaretMain.baseNode
                string_inputed = node.nodeValue;
                
                var analyzed_string = getLastWord(string_inputed, activeEl);
                if(!xmldata) {
                    if($.inArray(analyzed_string, shortcutsArray) !== -1) {
                        replaceShortCutWithInfo(analyzed_string, activeEl);
                    } else {

                        FindMatchesFromDicAndDisplayResults(analyzed_string, activeEl)   
                    }
                }
            }
        
        }   
})

function getLastWord(string_passed, activeEl) {
    // console.log(string_passed)
    if(CaretMain.baseOffset != 0) {
        var string_passed = string_passed.substring(0, CaretMain.baseOffset)    
    }

    var popup = document.getElementById("nuseir")
     
    if(popup) {
        var last_phrase = string_passed.substring(first_match_index);
        return last_phrase;
    } else {
        //return last word
        if(string_passed) {
            var split_string =string_passed.split(" ");    
            var last_word_extracted = split_string[split_string.length - 1]
            if(last_word_extracted) {
                last_word = last_word_extracted;
                return last_word_extracted;
            } else {
                activeEl.removeChild(popup)
                return "";
            }
        } else {
            return "";
        }
    }
}

// function searchWolframAlpha(full_string, query_string, activeEl) {
//     var url = "http://api.wolframalpha.com/v2/query?input=#query#&appid=WA98HE-2AT2K78RJ4"
//     url = url.replace("#query#", query_string);
//     // console.log(url)
//         xmlhttp = new XMLHttpRequest();
//         xmlhttp.open("GET",url,false);  // the third param sets async=false
//         xmlhttp.send();
//         xmldata = xmlhttp.responseXML;
//     var results = "";
//      $(xmldata).find("pod").each(function() {

//         if($(this).attr('id') == "Result"){
//             var result = $(this)[0].childNodes[1]
//             var result = $(result).text();
//             // result = result.replace(/<(?:.|\n)*?>/gm, '');

//             // console.log(results)
//             DisplayWolframResults(full_string, query_string, result, activeEl)

//         }
//      })
//      xmldata = "";
//      xmlhttp = "";
     

// }
// function DisplayWolframResults(full_string, query, result, activeEl) {
//     full_string = full_string.replace("@" + query + "@", result)
//     console.log(full_string)

//     // if(node_location == 0) {
//             // activeEl.firstChild.nodeValue = activeEl.firstChild.nodeValue.replace("@" + query + "@", result);
//     // } else {
//     full_string = full_string.replace(/[\r\n]/g, '');
//     var string_new = full_string.replace("@" + query + "@", result);    
    

//     // console.log(string_new)
//     activeEl.childNodes[node_location].innerText = string_new;
//     console.log(activeEl.childNodes[node_location].innerText)
//     // }
//     // global_response = result;

// }
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
        case "@wsig":
            replacement = "Personal Financier and Professional Philanthropist. \n 159 W 25th Street, New York, NY 10001 \n Phone: 773.490.1404"
            break;
    }

    var start = node.nodeValue.lastIndexOf(analyzed_string)
    node.nodeValue = node.nodeValue.substring(0, start) + " " + replacement;
    
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

        // $('#options li').bind('click', function() {
        //     var text = getTextToAppend($(this).text(), elem.firstChild.nodeValue.substr(general_location, elem.firstChild.nodeValue.length -1 ))
        //     node.nodeValue = node.nodeValue + text;
        //     elem.removeChild(domDiv)
        // })
    }
}
function getTextToAppend(full_autocomplete, text_written) {
    return full_autocomplete.toLowerCase().slice(text_written.length + 1);

}





