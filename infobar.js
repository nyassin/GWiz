// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Obtain the count of sandwiches from the page URL.
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

var new_dic = [];

$(document).ready(function() {
   // Handler for .ready() called.
	$('#shortcuts_wrapper').hide();
	
	var mem = localStorage["array"];
	var shortcuts = localStorage["shortcuts"];

	if(!mem) {
      localStorage["array"] = dictionary;
      localStorage["shortcuts"] = JSON.stringify(varsdic)	
      mem = localStorage["array"];
      shortcuts = localStorage["shortcuts"];

	}
	mem = mem.split(",")
	shortcuts_form = $('#shortcuts_list')
	var form = $('#phrases_list')

	populatePhrases(mem,form)
	populateShortcuts(shortcuts, shortcuts_form)
	
	$('#shortcuts_button').on('click', function() {
		console.log("SHORTCUTS CLICKED")
		$('#phrases_wrapper').hide();
		$('#shortcuts_wrapper').show();

	})
	$('#phrases_button').on('click', function() {
		console.log("SHORTCUTS CLICKED")
		$('#phrases_wrapper').show();
		$('#shortcuts_wrapper').hide();

	})
	$('#options_form').submit(function() {
  		$('#phrases_list li').each(function() {
  			var val = $(this)[0].firstChild.value
  			if(val) {
  				new_dic.push(val);	
  			}
  			
		});
		localStorage["array"] = new_dic
		new_dic = [];
		form.append("<li>YOUR OPTIONS HAVE BEEN SAVED</li>")
		return false;	
	});
	$('#shortcuts_form').submit(function() {
		var new_dic = [];
  		$('#shortcuts_list li').each(function() {
  			var key = $(this)[0].children[0].value
  			var val = $(this)[0].children[1].value
  			if(val&&key) {
  				new_dic.push({'key': key, 'value':val });	
  			}
		});
		console.log("ADDED THE FOLLOWING")
		console.log(new_dic)
		new_dic = JSON.stringify(new_dic)
		console.log(new_dic)
		localStorage["shortcuts"] = new_dic
		new_dic = [];
		shortcuts_form.append("<li>YOUR OPTIONS HAVE BEEN SAVED</li>")
		return false;	
	});
	$('.add_phrase').bind('click', function() {
		var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
		var uniqid = randLetter + Date.now();
		form.append("<li><input type='text', value='', style='width: 400px;'/> <img src='del.png' width='10' height='10' id='" +  uniqid + "' class='del'></img></li>")
		$("#" + time).click(handler)
		return false;

	})
	$('.add_shortcut').bind('click', function() {
		var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
		var uniqid = randLetter + Date.now();
		shortcuts_form.append("<li><input type='text', value='', style='width: 200px;'/><input type='text', value='', style='width: 200px;'/> <img src='del.png' width='10' height='10' id='" +  uniqid + "' class='del'></img></li>")
		$("#" + time).click(handler)
		return false;

	})
	$('.del').bind('click', function(){
		var id = $(this).attr('id');
		var elem = document.getElementById(id)
		elem.parentElement.remove(); 
	})
	function handler() {
		var id = $(this).attr('id');
		var elem = document.getElementById(id)
		elem.parentElement.remove(); 
	}
	function populatePhrases(mem,form) {
		// var elem = document.getElementById('phrases_list');
		var appendingDiv = "";
		form.append("<input type='button' value='Add Phrase Field', class='add_phrase', style='padding: 10px 15px; font-size:1.3em; border: none;  background-color: #3d94d1; color: white; '>");
		form.append("<input type='submit' value='Save options', style='padding: 10px 15px; font-size:1.3em; border: none; background-color: #3d94d1; color: white; '>");
		mem.forEach(function(saying) {
			var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
			var uniqid = randLetter + Date.now();
			form.append("<li><input type='text', value='" + saying +  "', style='width: 400px;'/> <img src='del.png' width='10' height='10' id='" +  uniqid + "' class='del'></img></li>")
		})
	}
	function populateShortcuts(shortcuts, form) {
		var shortcuts = JSON.parse(shortcuts);
		console.log(shortcuts)
		form.append("<input type='button' value='Add Shortcut Field', class='add_shortcut', style='padding: 10px 15px; font-size:1.3em; border: none;  background-color: #3d94d1; color: white; '>");
		form.append("<input type='submit' value='Save options', style='padding: 10px 15px; font-size:1.3em; border: none;background-color: #3d94d1; color: white; '>");
		shortcuts.forEach(function(shortcut) {
			var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
			var uniqid = randLetter + Date.now();
			form.append("<li><input type='text', value='" + shortcut.key +  "', style='width: 200px;'/><input type='text', value=' " + shortcut.value + "', style='width: 200px;'/> <img src='del.png' width='10' height='10' id='" +  uniqid + "' class='del'></img></li>")
		})	
	}
});










