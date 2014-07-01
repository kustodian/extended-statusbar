
if(Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator)
	.compare(Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo).version, "29.0") >= 0)
{
	window.openDialog("chrome://extendedstatusbar/content/extendedstatusbaroptionsFF29.xul", "", "chrome,modal");
}
else
{
	window.openDialog("chrome://extendedstatusbar/content/extendedstatusbaroptions.xul", "", "chrome,modal");
}
window.parent.focus();
window.close();