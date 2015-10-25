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

(function() { var cls = net.dryuf.registerClass("net.dryuf.textual.Latitude60Textual", "net.dryuf.textual.PreTrimTextual",
{
	constructor:			function()
	{
		return this;
	},

	check:				function(text, style)
	{
		var match;
		if (!(match = text.match(/^((N|S)\s*(\d{1,2})°\s*(\d{1,2})\'\s*(\d{1,2}(\.\d*)?)\"|[-+]?\d+\.\d*)$/)))
			return net.dryuf.clocalize(cls, "format N|S dd°mm'ss[.sss]\" required");
		var lat;
		if (match[3] != null) {
			lat = Number(match[3])+Number(match[4])/60+Number(match[5])/3600;
			if (match[2] == "S")
				lat = -lat;
		}
		else {
			lat = match[1];
		}
		if (lat < -90 || lat > 90)
			return "net.dryuf.textual.LatitudeTextual^latitude must be within interval -90 - 90";
		return null;
	},

	convert:			function(text, style)
	{
		var match;
		if (!(match = text.match(/^((N|S)\s*(\d{1,2})°\s*(\d{1,2})\'\s*(\d{1,2}(\.\d*)?)\"|[-+]?\d+\.\d*)$/)))
			net.dryuf.reportError("invalid format for latitude, no check performed?");
		var lat;
		if (match[3] != null) {
			lat = Number(match[3])+Number(match[4])/60+Number(match[5])/3600;
			if (match[2] == "S")
				lat = -lat;
		}
		else {
			lat = match[1];
		}
		return lat*10000000;
	},

	format:				function(internal, style)
	{
		var orient = internal < 0 ? 'S' : 'N';
		if (internal < 0)
			internal = -internal;
		var degree = Math.floor(internal/10000000);
		internal -= degree*10000000;
		var min = Math.floor(internal*60/10000000);
		internal -= min*10000000/60;
		var sec = internal*3600/10000000.0;
		return net.dryuf.sprintf("%s%02d°%02d'%08.5f\"", orient, degree, min, sec);
	},
}); })();
