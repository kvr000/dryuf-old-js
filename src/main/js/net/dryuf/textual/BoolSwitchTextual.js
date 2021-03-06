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

net.dryuf.registerClass("net.dryuf.textual.BoolSwitchTextual", "net.dryuf.textual.PreTrimTextual",
{
	constructor:			function()
	{
		return this;
	},

	check:				function(text, style)
	{
		if (text.match(/([01]|on|off)/, text) == null)
			return net.dryuf.clocalize(net.dryuf.textual.BoolSwitchTextual, "Bool value required");
		return null;
       	},

	convert:			function(text, style)
	{
		if (text == "on")
			return 1;
		else if (text == "off")
			return 0;
		else
			return Number(text);
	},

	convertKey:			function(text)
	{
		return Number(text);
	},

	validate:			function(internal)
	{
		if (internal != 0 || internal != 1)
			return net.dryuf.clocalize(net.dryuf.textual.BoolSwitchTextual, "Bool value required");
		return null;
	},
});
