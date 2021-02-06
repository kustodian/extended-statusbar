Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");

var isPostAustralis = Services.appinfo.ID == "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}" && // Firefox
	Services.vc.compare(Services.appinfo.version, "29.0") >= 0;

if (isPostAustralis) Components.utils.import("resource:///modules/CustomizableUI.jsm");

function startup(data,reason)
{
	if (isPostAustralis)
	{
		//Define the widget once for all windows
		CustomizableUI.createWidget({
			id: "ESB_toolbaritem",
			type: "custom",
			onBuild: buildESB
		});
	}
	
	//Services.console.logStringMessage();
	Services.scriptloader.loadSubScript("chrome://extendedstatusbar/content/esbpref.js", {pref:setDefaultPref} );
    forEachOpenWindow(loadIntoWindow);
    Services.wm.addListener(WindowListener);
	
	//skin
	let styleService = Components.classes["@mozilla.org/content/style-sheet-service;1"]
								.getService(Components.interfaces.nsIStyleSheetService);
	let uri = NetUtil.newURI("chrome://extendedstatusbar/skin/extendedstatusbar.css");
	if (!styleService.sheetRegistered(uri, styleService.AUTHOR_SHEET)) {
		styleService.loadAndRegisterSheet(uri, styleService.AUTHOR_SHEET);
	}
}
function install(data, reason)
{
	if (!isPostAustralis)
	{
		var unCollapseAddonBar = function (window) {
			addonBar = window.document.getElementById("addon-bar");
			if (addonBar) 
			{
				window.setToolbarVisibility(addonBar, true, true);
			}
		};
		forEachOpenWindow(unCollapseAddonBar);
	}
}
function uninstall(data, reason)
{}
function shutdown(data, reason)
{
    if (reason == APP_SHUTDOWN)
        return;

	if (isPostAustralis)
	{
		CustomizableUI.unregisterArea("ESB_toolbar");
		CustomizableUI.destroyWidget("ESB_toolbaritem");
	}
	
    forEachOpenWindow(unloadFromWindow);
    Services.wm.removeListener(WindowListener);
	
	//skin
	let styleService = Components.classes["@mozilla.org/content/style-sheet-service;1"]
								.getService(Components.interfaces.nsIStyleSheetService);
	let uri = NetUtil.newURI("chrome://extendedstatusbar/skin/extendedstatusbar.css");
	if (styleService.sheetRegistered(uri, styleService.AUTHOR_SHEET)) {
		styleService.unregisterSheet(uri, styleService.AUTHOR_SHEET);
	}
	
	//cache clearing 
    Services.obs.notifyObservers(null, "chrome-flush-caches", null);
}

// loader

