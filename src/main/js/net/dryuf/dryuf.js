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

if (typeof net == "undefined")
	net = {};

if (typeof net.dryuf == "undefined") {
	// base dryuf attributes, all of them can be overwritten
	net.dryuf = {
		serverHash:			"0",
		serverPath:			"/",
		debug:				{ timing: 0, localize: 0 },
		test:				{},
		lang:				"en",
		translation:			{},
		is_std:				!document.all || document.opera,
		is_mozilla:			null,
		is_ie:				document.all && !document.opera,
		agent:				null,
		classesHash:			{},
		loaderCount:			0,
		tz:				(function() {
							var m;
							if (m = (new Date).toTimeString().match(/^.*\(([A-Z]+)\)$/))
								return m[1];
							else if (m = (new Date).toTimeString().match(/^.*?([A-Z]+)$/))
								return m[1];
							else if (m = (new Date).toLocaleString().match(/^.*?([A-Z]+)$/))
								return m[1];
							var d = new Date(); d.setDate(1);
							d.setMonth(0);
							var woff = d.getTimezoneOffset();
							d.setMonth(5);
							var soff = d.getTimezoneOffset();
							return -woff+"/"+-soff;
						})(),
	};

	net.dryuf.agent = (function() {
		var agent = navigator.userAgent.toLowerCase();
		if (agent.match(/chrome/)) return 'chrome';
		if (agent.match(/firefox/)) return 'mozilla';
		if (agent.match(/khtml/)) return 'khtml';
		if (agent.match(/opera/)) return 'opera';
		if (agent.match(/msie/)) return 'msie';
		if (agent.match(/mozilla/)) return 'mozilla';
		return 'unknown';
	})();
	net.dryuf.is_mozilla = net.dryuf.agent == 'mozilla';

	net.dryuf.srvArgs = function()
	{
		return "&srvhash="+net.dryuf.serverHash+"&lang="+net.dryuf.lang+"&tz="+net.dryuf.tz;
	};

	net.dryuf.getStackTrace = function()
	{
		try {
			throw new Error();
		}
		catch (ex) {
			return ex.stack;
		}
	};

	net.dryuf.reportError = function(text)
	{
		throw new Error(text+": "+net.dryuf.getStackTrace());
	};

	net.dryuf.assert = function(val)
	{
		if (val)
			return;
		try {
			throw new Error();
		}
		catch (e) {
			throw new Error("assert failed: "+e.stack);
		}
	};

	net.dryuf.invalid = function(text)
	{
		net.dryuf.reportError(text);
	};

	net.dryuf.defvalue = function(val, def)
	{
		return val === null ? def : val;
	};

	net.dryuf.nullifempty = function(val)
	{
		return val ? val : null;
	};

	net.dryuf.hashObj = function(obj)
	{
		var h = 0, i;
		switch (typeof(obj)) {
		case 'number':
			h = Math.floor(obj)&0x7fffffff;
			break;

		case 'string':
			for (i = 0; i < obj.length; i++) {
				h *= 17;
				h += obj.charCodeAt(i);
			}
			return h;

		case 'object':
			if ("splice" in obj && "join" in obj) {
				net.dryuf.foreach(function(v, i) { h *= 19; h += net.dryuf.hashObj(v); }, obj);
			}
			else {
				net.dryuf.foreachKey(function(v, k) { h *= 19; h += net.dryuf.hashObj(k)*3; h += net.dryuf.hashObj(v); }, obj);
			}
			break;

		case 'function':
			h = 0x12345679;
			break;

		case 'undefined':
			h = 0x12345678;
			break;

		default:
			net.dryuf.assert(0);
		}
		return h;
	};

	net.dryuf.eqObj = function(o0, o1)
	{
		if (typeof o0 != typeof o1)
			return false;
		var i = null;
		switch (typeof o0) {
		case 'object':
			if (o0 instanceof Array != o1 instanceof Array)
				return false;
			if (o0 instanceof Array) {
				if (o0.length != o1.length)
					return false;
				for (i = 0; i < o0.length; i++) {
					if (!net.dryuf.eqObj(o0[i], o1[i]))
						return false;
				}
			}
			else {
				var done = {};
				for (i in o0) {
					if (!(i in o1) || ((typeof o0[i] != 'function' || typeof o1[i] != 'function') && !net.dryuf.eqObj(o0[i], o1[i])))
						return false;
					done[i] = true;
				}
				for (i in o1) {
					if (!done[i])
						return false;
				}
			}
			return true;

		case 'undefined':
			return true;

		default:
			return o0 == o1;
		}
	};

	net.dryuf.unimplemented = function()
	{
		throw new Error("function not implemented");
	};

	net.dryuf.defvalue = function(val)
	{
		for (var i = 0; i < arguments.length; i++) {
			if (arguments[i] != null)
				return arguments[i];
		}
		return null;
	};

	net.dryuf.safe = function(func)
	{
		try {
			return func();
		}
		catch (ex) {
		}
	};

	net.dryuf.bind = function(obj, met)
	{
		return function() { met.apply(obj, arguments); };
	};

	net.dryuf.bindThis = function(obj, met)
	{
		if (!met)
			net.dryuf.reportError("met is null");
		return function() { met.apply(obj, [ this ]); };
	};

	net.dryuf.bindArg = function(obj, met, arg)
	{
		return function() { met.apply(obj, [ arg ]); };
	};

	net.dryuf.foreach = function(processor, list)
	{
		net.dryuf.assert(list != null);
		for (var i = 0, l = list.length; i < l; i++)
			processor(list[i], i);
	};

	net.dryuf.downeach = function(processor, list)
	{
		net.dryuf.assert(list != null);
		for (var i = list.length; i--; )
			processor(list[i], i);
	};

	net.dryuf.foreachKey = function(processor, hash)
	{
		net.dryuf.assert(hash != null);
		for (var i in hash)
			processor(hash[i], i);
	};

	/**
	  * processes the list and returns the list built from results returned by processor
	  */
	net.dryuf.map = function(processor, list)
	{
		net.dryuf.assert(list != null);
		var out = [];
		for (var i = 0, l = list.length; i < l; i++)
			out.push(processor(list[i], i));
		return out;
	};

	/**
	  * processes the hash and returns the list built from results returned by processor
	  */
	net.dryuf.mapKey = function(processor, hash)
	{
		net.dryuf.assert(hash != null);
		var out = [];
		for (var i in hash) {
			if (typeof(hash[i]) != "function")
				out.push(processor(hash[i], i));
		}
		return out;
	};

	net.dryuf.filter = function(processor, list)
	{
		net.dryuf.assert(list != null);
		var out = [];
		for (var i = 0, l = list.length; i < l; i++) {
			if (processor(list[i], i))
				out.push(list[i]);
		}
		return out;
	};

	/**
	  * processes the list and returns the list concatenated from optional lists returned by processor
	  */
	net.dryuf.listMap = function(processor, list)
	{
		net.dryuf.assert(list != null);
		var out = [];
		for (var i = 0, l = list.length; i < l; i++) {
			var s = processor(list[i], i);
			if (s != null)
				out = out.concat(s);
		}
		return out;
	};

	/**
	  * processes the list and returns the hash concatenated from optional pairs returned by processor
	  */
	net.dryuf.hashMap = function(processor, list)
	{
		net.dryuf.assert(list != null);
		var hash = {};
		for (var i = 0, l = list.length; i < l; i++) {
			var r;
			if (r = processor(list[i], i))
				hash[r[0]] = r[1];
		}
		return hash;
	};

	/**
	  * processes the hash and returns the hash concatenated from optional pairs returned by processor
	  */
	net.dryuf.hashMapKey = function(processor, hash)
	{
		net.dryuf.assert(hash != null);
		var out = {};
		for (var i in hash) {
			var r;
			if (r = processor(hash[i], i))
				out[r[0]] = r[1];
		}
		return out;
	};

	/**
	 * Processes the list and returns hash containing elements as keys
	 */
	net.dryuf.arrayToHash = function(keys, value)
	{
		var out = {};
		net.dryuf.foreach(function (key) { out[key] = value; }, keys);
		return out;
	};

	net.dryuf.mergeKeyAdd = function(base, add)
	{
		var i = null, out = {};
		for (i in base)
			out[i] = base[i];
		for (i in add)
			if (out[i] == null)
				out[i] = add[i];
		return out;
	};

	net.dryuf.mergeKeyReplace = function(base, add)
	{
		var i = null, out = {};
		for (i in base)
			out[i] = base[i];
		for (i in add)
			out[i] = add[i];
		return out;
	};

	net.dryuf.find = function(comparator, list)
	{
		if (list == null)
			net.dryuf.reportError("list is undefined");
		for (var i = 0, l = list.length; i < l; i++) {
			if (comparator(list[i], i))
				return list[i];
		}
	};

	net.dryuf.require = function(classname)
	{
		net.dryuf.assert(classname);
		if (typeof net.dryuf.classesHash == "undefined")
			net.dryuf.classesHash = {};
		if (typeof net.dryuf.classesHash[classname] != "undefined")
			return net.dryuf.classesHash[classname];

		var js_cn = classname.replace(/::/g, ".");
		var file_cn = classname.replace(/::/g, "/");

		for (var p = 0, n = 0; (n = js_cn.indexOf(".", p)) >= 0; p = n+1) {
			if (eval("typeof "+js_cn.substr(0, n)+" == \"undefined\""))
				eval(js_cn.substr(0, n)+" = {}");
		}

		if (eval("typeof "+js_cn+" == \"undefined\"")) {
			if (0) {
				net.dryuf.gui.GuiDom.addElement(document.getElementById("dr_js"), "script", { "type": "text/javascript", "src": "/resources/"+file_cn+".js" });
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
					var thread = Components.classes["@mozilla.org/thread-manager;1"].getService(Components.interfaces.nsIThreadManager).currentThread;
					for (var timeout = new Date()+3000; eval("typeof "+js_cn+" == \"undefined\""); ) {
						if (new Date > timeout)
							throw Error("Failed to load class "+classname);
						thread.processNextEvent(true);
					}
				}
				catch (ex) {
					alert("Using alert to load the script: "+ex.toString()+"\n"+ex.stack);
				}
			}
			else {
				var source;
				if ((source = net.dryuf.core.Ajax.runAjaxSync(net.dryuf.serverPath+"resources/"+classname.replace(/\./g, "/")+".js", null)) == null) {
					throw new Error("Fatal error: failed to load class "+classname);
				}
				else {
					try {
						(function(){ eval(source); })();
					}
					catch (ex) {
						throw ex;
					}
				}
			}
		}
		net.dryuf.classesHash[classname] = eval(js_cn);
		if (!net.dryuf.classesHash[classname])
			net.dryuf.reportError("loaded class "+classname+" but the class was not registered");
		return net.dryuf.classesHash[classname];
	};

	net.dryuf.requireAsync = function(callback)
	{
		var syncer = new net.dryuf.core.ParallelSync(callback);
		for (var i = 1; i < arguments.length; i++) {
			var js_cn = arguments[i].replace(/::/g, ".");
			if (typeof net.dryuf.classesHash[js_cn] == "undefined") {
				var head = (document.getElementsByTagName("head"))[0];
				net.dryuf.gui.GuiDom.addElement(head, "script", {
					type:		"text/javascript",
					src:		net.dryuf.serverPath+"resources/"+js_cn.replace(/\./g, "/")+".js",
					onload:		syncer.getPartialCb(),
					onerror:	function() { net.dryuf.reportError("failed to load class: '"+js_cn+"'"); },
				});
			}
		}
		syncer.start();
	};

	net.dryuf.capitalize = function(s)
	{
		return s.charAt(0).toUpperCase()+s.substring(1);
	};

	net.dryuf.sprintf = function(format)
	{
		var exp = /(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g;
		var matches = [];
		var strings = [];
		var argp = 0;
		var stringPosStart = 0;
		var stringPosEnd = 0;
		var matchPosEnd = 0;
		var newString = '';
		var match = null;

		while (match = exp.exec(format)) {
			if (match[9])
				argp += 1;

			stringPosStart = matchPosEnd;
			stringPosEnd = exp.lastIndex - match[0].length;
			strings[strings.length] = format.substring(stringPosStart, stringPosEnd);

			matchPosEnd = exp.lastIndex;
			matches[matches.length] = {
				match: match[0],
				left: match[3] ? true : false,
				sign: match[4] || '',
				pad: match[5] || ' ',
				min: match[6] || 0,
				precision: match[8],
				code: match[9] || '%',
				negative: parseInt(arguments[argp]) < 0 ? true : false,
				argument: String(arguments[argp])
			};
		}
		strings[strings.length] = format.substring(matchPosEnd);

		if (matches.length == 0) { return format; }
		if ((arguments.length - 1) < argp) { return null; }

		var i = null;

		for (i=0; i < matches.length; i++) {
			if (matches[i].code == '%') {
				substitution = '%';
			}
			else if (matches[i].code == 'b') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
				substitution = net.dryuf.sprintfConvert(matches[i], true);
			}
			else if (matches[i].code == 'c') {
				matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
				substitution = net.dryuf.sprintfConvert(matches[i], true);
			}
			else if (matches[i].code == 'd') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
				substitution = net.dryuf.sprintfConvert(matches[i]);
			}
			else if (matches[i].code == 'f') {
				matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
				substitution = net.dryuf.sprintfConvert(matches[i]);
			}
			else if (matches[i].code == 'o') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
				substitution = net.dryuf.sprintfConvert(matches[i]);
			}
			else if (matches[i].code == 's') {
				matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length);
					substitution = net.dryuf.sprintfConvert(matches[i], true);
			}
			else if (matches[i].code == 'x') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
				substitution = net.dryuf.sprintfConvert(matches[i]);
			}
			else if (matches[i].code == 'X') {
				matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
				substitution = net.dryuf.sprintfConvert(matches[i]).toUpperCase();
			}
			else {
				substitution = matches[i].match;
			}

			newString += strings[i];
			newString += substitution;

		}
		newString += strings[i];

		return newString;
	};

	net.dryuf.sprintfConvert = function(match, nosign)
	{
		if (nosign) {
			match.sign = '';
		}
		else {
			match.sign = match.negative ? '-' : match.sign;
		}
		var l = match.min - match.argument.length + 1 - match.sign.length;
		var pad = new Array(l < 0 ? 0 : l).join(match.pad);
		if (!match.left) {
			if (match.pad == "0" || nosign) {
				return match.sign + pad + match.argument;
			}
			else {
				return pad + match.sign + match.argument;
			}
		}
		else {
			if (match.pad == "0" || nosign) {
				return match.sign + match.argument + pad.replace(/0/g, ' ');
			} else {
				return match.sign + match.argument + pad;
			}
		}
	};

	net.dryuf.clocalize = function(cls, str)
	{
		var trans_table = cls ? cls._$translation : null;
		switch (net.dryuf.debug.localize) {
		default:
			return trans_table && str in trans_table ? trans_table[str] : str;

		case 1:
			return trans_table && str in trans_table ? trans_table[str] : "-"+cls.clsname+"-"+str+"-";

		case 2:
			return "-"+cls.clsname+"-"+str+"-";
		}
	};

	net.dryuf.localize = function(clsname, str)
	{
		if (!clsname)
			net.dryuf.reportError("empty classname: "+clsname);
		var trans_table = net.dryuf.translation[clsname];
		if (!trans_table) {
			net.dryuf.translation[clsname] = trans_table = net.dryuf.core.Eval.evalSafe("("+net.dryuf.core.Ajax.runAjaxSync(net.dryuf.serverPath+"_translation/"+clsname+"/?lang="+net.dryuf.lang, null)+")");
		}
		switch (net.dryuf.debug.localize) {
		default:
			return trans_table && str in trans_table ? trans_table[str] : str;

		case 1:
			return trans_table && str in trans_table ? trans_table[str] : "-"+clsname+"-"+str+"-";

		case 2:
			return "-"+clsname+"-"+str+"-";
		}
	};

	net.dryuf.tlocalize = function(str)
	{
		var m;
		if (!(m = str.match(/^(((\w+::)*\w+)|((\w+\.)*\w+))^(.*)$/))) {
			if (net.dryuf.debug.localize > 0)
				net.dryuf.reportError("invalid localize string passed");
			return str;
		}
		return net.dryuf.tlocalize(m[2] == null ? m[4].replace(/\./, '.') : m[2], m[6]);
	};

	net.dryuf.registerPackage = function(package)
	{
		var dclassname = package+".";
		for (var p = 0, n = 0; (n = dclassname.indexOf(".", p)) >= 0; p = n+1) {
			if (eval("typeof "+dclassname.substr(0, n)+" == \"undefined\""))
				eval(dclassname.substr(0, n)+" = {}");
		}
	};

	net.dryuf.registerClass = function(classname, superclassName, implementation)
	{
		var dclassname = null;
		if (classname) {
			if (!net.dryuf.classesHash)
				net.dryuf.classesHash = {};
			else if (net.dryuf.classesHash[classname])
				return net.dryuf.classesHash[classname];
			dclassname = classname.replace(/::/g, ".");
			if (!dclassname)
				net.dryuf.reportError("wrong dclassname: "+dclassname);
		}
		try {
			var cls;
			var dummyConstructor = null;
			var superclass;

			if (superclassName != null)
				var superclass = net.dryuf.require(superclassName);

			if (typeof implementation.constructor != "function" || implementation.constructor == {}.constructor) {
				//throw new Error("Constructor must be always defined, even for utility classes");
				dummyConstructor = superclass ? function() { superclass.constructor(); } : function() {};
			}
			if (classname) {
				for (var p = 0, n = 0; (n = dclassname.indexOf(".", p)) >= 0; p = n+1) {
					if (eval("typeof "+dclassname.substr(0, n)+" == \"undefined\""))
						eval(dclassname.substr(0, n)+" = {}");
				}
				//var pkg = eval(dclassname.substr(0, dclassname.lastIndexOf(".")));
				//alert(dclassname+" = function() { this.constructor.apply(this, arguments); }\n");
				eval(dclassname+" = function() { this.constructor.apply(this, arguments); }\n");
				//pkg[dclassname.substr(dclassname.lastIndexOf(".")+1)] = dummyConstructor ? dummyConstructor : implementation.constructor;
				cls = eval(dclassname);
				cls.prototype.constructor = dummyConstructor ? dummyConstructor : implementation.constructor;
			}
			else {
				cls = dummyConstructor ? dummyConstructor : implementation.constructor;
			}
			if (superclassName != null) {
				var F = function() {};
				F.prototype = superclass.prototype;
				cls.prototype = new F();
				cls.superclass = superclass.prototype;
				cls.superclassClass = superclass;
				cls.prototype.superclass = superclass.prototype;
				cls.prototype.superclassClass = superclass;
				for (var stf in superclass) {
					if (!(stf in cls))
						cls[stf] = superclass[stf];
				}
			}
			for (var fn in implementation) {
				var m;
				if (m = fn.match(/^_(st\$(.*)|\$require|\$translation|\$css)$/)) {
					if (m[2] != null) {
						eval(dclassname)[m[2]] = implementation[fn];
					}
				}
				else {
					eval(dclassname).prototype[fn] = implementation[fn];
				}
			}
			if ("_$require" in implementation)
				net.dryuf.foreach(function(v) { net.dryuf.require(v); }, implementation._$require);
			if ("_$translation" in implementation) {
				net.dryuf.translation[dclassname] = net.dryuf.translation[classname] = cls._$translation = implementation._$translation;
			}
			if ("_$css" in implementation) {
				var css_el = (document.getElementsByTagName("head"))[0];
				net.dryuf.foreach(function(v) { if (css_el) net.dryuf.gui.GuiDom.addElement(css_el, "link", { rel: "stylesheet", type: "text/css", href: net.dryuf.serverPath+"resources/"+v }); else document.write("<link rel='stylesheet' type='text/css' href='"+net.dryuf.serverPath+"resources/"+v+"' />"); }, implementation._$css);
			}
			cls.clsname = dclassname;
			cls.locpref = dclassname+"^";
			if ("staticInit" in cls)
				cls.staticInit();
			if (classname) {
				net.dryuf.classesHash[classname] = cls;
			}
			var o = {};
			return cls;
		}
		catch (ex) {
			alert("failed to register class: "+classname+"\n"+ex+"\n"+ex.stack);
			throw ex;
		}
	};

	net.dryuf.createClass = function(classname)
	{
		return new (net.dryuf.require(classname))();
	};

	net.dryuf.createClassArg1 = function(classname, arg)
	{
		return new (net.dryuf.require(classname))(arg);
	};

	net.dryuf.createClassArg2 = function(classname, arg0, arg1)
	{
		return new (net.dryuf.require(classname))(arg0, arg1);
	};

	net.dryuf.createClassArg3 = function(classname, arg0, arg1, arg2)
	{
		return new (net.dryuf.require(classname))(arg0, arg1, arg2);
	};

	net.dryuf.createClassArg4 = function(classname, arg0, arg1, arg2, arg3)
	{
		return new (net.dryuf.require(classname))(arg0, arg1, arg2, arg3);
	};

	net.dryuf.genUniqueId = function()
	{
		if (!('unique_id' in net.dryuf))
			net.dryuf.unique_id = 0;
		return "druf_id_"+(new Date).getTime()+"_"+ ++net.dryuf.unique_id;
	};

	net.dryuf.appCache = function()
	{
		if (net.dryuf.app_cache == null)
			net.dryuf.app_cache = new (net.dryuf.require("net.dryuf.app.AppCache"))();
		return net.dryuf.app_cache;
	};

	net.dryuf.metaCache = function()
	{
		if (net.dryuf.meta_cache == null)
			net.dryuf.meta_cache = new (net.dryuf.require("net.dryuf.app.AppCache"))({ default_timeout: Number.MAX_VALUE });
		return net.dryuf.meta_cache;
	};

	net.dryuf.numFixedDot = function(num, prec)
	{
		return num.toFixed(prec).replace(",", ".");
	};

	(function() { net.dryuf.registerClass("net.dryuf.Dummy", null, { constructor: function() {} }); })();
}
