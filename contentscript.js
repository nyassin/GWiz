// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var regex = /sandwich/gi;
// matches = document.body.innerText.match(regex);
var dictionary = [
    "Thank you for your email",
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


$(new_elem).bind('keydown',function(e) {
        var activeEl = document.activeElement;

        var popup = document.getElementById("nuseir")
        if(activeEl.className == "Am aO9 Al editable LW-avf" || activeEl.className == "Am Al editable LW-avf") { 
            console.log(string_inputed)
            if(popup) {
                if(e.keyCode == 13) {
                    
                        e.preventDefault();    
                        var text = getTextToAppend($('#options').find('li:first').text(), activeEl.firstChild.nodeValue)
                        activeEl.firstChild.nodeValue = activeEl.firstChild.nodeValue + text;
                        activeEl.removeChild(popup)
                }
                if(e.keyCode == 38) {
                    e.preventDefault();
                }
                if(e.keyCode == 40) {
                    e.preventDefault();
                }
        }   
    }
})


$(new_elem).bind('keyup',function(e) {
        var activeEl = document.activeElement;
        var popup = document.getElementById("nuseir")

        if(activeEl.className == "Am aO9 Al editable LW-avf" || activeEl.className == "Am Al editable LW-avf") {

            if(activeEl.innerText != "") {

                if(popup) {
                    node = activeEl.lastChild.previousElementSibling
                    console.log("pop up is not here")
                } else {
                    console.log("POP UP IS NOT HERE")
                    node = activeEl.lastChild
                }
                
                string_inputed = (node.nodeValue) ? node.nodeValue : node.innerText;
                console.log(string_inputed)
                processIt(string_inputed, activeEl, phrases)        
            }
        }   
})

function processIt(string_passed, elem, phrases) {
    phrases = [];
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
        domDiv.style.width = "600px"
        domDiv.style.height = "auto"
        domDiv.style.backgroundColor = "white"
        domDiv.style.border = "2px solid black"
        var appendingDiv = "<div><ul id='options', style='list-style-type: none; padding:5px; margin: 0;'>";
        results.forEach(function(result) {
            appendingDiv = appendingDiv + "<li>" + result + "</li>"
        })
        appendingDiv = appendingDiv + "</ul>"
        domDiv.innerHTML = appendingDiv;
        
        elem.appendChild(domDiv)    
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




