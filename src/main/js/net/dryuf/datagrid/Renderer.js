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

(function() { var cls = net.dryuf.registerClass("net.dryuf.datagrid.Renderer", null,
			{
				constructor:			function(processor)
	{
		this.processor = processor;
		this.webMeta = processor.webMeta;
		this.parameters = processor.parameters;
		this.dataClassName = processor.dataClassName;

		this.view_childs = [];

		this.list_head = null;
	},
	_$css:				[ "net/dryuf/datagrid/Renderer.css" ],

	_st$colorList:			[
		[ '#ff0000', 'red' ],
		[ '#00ff00', 'green' ],
		[ '#0000ff', 'blue' ],
		[ '#a00000', 'dark red' ],
		[ '#00a000', 'dark green' ],
		[ '#0000a0', 'dark blue' ],
		[ '#ffff00', 'yellow' ],
		[ '#ff00ff', 'pink' ],
		[ '#ff0080', 'light purple' ],
		[ '#800080', 'dark purple' ],
		[ '#ffffff', 'white' ],
		[ '#00ffff', 'turquoise' ],
		[ '#c0c0c0', 'light grey' ],
		[ '#808080', 'dark grey' ],
		[ '#ff8040', 'orange' ],
		[ '#804000', 'brown' ],
		[ '#808000', 'forest green' ],
		[ '#408080', 'grass green' ],
		[ '#000000', 'black' ],
	],

	close:				function()
	{
		this.resetView();
	},

	resetView:			function()
	{
		var processor = this.processor;
		net.dryuf.foreach(function(child) { processor.removeChild(child); }, this.view_childs);
		this.view_childs = [];
	},

	updateObject:			function(obj, completor)
	{
		window.setTimeout(completor, 0);
	},

	forgetObject:			function(obj)
	{
	},

	fieldText:			function(obj, name)
	{
		var field = this.webMeta.getField(name);
		if (!field)
			net.dryuf.reportError("field "+name+" does not exist");
		return net.dryuf.createClass(field.getTextualName() == null ? "net.dryuf.core.Textual" : field.getTextualName()).format(obj[name]);
	},

	plainOutput:			function(field, value)
	{
		var text;
		if (!field.getDisplay())
			dmatch = [ "", "text" ];
		else if (!(dmatch = field.getDisplay().match(/^\s*(\w+)\(\s*(.*?)\s*\)\s*$/)))
			net.dryuf.reportError("invalid display for "+field.getPath()+": "+field.getDisplay());
		switch (dmatch[1]) {
		case 'select':
			text = net.dryuf.localize(field.getTextualName() ? field.getTextualName() : "invalid", dmatch[2].split(/,\s*/)[1].split(/\^/)[value]);
			break;

		case 'multi':
			text = net.dryuf.listMap(function(c, i) { return ((1<<i)&value) ? [ net.dryuf.localize(field.getTextualName() ? field.getTextualName() : "invalid", c) ] : null; }, dmatch[2].split(/,\s*/)[1].split(/\^/)).join(", ");
			break;

		case 'color':
			text = net.dryuf.createClass(field.getTextualName() == null ? "net.dryuf.core.Textual" : field.getTextualName()).format(value);
			net.dryuf.foreach(function(v) { if (v[0] == text) text = net.dryuf.clocalize(cls, v[1]); }, cls.colorList);
			break;

		case 'ref':
			var refMeta = net.dryuf.meta.WebMeta.openCached(field.getRefClassName(), 'Ref');
			var key = {};
			key[refMeta.getRefName()] = value;
			var refed = value ? refMeta.cacheSyncSimple(key) : null;
			if (!refed) {
				text = '';
			}
			else {
				text = net.dryuf.map(function(a) { return refed[a.name]; }, refMeta.getFields()).join(" ");
			}
			break;

		default:
			text = net.dryuf.createClass(field.getTextualName() ? field.getTextualName() :  "net.dryuf.core.Textual").format(value);
			break;
		}
		return document.createTextNode(value == null ? "" : text);
	},

	assocOutput:			function(field, value)
	{
		if (value == null)
			return "";
		var refMeta = net.dryuf.meta.WebMeta.openCached(field.getRefClassName(), 'Default');
		var refed = value ? refMeta.cacheSyncSimple(null, value) : null;
		if (refed == null) {
			text = '';
		}
		else {
			//alert(net.dryuf.core.Dump.dumpContent(refed));
			//alert(net.dryuf.core.Dump.dumpContent(refMeta.getRefFields()));
			text = net.dryuf.map(function(a) { return refMeta.formatFieldName(refed, a).toString(); }, refMeta.getRefFields()).join(" ");
		}
		return document.createTextNode(value == null ? "" : text);
	},

	formOutput:			function(field, value)
	{
		var e;
		var textual = net.dryuf.createClass(field.getTextualName() ? field.getTextualName() :  "net.dryuf.core.Textual");
		var dmatch = null;
		if (!field.getDisplay() || !(dmatch = field.getDisplay().match(/^\s*(\w+)\(\s*(.*?)\s*\)\s*$/)))
			net.dryuf.reportError("invalid display for "+field.getPath()+": "+field.getDisplay());
		var dtype = dmatch[1];
		var dargs = dmatch[2].split(/,\s*/);
		if (field.isReference()) {
			var suggestor = null;
			e = net.dryuf.gui.GuiDom.createElement("span", { get: function() { var val = suggestor.getValue(); return val ? String(val[suggestor.webMeta.getRefName()]) : ""; } });
			this.processor.addChild(suggestor = new (net.dryuf.require('net.dryuf.gui.control.SuggestInput'))(this.processor, e, { dataClassName: field.getRefClassName() }));
			if (value) {
				var refval = {};
				refval[suggestor.webMeta.getRefName()] = value;
				suggestor.setValue(refval);
			}
			return e;
		}
		else {
			var formatted = value == null ? "" : textual.format(value);
			switch (dtype) {
				case 'hidden':
					return null;

				case 'date':
				case 'datetime':
				case 'text':
					e = net.dryuf.gui.GuiDom.createElement("input", { type: "text", width: dargs[0], value: formatted, get: function() { return this.value; } });
					return e;

				case 'file':
					e = net.dryuf.gui.GuiDom.createElement("input", { name: "file__"+field.getPath(), type: "file", size: "60", get: function() { return this.value ? "file__"+field.getPath() : null; } });
					return e;

				case 'color':
					e = net.dryuf.gui.GuiDom.createElement("select", { width: dargs[0], get: function() { var val = null; net.dryuf.foreach(function(opt) { if (opt.selected) val = opt.value; }, this.childNodes); return val; } });
					net.dryuf.foreach(function(v) { net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(e, "option", v[0] == formatted ? { selected: 1, value: v[0], $style: "background-color: "+formatted+";" } : { value: v[0], $style: "background-color: "+v[0]+";" }), net.dryuf.clocalize(cls, v[1])); }, cls.colorList);
					return e;

				case 'checkbox':
					e = net.dryuf.gui.GuiDom.createElement("input", { type: "checkbox", get: function() { return this.checked != 0 ? "1" : "0"; } });
					if (value)
						e.checked = 1;
					return e;

				case 'password':
					e = net.dryuf.gui.GuiDom.createElement("input", { type: "password", width: dargs[0], get: function() { return this.value; } });
					return e;

				case 'textarea':
					net.dryuf.gui.GuiDom.setText(e = net.dryuf.gui.GuiDom.createElement("textarea", { cols: dargs[0], rows: dargs[1], get: function() { return this.value; } }), formatted);
					return e;

				case 'select':
					e = net.dryuf.gui.GuiDom.createElement("select", { width: dargs[0], get: function() { var val = 0; net.dryuf.foreach(function(opt) { val |= opt.selected ? opt.value : 0; }, this.childNodes); return String(val); } });
					net.dryuf.foreach(function(v, i) { net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(e, "option", i == value ? { selected: 1, value: i } : { value: i }), net.dryuf.localize(field.getTextualName() ? field.getTextualName() : "invalid", v)); }, dargs[1].split(/\^/));
					return e;

				case 'multi':
					e = net.dryuf.gui.GuiDom.createElement("select", { width: dargs[0], multiple: 1, get: function() { var val = 0; net.dryuf.foreach(function(opt) { val |= opt.selected ? opt.value : 0; }, this.childNodes); return String(val); } });
					net.dryuf.foreach(function(v, i) { net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(e, "option", (1<<i)&value ? { selected: 1, value: 1<<i } : { value: 1<<i }), net.dryuf.localize(field.getTextualName() ? field.getTextualName() : "invalid", v)); }, dargs[1].split(/\^/));
					return e;

				default:
					net.dryuf.reportError("invalid display_type for "+field.getPath()+": "+dtype);
			}
		}
	},

	openList:			function(position)
	{
		return position;
	},

	getGlobalActionHandler:		function(action)
	{
		var this_ = this;
		var processor = this.processor;
		return function() {
			var guiDef = action.guiDef ?
				net.dryuf.hashMap(function(assign) { return assign.split(/=/); }, action.guiDef.split(/\s+/)) :
				{ target: (action.name == "new" || action.name == "edit" || action.name == "remove") ? "this" : "dynamic", mode: action.name };
			switch (guiDef.target) {
			case 'this':
				var actionName = net.dryuf.defvalue(guiDef.mode, action.name);
				switch (actionName) {
				case 'action':
					processor.action = action;
				case 'new':
				case 'edit':
				case 'remove':
					processor.handleListAction({ name: actionName }, null);
					break;

				default:
					net.dryuf.reportError("unknown mode for Renderer: "+actionName);
				}
				break;

			case 'renderer':
				this_.handleRendererAction(action, null);
				break;

			default:
				this_.parameters.manager.openDynamic(guiDef, function(manager, position) {
					var control = net.dryuf.defvalue(guiDef.control, "datagrid");
					var parameters = {};
					net.dryuf.foreachKey(function(val, key) {
						switch (val) {
						case '$_classname':
							val = processor.dataClassName;
							break;

						case '$_composKey':
							val = processor.composKey;
							break;
						}
						parameters[key] = val;
					}, guiDef);
					switch (control) {
					case 'datagrid':
						if (!parameters.dataClassName) {
							parameters.rpcPath = processor.rpcPath;
							parameters.dataClassName = processor.dataClassName;
							if (!parameters.viewName)
								parameters.viewName = processor.viewName;
						}
						if (parameters.dataClassName == processor.dataClassName && parameters.viewName == processor.viewName) {
							parameters.renderer = this_.parameters.renderer;
						}
						switch (parameters.mode) {
						case 'action':
							if (!parameters.actionName)
								parameters.actionName = action.name;
							break;
						}
						parameters.manager = manager;
						return new net.dryuf.datagrid.DataGridPresenter(manager, position, parameters);

					default:
						return new (net.dryuf.require(control))(manager, position, parameters);
					} });
				break;
			}
		};
	},

	getObjectActionHandler:		function(action, obj)
	{
		var this_ = this;
		var processor = this.processor;
		var webMeta = processor.webMeta;
		return function() {
			var objKey = this_.webMeta.getEntityPk(obj.entity);
			var guiDef = action.guiDef ?
				net.dryuf.hashMap(function(assign) { return assign.split(/=/); }, action.guiDef.split(/\s+/)) :
				{ target: (action.name == "new" || action.name == "edit" || action.name == "remove") ? "this" : "dynamic", mode: action.name };
			switch (guiDef.target) {
			case 'this':
				var actionName = net.dryuf.defvalue(guiDef.mode, action.name);
				switch (actionName) {
				case 'action':
					this_.processor.action = action;
				case 'new':
				case 'edit':
				case 'remove':
					this_.processor.handleListAction({ name: actionName }, objKey);
					break;

				default:
					net.dryuf.reportError("unknown mode for Renderer: "+actionName);
				}
				break;

			case 'renderer':
				this_.handleRendererAction(action, obj);
				break;

			case 'server':
				window.open(webMeta.getObjectKeyActionPath(processor.rpcPath, objKey, action.name), "Result");
				break;

			default:
				this_.parameters.manager.openDynamic(guiDef, function(manager, position) {
					var control = net.dryuf.defvalue(guiDef.control, "datagrid");
					var parameters = {};
					net.dryuf.foreachKey(function(val, key) {
						var match;
						if (match = val.match(/\$_field\.(.*)$/)) {
							if (obj.entity[match[1]] === undefined)
								net.dryuf.reportError("looking for undefined "+match[1]+" in obj "+net.dryuf.core.Dump.dumpContent(obj, 1));
							val = obj.entity[match[1]];
						}
						else if (match = val.match(/_\$renderer\.(.*)$/)) {
							val = this.getRendererValue(match[1]);
						}
						else switch (val) {
						case '$_classname':
							val = this_.processor.dataClassName;
							break;

						case '$_composKey':
							val = this_.processor.composKey;
							break;

						case '$_objKey':
							val = objKey;
							break;
						}
						if (match = key.match(/^init\.(.*)$/)) {
							if (typeof val == 'undefined') {
								net.dryuf.reportError("val is undefined, "+key+"="+val+", "+net.dryuf.core.Dump.dumpContent(parameters, 1));
							}
							if (!parameters.init)
								parameters.init = {};
							parameters.init[match[1]] = val;
						}
						else if (match = key.match(/^bind\.(.*)$/))  {
							if (!parameters.bind)
								parameters.bind = {};
							parameters.bind[match[1]] = val;
						}
						else {
							parameters[key] = val;
						}
					}, guiDef);
					switch (control) {
					case 'datagrid':
						if (parameters.relation) {
							var relation = webMeta.getRelation(parameters.relation);
							if (!parameters.composKey) {
								parameters.composKey = objKey;
								parameters.composRole = obj.role;
							}
							net.dryuf.assert(relation);
							parameters.dataClassName = relation.targetClass;
							parameters.rpcPath = webMeta.getEntityKeyUrl(processor.rpcPath, objKey)+parameters.relation+"/";
						}
						if (!parameters.dataClassName) {
							parameters.rpcPath = this_.processor.rpcPath;
							parameters.dataClassName = this_.processor.dataClassName;
							if (!parameters.viewName && false)
								parameters.viewName = this_.processor.viewName;
						}
						if (!parameters.renderer && parameters.dataClassName == this_.processor.dataClassName) {
							parameters.caller_gui = this_.processor;
						}
						switch (parameters.mode) {
						case 'action':
							if (!parameters.actionName)
								parameters.actionName = action.name;
							break;
						}
						parameters.manager = manager;
						return new net.dryuf.datagrid.DataGridPresenter(manager, position, parameters);

					default:
						return new (net.dryuf.require(control))(manager, position, parameters);
					} });
				break;
			}
		};
	},

	generateObjectActionList:       function(obj)
	{
		var this_ = this;
		return net.dryuf.map(
			function(action) {
				return {
					name:		action.name,
					text:		net.dryuf.localize(this_.webMeta.dataClassName, action.name),
					handler:	this_.getObjectActionHandler(action, obj)
				};
			},
			this.webMeta.getObjectActionList(null, obj.role)
		);
	},

	handleRendererAction:		function(action, obj)
	{
		net.dryuf.reportError("unknown action "+action.name);
	},

	getCssClasses:			function(actionName)
	{
		return "net-dryuf-datagrid-Renderer";
	},

	expandAllFields:		function(mode)
	{
		var webMeta = this.webMeta;
		return webMeta.expandFieldsPaths(webMeta.getModeFieldList(mode))
	},

	renderList:			function()
	{
		var this_ = this;
		var root = net.dryuf.gui.GuiDom.createElement("div", { $class: this.getCssClasses(null) });
		var main_table = net.dryuf.gui.GuiDom.addElement(root, "table", { $class: "list", width: "100%", border: 0, cellspacing: 2 });
		this.renderGuiHead(main_table);
		var main_head = net.dryuf.gui.GuiDom.addElement(main_table, "tr");
		var action_td = net.dryuf.gui.GuiDom.addElement(main_head, "td", { width: "33%" });
		this.renderListGlobalActions(action_td);
		var pager_td = net.dryuf.gui.GuiDom.addElement(main_head, "td", { width: "34%", align: "center" });
		if (this.listPageSize !== null) {
			this.renderListPager(pager_td, this.getPageList());
		}
		var refresh_el = net.dryuf.gui.GuiDom.addElement(main_head, "td", { width: "33%" });
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(refresh_el, "a", { href: '#', onclick: function() { this_.processor.refresh(); return false; } }), net.dryuf.clocalize(net.dryuf.datagrid.DataGridPresenter, "Refresh"));
		if (net.dryuf.debug.timing)
			refresh_el.addText(net.dryuf.sprintf("server: %.3fs", net.dryuf.defvalue(this.processor.gentime, 0)));

		var rows = net.dryuf.gui.GuiDom.addElements(main_table, "tr,td", { $colspan: 3 });
		this.renderListTable(rows);
		return root;
	},

	renderGuiHead:			function(mainElement)
	{
		if (!this.list_head) {
			if (this.webMeta.view.gui_filter) {
				this.list_head = net.dryuf.gui.GuiDom.createElement("tr");
				this.renderGuiFilter(net.dryuf.gui.GuiDom.addElement(this.list_head, "td", { $colspan: 3 }));
			}
		}
		if (this.list_head) {
			if (this.list_head.parentNode)
				net.dryuf.gui.GuiDom.removeElement(this.list_head);
			mainElement.appendChild(this.list_head);
		}
	},

	renderGuiFilter:		function(gui_td)
	{
		var this_ = this;
		var view = this.webMeta.view;
		var filter_tab = net.dryuf.gui.GuiDom.addElements(gui_td, "table,tr");
		net.dryuf.foreach(function(filter) {
				var match;
				var td = net.dryuf.gui.GuiDom.addElements(filter_tab, "td");
				if (match = filter.match(/^ref\((\w+),\s*((\w+\.)*\w+),\s*(\w+)\)$/)) {
					var ref_tr  = net.dryuf.gui.GuiDom.addElements(td, "table,tr");
					net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(ref_tr, "td,b"), (match[2] == this_.dataClassName ? net.dryuf.localize(this_.dataClassName, "_name") : net.dryuf.localize(this_.dataClassName, match[1]))+": ");
					this_.processor.addChild(new (net.dryuf.require("net.dryuf.gui.control.SuggestInput"))(this_.processor, net.dryuf.gui.GuiDom.addElements(ref_tr, "td"), {
							bind_name:		match[1],
							dataClassName:		match[2],
							viewName:		match[4],
							value:			this_.processor.bind[match[1]],
							onchange:		function(options) {
								this_.processor.bind[this.bind_name] = options.value.id;
								this_.processor.refresh();
							},
						}));
				}
				else {
					net.dryuf.reportError("invalid gui_filter: "+filter);
				}
			}, view.gui_filter.split(/\s*,\s*(?=\w+\()/));
	},

	getPageList:			function()
	{
		var processor = this.processor;
		var pages = [ processor.listPageNum ];
		for (var cont = true, diff = 1, step = 1; cont; diff += (step = step*2 > processor.listTotal/processor.listPageSize/7 ? Math.max(Math.floor(processor.listTotal/processor.listPageSize/7), 1) : (step*2))) {
			cont = false;
			if (diff < processor.listPageNum) {
				cont = true;
				pages.unshift(processor.listPageNum-diff);
			}
			if (diff < Math.floor((processor.listTotal-1)/processor.listPageSize)-processor.listPageNum) {
				cont = true;
				pages.push(processor.listPageNum+diff);
			}
		}
		if (processor.listPageNum > 0)
			pages.unshift(0);
		if (processor.listPageNum < Math.floor((processor.listTotal-1)/processor.listPageSize))
			pages.push(Math.floor((processor.listTotal-1)/processor.listPageSize));
		return pages;
	},

	renderListGlobalActions:	function(actions_el)
	{
		var processor = this.processor;
		var actions = this.webMeta.getGlobalActionList(this.mode, processor.baseRole);
		var action_tr = net.dryuf.gui.GuiDom.addElements(actions_el, "table,tr");
		net.dryuf.foreach(function(a) {
				net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(action_tr, "td,a", { this_: processor, href: "#", action: a, onclick: function() { this.this_.renderer.getGlobalActionHandler(this.action)(); return false; } }), net.dryuf.localize(processor.dataClassName, a.name));
			}, actions);
	},

	renderListPager:		function(pager_el, pages)
	{
		var processor = this.processor;
		if (pages.length == 1 && processor.listPageNum == 0)
			return;
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(pager_el, "a", processor.listPageNum > 0 ? { this_: processor, href: "#", onclick: function() { this.this_.handleListChoose(processor.listPageNum-1); return false; } } : null), net.dryuf.clocalize(cls, "◀"));
		net.dryuf.gui.GuiDom.addText(pager_el, " ");
		var pager_sel = net.dryuf.gui.GuiDom.addElement(pager_el, "select", { this_: processor, onchange: function() { this.this_.handleListChoose(this.value); } });
		net.dryuf.foreach(function(p) { net.dryuf.gui.GuiDom.addElement(pager_sel, "option", p == processor.listPageNum ? { value: p, selected: 1 } : { value: p }).innerHTML = p+1; }, pages);
		net.dryuf.gui.GuiDom.addText(pager_el, " ");
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(pager_el, "a", processor.listPageNum < Math.floor((processor.listTotal-1)/processor.listPageSize) ? { this_: processor, href: "#", onclick: function() { this.this_.handleListChoose(processor.listPageNum+1); return false; } } : null), net.dryuf.clocalize(cls, "▶"));
	},

	renderListTable:		function(contentElement)
	{
		var processor = this.processor;
		var webMeta = this.webMeta;
		var fields = net.dryuf.filter(function(field) { return field.getDisplay() != 'hidden()'; }, this.expandAllFields(processor.mode));
		var contentTable = net.dryuf.gui.GuiDom.addElement(contentElement, "table", { $class: "rows", width: "100%" });
		this.renderListHead(contentTable, fields);
		this.renderListContent(contentTable, fields);
	},

	renderListHead:			function(contentTable, fields)
	{
		var processor = this.processor;
		var cont_head = net.dryuf.gui.GuiDom.addElement(contentTable, "tr", { $class: "header" });
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(cont_head, "th", { $class: "action" }), net.dryuf.clocalize(cls, "Action"));
		net.dryuf.foreach(function(field) { net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(cont_head, "th", { $class: "field" }), net.dryuf.localize(processor.dataClassName, field.text != null ? field.text : field.getPath())); }, fields);
	},

	renderListContent:		function(contentTable, fields)
	{
		var this_ = this;
		net.dryuf.foreach(function(obj, i) {
				this_.renderListObject(contentTable, fields, obj, i);
			}, this.processor.listData);
	},

	getListRowCssClass:		function(i, obj)
	{
		return "row-"+((i&1) != 0 ? "odd" : "even");
	},

	renderListObject:		function(contentTable, fields, obj, i)
	{
		var webMeta = this.webMeta;
		var objKey = webMeta.getEntityPk(obj.entity);
		var row_tr = net.dryuf.gui.GuiDom.addElement(contentTable, "tr", { objKey: objKey, $class: this.getListRowCssClass(i, obj) });
		this.renderListObjectActions(row_tr, objKey, obj, i);
		this.renderListObjectFields(row_tr, fields, objKey, obj, i);
	},

	popupObjectActions:		function(ev, title, obj)
	{
		var this_ = this;
		return new net.dryuf.gui.ContextMenu(ev, title,
			net.dryuf.map(function(action) {
				return {
					name:		action.name,
					text:		net.dryuf.localize(this_.webMeta.dataClassName, action.name),
					handler:	this_.getObjectActionHandler(action, obj),
				};
			}, this.webMeta.getObjectActionList(null, obj.role))
		);
	},

	renderListObjectActions:	function(row_tr, objKey, obj, i)
	{
		var processor = this.processor;
		var rac_tr = net.dryuf.gui.GuiDom.addElements(row_tr, "td", { $class: "action" });
		net.dryuf.foreach(function(action) {
				net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(rac_tr, "a", { this_: processor, obj: obj, objKey: objKey, action: action, href: "#", onclick: function() { this.this_.renderer.getObjectActionHandler(this.action, this.obj)(); return false; } }), net.dryuf.localize(processor.dataClassName, action.name));
				net.dryuf.gui.GuiDom.addText(rac_tr, " ");
			}, this.webMeta.getObjectActionList(this.mode, obj.role));
	},

	renderListObjectFields:		function(row_tr, fields, objKey, obj, i)
	{
		var this_ = this;
		var processor = this.processor;
		var webMeta = this.webMeta;
		net.dryuf.foreach(function(field) {
				var td = net.dryuf.gui.GuiDom.addElements(row_tr, "td", { $class: "field", align: field.getAlign() ? field.getAlign() : "left" });
				if (field.isChildren()) {
					new net.dryuf.datagrid.DataGridPresenter(processor, td, {
						parentProcessor:	processor,
						rpcPath:		processor.webMeta.getEntityUrl(processor.rpcPath, obj.entity)+field.getName()+"/",
						dataClassName:		field.getRefClassName(),
						viewName:		processor.viewName,
						mode:			"children",
						composKey:		objKey,
						composRole:		obj.role,
						childData:		net.dryuf.map(function (child) { return { role: obj.role, entity: child }; }, webMeta.getEntityPathValue(obj.entity, field.getPath()))
					});
				}
				else if (field.isReference()) {
					value = webMeta.getEntityPathValue(obj.entity, field.getPath());
					var e = this_.assocOutput(field, value);
					if (e)
						td.appendChild(e);
				}
				else {
					var e = this_.plainOutput(field, webMeta.getEntityPathValue(obj.entity, field.getPath()));
					if (e)
						td.appendChild(e);
				}
			}, fields);
	},

	renderModify:			function(req_mode)
	{
		var this_ = this;
		var processor = this.processor;
		var webMeta = this.webMeta;
		var obj = processor.currentData;
		var objKey = webMeta.getEntityPk(obj.entity);
		var root = net.dryuf.gui.GuiDom.createElement("div", { $class: this.getCssClasses(null) });
		var main_table = net.dryuf.gui.GuiDom.addElement(root, "table", { $class: "edit", width: "100%", border: 0, cellspacing: 2 });
		var form = net.dryuf.gui.GuiDom.addElements(main_table, "tr,td,form", { $class: "form", name: net.dryuf.genUniqueId(), method: "POST", processor: processor, onsubmit: function() { this.processor.handleEditSave(this); return false; } });
		var table = net.dryuf.gui.GuiDom.addElement(form, "table", { $class: "fields" });
		processor.currentEdit = {};
		net.dryuf.foreach(function(field) {
				var e = null;
				switch (processor.getFieldVisibility(field, req_mode)) {
				case 0:
					break;

				case 1:
					if (!field.isChildren())
						e = this_.plainOutput(field, webMeta.getEntityPathValue(obj.entity, field.getPath()));
					break;

				case 2:
				case 3:
					if (field.isChildren()) {
						if (processor.mode != 'new') {
							e = net.dryuf.gui.GuiDom.createElement("div");
							new net.dryuf.datagrid.DataGridPresenter(processor, e, {
								parentProcessor:	processor,
								rpcPath:		processor.webMeta.getEntityUrl(processor.rpcPath, obj.entity)+field.getName()+"/",
								dataClassName:		field.getRefClassName(),
								viewName:		processor.viewName,
								mode:			"children",
								composKey:		objKey,
								composRole:		obj.role,
								childData:		net.dryuf.map(function(child) { return { role: obj.role, entity: child }; }, webMeta.getEntityPathValue(obj.entity, field.getPath()))
							});
						}
					}
					else if (e = this_.formOutput(field, webMeta.getEntityPathValue(obj.entity, field.getPath()))) {
						processor.currentEdit[field.getPath()] = e;
					}
					break;
				default:
					throw new Error("unexpected field visibility");
				}
				if (e) {
					var row_tr = net.dryuf.gui.GuiDom.addElement(table, "tr", { $class: "field" } );
					net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(row_tr, "td", { $class: "key" }), net.dryuf.localize(processor.dataClassName, field.getPath())+":");
					net.dryuf.gui.GuiDom.addElements(row_tr, "td", { $class: "value" }).appendChild(e);
				}
			}, webMeta.expandFieldsPaths(webMeta.getFields()));
		var td_actions = net.dryuf.gui.GuiDom.addElements(table, "tr,td", { $class: "actions", $colspan: 2 });
		var tr_btns = net.dryuf.gui.GuiDom.addElement(table, "tr");
		var td_debug = net.dryuf.gui.GuiDom.addElement(tr_btns, "td");
		if (net.dryuf.debug.timing)
			net.dryuf.gui.GuiDom.setText(td_debug, "server: "+net.dryuf.defvalue(processor.gentime, 0).toFixed(3));
		var td_btns = net.dryuf.gui.GuiDom.addElement(tr_btns, "td");
		this.editButtons = [];
		this.editButtons.push(net.dryuf.gui.GuiDom.addElement(td_btns, "input", { type: "submit", value: net.dryuf.clocalize(cls, "Save"), processor: processor }));
		net.dryuf.gui.GuiDom.addText(td_btns, " ");
		this.editButtons.push(net.dryuf.gui.GuiDom.addElements(td_btns, "input", { type: "submit", value: net.dryuf.clocalize(cls, "Cancel"), processor: processor, onclick: function() { this.processor.handleEditCancel(); return false; } }));
		if (processor.isChildren()) {
			processor.parameters.parentProcessor.renderer.enableEdits(false);
		}
		return root;
	},

	enableEdits:			function(enable)
	{
		net.dryuf.foreach(function(button) { button.disabled = !enable; }, this.editButtons);
	},

	openEdit:			function(position)
	{
		return position;
	},

	closeEdit:			function()
	{
		this.closeGeneric();
	},

	renderEdit:			function()
	{
		return this.renderModify("roleSet");
	},

	openNew:			function(position)
	{
		return position;
	},

	closeNew:			function()
	{
		this.closeGeneric();
	},

	renderNew:			function()
	{
		return this.renderModify("roleNew");
	},

	renderGlobalError:		function(el, err)
	{
		net.dryuf.foreach(
			function(divel) {
				if (divel.getAttribute("class") == "globalError")
					net.dryuf.gui.GuiDom.removeElement(divel);
			},
			net.dryuf.xml.DomUtil.getImmediateElementsByTag(el.parentNode, "div")
		);
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(el.parentNode, "div", { $class: "globalError" }), err);
	},

	renderFieldError:		function(el, err)
	{
		net.dryuf.foreach(
			function(divel) {
				if (divel.getAttribute("class") == "fieldError")
					net.dryuf.gui.GuiDom.removeElement(divel);
			},
			net.dryuf.xml.DomUtil.getImmediateElementsByTag(el.parentNode, "div")
		);
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(el.parentNode, "div", { $class: "fieldError" }), err);
	},

	openRemove:			function(position)
	{
		return position;
	},

	closeRemove:			function()
	{
		this.closeGeneric();
	},

	renderRemove:			function()
	{
		var this_ = this;
		var processor = this.processor;
		var webMeta = this.webMeta;
		var obj = processor.currentData;
		var root = net.dryuf.gui.GuiDom.createElement("div", { $class: this.getCssClasses(null) });
		var main_table = net.dryuf.gui.GuiDom.addElement(root, "table", { $class: "remove", width: "100%", border: 0, cellspacing: 2 });
		var form = net.dryuf.gui.GuiDom.addElements(main_table, "tr,td,form", { $class: "form", name: net.dryuf.genUniqueId(), method: "POST" });
		var table = net.dryuf.gui.GuiDom.addElement(form, "table", { $class: "fields" });
		net.dryuf.foreach(
			function(field) {
				var e;
				switch (webMeta.getFieldVisibility(field, "roleSet", processor.currentData.role)) {
				case 0:
					break;

				case 1:
				case 2:
				case 3:
					if (!field.isChildren())
						e = this_.plainOutput(field, webMeta.getEntityPathValue(obj.entity, field.getPath()));
					break;
				}
				if (e) {
					var row_tr = net.dryuf.gui.GuiDom.addElement(table, "tr");
					net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(row_tr, "td,b"), net.dryuf.localize(processor.dataClassName, field.getPath())+":");
					net.dryuf.gui.GuiDom.addElements(row_tr, "td").appendChild(e);
				}
			},
			webMeta.expandFieldsPaths(webMeta.getFields())
		);
		var tr_btns = net.dryuf.gui.GuiDom.addElement(table, "tr");
		var td_debug = net.dryuf.gui.GuiDom.addElement(tr_btns, "td");
		if (net.dryuf.debug.timing)
			net.dryuf.gui.GuiDom.setText(td_debug, "server: "+net.dryuf.defvalue(processor.gentime).toFixed(3));
		var td_btns = net.dryuf.gui.GuiDom.addElement(tr_btns, "td");
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(td_btns, "input", { type: "submit", value: net.dryuf.clocalize(cls, "Remove"), this_: processor, onclick: function() { this.this_.handleRemoveRemove(this); return false; } }), "Remove");
		net.dryuf.gui.GuiDom.addText(td_btns, " ");
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(td_btns, "input", { type: "submit", value: net.dryuf.clocalize(cls, "Cancel"), this_: processor, onclick: function() { this.this_.handleRemoveCancel(this); return false; } }), "Cancel");
		if (processor.isChildren()) {
			processor.parameters.parentProcessor.renderer.enableEdits(false);
		}
		return root;
	},

	openDummy:			function(position)
	{
		return position;
	},

	closeDummy:			function()
	{
		this.closeGeneric();
	},

	renderDummy:			function()
	{
		var this_ = this;
		var table = net.dryuf.gui.GuiDom.createElement("table");
		var obj = this.processor.currentData;
		//alert(net.dryuf.core.Dump.dumpContent(this.processor.baseRole.roles));
		if (!this.processor.currentData) {
			net.dryuf.foreach(function(action) {
					net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(table, "tr,td,a", { href: '#', action: action, onclick: function() {
							(this_.getGlobalActionHandler(this.action))();
							return false;
						} }), net.dryuf.localize(this_.processor.dataClassName, action.name));
				}, this.webMeta.getGlobalActionList(null, this.processor.baseRole));
		}
		else {
			net.dryuf.foreach(function(action) {
					net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(table, "tr,td,a", { href: '#', action: action, onclick: function() {
							(this_.getObjectActionHandler(this.action, obj))();
							return false;
						} }), net.dryuf.localize(this_.processor.dataClassName, action.name));
				}, this.webMeta.getObjectActionList(null, obj.role));
		}
		return table;
	},

	openAction:			function(position)
	{
		return position;
	},

	closeAction:			function()
	{
		this.closeGeneric();
	},

	closeGeneric:			function()
	{
		if (this.processor.isChildren())
			this.processor.parameters.parentProcessor.renderer.enableEdits(true);
		if (this.processor.originalMode == this.processor.mode) {
			this.parameters.manager.closeDynamic(this.processor);
		}
		else {
			this.resetView();
			this.processor.handleAnyList();
		}
	},

	renderAction:			function(position)
	{
		var this_ = this;
		var processor = this.processor;
		var actionMeta = processor.actionMeta;
		var root = net.dryuf.gui.GuiDom.createElement("div", { $class: this.getCssClasses(null) });
		var main_table = net.dryuf.gui.GuiDom.addElement(root, "table", { $class: "action", width: "100%", border: 0, cellspacing: 2 });
		var form = net.dryuf.gui.GuiDom.addElements(main_table, "tr,td,form", { $class: "form", name: net.dryuf.genUniqueId(), processor: processor, method: "POST", onsubmit: function() { this.processor.handleActionDo(this); return false; } });
		var table = net.dryuf.gui.GuiDom.addElement(form, "table", { $class: "fields" });
		processor.action_edit = {};
		net.dryuf.foreach(function(field) {
				var e;
				switch (actionMeta.getFieldVisibility(field, "roleNew", processor.baseRole)) {
				case 0:
					break;

				case 1:
					e = this_.plainOutput(field, processor.actionData[field.getPath()]);
					break;

				case 2:
				case 3:
					if (e = this_.formOutput(field, processor.actionData[field.getPath()])) {
						processor.action_edit[field.getPath()] = e;
					}
					break;
				}
				if (e) {
					var row_tr = net.dryuf.gui.GuiDom.addElement(table, "tr", { $class: "field" });
					net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(row_tr, "td", { $class: "key" }), net.dryuf.localize(actionMeta.dataClassName, field.getPath())+":");
					net.dryuf.gui.GuiDom.addElements(row_tr, "td", { $class: "value"}).appendChild(e);
				}
			}, actionMeta.getFields());
		var tr_btns = net.dryuf.gui.GuiDom.addElement(table, "tr", { $class: "buttons" });
		/*var td_debug =*/ net.dryuf.gui.GuiDom.addElement(tr_btns, "td");
		var td_btns = net.dryuf.gui.GuiDom.addElement(tr_btns, "td", { $class: "buttons" });
		net.dryuf.gui.GuiDom.addElement(td_btns, "input", { $class: "submit", type: "submit", value: net.dryuf.clocalize(cls, "Send"), this_: processor });
		net.dryuf.gui.GuiDom.addText(td_btns, " ");
		net.dryuf.gui.GuiDom.addElements(td_btns, "input", { $class: "cancel", type: "submit", value: net.dryuf.clocalize(cls, "Cancel"), this_: processor, onclick: function() { this.this_.handleActionCancel(this); return false; } });
		return root;
	},

	renderActionResult:		function(action, result)
	{
		if (action.guiActions == null) {
			this.closeAction();
		}
		else {
			switch (action.guiActions) {
			case 'newLocation':
				window.open(result.location, "Result");
				this.closeAction();
				break;

			case 'message':
				alert(result.message);
				this.closeAction();
				break;

			case 'none':
				this.closeAction();
				break;

			default:
				net.dryuf.reportError("unknown gui action: "+action.guiActions);
			}
		}
	},

	getRendererValue:		function(name)
	{
		throw new Error("invalid renderer value: "+name);
	},

	getViewFilters:			function()
	{
		return {};
	},

	getFilterCondition:		function()
	{
		return [];
	},

	getListSpecialPath:		function()
	{
		return "";
	},
}); })();
