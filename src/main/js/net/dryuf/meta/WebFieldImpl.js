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

(function() { var cls = net.dryuf.registerClass("net.dryuf.meta.WebFieldImpl", null,
{
	_st$AST_None:			0,
	_st$AST_Reference:		1,
	_st$AST_Compos:			2,
	_st$AST_Children:		3,

	constructor:			function()
	{
	},

	// String
	getName:			function()
	{
		return this.name;
	},

	// String
	getPath:			function()
	{
		return this.path;
	},

	// Class
	getType:			function()
	{
		return this.type;
	},

	// int
	getAssocType:			function()
	{
		return this.assocType;
	},

	// boolean
	isCompos:			function()
	{
		return this.assocType == cls.AST_Compos;
	},

	// boolean
	isReference:			function()
	{
		return this.assocType == cls.AST_Reference;
	},

	// boolean
	isChildren:			function()
	{
		return this.assocType == cls.AST_Children;
	},

	// boolean
	isNoAssociation:		function()
	{
		return this.assocType == cls.AST_None;
	},

	//Class<?>
	getRefClass:			function()
	{
		return net.dryuf.require(this.refClassName);
	},

	getRefClassName:		function()
	{
		return this.refClassName;
	},

	//Class<?>
	getTextualName:			function()
	{
		return this.textualName;
	},

	//int
	getAlign:			function()
	{
		return this.align;
	},

	//String
	getDisplay:			function()
	{
		return this.display;
	},

	//boolean
	getMandatory:			function()
	{
		return this.mandatory;
	},

	//String
	getDoMandatory:			function()
	{
		return this.doMandatory;
	},

	//FieldRoles
	getRoles:			function()
	{
		return this.roles;
	},

	//Class
	getTextual:			function()
	{
		if (this.textualName == null)
			return null;
		return net.dryuf.require(this.getTextual());
	},

	//Class
	needTextual:			function()
	{
		if (this.textualName == null)
			throw new Error("textual not defined for "+this.name);
		return this.getTextual();
	},

	//FT
	getValue:			function(o)
	{
		return o[this.name];
	},

	//void
	setValue:			function(o, value)
	{
		o[this.name] = value;
	},

	//ClassMeta<?>
	getEmbedded:			function()
	{
		return this.embedded;
	},

	name:				null,
	path:				null,
	roles:				null,
	mandatory:			false,
	doMandatory:			null,
	display:			null,
	refName:			null,
	textualName:			null,
	embedded:			null,

}); })();
