if ("undefined" == typeof(XULExtendedStatusbarDetails)) {
  var XULExtendedStatusbarDetails = {};
}

XULExtendedStatusbarDetails.init = function()
{
	list = document.getElementById("esbDetailsList");
	details = window.arguments[0];

	for (var i = 0; i < details.length; i++) {
		var row = document.createElement('listitem');
		var cell = document.createElement('listcell');
		cell.setAttribute("label", details[i].loaded.toLocaleString());
		cell.setAttribute("style", "text-align: right");
		row.appendChild(cell);
		cell = document.createElement('listcell');
		cell.setAttribute("label", details[i].retrieved.toLocaleString());
		cell.setAttribute("style", "text-align: right");
		row.appendChild(cell);
		cell = document.createElement('listcell');
		cell.setAttribute("label", details[i].received.toLocaleString());
		cell.setAttribute("style", "text-align: right");
		row.appendChild(cell);
		cell = document.createElement('listcell');
		cell.setAttribute("label", details[i].sent.toLocaleString());
		cell.setAttribute("style", "text-align: right");
		row.appendChild(cell);
		cell = document.createElement('listcell');
		cell.setAttribute("label", this.getType(details[i].type));
		row.appendChild(cell);
		cell = document.createElement('listcell');
		cell.setAttribute("label", this.getName(details[i].name));
		row.appendChild(cell);
		list.appendChild(row);
	}
}

XULExtendedStatusbarDetails.updateTypes = function()
{
	list = document.getElementById("esbDetailsList");
	details = window.arguments[0];
	this.rawType = !document.getElementById("checkesbrawtype").checked;

	for (var i = 0; i < details.length; i++)
	{
		var item = list.getItemAtIndex(i);
		item.childNodes[4].setAttribute("label", this.getType(details[i].type));
	}
}

XULExtendedStatusbarDetails.updateNames = function()
{
	list = document.getElementById("esbDetailsList");
	details = window.arguments[0];
	this.rawName = !document.getElementById("checkesbrawname").checked;

	for (var i = 0; i < details.length; i++)
	{
		var item = list.getItemAtIndex(i);
		item.childNodes[5].setAttribute("label", this.getName(details[i].name));
	}
}

XULExtendedStatusbarDetails.getType = function(aType)
{
	if (this.rawType || aType == "")
		return aType;

	if (aType.indexOf("html") != -1)
		return document.getElementById("strings").getString("esb.document");

	if (aType.substr(0,5) == "image")
		return document.getElementById("strings").getString("esb.image");

	if (aType.indexOf("script") != -1)
		return document.getElementById("strings").getString("esb.script");

	if (aType == "text/css")
		return document.getElementById("strings").getString("esb.style");

	return document.getElementById("strings").getString("esb.other");
}

XULExtendedStatusbarDetails.getName = function(aName)
{
	if (this.rawName)
		return aName;

	if (aName.substr(0,4) == "data")
		return document.getElementById("strings").getString("esb.data");

	// Keep the first argument, strip the rest.
	var name = aName.match(/^.*\/([^#?]+)(?:#|(\?[^&]+))?/);
	if (name[2])
		return name[1] + name[2];
	return name[1];
}
