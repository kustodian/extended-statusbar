/**
 * XULExtendedStatusbarChrome namespace.
 */
if ("undefined" == typeof(XULExtendedStatusbarChrome)) {
  var XULExtendedStatusbarChrome = {};
}

/*          Vars         */
XULExtendedStatusbarChrome.esbHide;    //If True ESB will hide
XULExtendedStatusbarChrome.esbWait;    //How long to wait before hiding
XULExtendedStatusbarChrome.hideTimeOut;    //Name says it all
XULExtendedStatusbarChrome.esbTimeOutSem = false;    // True only if the timeout is active
XULExtendedStatusbarChrome.showOnHover;    // If True ESB will be displayed while hovering over the status bar
XULExtendedStatusbarChrome.hoverWait;  // How long to hover before showing ESB
XULExtendedStatusbarChrome.hoverSem;   // True only if hover is in progress
XULExtendedStatusbarChrome.hoverTimeOut;    //Name says it all
XULExtendedStatusbarChrome.hideForSites;   // RegExp of sites on which to hide ESB
XULExtendedStatusbarChrome.hideForSitesSem = false; // Only true if the current site matches hideForSites
XULExtendedStatusbarChrome.esbLoading = false; // True while the page is loading
XULExtendedStatusbarChrome.esbOldStyle;
XULExtendedStatusbarChrome.esbOldSlimMode;
XULExtendedStatusbarChrome.esbIWebProgressListener = Components.interfaces.nsIWebProgressListener;  //this has to have a unique name because a lot of oxtensions are using it

XULExtendedStatusbarChrome.registerESBListener = function ()
{
	XULExtendedStatusbarChrome.esbXUL.init();
	XULExtendedStatusbarChrome.esbListener.init();
	window.getBrowser().addProgressListener(XULExtendedStatusbarChrome.esbListener, XULExtendedStatusbarChrome.esbIWebProgressListener.STATE_START);
}

XULExtendedStatusbarChrome.unregisterESBListener = function ()
{
	XULExtendedStatusbarChrome.esbXUL.destroy();
	XULExtendedStatusbarChrome.esbListener.destroy();
	window.getBrowser().removeProgressListener(XULExtendedStatusbarChrome.esbListener, XULExtendedStatusbarChrome.esbIWebProgressListener.STATE_STOP);
}

XULExtendedStatusbarChrome.hideESB = function ()
{
	if (XULExtendedStatusbarChrome.esbTimeOutSem)
	{
		XULExtendedStatusbarChrome.esbXUL.esb_toolbar.hidden = true;
		XULExtendedStatusbarChrome.esbTimeOutSem = false;
	}
}

XULExtendedStatusbarChrome.cancelTimeOut = function (TimeOut)
{
	if (XULExtendedStatusbarChrome.esbTimeOutSem)
	{
		window.clearTimeout(TimeOut);
		XULExtendedStatusbarChrome.esbTimeOutSem = false;
	}
}

XULExtendedStatusbarChrome.cancelHover = function (Hover)
{
	if (XULExtendedStatusbarChrome.hoverSem)
	{
		window.clearTimeout(Hover);
		XULExtendedStatusbarChrome.hoverSem = false;
	}
}

XULExtendedStatusbarChrome.showESBOnHover = function ()
{
	if (!XULExtendedStatusbarChrome.esbOldStyle && XULExtendedStatusbarChrome.esbHide && XULExtendedStatusbarChrome.showOnHover && !XULExtendedStatusbarChrome.esbLoading)
	{
		XULExtendedStatusbarChrome.hoverSem = true;
		XULExtendedStatusbarChrome.hoverTimeOut = window.setTimeout(function()
		{
			XULExtendedStatusbarChrome.hoverSem = false;
			XULExtendedStatusbarChrome.cancelTimeOut(XULExtendedStatusbarChrome.hideTimeOut);
			if (XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden)
			{
				XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden = false;
			};
		}, XULExtendedStatusbarChrome.hoverWait);
	}
}

XULExtendedStatusbarChrome.hideESBOnHover = function ()
{
	if (XULExtendedStatusbarChrome.esbHide && XULExtendedStatusbarChrome.showOnHover && !XULExtendedStatusbarChrome.esbLoading)
	{
		XULExtendedStatusbarChrome.cancelHover(XULExtendedStatusbarChrome.hoverTimeOut);
		if (!XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden)
		{
			XULExtendedStatusbarChrome.cancelTimeOut(XULExtendedStatusbarChrome.hideTimeOut);
			XULExtendedStatusbarChrome.esbTimeOutSem = true;
			XULExtendedStatusbarChrome.hideTimeOut = window.setTimeout("XULExtendedStatusbarChrome.hideESB()", XULExtendedStatusbarChrome.esbWait*1000);
		}
	}
}

//Load progress listeners at window load
window.addEventListener("load", XULExtendedStatusbarChrome.registerESBListener, false);
window.addEventListener("unload", XULExtendedStatusbarChrome.unregisterESBListener, false);

