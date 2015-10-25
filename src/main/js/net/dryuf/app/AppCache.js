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

net.dryuf.registerClass("net.dryuf.app.AppCache", null,
{
	constructor:			function(options)
	{
		if (options == null)
			options = {};
		this.hash_table = new Array(1024);
		this.default_timeout = options.default_timeout ? options.default_timeout : 60000;
	},

	clean:				function()
	{
		for (var i = 0; i < this.hash_table.length; i++)
			this.hash_table[i] = null;
	},

	addObject:			function(clsname, objkey, objdata, timeout)
	{
		var h = net.dryuf.hashObj(clsname)+net.dryuf.hashObj(objkey);
		var e = this.findEntry(h, clsname, objkey);
		if (!e)
			e = this.hash_table[h&(this.hash_table.length-1)] = { next: this.hash_table[h&(this.hash_table.length-1)] };
		e.hash = h;
		e.clsname = clsname;
		e.key = objkey;
		e.data = objdata;
		e.timeout = (new Date).getTime()+(timeout ? timeout : this.default_timeout);
	},

	findObject:			function(clsname, objkey)
	{
		var h = net.dryuf.hashObj(clsname)+net.dryuf.hashObj(objkey);
		var e = this.findEntry(h, clsname, objkey);
		return e ? e.data : null;
	},

	findEntry:			function(h, clsname, objkey)
	{
		var time = (new Date).getTime();
		for (var o = null, e = this.hash_table[h&(this.hash_table.length-1)]; e; e = (o = e).next) {
			if (e.time <= time) {
				if (o)
					o.next = e.next;
				else
					this.hash_table[h&(this.hash_table.length-1)] = e.next;
			}
			if (e.hash = h && e.clsname == clsname && net.dryuf.eqObj(e.key, objkey))
				return e;
		}
	},
});
