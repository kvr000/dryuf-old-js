/*
 * Dryuf framework
 *
 * ----------------------------------------------------------------------------------
 *
 * Copyright (C) 2002-2015 Zbyněk Vyškovský
 *
 * ----------------------------------------------------------------------------------
 *
 * LICENSE:
 *
 * This file is part of Dryuf
 *
 * Dryuf is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 3 of the License, or (at your option)
 * any later version.
 *
 * Dryuf is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for
 * more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Dryuf; if not, write to the Free Software Foundation, Inc., 51
 * Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @author	2002-2015 Zbyněk Vyškovský
 * @link	mailto:kvr@matfyz.cz
 * @link	http://kvr.matfyz.cz/software/java/dryuf/
 * @link	http://github.com/dryuf/
 * @license	http://www.gnu.org/licenses/lgpl.txt GNU Lesser General Public License v3
 */

(function() { var cls = net.dryuf.registerClass("net.dryuf.core.Ajax", null,
{
	constructor:			function()
	{
	},

	_st$ajaxFailure:		function(status, text, url, data)
	{
		if (status == 405)
			net.dryuf.core.Ajax.ajaxNoSession();
		net.dryuf.reportError("ajax failed on "+url+" for "+data+": "+status+" "+text+"\nstacktrace:\n"+net.dryuf.getStackTrace());
	},

	_st$ajaxNoSession:		function(code, err)
	{
		alert(net.dryuf.localize("_login", "Session expired, please login again"));
	},

	_$require:			[ "net.dryuf.xml.DomUtil", "net.dryuf.core.Base64", "net.dryuf.core.Eval" ],

	_st$createAjax:			function()
	{
		try { return new XMLHttpRequest2(); } catch (e) {}
		try { return new XMLHttpRequest(); } catch (e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch(e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch(e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) {}
		try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {}
		throw new Error( "This browser does not support XMLHttpRequest." );
	},

	_st$runAjax:			function(url, data, completor, failurer)
	{
		var xhr = net.dryuf.core.Ajax.createAjax();
		if (!failurer)
			failurer = net.dryuf.core.Ajax.ajaxFailure;

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					if (xhr.responseText) {
						completor(xhr.responseText);
					}
				}
				else {
					failurer(xhr.status, xhr.responseText, url, data);
				}
			}
		};
		xhr.open(data == null ? "GET" : "POST", url, true);
		if (data)
			xhr.setRequestHeader("content-type", "text/plain; charset=UTF-8");
		xhr.send(data);
	},

	_st$runForm:			function(method, form, completor, failurer)
	{
		var xhr = net.dryuf.core.Ajax.createAjax();

		form.method = method;
		var data = new FormData(form);
		data.append("_method", method);
		if (!failurer)
			failurer = net.dryuf.core.Ajax.ajaxFailure;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					if (xhr.responseText) {
						completor(xhr.responseText);
					}
				}
				else {
					failurer(xhr.status, xhr.responseText, form.action, data);
				}
			}
		};
		xhr.open("POST", form.action, true);
		xhr.send(data);
	},

	_st$runJsonRest:		function(method, url, data, completor, failurer)
	{
		var xhr = net.dryuf.core.Ajax.createAjax();

		if (!failurer)
			failurer = net.dryuf.core.Ajax.ajaxFailure;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					if (xhr.responseText) {
						completor(xhr.responseText);
					}
				}
				else {
					failurer(xhr.status, xhr.responseText, url, data);
				}
			}
		};
		if (url.indexOf("?") < 0)
			url = url+"?";
		else
			url = url+"&";
		url += "_method="+method;
		xhr.open("POST", url, true);
		if (data)
			xhr.setRequestHeader("content-type", "application/json; charset=UTF-8");
		xhr.send(data);
	},

	_st$runAjaxBinSync:			function(url, data)
	{
		var xhr = cls.createAjax();
		var base64 = data == null ? null : net.dryuf.core.Base64.encode(data);

		xhr.open(data == null ? "GET" : "POST", url, false);
		if (data)
			xhr.setRequestHeader("content-type", "application/octet-stream");
		xhr.send(base64, true);
		if (xhr.status != 200) {
			net.dryuf.reportError("Failed to run ajax on "+url+" for "+data);
		}
		//return xhr.responseData;
		return net.dryuf.core.Base64.decode(xhr.responseText);
	},

	_st$runAjaxSync:			function(url, data)
	{
		net.dryuf.assert(url);
		var xhr = net.dryuf.core.Ajax.createAjax();

		try {
			xhr.open(data == null ? "GET" : "POST", url, false);
		}
		catch (ex) {
			net.dryuf.reportError("runAjaxSync failed on "+url+": "+ex.toString());
		}
		if (data)
			xhr.setRequestHeader("content-type", "text/plain; charset=UTF-8");
		xhr.send(data, true);
		if (xhr.status != 200) {
			net.dryuf.reportError("Failed to run ajax on "+url+" for "+data+": "+xhr.status+"\n"+xhr.responseText);
		}
		return xhr.responseText;
	},

	_st$runJsonRestSync:			function(method, url, data)
	{
		net.dryuf.assert(url);
		var xhr = net.dryuf.core.Ajax.createAjax();

		try {
			xhr.open(method, url, false);
		}
		catch (ex) {
			net.dryuf.reportError("runAjaxSync failed on "+url+": "+ex.toString());
		}
		if (data)
			xhr.setRequestHeader("content-type", "application/json; charset=UTF-8");
		xhr.send(data, true);
		if (xhr.status != 200) {
			net.dryuf.reportError("Failed to run ajax on "+url+" for "+data+": "+xhr.status+"\n"+xhr.responseText);
		}
		return xhr.responseText;
	},

	_st$runAjaxSyncXml:		function(url, data)
	{
		return new net.dryuf.xml.DomUtil.createXml(cls.runAjaxSync(url, data));
	},

	_st$runAjaxSyncXmlRoot:		function(url, data, root)
	{
		var xml = net.dryuf.xml.DomUtil.createXml(cls.runAjaxSync(url, data));
		var roots;
		if (!(roots = xml.getElementsByTagName(root)) || roots.length != 1)
			throw Error("Failed to get root "+root+ " of XML from "+url);
		return roots[0];
	},
}); })();
