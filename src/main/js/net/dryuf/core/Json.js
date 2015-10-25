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

(function() { var cls = net.dryuf.registerClass("net.dryuf.core.Json", null,
{
	constructor:			function()
	{
	},

	_st$json:			function(v)
	{
		if (v === null)
			return null;
		switch (typeof(v)) {
		case 'number':
			return ""+v;

		case 'boolean':
			return ""+v;

		case 'string':
			return "\""+v.replace(/(["\\])/g, "\\$1").replace(/\n/g, "\\n").replace(/\t/g, "\\t")+"\"";

		case 'object':
			var text;
			if (v instanceof Array)
				text = "["+net.dryuf.map(function(x) { try { return cls.json(x); } catch (ex) { net.dryuf.reportError("failed to dump "+(-1)+": "+ex.toString()); } }, v).join(",")+"]";
			else
				text = "{"+net.dryuf.mapKey(function(x, k) { try { return "\""+k.replace(/(["\\])/g, '\\$1').replace(/\n/g, "\\n")+"\":"+cls.json(x); } catch (ex) { net.dryuf.reportError("failed to dump "+k+": "+ex.toString()); } }, v).join(",")+"}";
			return text;

		case 'function':
			return null;

		default:
			net.dryuf.reportError("json dumping invalid type: "+typeof(v));
		}
	},
}); })();