function buildESB(document)
{
	var onDragStart = function(event){
		var dataTransfer = event.dataTransfer;
		var dataNode = event.target;
		while(!dataNode.id || !dataNode.id.match("ESB_.*_box"))
			dataNode = dataNode.parentNode;
		if(!dataNode.draggable) return;
		dataTransfer.mozSetDataAt('application/x-moz-node', dataNode, 0);
	};
	
	var onDragOver = function(event){
		var dataNode = event.dataTransfer.mozGetDataAt('application/x-moz-node', 0);
		if(!dataNode || !dataNode.id || !dataNode.id.match("ESB_.*_box")) return;
		event.preventDefault();
		var boxNodes = dataNode.parentNode.childNodes;
		var mouseX = event.clientX;
		for (var i = 0; i < boxNodes.length; i++) 
		{
			if(boxNodes[i].hidden == true || boxNodes[i] == dataNode) continue;
			var boxX = boxNodes[i].boxObject.x;
			var boxWidth = boxNodes[i].boxObject.width;
			if(mouseX >= boxX && mouseX <= (boxX + boxWidth))
			{
				var moved = false;
				var newPosition;
				if(mouseX > (boxX + boxWidth/2))
				{
					if(dataNode != boxNodes[i].nextSibling)
					{
						newPosition = dataNode.esbPosition > i ? i + 1 : i;
						moved = true;
					}
				}
				else
				{
					if(dataNode != boxNodes[i].previousSibling)
					{
						newPosition = dataNode.esbPosition > i ? i : i - 1;
						moved = true;
					}
				}
				if(moved)
				{
					switch(dataNode.id)
					{
						case "ESB_percent_box":
							Services.prefs.setIntPref("extensions.extendedstatusbar.percentposition", newPosition);
							break;
						case "ESB_images_box":
							Services.prefs.setIntPref("extensions.extendedstatusbar.imagesposition", newPosition);
							break;
						case "ESB_loaded_box":
							Services.prefs.setIntPref("extensions.extendedstatusbar.loadedposition", newPosition);
							break;
						case "ESB_speed_box":
							Services.prefs.setIntPref("extensions.extendedstatusbar.speedposition", newPosition);
							break;
						case "ESB_time_box":
							Services.prefs.setIntPref("extensions.extendedstatusbar.timeposition", newPosition);
							break;
					}
				}
				break;
			}
		}
	};
	
	//ESB_percent_box
	var percentLabel = document.createElement("label");
	percentLabel.setAttribute("id", "ESB_percent_label");
	var percentLabelHbox =  document.createElement("hbox");
	percentLabelHbox.setAttribute("pack", "end");
	percentLabelHbox.setAttribute("align", "center");
	percentLabelHbox.appendChild(percentLabel);
	
	var percentProgressbar =  document.createElement("hbox");
	percentProgressbar.setAttribute("id", "ESB_percent_progressbar");
	var percentProgressbarHbox =  document.createElement("hbox");
	percentProgressbarHbox.appendChild(percentProgressbar);
	
	var percentBox =  document.createElement("stack");
	percentBox.setAttribute("id", "ESB_percent_box");
	percentBox.draggable = false;
	percentBox.addEventListener("dragstart", onDragStart, false);
	percentBox.appendChild(percentProgressbarHbox);
	percentBox.appendChild(percentLabelHbox);
	
	//ESB_images_box
	var imagesLabel = document.createElement("label");
	imagesLabel.setAttribute("id", "ESB_images_label");
	var imagesBox =  document.createElement("hbox");
	imagesBox.setAttribute("id", "ESB_images_box");
	imagesBox.draggable = false;
	imagesBox.setAttribute("pack", "center");
	imagesBox.setAttribute("align", "center");
	imagesBox.addEventListener("dragstart", onDragStart, false);
	imagesBox.appendChild(imagesLabel);
	
	//ESB_loaded_box
	var loadedLabel = document.createElement("label");
	loadedLabel.setAttribute("id", "ESB_loaded_label");
	var loadedLabelHbox =  document.createElement("hbox");
	loadedLabelHbox.setAttribute("pack", "center");
	loadedLabelHbox.setAttribute("align", "center");
	loadedLabelHbox.appendChild(loadedLabel);
	
	var loadedWorkingProgressbar =  document.createElement("hbox");
	loadedWorkingProgressbar.setAttribute("id", "ESB_loaded_working_progressbar");
	loadedWorkingProgressbar.setAttribute("hidden", "true");
	var loadedWorkingProgressbarHbox =  document.createElement("hbox");
	loadedWorkingProgressbarHbox.appendChild(loadedWorkingProgressbar);
	
	var loadedFinishedProgressbar =  document.createElement("hbox");
	loadedFinishedProgressbar.setAttribute("id", "ESB_loaded_finished_progressbar");
	loadedFinishedProgressbar.setAttribute("flex", "1");
	loadedFinishedProgressbar.setAttribute("hidden", "true");
	var loadedFinishedProgressbarHbox =  document.createElement("hbox");
	loadedFinishedProgressbarHbox.appendChild(loadedFinishedProgressbar);
	
	var loadedBox =  document.createElement("stack");
	loadedBox.setAttribute("id", "ESB_loaded_box");
	loadedBox.draggable = false;
	loadedBox.addEventListener("dragstart", onDragStart, false);
	loadedBox.appendChild(loadedFinishedProgressbarHbox);
	loadedBox.appendChild(loadedWorkingProgressbarHbox);
	loadedBox.appendChild(loadedLabelHbox);
	
	//ESB_speed_box
	var speedLabel = document.createElement("label");
	speedLabel.setAttribute("id", "ESB_speed_label");
	var speedBox =  document.createElement("hbox");
	speedBox.setAttribute("id", "ESB_speed_box");
	speedBox.draggable = false;
	speedBox.setAttribute("pack", "end");
	speedBox.setAttribute("align", "center");
	speedBox.addEventListener("dragstart", onDragStart, false);
	speedBox.appendChild(speedLabel);
	
	//ESB_time_box
	var timeLabel = document.createElement("label");
	timeLabel.setAttribute("id", "ESB_time_label");
	var timeBox =  document.createElement("hbox");
	timeBox.setAttribute("id", "ESB_time_box");
	timeBox.draggable = false;
	timeBox.setAttribute("pack", "end");
	timeBox.setAttribute("align", "center");
	timeBox.addEventListener("dragstart", onDragStart, false);
	timeBox.appendChild(timeLabel);
	
	//ESB_status_bar
	var esbStatusBar = document.createElement("hbox");
	esbStatusBar.addEventListener("dragover", onDragOver, false);
	esbStatusBar.setAttribute("id", "ESB_status_bar");
	
	percentBox.esbPosition = Services.prefs.getIntPref("extensions.extendedstatusbar.percentposition");
	imagesBox.esbPosition = Services.prefs.getIntPref("extensions.extendedstatusbar.imagesposition");
	loadedBox.esbPosition = Services.prefs.getIntPref("extensions.extendedstatusbar.loadedposition");
	speedBox.esbPosition = Services.prefs.getIntPref("extensions.extendedstatusbar.speedposition");
	timeBox.esbPosition = Services.prefs.getIntPref("extensions.extendedstatusbar.timeposition");
	insertBox(percentBox);
	insertBox(imagesBox);
	insertBox(loadedBox);
	insertBox(speedBox);
	insertBox(timeBox);
	function insertBox(node)
	{
		var childNodes = esbStatusBar.childNodes;
		var futureNextSibling = null;
		if(childNodes.length > 0)
		{
			for (var i = 0; i < childNodes.length; i++)
			{
				if(node.esbPosition < childNodes[i].esbPosition)
				{
					futureNextSibling = childNodes[i];
					break;
				}
			}
			if(futureNextSibling)
				esbStatusBar.insertBefore(node, futureNextSibling);
			else
				esbStatusBar.appendChild(node);
		}
		else
		{
			esbStatusBar.appendChild(node);
		}
	}
	
	//refreshing positions in case of messed up prefs
	var childNodes = esbStatusBar.childNodes;
	for (var i = 0; i < childNodes.length; i++)
	{
		childNodes[i].esbPosition = i;
	}
	Services.prefs.setIntPref("extensions.extendedstatusbar.percentposition", percentBox.esbPosition);
	Services.prefs.setIntPref("extensions.extendedstatusbar.imagesposition", imagesBox.esbPosition);
	Services.prefs.setIntPref("extensions.extendedstatusbar.loadedposition", loadedBox.esbPosition);
	Services.prefs.setIntPref("extensions.extendedstatusbar.speedposition", speedBox.esbPosition);
	Services.prefs.setIntPref("extensions.extendedstatusbar.timeposition", timeBox.esbPosition);
	
	let esbToolbaritem = document.createElement("toolbaritem");
	esbToolbaritem.id = "ESB_toolbaritem";
	esbToolbaritem.setAttribute("removable", "true");
	esbToolbaritem.setAttribute("title", "Extended Statusbar");
	esbToolbaritem.appendChild(esbStatusBar);
	return esbToolbaritem;
}

