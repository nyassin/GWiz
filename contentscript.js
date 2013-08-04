// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var regex = /sandwich/gi;
// matches = document.body.innerText.match(regex);
var dictionary = [
    "Thank&nbsp;you for your email",
    "Looking forward to hearing back soon",
    "Hope you had a good day",
    "Have a safe flight",
    "test me babe",
    "another test",
    "haha tests"
]
// var elem =document.activeElement
// $(elem).keypress(function() {
//     console.log("KEY PRESSED!")
// })
var phrases = [];
var new_elem = document.body
var node = [];
var string_inputed = "";
var chosen = "";

$(new_elem).bind('keydown',function(e) {
        var activeEl = document.activeElement;

        var popup = document.getElementById("nuseir")
        if(activeEl.className == "Am aO9 Al editable LW-avf" || activeEl.className == "Am Al editable LW-avf") { 
            console.log(string_inputed)
            if(popup) {
                if(e.keyCode == 13) {
                    
                        e.preventDefault();
                        // $("ul#options li").each(function() { console.log($(this)) });
                        console.log("ultimate")
                        console.log(chosen)
                        // console.log($('#nuseir ul').children[1]);
                        var text = getTextToAppend($('#nuseir ul')[0].children[chosen].innerText, activeEl.firstChild.nodeValue)
                        activeEl.firstChild.nodeValue = activeEl.firstChild.nodeValue + text;
                        activeEl.removeChild(popup)
                }
                if(e.keyCode == 38) {
                    // e.preventDefault();
                if(chosen === "") {
                    chosen = 0;
                } else if(chosen > 0) {
                    chosen--;            
                }

                // $('#nuseir ul')[0].children[chosen].style.backgroundColor = "green"
                return false;
                }

                if(e.keyCode == 40) {
                    // e.preventDefault();
                    // console.log($('li#auto_options:eq(0)')[0].innerText)
                    if(chosen === "") {
                        chosen = 0;
                    } else if((chosen+1) < $('#nuseir ul')[0].children.length) {
                        chosen++; 
                    }
                    // $('li#auto_options').removeClass('selected');
                    console.log("counter")
                    // $('#nuseir ul')[0].children[chosen].style.backgroundColor = "green"
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

                // if(popup) {
                //     node = activeEl.lastChild.previousSibling
                //     if(!node) {
                //         node = activeEl.lastChild.previousSibling.previousSibling
                //     }
                //     console.log(node)
                //     string_inputed = node.nodeValue;
                //     console.log("pop up is not here")
                // } else {
                //     console.log("POP UP IS NOT HERE")
                //     node = activeEl.lastChild
                //     if(node.nodeValue) {
                //         string_inputed = node.nodeValue;    
                //     } else {
                //         string_inputed = node.innerText;    
                //     }
                    
                // }
                node = activeEl.firstChild
                string_inputed = activeEl.firstChild.nodeValue;
                // string_inputed = (node.nodeValue) ? node.innerText : node.innerText;
                console.log(string_inputed)
                var analyzed_string = analyzeIt(string_inputed);
                processIt(analyzed_string, activeEl, phrases)        
            }
        }   
})
function analyzeIt(string_passed) {
    // console.log(string_passed)
    // var split_string =string_passed.split(" ");
    // var popup = document.getElementById("nuseir")
    // if(!popup) {
        // var last_word = split_string[split_string.length - 1]
        // return last_word;    
    // } else {
        return string_passed;
    // }
    

}
function processIt(string_passed, elem, phrases) {
    phrases = [];
    
    //ignore spaces
    if(/\s+$/.test(string_passed)) {
        console.log("HAS SPACE IN IT")
        string_passed = string_passed.substr(0, string_passed.length -1);    
    }
    dictionary.forEach(function(phrase) {
        if(phrase.toLowerCase().indexOf(string_passed.toLowerCase()) == 0) {
            if(phrase.length == string_passed.length) {
                //do nothing
            } else {

                phrases.push(phrase);    
            }
        }
    })
    DisplayResults(phrases, elem);
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
        
        elem.appendChild(domDiv)    
        $('#nuseir ul')[0].children[chosen].style.backgroundColor = "#b3d4fc"
        $('#options li').bind('click', function() {
            var text = getTextToAppend($(this).text(), elem.firstChild.nodeValue)
            node.nodeValue = node.nodeValue + text;
            elem.removeChild(domDiv)
        })
    }
}
function getTextToAppend(full_autocomplete, text_written) {
    return full_autocomplete.slice(text_written.length)
}





