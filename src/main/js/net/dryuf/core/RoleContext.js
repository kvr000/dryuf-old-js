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

net.dryuf.registerClass("net.dryuf.core.RoleContext", null,
{
	constructor:			function(owner, additional)
	{
		var roles = this.roles = {};
		if (owner)
			net.dryuf.foreachKey(function (v, k) { roles[k] = 1; }, owner.roles);
		if (additional !== null)
			net.dryuf.foreach(function(r) { roles[r] = 1; }, additional);
		return this;
	},

	addRoles:			function(add_list)
	{
		var roles = this.roles;
		net.dryuf.foreach(function(r) { roles[r] = 1; }, add_list);
	},

	removeRoles:			function(remove_list)
	{
		var roles = this.roles;
		net.dryuf.foreach(function(r) { delete roles[r]; }, add_list);
	},

	checkRole:			function(roles_str)
	{
		var roles = this.roles;
		/*DBG*/net.dryuf.assert(roles_str != null);
		var req = roles_str.split(/,\s*/);
		for (var i = 0; i < req.length; i++) {
			if (roles[req[i]])
				return true;
		}
		return false;
	},
});