function $(node, childId) {
	if (node.getElementById) {
		return node.getElementById(childId);
	} else {
		return node.querySelector("#" + childId);
	}
}

var branch = "extensions.extendedstatusbar.";

function getPlacement() {
	var p = Services.prefs.getBranch(branch);
	return {
		toolbarId : p.getCharPref("toolbarid"),
		nextItemId : p.getCharPref("nextitemid")
	};
}

function setPlacement(toolbarId, nextItemId) {
	var p = Services.prefs.getBranch(branch);
	p.setCharPref("toolbarid", toolbarId || "");
	p.setCharPref("nextitemid", nextItemId || "");
}

function afterCustomize(e) {
	var toolbox = e.target,
		est = $(toolbox.parentNode, "ESB_toolbaritem"),
		toolbarId, nextItemId;
	if (est) {
		var parent = est.parentNode,
			nextItem = est.nextSibling;
		if (parent && parent.localName == "toolbar") {
			toolbarId = parent.id;
			nextItemId = nextItem && nextItem.id;
		}
	}
	setPlacement(toolbarId, nextItemId);
}

function loadIntoWindow(window) 
{
	var document = window.document;
	
	//ESB_toolbaritem
	if(isPostAustralis)
	{		
		//ESB_toolbarspacer
		var esbToolbarspacer = document.createElement("toolbarspacer");
		esbToolbarspacer.setAttribute("id", "ESB_toolbarspacer");
		esbToolbarspacer.setAttribute("flex", "1");
		
		//ESB_toolbar
		var esbToolbar = document.createElement("toolbar");
		esbToolbar.setAttribute("id", "ESB_toolbar");
		esbToolbar.setAttribute("toolbarname", "Extended Statusbar");
		esbToolbar.setAttribute("toolboxid", "navigator-toolbox");
		esbToolbar.setAttribute("accesskey", "E");
		esbToolbar.setAttribute("class", "toolbar-primary chromeclass-toolbar");
		esbToolbar.setAttribute("customizable", "true");
		esbToolbar.setAttribute("context", "toolbar-context-menu");
		esbToolbar.setAttribute("hidden", "false");
		var esbCollapsed;
		try {
			esbCollapsed = Services.prefs.getBoolPref("extensions.extendedstatusbar.collapsed");
		} catch(e) {
			esbCollapsed = "false";
		}
		esbToolbar.setAttribute("collapsed", esbCollapsed);
		esbToolbar.setAttribute("persist", "hidden");
		esbToolbar.setAttribute("mode", "icons");
		esbToolbar.setAttribute("iconsize", "small");
   		esbToolbar.addEventListener("onmouseover", function() { XULExtendedStatusbarChrome.showESBOnHover(); });
        esbToolbar.addEventListener("onmouseout", function() { XULExtendedStatusbarChrome.hideESBOnHover(); });
		esbToolbar.appendChild(esbToolbarspacer);
		
		document.getElementById("browser-bottombox").appendChild(esbToolbar);
	
		//Let the toolbar be customizable and element placement correctly saved
		CustomizableUI.registerArea("ESB_toolbar",{
			type: CustomizableUI.TYPE_TOOLBAR,
			defaultPlacements: ["ESB_toolbaritem","ESB_toolbarspacer"]});
	}
	else
	{	
		var esbToolbaritem = buildESB(document);
		window.esbToolbaritem = esbToolbaritem;

		var toolbox = $(document, "navigator-toolbox");
		toolbox.palette.appendChild(esbToolbaritem);

		var {toolbarId, nextItemId} = getPlacement(),
			toolbar = toolbarId && $(document, toolbarId),
			nextItem = toolbar && $(document, nextItemId);

		var esb_id = "ESB_toolbaritem";
		if (toolbar) {
			if (nextItem && nextItem.parentNode && nextItem.parentNode.id == toolbarId) {
				toolbar.insertItem(esb_id, nextItem);
			} else {
				var ids = (toolbar.getAttribute("currentset") || "").split(",");
				nextItem = toolbarId == "addon-bar" ? toolbar.firstChild : null;
				for (var i = ids.indexOf(esb_id) + 1; i > 0 && i < ids.length; i++) {
					nextItem = $(document, ids[i])
					if (nextItem) {
						break;
					}
				}
				toolbar.insertItem(esb_id, nextItem);
			}
			if (toolbar.getAttribute("collapsed") == "true") {
				window.setToolbarVisibility(toolbar, true);
			}
		}

		window.addEventListener("aftercustomization", afterCustomize, false);
	}
		
/*	<toolbarpalette id="BrowserToolbarPalette">
		<toolbaritem id="ESB_toolbaritem" title="Extended Statusbar" removable="true">
			<hbox id="ESB_status_bar">
				<stack id="ESB_percent_box" tooltiptext="&esb.percentage;">
					<hbox>
						<hbox id="ESB_percent_progressbar"/>
					</hbox>
					<hbox pack="end" align="center">
						<label id="ESB_percent_label"/>
					</hbox>
				</stack>
				<hbox id="ESB_images_box" tooltiptext="&esb.loadedimages;" pack="center" align="center">
					<label id="ESB_images_label"/>
				</hbox>
				<stack id="ESB_loaded_box" tooltiptext="&esb.dataloaded;">
					<hbox>
						<hbox id="ESB_loaded_finished_progressbar" flex="1" hidden="true"/>
					</hbox>
					<hbox>
						<hbox id="ESB_loaded_working_progressbar" hidden="true"/>
					</hbox>
					<hbox pack="center" align="center">
						<label id="ESB_loaded_label"/>
					</hbox>
				</stack>
				<hbox id="ESB_speed_box" tooltiptext="&esb.avgspeed;" pack="end" align="center">
					<label id="ESB_speed_label"/>
				</hbox>
				<hbox id="ESB_time_box" tooltiptext="&esb.time;" pack="end" align="center">
					<label id="ESB_time_label"/>
				</hbox>
			</hbox>
		</toolbaritem>
	</toolbarpalette>
	
	<vbox id="browser-bottombox">
		<toolbar id="ESB_toolbar" toolbarname="Extended Statusbar" toolboxid="navigator-toolbox" accesskey="E" class="toolbar-primary chromeclass-toolbar" customizable="true" context="toolbar-context-menu" hidden="false" persist="hidden" mode="icons" iconsize="small" onmouseover="XULExtendedStatusbarChrome.showESBOnHover();" onmouseout="XULExtendedStatusbarChrome.hideESBOnHover();">
			<toolbarspacer id="ESB_toolbarspacer" flex="1"/>
		</toolbar>
	</vbox> */
	
	XPCOMUtils.defineLazyGetter(this, "XULExtendedStatusbarChrome", function() {
		Services.scriptloader.loadSubScript("chrome://extendedstatusbar/content/extendedstatusbar.js", window);
		return window.XULExtendedStatusbarChrome;
	});
		
	XULExtendedStatusbarChrome.init();
}
function unloadFromWindow(window) 
{
	var document = window.document;
	
	if (isPostAustralis)
	{
		var esbToolbar = document.getElementById("ESB_toolbar");
		if(esbToolbar)
		{
			document.getElementById("browser-bottombox").removeChild(esbToolbar);
			var externalToolbars = window.gNavToolbox.externalToolbars;
			externalToolbars.splice(externalToolbars.indexOf(esbToolbar), 1);
		}
	}
	else
	{
		window.removeEventListener("aftercustomization", afterCustomize, false);
		var esbToolbaritem = window.esbToolbaritem;
		esbToolbaritem.parentNode.removeChild(esbToolbaritem);
		window.esbToolbaritem = null;
	}
	
	XULExtendedStatusbarChrome.uninit();
}
function forEachOpenWindow(todo)  // Apply a function to all open browser windows
{
    var windows = Services.wm.getEnumerator("navigator:browser");
    while (windows.hasMoreElements())
        todo(windows.getNext().QueryInterface(Components.interfaces.nsIDOMWindow));
}
var WindowListener =
{
    onOpenWindow: function(xulWindow)
    {
        var window = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                              .getInterface(Components.interfaces.nsIDOMWindow);
        function onWindowLoad()
        {
            window.removeEventListener("load",onWindowLoad);
            if (window.document.documentElement.getAttribute("windowtype") == "navigator:browser")
                loadIntoWindow(window);
        }
        window.addEventListener("load",onWindowLoad);
    },
    onCloseWindow: function(xulWindow) { },
    onWindowTitleChange: function(xulWindow, newTitle) { }
};

