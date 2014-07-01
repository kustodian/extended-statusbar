var ExtendedStatusbarPrefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
ExtendedStatusbarPrefs = ExtendedStatusbarPrefs.getBranch("extensions.extendedstatusbar.");

if ("undefined" == typeof(XULExtendedStatusbarOptions)) {
  var XULExtendedStatusbarOptions = {};
}

XULExtendedStatusbarOptions.init = function ()
{
	if (document.getElementById("checkesbhide").checked)
	{
		document.getElementById("textesbtimeout").removeAttribute("disabled");      //Have to remove it because it stay disabled
		document.getElementById("labelesbhideafter").setAttribute("disabled", "false");
		document.getElementById("labelesbseconds").setAttribute("disabled", "false");
		document.getElementById("checkesbshowonhover").setAttribute("disabled", "false");
		document.getElementById("checkesbhidetoolbar").setAttribute("disabled", "false");
		if (document.getElementById("checkesbshowonhover").checked)
		{
			document.getElementById("labelesbhovering").setAttribute("disabled", "false");
			document.getElementById("textesbhovertimeout").removeAttribute("disabled");
			document.getElementById("labelesbhoverseconds").setAttribute("disabled", "false");
		}
		else
		{
			document.getElementById("labelesbhovering").setAttribute("disabled", "true");
			document.getElementById("textesbhovertimeout").setAttribute("disabled", "true");
			document.getElementById("labelesbhoverseconds").setAttribute("disabled", "true");
		}
	}
	else
	{
		document.getElementById("textesbtimeout").setAttribute("disabled", "true");
		document.getElementById("labelesbhideafter").setAttribute("disabled", "true");
		document.getElementById("labelesbseconds").setAttribute("disabled", "true");
		document.getElementById("checkesbshowonhover").setAttribute("disabled", "true");
		document.getElementById("checkesbhidetoolbar").setAttribute("disabled", "true");
		document.getElementById("labelesbhovering").setAttribute("disabled", "true");
		document.getElementById("textesbhovertimeout").setAttribute("disabled", "true");
	}

	if (document.getElementById("checkesbcolor").checked)
	{
		document.getElementById("customColorDisable").removeAttribute("disabled");
		document.getElementById("customColorHide").setAttribute("hidden","false");
	}
	else
	{
		document.getElementById("customColorDisable").setAttribute("disabled","true");
		document.getElementById("customColorHide").setAttribute("hidden","true");
	}

	// Set colors of boxes
	var color = ExtendedStatusbarPrefs.getCharPref("backgroundcolor");
	if (color != "")
	{
		document.getElementById("backcolorBox").firstChild.setAttribute("style", "background-color:" + color + "; border: 1px solid #000000;");
		document.getElementById("backcolorBox").setAttribute("currColor", color);
		}
	else
	{
		document.getElementById("backcolorBox").firstChild.setAttribute("style", "border: 1px solid #000000;");
	}
	color = ExtendedStatusbarPrefs.getCharPref("progresscolor");
	if (color != "")
	{
		document.getElementById("progresscolorBox").firstChild.setAttribute("style", "background-color:" + color + "; border: 1px solid #000000;");
		document.getElementById("progresscolorBox").setAttribute("currColor", color);
	}
	else
	{
		document.getElementById("progresscolorBox").firstChild.setAttribute("style", "border: 1px solid #000000;");
	}
	color = ExtendedStatusbarPrefs.getCharPref("cursorcolor");
	if (color != "")
	{
		document.getElementById("cursorcolorBox").firstChild.setAttribute("style", "background-color:" + color + "; border: 1px solid #000000;");
		document.getElementById("cursorcolorBox").setAttribute("currColor", color);
	}
	else
	{
		document.getElementById("cursorcolorBox").firstChild.setAttribute("style", "border: 1px solid #000000;");
	}
	color = ExtendedStatusbarPrefs.getCharPref("textcolor");
	if (color != "")
	{
		document.getElementById("textcolorBox").firstChild.setAttribute("style", "background-color:" + color + "; border: 1px solid #000000;");
		document.getElementById("textcolorBox").setAttribute("currColor", color);
	}
	else
	{
		document.getElementById("textcolorBox").firstChild.setAttribute("style", "border: 1px solid #000000;");
	}

	document.getElementById("esbRadioStyle").selectedIndex = ExtendedStatusbarPrefs.getIntPref("esbstyle");
	if(document.getElementById("esbRadioStyle").selectedIndex == 2)
	{
		document.getElementById("stylegrid").hidden = false;
	}
	var textboxHeight = parseInt(window.getComputedStyle(document.getElementById("textesbtoolbarstyle")).lineHeight)+5;
	document.getElementById("textesbtoolbarstyle").height = textboxHeight;
	document.getElementById("textesbwidgetstyle").height = textboxHeight;
	document.getElementById("textpercentstyle").height = textboxHeight;
	document.getElementById("textimagesstyle").height = textboxHeight;
	document.getElementById("textloadedstyle").height = textboxHeight
	document.getElementById("textspeedstyle").height = textboxHeight;
	document.getElementById("texttimestyle").height = textboxHeight;
	document.getElementById("textprogressstyle").height = textboxHeight;
	document.getElementById("textcursorstyle").height = textboxHeight;
	document.getElementById("textcursorbackgroundstyle").height = textboxHeight;
}