XULExtendedStatusbarChrome.esbXUL =
{
	esbstrings: null,
	esb_gBundle: null,

	get document_label() {return document.getElementById("ESB_document_working_label");},
	get document_start() {return document.getElementById("ESB_document_working_box");},
	get document_stop() {return document.getElementById("ESB_document_finished_box");},
	get document_progressbar() {return document.getElementById("ESB_document_working_progressbar");},
	get loaded_start_label() {return document.getElementById("ESB_loaded_working_label");},
	get loaded_start() {return document.getElementById("ESB_loaded_working_box");},
	get loaded_stop_label() {return document.getElementById("ESB_loaded_finished_label");},
	get loaded_stop() {return document.getElementById("ESB_loaded_finished_box");},
	get loaded_progressbar() {return document.getElementById("ESB_loaded_working_progressbar");},
	get loadedimages() {return document.getElementById("ESB_images_label");},
	get time_label() {return document.getElementById("ESB_time_label");},
	get speed_label() {return document.getElementById("ESB_speed_label");},
	get new_status_bar() {return document.getElementById("ESB_new_status_bar");},
	get esb_toolbar() {return document.getElementById("ESB_toolbar");},
	get old_images() {return document.getElementById("ESB_old_images");},
	get old_loaded() {return document.getElementById("ESB_old_loaded");},
	get old_speed() {return document.getElementById("ESB_old_speed");},
	get old_time() {return document.getElementById("ESB_old_time");},
	
	init: function()
	{
		this.esb_gBundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
		this.esbstrings = this.esb_gBundle.createBundle("chrome://extendedstatusbar/locale/extendedstatusbar.properties");
		
		// Let the toolbar be customizable and element placement correctly saved
		CustomizableUI.registerArea("ESB_toolbar",{
			type: CustomizableUI.TYPE_TOOLBAR,
			defaultPlacements: ["ESB_toolbaritem","ESB_toolbarspacer"]});
		
		// Display ESB before other items in the addon-bar
		// var addonBar = document.getElementById("addon-bar");
		// if (addonBar) {
			// var extbar = addonBar.removeChild(document.getElementById("extended-statusbar"));
			// addonBar.insertBefore(extbar, addonBar.firstChild);
			// addonBar.collapsed = false;
			
			// Remove Addonbar Close Button
			// var addonBarCloseButton = document.getElementById("addonbar-closebutton");
			// if (addonBarCloseButton) {
				// addonBar.removeChild(addonBarCloseButton);
			// }
		// }
	},

	destroy: function()
	{
		this.esb_gBundle = null;
		this.esbstrings = null;
	},
}