// default pref handler

function getGenericPref(branch,prefName)
{
    switch (branch.getPrefType(prefName))
    {
        default:
        case 0:   return undefined;                      // PREF_INVALID
        case 32:  return getUCharPref(prefName,branch);  // PREF_STRING
        case 64:  return branch.getIntPref(prefName);    // PREF_INT
        case 128: return branch.getBoolPref(prefName);   // PREF_BOOL
    }
}
function setGenericPref(branch,prefName,prefValue)
{
    switch (typeof prefValue)
    {
      case "string":
          setUCharPref(prefName,prefValue,branch);
          return;
      case "number":
          branch.setIntPref(prefName,prefValue);
          return;
      case "boolean":
          branch.setBoolPref(prefName,prefValue);
          return;
    }
}
function setDefaultPref(prefName,prefValue)
{
    var defaultBranch = Services.prefs.getDefaultBranch(null);
    setGenericPref(defaultBranch,prefName,prefValue);
}
function getUCharPref(prefName,branch)  // Unicode getCharPref
{
    branch = branch ? branch : Services.prefs;
    return branch.getComplexValue(prefName, Components.interfaces.nsISupportsString).data;
}
function setUCharPref(prefName,text,branch)  // Unicode setCharPref
{
    var string = Components.classes["@mozilla.org/supports-string;1"]
                           .createInstance(Components.interfaces.nsISupportsString);
    string.data = text;
    branch = branch ? branch : Services.prefs;
    branch.setComplexValue(prefName, Components.interfaces.nsISupportsString, string);
}
