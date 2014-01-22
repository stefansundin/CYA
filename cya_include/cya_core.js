/*
* Copy YouTube Annotations - Core
* Version: 2.0.0
* Copyright 2013 ZSleyerLP.de
*/


// COPY YOUTUBE ANNOTATIONS

function extract_ids(str) {
	if (str == null) return str;
	return str.replace(/.*?([\?&]v=|[\?&]video_id=|youtu.be\/)([^&\?#\s]+)[\S]*/g, '$2');
}

function get() {
	var video_id = extract_ids(document.getElementById('data').value);
	if (!video_id) return alertmessage('You have to enter a VideoID before proceeding!');
	var xmlHttp = null;
try {
    // Mozilla, Opera, Safari sowie Internet Explorer (ab v7)
    xmlHttp = new XMLHttpRequest();
} catch(e) {
    try {
        // MS Internet Explorer (ab v6)
        xmlHttp  = new ActiveXObject("Microsoft.XMLHTTP");
    } catch(e) {
        try {
            // MS Internet Explorer (ab v5)
            xmlHttp  = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            xmlHttp  = null;
        }
    }
}
if (xmlHttp) {
    xmlHttp.open('GET', '/get-annotation.php?id='+video_id, true);
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
			document.getElementById('data').value = xmlHttp.responseText;
        }
    };
    xmlHttp.send(null);
}
}

function gethelp(e) {
	if (e.keyCode == 13) get();
}

function checkxml() {
	var data = document.getElementById('data').value;
	var warn = document.getElementById('ampersand_warning');
	//var ret = /&(?!amp;)/.exec(data);
	var ret = /&(?!([a-zA-Z][a-zA-Z0-9]*|(#\d+));)/.exec(data);
	if (ret == null) {
		warn.style.visibility = 'hidden';
	}
	else {
		warn.style.visibility = 'visible';
	}
}

function getxml() {
	var data = document.getElementById('data').value;
	if (!data) return alertmessage('You have to enter the XML-Data before proceeding!');
	data = data.replace(/<\?xml[^>]*\?>/, ''); //https://bugzilla.mozilla.org/show_bug.cgi?id=336551
	data = data.replace(/annotations>/g, 'updatedItems>'); //rename <annotations> to <updatedItems>
	
	// insert requestHeader and authenticationHeader, if not already present
	var ret = /<authenticationHeader/.exec(data);
	if (ret == null) {
		data = data.replace(/<document.*?>/, '$&<requestHeader video_id="" /><authenticationHeader auth_token="" />');
	}
	
	// remove InVideo Programming
	data = data.replace(/<annotation [^>]*?id="channel:[\S\s]*?<\/annotation>/g, '');
	
	return data;
}

function log(s,e) {
	document.body.appendChild(document.createTextNode(s));
	if (e) document.body.appendChild(e);
	document.body.appendChild(document.createTextNode('.'));
	document.body.appendChild(document.createElement('br'));
}


// Meldungen
function alertmessage(message) {
	// Meldungen
	if ($('#alert').length) {
		$("#alert").remove();
	}
	if ($('#alertoverlay').length) {
		$("#alertoverlay").remove();
	}
	jQuery('body').prepend('<div id="alert" style="display:none;">' + message + '</div><div id="alertoverlay" style="display:none;"></div>');
	jQuery('#alert').fadeIn('slow');
	jQuery('#alertoverlay').fadeIn('slow');
	$('body,html').animate({
		scrollTop: 0
		}, 800);
	$(document.body).on("click",'#alertoverlay', function(){
		if ($('#alert').is(':visible')) {
		jQuery('#alert').fadeOut('slow');
		jQuery('#alertoverlay').fadeOut('slow');
		}
	});
}

if (document.domain == 'cya.zsleyerlp.com') {
	//UPDATE
	var version = '2.00';
	document.getElementById('version').innerHTML = "Installed Version: "+version;
	$('#tool-information').hide('slow', function(){
	$('#scriptversion').show('slow');
	$('#start-up').show('slow');});
	if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				var currentversion = parseFloat(xmlhttp.responseText);
				var scriptversion = parseFloat(version);
				if(currentversion <= scriptversion){
				}else{
					alertmessage('There is a new Version out there, please make sure to Update the Script as soon as possible!');
					$('#update').show('slow');
				}
            }
        }
        xmlhttp.open("GET","http://cya.zsleyerlp.com/?getversion=true",true);
		xmlhttp.send()
	
	//CREAT BUTTONS
	var isChromium = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	if (isChromium === true) {
		document.getElementById('auth_token_button').onclick = function requestauthtoken(){
			//Authtoken
			var video_id = extract_ids(document.getElementById('video_id').value);
			if (!video_id) return alertmessage('You have to enter a VideoID before proceeding!');
			if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				} else { // code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange=function() {
					if (xmlhttp.readyState==4 && xmlhttp.status==200) {
						var ret = /auth_token.*?:.*?"(.*?)"/.exec(xmlhttp.responseText);
						if (ret == null) {
							alertmessage('The entered VideoID(URL) seems to be invalid!');
							return;
						} else {
							var auth_token = ret[1];
							document.getElementById('auth_token').value = auth_token;
						}
					}
				}
				xmlhttp.open("GET",'https://www.youtube.com/my_videos_annotate?v='+video_id,true);
				xmlhttp.send()
		};
	
		//XMLBUTTON
		document.getElementById('xml_data_button').onclick = function requestxmlsource() {
			//XML Source
				var video_id = extract_ids(document.getElementById('video_id').value);
				if (!video_id) return alertmessage('You have to enter a VideoID before proceeding!');
				if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				} else { // code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange=function() {
					if (xmlhttp.readyState==4 && xmlhttp.status==200) {
						document.getElementById('data').value = xmlhttp.responseText;
					}
					if (xmlhttp.readyState==4 && xmlhttp.status==400) {
						alertmessage('The entered VideoID(URL) seems to be invalid!');
					}
				}
				xmlhttp.open("GET",'https://www.youtube.com/annotations_invideo?features=1&legacy=1&video_id='+video_id,true);
				xmlhttp.send()
		};

	} else {
		document.getElementById('auth_token_button').onclick = function requestxmlsource() {
			var video_id = extract_ids(document.getElementById('video_id').value);
			if (!video_id) return alertmessage('You have to enter a VideoID before proceeding!');
			GM_xmlhttpRequest({
				method: "GET",
				url: 'https://www.youtube.com/my_videos_annotate?v='+video_id,
				onload: function(response) {
					var ret = /auth_token.*?:.*?"(.*?)"/.exec(response.responseText);
						if (ret == null) {
							alertmessage('The entered VideoID(URL) seems to be invalid!');
							return;
						} else {
							var auth_token = ret[1];
							document.getElementById('auth_token').value = auth_token;
						}
				},
				onerror: function() {alertmessage('The entered VideoID(URL) seems to be invalid!');}	
			});
		}
		document.getElementById('xml_data_button').onclick = function requestxmlsource() {
			var video_id = extract_ids(document.getElementById('video_id').value);
			if (!video_id) return alertmessage('You have to enter a VideoID before proceeding!');
			GM_xmlhttpRequest({
				method: "GET",
				url: 'https://www.youtube.com/annotations_invideo?features=1&legacy=1&video_id='+video_id,
				onload: function(response) {
					document.getElementById('data').value = response.responseText;
				},
				onerror: function() {alertmessage('The entered VideoID(URL) seems to be invalid!');}	
			});
		}
	}
	
	document.getElementById('copy_annotations_button').onclick = function update() {
		var ids = document.getElementById('ids');
		ids.value = extract_ids(ids.value);
		var auth_token = document.getElementById('auth_token').value;
		if (!auth_token) return alertmessage('You have to get an "auth_token" before proceeding!');
	
	
		var data = getxml();
		if (!data) return;
		var ret = data.match(/<annotation /g);
		var num = (ret != null)?ret.length:0;
		ids = ids.value.split('\n');
		ids.forEach(function(id) {
			var ret = /^([^ #]+)/.exec(id);
			if (ret == null) return;
			var id = ret[1];
		
			// insert video_id and auth_token into xml
			data = data.replace(/<requestHeader(.*?)video_id=".*?"(.*?)>/, '<requestHeader$1video_id="'+id+'"$2>');
			data = data.replace(/<authenticationHeader(.*?)auth_token=".*?"(.*?)>/, '<authenticationHeader$1auth_token="'+auth_token+'"$2>');
			console.log(data);
		
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			xhr.open('POST', 'https://www.youtube.com/annotations_auth/update2', true);
			xhr.send(data);
		
			var link = document.createElement('a');
			link.href = 'https://www.youtube.com/my_videos_annotate?v='+id;
			link.target = '_blank';
			link.appendChild(document.createTextNode(id));
			//log('Kopiere '+num+' Anmerkungen zu ', link);
			if ($('#info').is(':visible')) {
				jQuery('#info').fadeOut('slow', function() {
					jQuery('#log').fadeIn('slow');
				});
			}
			$('#log').append('Copying '+num+' annotations to ', link, document.createElement('br'));
		});
	};
	
	document.getElementById('publish_annotations_button').onclick = function publish() {
		var ids = document.getElementById('ids');
		ids.value = extract_ids(ids.value);

		var auth_token = document.getElementById('auth_token').value;
		if (!auth_token) return alertmessage('You have to get an "auth_token" before proceeding!');
	
		ids = ids.value.split('\n');
		ids.forEach(function(id) {
			var ret = /^([^ #]+)/.exec(id);
			if (ret == null) return;
			var id = ret[1];
		
			// publish
			var pubdata = '<document><requestHeader video_id="'+id+'" /><authenticationHeader auth_token="'+auth_token+'" /></document>';
			console.log(pubdata);
		
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			xhr.open('POST', 'https://www.youtube.com/annotations_auth/publish2', true);
			xhr.send(pubdata);
		
			var link = document.createElement('a');
			link.href = 'https://www.youtube.com/watch?v='+id;
			link.target = '_blank';
			link.appendChild(document.createTextNode(id));
			//log(unescape("Ver%F6ffentliche "), link);
			if ($('#info').is(':visible')) {
				jQuery('#info').fadeOut('slow', function() {
					jQuery('#log').fadeIn('slow');
				});
			}
			$('#log').append('Publishing ', link, document.createElement('br'));
		});
	};	
}