XULExtendedStatusbarChrome.esbListener =
{
	startprog: new Date(),
	updateTimeInterval: "",
	firstRun: true,
	//windowWidth: 0,
	//esbWidth: 0,

	QueryInterface: function(aIID)
	{
		if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
			aIID.equals(Components.interfaces.nsIWebProgressListener2) ||
			aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
			aIID.equals(Components.interfaces.nsIXULBrowserWindow) ||
			aIID.equals(Components.interfaces.nsISupports))
			return this;
		throw Components.results.NS_NOINTERFACE;
	},

	init: function()
	{

	},

	destroy: function()
	{

	},

	onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus)
	{
		if (aStateFlags & XULExtendedStatusbarChrome.esbIWebProgressListener.STATE_START &&     //Start only if network activity,
			aStateFlags & XULExtendedStatusbarChrome.esbIWebProgressListener.STATE_IS_NETWORK)  //so that ESB doesn't fire up on blank tabs/windows
		{
			this.startprog = new Date();
			this.startTimer();
			XULExtendedStatusbarChrome.esbLoading = true;
			if (!XULExtendedStatusbarChrome.esbOldStyle && !XULExtendedStatusbarChrome.hideForSitesSem)
			{
				XULExtendedStatusbarChrome.cancelTimeOut(XULExtendedStatusbarChrome.hideTimeOut);
				XULExtendedStatusbarChrome.esbXUL.esb_toolbar.hidden = false;
				XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden = false;
			}
			//dump("window.outerWidth=" + window.outerWidth + "\n");
			//this.windowWidth = parseInt(window.outerWidth);
			//this.esbWidth = parseInt(esbXUL.document_start.width) + parseInt(esbXUL.loadedimages.width) +
			//                parseInt(esbXUL.loaded_start.width) + parseInt(esbXUL.time_label.width) +
			//                parseInt(esbXUL.speed_label.width);
			//dump("this.esbWidth=" + this.esbWidth + "\n");
			// Hide for Popups smaller than the wide of the ESB
			//if (this.windowWidth < this.esbWidth)
			//{
			//    esbXUL.new_status_bar.hidden = true;
			//}
			// New
			XULExtendedStatusbarChrome.esbXUL.document_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.document") + " 0%";
			XULExtendedStatusbarChrome.esbXUL.document_progressbar.width = 0;
			XULExtendedStatusbarChrome.esbXUL.document_start.hidden = false;
			XULExtendedStatusbarChrome.esbXUL.document_stop.hidden = true;
			XULExtendedStatusbarChrome.esbXUL.loadedimages.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.images") + " 0/0";
			XULExtendedStatusbarChrome.esbXUL.loaded_start.hidden = false;
			XULExtendedStatusbarChrome.esbXUL.loaded_stop.hidden = true;
			XULExtendedStatusbarChrome.esbXUL.loaded_start_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.loaded") + " 0" + XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.kb");
			XULExtendedStatusbarChrome.esbXUL.speed_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.speed") + " 0 " + XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.kbps");
			XULExtendedStatusbarChrome.esbXUL.time_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.time") + " 0" + XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.dot") + "000";

			// Old
			if (XULExtendedStatusbarChrome.esbOldSlimMode)
			{
				XULExtendedStatusbarChrome.esbXUL.old_images.label = "0/0";
				XULExtendedStatusbarChrome.esbXUL.old_loaded.label = "0" + XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.kb");
				XULExtendedStatusbarChrome.esbXUL.old_speed.label = "0 " + XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.kbps");
				XULExtendedStatusbarChrome.esbXUL.old_time.label = "0" + XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.dot") + "000";
			}
			else
			{
				XULExtendedStatusbarChrome.esbXUL.old_images.label = XULExtendedStatusbarChrome.esbXUL.loadedimages.value;
				XULExtendedStatusbarChrome.esbXUL.old_loaded.label = XULExtendedStatusbarChrome.esbXUL.loaded_start_label.value;
				XULExtendedStatusbarChrome.esbXUL.old_speed.label = XULExtendedStatusbarChrome.esbXUL.speed_label.value;
				XULExtendedStatusbarChrome.esbXUL.old_time.label = XULExtendedStatusbarChrome.esbXUL.time_label.value;
			}
		}
		else if (aStateFlags & XULExtendedStatusbarChrome.esbIWebProgressListener.STATE_STOP &&
				 aStateFlags & XULExtendedStatusbarChrome.esbIWebProgressListener.STATE_IS_NETWORK)
		{
			XULExtendedStatusbarChrome.esbLoading = false;
			this.stopTimer();
			this.updateTime();
			// New
			XULExtendedStatusbarChrome.esbXUL.document_start.hidden = true;
			XULExtendedStatusbarChrome.esbXUL.document_stop.hidden = false;
			XULExtendedStatusbarChrome.esbXUL.loaded_start.hidden = true;
			XULExtendedStatusbarChrome.esbXUL.loaded_stop.hidden = false;
			XULExtendedStatusbarChrome.esbXUL.loaded_stop_label.value = XULExtendedStatusbarChrome.esbXUL.loaded_start_label.value;
			// Set size of boxes to fit content, so the ESB elements don't always move left-right because the labels resize automatically
			if (XULExtendedStatusbarChrome.esbXUL.document_start.width < XULExtendedStatusbarChrome.esbXUL.document_stop.boxObject.width)
			  XULExtendedStatusbarChrome.esbXUL.document_start.width = XULExtendedStatusbarChrome.esbXUL.document_stop.width = XULExtendedStatusbarChrome.esbXUL.document_stop.boxObject.width;
			if (XULExtendedStatusbarChrome.esbXUL.loaded_start.width < XULExtendedStatusbarChrome.esbXUL.loaded_stop.boxObject.width)
			  XULExtendedStatusbarChrome.esbXUL.loaded_start.width = XULExtendedStatusbarChrome.esbXUL.loaded_stop.width = XULExtendedStatusbarChrome.esbXUL.loaded_stop.boxObject.width;
			if (XULExtendedStatusbarChrome.esbXUL.loadedimages.width < XULExtendedStatusbarChrome.esbXUL.loadedimages.boxObject.width)
			  XULExtendedStatusbarChrome.esbXUL.loadedimages.width = XULExtendedStatusbarChrome.esbXUL.loadedimages.boxObject.width;
			if (XULExtendedStatusbarChrome.esbXUL.speed_label.width < XULExtendedStatusbarChrome.esbXUL.speed_label.boxObject.width)
			  XULExtendedStatusbarChrome.esbXUL.speed_label.width = XULExtendedStatusbarChrome.esbXUL.speed_label.boxObject.width;

			// Old
			// Set size of panels to fit content, so the ESB elements don't always move left-right because the labels resize automatically
			if (XULExtendedStatusbarChrome.esbXUL.old_images.minWidth < XULExtendedStatusbarChrome.esbXUL.old_images.boxObject.width)
			  XULExtendedStatusbarChrome.esbXUL.old_images.minWidth = XULExtendedStatusbarChrome.esbXUL.old_images.boxObject.width;
			if (XULExtendedStatusbarChrome.esbXUL.old_loaded.minWidth < XULExtendedStatusbarChrome.esbXUL.old_loaded.boxObject.width)
			  XULExtendedStatusbarChrome.esbXUL.old_loaded.minWidth = XULExtendedStatusbarChrome.esbXUL.old_loaded.boxObject.width;
			if (XULExtendedStatusbarChrome.esbXUL.old_speed.minWidth < XULExtendedStatusbarChrome.esbXUL.old_speed.boxObject.width)
			  XULExtendedStatusbarChrome.esbXUL.old_speed.minWidth = XULExtendedStatusbarChrome.esbXUL.old_speed.boxObject.width;
			if (XULExtendedStatusbarChrome.esbXUL.old_time.minWidth < XULExtendedStatusbarChrome.esbXUL.old_time.boxObject.width)
			  XULExtendedStatusbarChrome.esbXUL.old_time.minWidth = XULExtendedStatusbarChrome.esbXUL.old_time.boxObject.width;

			// Set hide timeout
			if(!XULExtendedStatusbarChrome.esbOldStyle && XULExtendedStatusbarChrome.esbHide && !XULExtendedStatusbarChrome.esbTimeOutSem)
			{
				XULExtendedStatusbarChrome.esbTimeOutSem = true;
				XULExtendedStatusbarChrome.hideTimeOut = window.setTimeout("XULExtendedStatusbarChrome.hideESB()", XULExtendedStatusbarChrome.esbWait*1000);
			}
		}
	},

	onProgressChange: function (aWebProgress, aRequest,
								 aCurSelfProgress, aMaxSelfProgress,
								 aCurTotalProgress, aMaxTotalProgress)
	{
		if (aMaxTotalProgress > 0)
		{
			var percentage = Math.round((aCurTotalProgress * 100) / aMaxTotalProgress);
			var docimgs = window._content.document.images;
			var imglcount = 0;
			var allimgsc = 0;
			if (docimgs != null)
			{
				allimgsc = docimgs.length;
				for (var i = 0; i < docimgs.length; i++)
				{
					if (docimgs[i].complete) imglcount++;
				}
				for (var i = 0; i < window._content.window.frames.length; i++)
				{
					docimgs = window._content.window.frames[i].document.images;
					allimgsc += docimgs.length;
					for (var j = 0; j < docimgs.length; j++)
					{
						if (docimgs[j].complete) imglcount++;
					}
				}
			}
			var compdocsize = aCurTotalProgress;
			for (var sizeinval = 0; Math.floor(compdocsize / 1024) > 0; sizeinval++)
			{
				compdocsize /= 1024;
			}
			switch (sizeinval)
			{
				case 0: sizeinval = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.kb");
						compdocsize = Math.floor(compdocsize * 100)/100;
						break;
				case 1: sizeinval = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.mb");
						compdocsize = Math.floor(compdocsize * 100)/100;
						break;
				case 2: sizeinval = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.gb");
						compdocsize = Math.floor(compdocsize * 100)/100;
						break;
				default: sizeinval = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.nosize");
						break;
			}
			XULExtendedStatusbarChrome.esbXUL.document_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.document") + " " + percentage + "%";
			XULExtendedStatusbarChrome.esbXUL.document_progressbar.width = Math.round(percentage * (XULExtendedStatusbarChrome.esbXUL.document_start.boxObject.width - 2) / 100);
			XULExtendedStatusbarChrome.esbXUL.loadedimages.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.images") + " " + imglcount + "/" + allimgsc;
			XULExtendedStatusbarChrome.esbXUL.loaded_start_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.loaded") + " " + compdocsize + " " + sizeinval;
			XULExtendedStatusbarChrome.esbXUL.loaded_progressbar.width = compdocsize*4 % XULExtendedStatusbarChrome.esbXUL.loaded_start.boxObject.width;
			if (XULExtendedStatusbarChrome.esbOldSlimMode)
			{
				XULExtendedStatusbarChrome.esbXUL.old_images.label = imglcount + "/" + allimgsc;
				XULExtendedStatusbarChrome.esbXUL.old_loaded.label = compdocsize + " " + sizeinval;
			}
			else
			{
				XULExtendedStatusbarChrome.esbXUL.old_images.label = XULExtendedStatusbarChrome.esbXUL.loadedimages.value;
				XULExtendedStatusbarChrome.esbXUL.old_loaded.label = XULExtendedStatusbarChrome.esbXUL.loaded_start_label.value;
			}
			var now = new Date();
			now = now.getTime() - this.startprog.getTime();
			this.updateTime();
			if (XULExtendedStatusbarChrome.esbLoading) this.startTimer(); //This is a workaround for the first run, esbLoading is false on FF first start,
											   //so time wont be started. This is a problem
											   //if FF starts with about:blank State_Stop is not called
											   //so the time doesn't stop for the first page
			if (now > 0)
			{
				var speed = aCurTotalProgress / now * 1000;
				speed = Math.round ( speed * 100) / 100;
				speed = speed.toFixed(2);
				speed = speed.toString().replace(/\./, XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.dot")); //Replace '.' with a symbol from the active local
				XULExtendedStatusbarChrome.esbXUL.speed_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.speed") + " " + speed + " " + XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.kbps");
				if (XULExtendedStatusbarChrome.esbOldSlimMode)
				{
					XULExtendedStatusbarChrome.esbXUL.old_speed.label = speed + " " + XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.kbps");
				}
				else
				{
					XULExtendedStatusbarChrome.esbXUL.old_speed.label = XULExtendedStatusbarChrome.esbXUL.speed_label.value;
				}
			}
		}
	},


	onProgressChange64: function (aWebProgress, aRequest,
				 aCurSelfProgress, aMaxSelfProgress,
				 aCurTotalProgress, aMaxTotalProgress)
	{
		return this.onProgressChange(aWebProgress, aRequest,
									 aCurSelfProgress, aMaxSelfProgress,
									 aCurTotalProgress, aMaxTotalProgress);
	},


	onLocationChange: function (webProgress , request , location)
	{
		try     // If location == null this throws an exception
		{
			if (XULExtendedStatusbarChrome.hideForSites && location.spec.match(XULExtendedStatusbarChrome.hideForSites))
			{
				hXULExtendedStatusbarChrome.ideForSitesSem = true;
				if (!XULExtendedStatusbarChrome.esbOldStyle && XULExtendedStatusbarChrome.esbHide) XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden = true;
			}
			else
			{
				XULExtendedStatusbarChrome.hideForSitesSem = false;
				if (!XULExtendedStatusbarChrome.esbOldStyle && XULExtendedStatusbarChrome.esbLoading)
				{
					XULExtendedStatusbarChrome.cancelTimeOut(XULExtendedStatusbarChrome.hideTimeOut);
					XULExtendedStatusbarChrome.esbXUL.esb_toolbar.hidden = false;
					XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden = false;
				}
			}
		}
		catch (e) {XULExtendedStatusbarChrome.hideForSitesSem = false;}
	},
	onStatusChange: function(a,b,c,d){},
	onSecurityChange: function(a,b,c){},


	updateTime: function ()
	{
		var now = new Date();
		now = now.getTime() - this.startprog.getTime();
		var hours = Math.floor((now / 3600000) % 24);
		var mins = Math.floor((now / 60000) % 60);
		var secs = Math.floor((now / 1000) % 60);
		var msecs = now - hours*36000 - mins*60000 - secs*1000;
		secs = secs.toString();
		msecs = msecs.toString();
		if (msecs.length == 1) msecs = "00" + msecs;
		else if (msecs.length == 2) msecs = "0" + msecs;
		var dot = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.dot");
		var colon = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.colon");
		var slimTimeString;
		if (hours > 0)
		{
			mins = mins.toString();
			if (mins.length == 1) mins = "0" + mins;
			XULExtendedStatusbarChrome.esbXUL.time_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.time") + " " + hours + colon + mins + colon + secs + dot + msecs;
			slimTimeString = hours + colon + mins + colon + secs + dot + msecs;
		}
		else
		{
			if (mins > 0)
			{
				if (secs.length == 1) secs = "0" + secs;
				mins = mins.toString();
				XULExtendedStatusbarChrome.esbXUL.time_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.time") + " " + mins + colon + secs + dot + msecs;
				slimTimeString = mins + colon + secs + dot + msecs;
			}
			else
			{
				XULExtendedStatusbarChrome.esbXUL.time_label.value = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.time") + " " + secs + dot + msecs;
				slimTimeString = secs + dot + msecs;
			}
		}
		if (XULExtendedStatusbarChrome.esbOldSlimMode)
		{
			XULExtendedStatusbarChrome.esbXUL.old_time.label = slimTimeString;
		}
		else
		{
			XULExtendedStatusbarChrome.esbXUL.old_time.label = XULExtendedStatusbarChrome.esbXUL.time_label.value;
		}
	},

	startTimer: function()
	{
		if (this.updateTimeInterval != "")
		{
			clearInterval(this.updateTimeInterval);
		}
		this.updateTimeInterval = setInterval("XULExtendedStatusbarChrome.esbListener.updateTime()", 768);
	},

	stopTimer: function()
	{
		if (this.updateTimeInterval != "")
		{
			clearInterval(this.updateTimeInterval);
			this.updateTimeInterval = "";
		}
	}
}


