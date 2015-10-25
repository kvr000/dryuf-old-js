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

net.dryuf.registerClass("net.dryuf.textual.DateTimeTextual", "net.dryuf.textual.PreTrimTextual",
{
	constructor:			function() { return this; },
	checkSextet:			function(y, m, d, h, mi, s)
	{
		try {
			var dt = new Date;
			dt.setFullYear(y, Number(m)-1, d);
			dt.setHours(h);
			dt.setMinutes(mi);
			dt.setSeconds(s);
			dt.setMilliseconds(0);
			return dt.getTime();
		}
		catch (e) {
			return null;
		}
	},

	doConversion:			function(match)
	{
		if (match[1] != undefined)
			return this.checkSextet(match[4], match[3], match[2], match[5], match[6], match[7]);
		else if (match[8] != undefined)
			return Number(match[8]);
		else
			throw new Error("match but no partial match?");
	},

	check:				function(text, style)
	{
		var match;
		if ((match = text.match(/^((\d{1,2})\s*\.\s*(\d{1,2})\s*\.\s*(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))|u(\d+)$/)) == null || this.doConversion(match) == null)
			return "net.dryuf.textual.DateTimeTextual^format dd.mm.yyyy hh:mm:ss required";
		return null;
       	},

	convert:				function(text, style)
	{
		var match;
		var internal;
		if ((match = text.match(/^((\d{1,2})\s*\.\s*(\d{1,2})\s*\.\s*(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))|u(\d+)$/)) == null || (internal = this.doConversion(match)) == null)
			throw new Error("invalid format for date, no check performed?");
		return internal;
	},

	format:					function(internal, style)
	{
		var d = new Date;
		d.setTime(internal);
		return net.dryuf.sprintf("%d.%d.%d %02d:%02d:%02d", d.getDate(), (d.getMonth()+1), d.getFullYear(), d.getHours(), d.getMinutes(), d.getSeconds());
	},

	convertKey:				function(text)
	{
		return Number(text);
	}
});