XULExtendedStatusbarOptions.hideCheck = function()
{
	// happens before the checkbox get finished changing it's state, so the booleans are backwards
	if (!document.getElementById("checkesbhide").checked)
	{
		document.getElementById("textesbtimeout").removeAttribute("disabled");      //Have to remove it because it stay disabled
		document.getElementById("labelesbhideafter").setAttribute("disabled", "false");
		document.getElementById("checkesbhidetoolbar").setAttribute("disabled", "false");
		document.getElementById("labelesbseconds").setAttribute("disabled", "false");
		document.getElementById("checkesbshowonhover").setAttribute("disabled", "false");
		if (document.getElementById("checkesbshowonhover").checked)
		{
			document.getElementById("labelesbhovering").setAttribute("disabled", "false");
			document.getElementById("textesbhovertimeout").removeAttribute("disabled");
			document.getElementById("labelesbhoverseconds").setAttribute("disabled", "false");
		}
		else
		{
			document.getElementById("labelesbhovering").setAttribute("disabled", "true");
			document.getElementById("textesbhovertimeout").setAttribute("disabled", "true");
			document.getElementById("labelesbhoverseconds").setAttribute("disabled", "true");
		}
	}
	else
	{
		document.getElementById("textesbtimeout").setAttribute("disabled", "true");
		document.getElementById("labelesbhideafter").setAttribute("disabled", "true");
		document.getElementById("checkesbhidetoolbar").setAttribute("disabled", "true");
		document.getElementById("labelesbseconds").setAttribute("disabled", "true");
		document.getElementById("checkesbshowonhover").setAttribute("disabled", "true");
		document.getElementById("labelesbhovering").setAttribute("disabled", "true");
		document.getElementById("textesbhovertimeout").setAttribute("disabled", "true");
	}
}

XULExtendedStatusbarOptions.hideHover = function ()
{
	if (!document.getElementById("checkesbshowonhover").checked)
	{
		document.getElementById("labelesbhovering").setAttribute("disabled", "false");
		document.getElementById("textesbhovertimeout").removeAttribute("disabled");
		document.getElementById("labelesbhoverseconds").setAttribute("disabled", "false");
	}
	else
	{
		document.getElementById("labelesbhovering").setAttribute("disabled", "true");
		document.getElementById("textesbhovertimeout").setAttribute("disabled", "true");
		document.getElementById("labelesbhoverseconds").setAttribute("disabled", "true");
	}
}

XULExtendedStatusbarOptions.gColorObj = {elemCurrColor:"", cancel:false};

XULExtendedStatusbarOptions.changeColor = function (clickedElem)
{
	XULExtendedStatusbarOptions.gColorObj.elemCurrColor = clickedElem.getAttribute("currColor");
	window.openDialog("colorPicker/EdColorPicker.xul", "_blank", "chrome,close,titlebar,modal,centerscreen", "", XULExtendedStatusbarOptions.gColorObj);
	if (XULExtendedStatusbarOptions.gColorObj.cancel) return;
		clickedElem.setAttribute("currColor", XULExtendedStatusbarOptions.gColorObj.elemCurrColor);    
	if (XULExtendedStatusbarOptions.gColorObj.elemCurrColor == "")	// default theme color
	{
		clickedElem.firstChild.setAttribute("style", "border: 1px solid #000000;");
		switch(clickedElem.id)
		{
			case "backcolorBox":
				document.getElementById("esbBackColor").value = "";
				break;
			case "progresscolorBox":
				document.getElementById("esbProgressColor").value = "";
				break;
			case "cursorcolorBox":
				document.getElementById("esbCursorColor").value = "";
				break;
			case "textcolorBox":
				document.getElementById("esbTextColor").value = "";
				break;
		}
		
	}
	else
	{
		clickedElem.firstChild.setAttribute("style", "background-color:" + clickedElem.getAttribute("currColor") + "; border: 1px solid #000000;");
		switch(clickedElem.id)
		{
			case "backcolorBox":
				document.getElementById("esbBackColor").value = clickedElem.getAttribute("currColor");
				break;
			case "progresscolorBox":
				document.getElementById("esbProgressColor").value = clickedElem.getAttribute("currColor");
				break;
			case "cursorcolorBox":
				document.getElementById("esbCursorColor").value = clickedElem.getAttribute("currColor");
				break;
			case "textcolorBox":
				document.getElementById("esbTextColor").value = clickedElem.getAttribute("currColor");
				break;
		}
	}
}

XULExtendedStatusbarOptions.hideCustomColor = function ()
{
	if (!document.getElementById("checkesbcolor").checked)
	{
		document.getElementById("customColorDisable").removeAttribute("disabled");
		document.getElementById("customColorHide").setAttribute("hidden","false");
	}
	else
	{
		document.getElementById("customColorDisable").setAttribute("disabled","true");
		document.getElementById("customColorHide").setAttribute("hidden","true");
	}
}