// Settings observer
XULExtendedStatusbarChrome.ESB_PrefObserver = {
		prefs: null,

		// Initialize the extension
		startup: function()
		{
		// Register to receive notifications of preference changes
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
					 .getService(Components.interfaces.nsIPrefService)
					 .getBranch("extensions.extendedstatusbar.");
		//this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);      //this is for Gecko 1.8 only (FF3)
		this.prefs.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
		this.prefs.addObserver("", this, false);

		XULExtendedStatusbarChrome.esbHide = this.prefs.getBoolPref("hide");
		XULExtendedStatusbarChrome.esbWait = this.prefs.getIntPref("hidetimeout");
		XULExtendedStatusbarChrome.showOnHover = this.prefs.getBoolPref("showonhover");
		XULExtendedStatusbarChrome.hoverWait = this.prefs.getIntPref("hovertimeout");
		//XULExtendedStatusbarChrome.hideForSites = this.prefs.getCharPref("hideonsites");
		if (this.prefs.getCharPref("hideonsites") != "")
		{
			XULExtendedStatusbarChrome.hideForSites = new RegExp(this.prefs.getCharPref("hideonsites")
							.replace(/\|$/, "")					//Remove last '|'
							.replace(/(\W)/g, "\\$1")			//Escape all special characters
							.replace(/\\\|/g, "|")				//Unescape from '|'
							.replace(/\\\*/g, ".*")				//Replace '\*' with '.*'
							.replace(/(^\.\*)|(\.\*$)/g, "")	//Remove '.*' on start and end
							.replace(/(\.\*\|)/g,"|")			//Remove '.*' left of'|'
							.replace(/(\|\.\*)/g, "|"));		//Remove '.*' right of'|'
		}
		else
		{
			XULExtendedStatusbarChrome.hideForSites = null;
		}
		
		XULExtendedStatusbarChrome.esbOldStyle = this.prefs.getBoolPref("oldstyle");

		// Set colors
		if (this.prefs.getBoolPref("usecustomstyle"))
		{
			this.appendStyleAtribute("ESB_new_status_bar", "background-color", this.prefs.getCharPref("backgroundcolor"));
			this.appendStyleAtribute("ESB_new_status_bar", "color", this.prefs.getCharPref("textcolor"));
			this.appendStyleAtribute("ESB_document_working_progressbar", "background-color", this.prefs.getCharPref("progresscolor"));
			this.appendStyleAtribute("ESB_document_finished_progressbar", "background-color", this.prefs.getCharPref("progresscolor"));
			this.appendStyleAtribute("ESB_loaded_working_box", "background-color", this.prefs.getCharPref("progresscolor"));
			this.appendStyleAtribute("ESB_loaded_finished_box", "background-color", this.prefs.getCharPref("progresscolor"));
			this.appendStyleAtribute("ESB_loaded_working_progressbar", "border-right", "10px solid " + this.prefs.getCharPref("cursorcolor"));
		}

		if (this.prefs.getBoolPref("oldslimmode")) XULExtendedStatusbarChrome.esbOldSlimMode = true;
		else XULExtendedStatusbarChrome.esbOldSlimMode = false;

		if (XULExtendedStatusbarChrome.esbOldStyle)
		{
			XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden = true;
			if (this.prefs.getBoolPref("oldhideimages")) XULExtendedStatusbarChrome.esbXUL.old_images.hidden = true;
			if (this.prefs.getBoolPref("oldhideloaded")) XULExtendedStatusbarChrome.esbXUL.old_loaded.hidden = true;
			if (this.prefs.getBoolPref("oldhidespeed")) XULExtendedStatusbarChrome.esbXUL.old_speed.hidden = true;
			if (this.prefs.getBoolPref("oldhidetime")) XULExtendedStatusbarChrome.esbXUL.old_time.hidden = true;
		}
		else
		{
			XULExtendedStatusbarChrome.esbXUL.old_images.hidden = true;
			XULExtendedStatusbarChrome.esbXUL.old_loaded.hidden = true;
			XULExtendedStatusbarChrome.esbXUL.old_speed.hidden = true;
			XULExtendedStatusbarChrome.esbXUL.old_time.hidden = true;
		}
	},

	// Clean up after ourselves and save the prefs
	shutdown: function()
	{
		this.prefs.removeObserver("", this);
	},


	// Called when events occur on the preferences
	observe: function(subject, topic, data)
	{
		if (topic != "nsPref:changed") return;
		
		XULExtendedStatusbarChrome.esbXUL.esb_toolbar.hidden = false;
		switch(data)
		{
			case "hide":
				XULExtendedStatusbarChrome.esbHide = this.prefs.getBoolPref("hide");
				if (!XULExtendedStatusbarChrome.esbOldStyle)
				{
					if (!XULExtendedStatusbarChrome.esbHide && XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden)
					{
						XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden = false;
					}
					else if (!XULExtendedStatusbarChrome.esbLoading)
					{
						XULExtendedStatusbarChrome.cancelTimeOut(XULExtendedStatusbarChrome.hideTimeOut);
						XULExtendedStatusbarChrome.esbTimeOutSem = true;
						XULExtendedStatusbarChrome.hideTimeOut = window.setTimeout("XULExtendedStatusbarChrome.hideESB()", XULExtendedStatusbarChrome.esbWait*1000);
					}
				}
				break;
			case "hidetimeout":
				XULExtendedStatusbarChrome.esbWait = this.prefs.getIntPref("hidetimeout");
				break;
			case "showonhover":
				XULExtendedStatusbarChrome.showOnHover = this.prefs.getBoolPref("showonhover");
				break;
			case "hovertimeout":
				XULExtendedStatusbarChrome.hoverWait = this.prefs.getIntPref("hovertimeout");
				break;
			case "backgroundcolor":
				this.appendStyleAtribute("ESB_new_status_bar", "background-color", this.prefs.getCharPref("backgroundcolor"));
				break;
			case "progresscolor":
				this.appendStyleAtribute("ESB_document_working_progressbar", "background-color", this.prefs.getCharPref("progresscolor"));
				this.appendStyleAtribute("ESB_document_finished_progressbar", "background-color", this.prefs.getCharPref("progresscolor"));
				this.appendStyleAtribute("ESB_loaded_working_box", "background-color", this.prefs.getCharPref("progresscolor"));
				this.appendStyleAtribute("ESB_loaded_finished_box", "background-color", this.prefs.getCharPref("progresscolor"));
				break;
			case "cursorcolor":
				this.appendStyleAtribute("ESB_loaded_working_progressbar", "border-right", "10px solid " + this.prefs.getCharPref("cursorcolor"));
				break;
			case "textcolor":
				this.appendStyleAtribute("ESB_new_status_bar", "color", this.prefs.getCharPref("textcolor"));
				break;
			case "usecustomstyle":
				if (this.prefs.getBoolPref("usecustomstyle"))
				{
					this.appendStyleAtribute("ESB_new_status_bar", "background-color", this.prefs.getCharPref("backgroundcolor"));
					this.appendStyleAtribute("ESB_new_status_bar", "color", this.prefs.getCharPref("textcolor"));
					this.appendStyleAtribute("ESB_document_working_progressbar", "background-color", this.prefs.getCharPref("progresscolor"));
					this.appendStyleAtribute("ESB_document_finished_progressbar", "background-color", this.prefs.getCharPref("progresscolor"));
					this.appendStyleAtribute("ESB_loaded_working_box", "background-color", this.prefs.getCharPref("progresscolor"));
					this.appendStyleAtribute("ESB_loaded_finished_box", "background-color", this.prefs.getCharPref("progresscolor"));
					this.appendStyleAtribute("ESB_loaded_working_progressbar", "border-right", "10px solid " + this.prefs.getCharPref("cursorcolor"));
				}
				else
				{
					var elemArray = ["ESB_new_status_bar", "ESB_document_working_progressbar", "ESB_document_finished_progressbar", "ESB_loaded_working_box",
									 "ESB_loaded_finished_box", "ESB_loaded_working_progressbar", "ESB_new_status_bar"];
					this.clearStyle(elemArray);
				}
				break;
			case "hideonsites":
				//XULExtendedStatusbarChrome.hideForSites = this.prefs.getCharPref("hideonsites");
				if (this.prefs.getCharPref("hideonsites") != "")
				{
					XULExtendedStatusbarChrome.hideForSites = new RegExp(this.prefs.getCharPref("hideonsites")
									.replace(/\|$/, "")					//Remove last '|'
									.replace(/(\W)/g, "\\$1")			//Escape all special characters
									.replace(/\\\|/g, "|")				//Unescape from '|'
									.replace(/\\\*/g, ".*")				//Replace '\*' with '.*'
									.replace(/(^\.\*)|(\.\*$)/g, "")	//Remove '.*' on start and end
									.replace(/(\.\*\|)/g,"|")			//Remove '.*' left of'|'
									.replace(/(\|\.\*)/g, "|"));		//Remove '.*' right of'|'
				}
				else
				{
					XULExtendedStatusbarChrome.hideForSites = null;
				}
				break;
			case "oldhideimages":
				if (this.prefs.getBoolPref("oldhideimages")) XULExtendedStatusbarChrome.esbXUL.old_images.hidden = true;
				else XULExtendedStatusbarChrome.esbXUL.old_images.hidden = false;
				break;
			case "oldhideloaded":
				if (this.prefs.getBoolPref("oldhideloaded")) XULExtendedStatusbarChrome.esbXUL.old_loaded.hidden = true;
				else XULExtendedStatusbarChrome.esbXUL.old_loaded.hidden = false;
				break;
			case "oldhidespeed":
				if (this.prefs.getBoolPref("oldhidespeed")) XULExtendedStatusbarChrome.esbXUL.old_speed.hidden = true;
				else XULExtendedStatusbarChrome.esbXUL.old_speed.hidden = false;
				break;
			case "oldhidetime":
				if (this.prefs.getBoolPref("oldhidetime")) XULExtendedStatusbarChrome.esbXUL.old_time.hidden = true;
				else XULExtendedStatusbarChrome.esbXUL.old_time.hidden = false;
				break;
			case "oldstyle":
				XULExtendedStatusbarChrome.esbOldStyle = this.prefs.getBoolPref("oldstyle");
				if (XULExtendedStatusbarChrome.esbOldStyle)
				{
					if (this.prefs.getBoolPref("oldhideimages")) XULExtendedStatusbarChrome.esbXUL.old_images.hidden = true;
						else XULExtendedStatusbarChrome.esbXUL.old_images.hidden = false;
					if (this.prefs.getBoolPref("oldhideloaded")) XULExtendedStatusbarChrome.esbXUL.old_loaded.hidden = true;
						else XULExtendedStatusbarChrome.esbXUL.old_loaded.hidden = false;
					if (this.prefs.getBoolPref("oldhidespeed")) XULExtendedStatusbarChrome.esbXUL.old_speed.hidden = true;
						else XULExtendedStatusbarChrome.esbXUL.old_speed.hidden = false;
					if (this.prefs.getBoolPref("oldhidetime")) XULExtendedStatusbarChrome.esbXUL.old_time.hidden = true;
						else XULExtendedStatusbarChrome.esbXUL.old_time.hidden = false;
					XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden = true;
				}
				else
				{
					XULExtendedStatusbarChrome.esbXUL.old_images.hidden = true;
					XULExtendedStatusbarChrome.esbXUL.old_loaded.hidden = true;
					XULExtendedStatusbarChrome.esbXUL.old_speed.hidden = true;
					XULExtendedStatusbarChrome.esbXUL.old_time.hidden = true;
					XULExtendedStatusbarChrome.esbXUL.new_status_bar.hidden = false;
					// Set hide timeout
					if(!XULExtendedStatusbarChrome.esbOldStyle && XULExtendedStatusbarChrome.esbHide && !XULExtendedStatusbarChrome.esbTimeOutSem)
					{
						XULExtendedStatusbarChrome.esbTimeOutSem = true;
						XULExtendedStatusbarChrome.hideTimeOut = window.setTimeout("XULExtendedStatusbarChrome.hideESB()", XULExtendedStatusbarChrome.esbWait*1000);
					}
				}
				break;
			case "oldslimmode":
				if (this.prefs.getBoolPref("oldslimmode"))
				{
					XULExtendedStatusbarChrome.esbOldSlimMode = true;
					XULExtendedStatusbarChrome.esbXUL.old_images.minWidth = 1;
					XULExtendedStatusbarChrome.esbXUL.old_loaded.minWidth = 1;
					XULExtendedStatusbarChrome.esbXUL.old_speed.minWidth = 1;
					XULExtendedStatusbarChrome.esbXUL.old_time.minWidth = 1;
					XULExtendedStatusbarChrome.esbXUL.old_images.label = XULExtendedStatusbarChrome.esbXUL.old_images.label.substring(XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.images").length + 1);
					XULExtendedStatusbarChrome.esbXUL.old_loaded.label = XULExtendedStatusbarChrome.esbXUL.old_loaded.label.substring(XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.loaded").length + 1)
					XULExtendedStatusbarChrome.esbXUL.old_speed.label = XULExtendedStatusbarChrome.esbXUL.old_speed.label.substring(XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.speed").length + 1)
					XULExtendedStatusbarChrome.esbXUL.old_time.label = XULExtendedStatusbarChrome.esbXUL.old_time.label.substring(XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.time").length + 1)
				}
				else
				{
					XULExtendedStatusbarChrome.esbOldSlimMode = false;
					XULExtendedStatusbarChrome.esbXUL.old_images.label = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.images") + " " + XULExtendedStatusbarChrome.esbXUL.old_images.label;
					XULExtendedStatusbarChrome.esbXUL.old_loaded.label = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.loaded") + " " + XULExtendedStatusbarChrome.esbXUL.old_loaded.label;
					XULExtendedStatusbarChrome.esbXUL.old_speed.label = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.speed") + " " + XULExtendedStatusbarChrome.esbXUL.old_speed.label;
					XULExtendedStatusbarChrome.esbXUL.old_time.label = XULExtendedStatusbarChrome.esbXUL.esbstrings.GetStringFromName("esb.time") + " " + XULExtendedStatusbarChrome.esbXUL.old_time.label;
				}
				break;
		}
	},


	appendStyleAtribute: function (elem, attrib, value)
	{
		var style = document.getElementById(elem).getAttribute("style");
		var myregexp1 = new RegExp("^" + attrib + ":[\\s]?[^:]+;");
		if (style.match(myregexp1) != null)
		{
			document.getElementById(elem).setAttribute("style", style.replace(myregexp1, attrib + ": " + value + ";"));
			return;
		}
		else
		{
			var myregexp2 = new RegExp("(;\\s+|;)" + attrib + ":[\\s]?[^:]+;");
			if (style.match(myregexp2) != null)
			{
				document.getElementById(elem).setAttribute("style", style.replace(myregexp2, ";" + attrib + ": " + value + ";"));
				return;
			}
			document.getElementById(elem).setAttribute("style", style.concat(style, attrib + ": " + value + ";"));
		}
	},


	clearStyle: function(elems)
	{
		for (var i=0; i<elems.length; i++)
		{
			document.getElementById(elems[i]).removeAttribute("style");
		}
	}
}

window.addEventListener("load", function(e) { XULExtendedStatusbarChrome.ESB_PrefObserver.startup(); }, false);
window.addEventListener("unload", function(e) { XULExtendedStatusbarChrome.ESB_PrefObserver.shutdown(); }, false);

XULExtendedStatusbarChrome.openESBOptions = function (event)
{
	window.open("chrome://extendedstatusbar/content/extendedstatusbaroptions.xul", "", "chrome");
}
