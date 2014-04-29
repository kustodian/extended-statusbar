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
		document.getElementById("labelesbhideforsites").setAttribute("disabled", "false");
		document.getElementById("textesbhideforsites").removeAttribute("disabled");
		document.getElementById("buttonesbappendcurrent").setAttribute("disabled", "false");
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
		document.getElementById("labelesbhovering").setAttribute("disabled", "true");
		document.getElementById("textesbhovertimeout").setAttribute("disabled", "true");
		document.getElementById("labelesbhoverseconds").setAttribute("disabled", "true");
		document.getElementById("labelesbhideforsites").setAttribute("disabled", "true");
		document.getElementById("textesbhideforsites").setAttribute("disabled", "true");
		document.getElementById("buttonesbappendcurrent").setAttribute("disabled", "true");
	}

	if (document.getElementById("checkesbstyle").checked)
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


	if (ExtendedStatusbarPrefs.getBoolPref("oldstyle"))
	{
		document.getElementById("esbRadioStyle").selectedIndex = 1;
		document.getElementById("newStyleBox").setAttribute("collapsed", "true");
	}
	else
	{
		document.getElementById("esbRadioStyle").selectedIndex = 0;
		document.getElementById("oldStyleBox").setAttribute("collapsed", "true");        
	}
}

XULExtendedStatusbarOptions.hideCheck = function()
{
	// happens before the checkbox get finished changing it's state, so the booleans are backwards
	if (!document.getElementById("checkesbhide").checked)
	{
		document.getElementById("textesbtimeout").removeAttribute("disabled");      //Have to remove it because it stay disabled
		document.getElementById("labelesbhideafter").setAttribute("disabled", "false");
		document.getElementById("labelesbseconds").setAttribute("disabled", "false");
		document.getElementById("checkesbshowonhover").setAttribute("disabled", "false");
		document.getElementById("labelesbhideforsites").setAttribute("disabled", "false");
		document.getElementById("textesbhideforsites").removeAttribute("disabled");
		document.getElementById("buttonesbappendcurrent").setAttribute("disabled", "false");
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
		document.getElementById("labelesbhovering").setAttribute("disabled", "true");
		document.getElementById("textesbhovertimeout").setAttribute("disabled", "true");
		document.getElementById("labelesbhideforsites").setAttribute("disabled", "true");
		document.getElementById("labelesbhideforsites").setAttribute("disabled", "true");
		document.getElementById("textesbhideforsites").setAttribute("disabled", "true");
		document.getElementById("buttonesbappendcurrent").setAttribute("disabled", "true");
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

XULExtendedStatusbarOptions.hideCustomStyle = function ()
{
	if (!document.getElementById("checkesbstyle").checked)
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
	var newStyleBoxvbox = document.getElementById("newStyleBox");
	var oldStyleBoxvbox = document.getElementById("oldStyleBox");
	var style = document.getElementById("esbOldStyle")
	var resize = true;
	
	switch(document.getElementById("esbRadioStyle").selectedIndex)
	{
		case 0:
				if (newStyleBoxvbox.collapsed)
				{
					style.value = false;
					newStyleBoxvbox.collapsed = false;
					oldStyleBoxvbox.collapsed = true;
					window.sizeToContent();
				}
				break;
		case 1:
				if (oldStyleBoxvbox.collapsed)
				{
					style.value = true;
					newStyleBoxvbox.collapsed = true;
					oldStyleBoxvbox.collapsed = false;
					window.sizeToContent();
				}
				break;
	}    
	
}
