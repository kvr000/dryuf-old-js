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

(function() { var cls = net.dryuf.registerClass("net.dryuf.core.Dump", null,
{
	constructor:			function(owner, additional)
	{
	},

	_st$dump:			function(obj, level)
	{
		var dumped_text = "";
		if (!level)
			level = 0;

		var level_padding = "";
		for(var j = 0; j < level+1; j++)
			level_padding += "\t";

		if (obj === undefined || obj === null) {
			dumped_text = String(obj);
		}
		else if (typeof(obj) == 'object') { //Array/Hashes/Objects
			try {
				var item = null, value, sub;
				if (obj instanceof Array) {
					sub = "(array) ["+obj.length+"]\n";
					for (item = 0; item < obj.length; item++) {
						value = obj[item];
						sub += level_padding+"\t"+item+"\t: "+cls.dump(value, level+1);
					}
				}
				else {
					sub = "("+typeof(obj)+")\n";
					for (item in obj) {
						value = obj[item];
						sub += level_padding+"\t"+item+"\t: "+cls.dump(value, level+1);
					}
				}
				dumped_text += sub;
			}
			catch (e) {
				dumped_text = "'"+obj+"' ("+typeof(obj)+")\n";
			}
		}
		else if (typeof(obj) == 'number' || typeof(obj) == 'boolean') {
			dumped_text = obj+" ("+typeof(obj)+")\n";
		}
		else { //Strings/Chars etc.
			dumped_text = "'"+obj+"' ("+typeof(obj)+")\n";
		}
		return dumped_text;
	},

	_st$dumpMax:			function(arr, max, level)
	{
		var dumped_text = "";
		if (!level)
			level = 0;
		else if (level > max)
			return "--max level reached--";

		var level_padding = "";
		for(var j = 0; j < level+1; j++)
			level_padding += "\t";

		if (typeof(arr) == 'object') { //Array/Hashes/Objects
			try {
				var sub = "("+typeof(arr)+") ["+arr.length+"]\n";
				for (var item in arr) {
					var value = arr[item];
					sub += level_padding+"\t"+item+"\t: "+cls.dumpMax(value, max, level+1);
				}
				dumped_text += sub;
			}
			catch (e) {
				dumped_text = "'"+arr+"' ("+typeof(arr)+")\n";
			}
		}
		else if (typeof(arr) == 'number') {
			dumped_text = arr+" ("+typeof(arr)+")\n";
		}
		else { //Strings/Chars/Numbers etc.
			dumped_text = "'"+arr+"' ("+typeof(arr)+")\n";
		}
		return dumped_text;
	},

	_st$dumpContent:		function(obj, max)
	{
		return cls.dumpContentImpl({ max: net.dryuf.defvalue(max, 1024), listed: [], line: 1 }, obj, 0);
	},

	_st$dumpContentImpl:		function(ctx, obj, level)
	{
		var dumped_text = "";

		if (level > ctx.max)
			return "max level reached";

		var level_padding = "";
		for(var j = 0; j < level; j++)
			level_padding += "\t";

		if (obj === null) {
			return "null";
		}
		else if (typeof(obj) == 'object') { //Array/Hashes/Objects
			var found = net.dryuf.find(function(t) { return t.obj == obj; }, ctx.listed);
			if (found)
				return "already shown on line "+found.line;
			ctx.listed.push({ obj: obj, line: ctx.line });
			try {
				var item = null, value, sub;
				if (obj instanceof Array) {
					sub = "(array) "+obj.length+" [\n"; ctx.line++;
					for (item = 0; item < obj.length; item++) {
						value = obj[item];
						sub += net.dryuf.sprintf("%s\t%-24s:\t%s,\n", level_padding, item, cls.dumpContentImpl(ctx, value, level+1));
						ctx.line++;
					}
					sub += level_padding+"]";
				}
				else {
					sub = "("+typeof(obj)+") {\n"; ctx.line++;
					for (item in obj) {
						value = obj[item];
						sub += net.dryuf.sprintf("%s\t%-24s:\t%s,\n", level_padding, item, cls.dumpContentImpl(ctx, value, level+1));
						ctx.line++;
					}
					sub += level_padding+"}";
				}
				dumped_text += sub;
			}
			catch (e) {
				dumped_text = "'"+obj+"' ("+typeof(obj)+")";
			}
		}
		else if (typeof(obj) == 'function') {
			return "(function) not_shown";
		}
		else if (typeof(obj) == 'number') {
			dumped_text = obj+" ("+typeof(obj)+")";
		}
		else { //Strings/Chars etc.
			dumped_text = "'"+obj+"' ("+typeof(obj)+")";
		}
		return dumped_text;
	},
}); })();
