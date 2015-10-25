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

net.dryuf.registerClass("net.dryuf.textual.Longitude60Textual", "net.dryuf.textual.PreTrimTextual",
{
	constructor:			function() { return this; },
	check:				function(text, style)
	{
		var match;
		if (!(match = text.match(/^((E|W)\s*(\d{1,3})°\s*(\d{1,2})\'\s*(\d{1,2}(\.\d*)?)\"|[+-]?\d+\.\d*)$/)))
			return "net.dryuf.textual.LongitudeTextual^format E|W dd°mm'ss[.sss]\" required";
		var lng;
		if (match[3] != null) {
			lng = Number(match[3])+Number(match[4])/60+Number(match[5])/3600;
			if (match[3] == "W")
				lng = -lng;
		}
		else {
			lng = Number(match[1]);
		}
		if (lng < -180 || lng > 180)
			return "net.dryuf.textual.LongitudeTextual^longitude must be within interval -180 - 180";
		return null;
	},

	convert:			function(text, style)
	{
		var match;
		if (!(match = text.match(/^((E|W)\s*(\d{1,3})°\s*(\d{1,2})\'\s*(\d{1,2}(\.\d*)?)\"|[+-]?\d+\.\d*)$/)))
			throw new Error("invalid format for longitude, no check performed?");
		var lng;
		if (match[3] != null) {
			lng = Number(match[3])+Number(match[4])/60+Number(match[5])/3600;
			if (match[2] == "W")
				lng = -lng;
		}
		else {
			lng = Number(match[1]);
			if (isNaN(lng))
				throw new Error("not a number!: "+match[1]+"");
		}
		return lng*10000000;
	},

	format:				function(internal, style)
	{
		var orient = internal < 0 ? 'W' : 'E';
		if (internal < 0)
			internal = -internal;
		var degree = Math.floor(internal/10000000);
		internal -= degree*10000000;
		var min = Math.floor(internal*60/10000000);
		internal -= min*10000000/60;
		var sec = internal*3600/10000000.0;
		return net.dryuf.sprintf("%s%02d°%02d'%08.5f\"", orient, degree, min, sec);
	},
});
