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

net.dryuf.registerClass("net.dryuf.textual.DateTextual", "net.dryuf.textual.PreTrimTextual",
{
	constructor:			function() { return this; },

	checkTriple:			function(y, m, d)
	{
		try {
			var dt = new Date;
			dt.setUTCHours(0);
			dt.setUTCMinutes(0);
			dt.setUTCSeconds(0);
			dt.setUTCMilliseconds(0);
			dt.setUTCFullYear(y);
			dt.setUTCMonth(m-1);
			dt.setUTCDate(d);
			return dt.getTime();
		}
		catch (e) {
			return null;
		}
	},

	check:				function(text, style)
	{
		var match;
		if ((match = text.match(/^(\d{1,2})\s*\.\s*(\d{1,2})\s*\.\s*(\d{4})$/)) == null || this.checkTriple(match[3], match[2], match[1]) == null)
			return "net.dryuf.textual.DateTextual^format dd.mm.yyyy required";
		return null;
       	},

	convert:				function(text, style)
	{
		var match;
		var internal;
		if ((match = text.match(/^(\d{1,2})\s*\.\s*(\d{1,2})\s*\.\s*(\d{4})$/)) == null || (internal = this.checkTriple(match[3], match[2], match[1])) == null)
			throw new Error("net.dryuf.textual.DateTextual^invalid format for date, no check performed?");
		return internal;
	},

	format:					function(internal, style)
	{
		var d = new Date;
		d.setTime(internal);
		return d.getUTCDate()+"."+(d.getUTCMonth()+1)+"."+d.getUTCFullYear();
	},

	convertKey:				function(text)
	{
		return Number(text);
	}
});