XULExtendedStatusbarOptions.formatString = function ()
{
	var text = document.getElementById("textesbhideforsites").value;
	if (text != "")
	{
		text = text.replace(/\s/g, "")				//Removes spaces
					.replace(/([^\|])$/g, "$1|")	//Append '|' at end of line
					.replace(/^\|+/g, "")			//Removes '|' at the begining
					.replace(/\|+/g, "|")			//Removes multiple '|'
					.replace(/\*+/g, "*")			//Removes multiple '*'
					.replace(/^(\*\|)+/g, "")		//Removes multiple '*|' at the begining
					.replace(/(\*\|)+/g, "*|")		//Replaces multiple '*|' with one '*|'
					.replace(/^\|$/, "");			//Removes '|' if it's the only char left
		document.getElementById("textesbhideforsites").value = text;
	}
}

XULExtendedStatusbarOptions.appendCurrent = function ()	// Adds the current URL host to textbox
{
	var text = document.getElementById("textesbhideforsites").value;
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
						 .getService(Components.interfaces.nsIWindowMediator);
	var win = wm.getMostRecentWindow("navigator:browser");
	if (win)
	{
		var browser = win.document.getElementById("content");
		try
		{
			//var newVal = browser.browsers[0].currentURI.host; //replace 'host' with 'spec' for full URL
			var newVal = browser.currentURI.host; //replace 'host' with 'spec' for full URL
			text += newVal + "|";
			document.getElementById("textesbhideforsites").value = text;
			document.getElementById("esbHideOnSites").value = text;
		}
		catch(e){}
	}
}

XULExtendedStatusbarOptions.radioStateChange = function ()
{
	var style = document.getElementById("esbStyle")
	
	switch(document.getElementById("esbRadioStyle").selectedIndex)
	{
		case 0:
				style.value = 0;
				document.getElementById("stylegrid").hidden = true;
				window.sizeToContent();
				break;
		case 1:
				style.value = 1;
				document.getElementById("stylegrid").hidden = true;
				window.sizeToContent();
				break;
		case 2:
				style.value = 2;
				document.getElementById("stylegrid").hidden = false;
				window.sizeToContent();
				//}
				break;
	}    
	
}

XULExtendedStatusbarOptions.applyCSS = function (e)
{
	var targetElementString = e.target.id.substring(6).replace("style","");
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	var browserWindow = wm.getMostRecentWindow("navigator:browser");
	switch(targetElementString)
	{
		case "esbtoolbar" :
			var targetElement = browserWindow.document.getElementById("ESB_toolbar");
			break;
		case "esbwidget" :
			var targetElement = browserWindow.document.getElementById("ESB_status_bar");
			break;
		case "percent" :
			var targetElement = browserWindow.document.getElementById("ESB_percent_box");
			break;
		case "images" :
			var targetElement = browserWindow.document.getElementById("ESB_images_box");
			break;
		case "loaded" :
			var targetElement = browserWindow.document.getElementById("ESB_loaded_box");
			break;
		case "speed" :
			var targetElement = browserWindow.document.getElementById("ESB_speed_box");
			break;
		case "time" :
			var targetElement = browserWindow.document.getElementById("ESB_time_box");
			break;
		case "progress" :
			var targetElement = browserWindow.document.getElementById("ESB_percent_progressbar");
			break;
		case "cursor" :
			var targetElement = browserWindow.document.getElementById("ESB_loaded_working_progressbar");
			break;
		case "cursorbackground" :
			var targetElement = browserWindow.document.getElementById("ESB_loaded_finished_progressbar");
			break;
	}
	targetElement.removeAttribute("style");
	targetElement.style.cssText = document.getElementById("text" + targetElementString + "style").value;
	targetElement.width = targetElement.style.width;
}

XULExtendedStatusbarOptions.cssTextBoxFocus = function (e)
{
	e.target.height = (parseInt(window.getComputedStyle(e.target).lineHeight))*5+5;
	window.sizeToContent();
}

XULExtendedStatusbarOptions.cssTextBoxBlur = function (e)
{
	e.target.height = (parseInt(window.getComputedStyle(e.target).lineHeight))+5;
	window.sizeToContent();
}

document.getElementById("textesbtoolbarstyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("textesbwidgetstyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("textpercentstyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("textimagesstyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("textloadedstyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("textspeedstyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("texttimestyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("textprogressstyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("textcursorstyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("textcursorbackgroundstyle").addEventListener("focus", XULExtendedStatusbarOptions.cssTextBoxFocus, false);
document.getElementById("textesbtoolbarstyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);
document.getElementById("textesbwidgetstyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);
document.getElementById("textpercentstyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);
document.getElementById("textimagesstyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);
document.getElementById("textloadedstyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);
document.getElementById("textspeedstyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);
document.getElementById("texttimestyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);
document.getElementById("textprogressstyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);
document.getElementById("textcursorstyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);
document.getElementById("textcursorbackgroundstyle").addEventListener("blur", XULExtendedStatusbarOptions.cssTextBoxBlur, false);