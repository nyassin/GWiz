// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Obtain the count of sandwiches from the page URL.

var dictionary = [
    "thank you for your email",
    "looking forward to hearing back soon",
    "hope you had a good day",
    "have a safe flight",
    "test me babe",
    "another test",
    "haha tests",
    "Kindly send it asap, we have already breached the deadline",
    "Let me know if I could be of any more help"

]
var new_dic = [];

$(document).ready(function() {
//   // Handler for .ready() called.
	if(localStorage["array"].length == 0) {
		localStorage["array"] = dictionary;
	}
	console.log("THANKS!")
	
	var mem = localStorage["array"];
	mem = mem.split(",")
	var elem = document.getElementById('options');
	var appendingDiv = "";
	var form = $('#options')
	form.append("<input type='button' value='Add', class='add'>");
	form.append("<input type='submit' value='Save options'>");
	mem.forEach(function(saying) {
		form.append("<li><input type='text', value='" + saying +  "', style='width: 400px;'/> <a class='del', id='" +  new Date().getTime()  + "'>delete</a></li>")
	})
	

	$('#options_form').submit(function() {
  		$('#options li').each(function() {
  			var val = $(this)[0].firstChild.value
  			if(val) {
  				new_dic.push(val);	
  			}
  			
		});
		localStorage["array"] = new_dic
		new_dic = [];
		form.append("<li>YOUR OPTIONS HAEVE BEEN SAVED</li>")
		return false;	
	});
	
	$('.add').bind('click', function() {
		var time = new Date().getTime()
		form.append("<li><input type='text', value='', style='width: 400px;'/> <a class='del', id='"+ time + "'>delete</a></li>")
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

});










