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

(function() { var cls = net.dryuf.registerClass("net.dryuf.datagrid.DataGridPresenter", "net.dryuf.gui.GuiObject",
{
	constructor:			function(owner, position, parameters)
	{
		superc.constructor.apply(this, [ owner, position ]);
		parameters = parameters ? parameters : {};
		this.dataClassName = parameters.dataClassName;
		this.viewName = net.dryuf.defvalue(parameters.viewName, "Default");
		this.parameters = parameters;
		this.originalMode = this.mode = parameters.mode == null ? "list" : parameters.mode;
		if (this.composKey = parameters.composKey == null ? null : parameters.composKey)
			this.baseRole = parameters.composRole;
		else
			this.baseRole = net.dryuf.core.RoleContextHolder.getSysRole();
		this.bind = net.dryuf.defvalue(parameters.bind, {});
		this.init = net.dryuf.defvalue(parameters.init, this.bind);
		this.actionset = net.dryuf.defvalue(parameters.actionset, {});
		this.currentData = parameters.obj;
		this.objKey = parameters.objKey;
		this.rpcPath = net.dryuf.defvalue(parameters.rpcPath, null);

		var dummyContent = net.dryuf.gui.GuiDom.createElement("div", { $class: "net-dryuf-datagrid-Renderer" });
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(dummyContent, "span", { $class: "init" }), net.dryuf.clocalize(cls, "Loading data..."));
		net.dryuf.gui.GuiDom.resetElement(this.position, dummyContent);

		try {
			this.webMeta = net.dryuf.require("net.dryuf.meta.WebMeta").openCached(this.dataClassName, this.viewName);
			if (this.rpcPath == null)
				this.rpcPath = this.webMeta.getDefaultRpcBase();
			if (this.mode == "children") {
				if (!this.composKey) {
					net.dryuf.reportError("children mode but no composKey specified");
				}
			}
			if (this.composKey) {
			}

			if ("actionName" in parameters) {
				if (!(this.action = this.webMeta.getAction(parameters.actionName))) {
					net.dryuf.reportError("action "+this.dataClassName+"."+parameters.actionName+" not defined: "+net.dryuf.core.Dump.dumpContent(parameters, 1));
				}
			}

			this.renderer = net.dryuf.createClassArg1(net.dryuf.defvalue(parameters.renderer, net.dryuf.nullifempty(this.webMeta.view.renderer), this.originalMode == "children" ? "net.dryuf.datagrid.ChildRenderer" : "net.dryuf.datagrid.Renderer"), this);
			if (!this.baseRole)
				this.baseRole = this.getBaseRole();
			if (this.listPageSize == null)
				this.listPageSize = 20;
			this.listPageNum = 0;
			this.initMode();
		}
		catch (ex) {
			var errBox = net.dryuf.gui.GuiDom.createElement("div", { $class: "initError" });
			net.dryuf.gui.GuiDom.setText(errBox, net.dryuf.clocalize(cls, "Error initializing datagrid:"));
			net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(errBox, "pre"), ex.toString());
			net.dryuf.gui.GuiDom.resetElement(dummyContent, errBox);
			throw ex;
		}
		return this;
	},

	_$require:			[ "net.dryuf.core.RoleContext", "net.dryuf.meta.WebMeta", "net.dryuf.gui.GuiDom" ],

	getBaseRole:			function()
	{
		return new net.dryuf.core.RoleContext(null, this.webMeta.runRpc(this.rpcPath, "role", null, { composKey: this.composKey }).role);
	},

	getEntityKeyUrl:		function(entityKey)
	{
		return this.webMeta.getEntityKeyUrl(this.rpcPath, entityKey);
	},

	close:				function()
	{
		var this_ = this;
		if (this.listData) {
			net.dryuf.foreach(function(obj) { this_.renderer.forgetObject(obj); }, this.listData);
			this.listData = null;
		}
		if (this.currentData) {
			this.renderer.forgetObject(this.currentData);
			this.currentData = null;
		}
		this.renderer.close();
		superc.close.apply(this, arguments);
	},

	initMode:			function()
	{
		switch (this.mode) {
		case 'list':
		case 'children':
			this.currentElement = this.renderer.openList(this.position);
			this.handleList();
			break;

		case 'edit':
			this.currentElement = this.renderer.openEdit(this.position);
			this.handleEdit();
			break;

		case 'new':
			this.currentElement = this.renderer.openNew(this.position);
			this.objKey = null;
			this.handleNew();
			break;

		case 'remove':
			this.currentElement = this.renderer.openRemove(this.position);
			this.handleRemove();
			break;

		case 'action':
			this.currentElement = this.renderer.openAction(this.position);
			this.handleAction();
			break;

		case 'dummy':
			this.currentElement = this.renderer.openDummy(this.position);
			this.handleDummy();
			break;

		default:
			net.dryuf.reportError("invalid mode: "+this.mode);
		}
	},

	refresh:			function()
	{
		this.initMode();
	},

	updateObject:			function(obj, completor)
	{
		this.renderer.updateObject(obj, completor);
	},

	handleAnyList:			function()
	{
		this.mode = this.originalMode;
		this.initMode();
	},

	handleList:			function()
	{
		var this_ = this;
		this.listLoadData(function() {
				net.dryuf.gui.GuiDom.resetElement(this_.currentElement, this_.renderer.renderList());
		});
	},

	handleListChoose:		function(page)
	{
		if ((this.listPageNum = Number(page)) < 0)
			this.listPageNum = 0;
		this.handleList();
	},

	handleListAction:		function(action, objKey)
	{
		switch (action.name) {
		case 'new':
			this.mode = action.name;
			this.objKey = null;
			this.initMode();
			break;

		case 'edit':
		case 'remove':
			this.mode = action.name;
			this.objKey = objKey;
			this.initMode();
			break;

		case 'action':
			this.mode = action.name;
			this.objKey = objKey;
			this.initMode();
			break;
		}
	},

	listLoadData:			function(completor)
	{
		var this_ = this;
		if (this.listData)
			net.dryuf.foreach(function(obj) { this_.renderer.forgetObject(obj); }, this.listData);
		if (this.originalMode == "children") {
			this.listData = this.parameters.childData;
			net.dryuf.foreach(function(obj) { obj.role = this_.baseRole; }, this.listData);
			setTimeout(completor, 0);
		}
		else if (this.blocked) {
			this.listData = [];
			setTimeout(completor, 0);
		}
		else {
			net.dryuf.core.Ajax.runAjax(this.webMeta.getMethodPath(this.rpcPath+this.renderer.getListSpecialPath(), "list", { _offset: this.listPageNum*this.listPageSize, _limit: this.listPageSize ? this.listPageSize : null }), net.dryuf.core.Json.json({ viewFilter: this.renderer.getViewFilters(), composKey: this.composKey, _filters: net.dryuf.mergeKeyReplace(this.bind, { '-cond': this.renderer.getFilterCondition() }) }),
					function(datajs) { this_.listLoadDataDone(datajs, completor); });
		}
	},

	listLoadDataDone:		function(datajs, completor)
	{
		var this_ = this;
		var req = net.dryuf.core.Eval.evalSafe("("+datajs+")");
		if (this.listData)
			net.dryuf.foreach(function(obj) { this_.renderer.forgetObject(obj); }, this.listData);
		this.listData = net.dryuf.map(function(holder) { holder.entity; holder.role = new net.dryuf.core.RoleContext(null, holder.role); return holder; }, req.objects);
		this.listTotal = req.total;
		this.gentime = req._gentime;
		var jobw = new (net.dryuf.require("net.dryuf.core.ParallelSync"))(completor);
		net.dryuf.foreach(function(obj) { this_.updateObject(obj, jobw.getPartialCb()); }, this.listData);
		jobw.start();
	},

	curLoadData:			function()
	{
		var datajs = net.dryuf.core.Ajax.runAjaxSync(this.webMeta.getMethodPath(this.webMeta.getEntityKeyUrl(this.rpcPath, this.objKey)));
		var resp = net.dryuf.core.Eval.evalSafe("("+datajs+")");
		resp.role = new net.dryuf.core.RoleContext(null, resp.role);
		this.currentData = resp;
		//this.gentime = resp._gentime;
		return true;
	},

	handleNew:			function()
	{
		var this_ = this;
		var webMeta = this.webMeta;
		this.currentData = { role: this.getBaseRole() };
		var entity = this.currentData.entity = webMeta.createEmpty();
		net.dryuf.foreach(
			function(field) {
				webMeta.setEntityPathValue(entity, field.getPath(), field.getPath() in this_.bind ? this_.bind[field.getPath()] : field.getPath() in this_.init ? this_.init[field.getPath()] : field.gui_init != null ? this_.getInitValue(field.gui_init) : null);
			},
			webMeta.expandFieldsPaths(webMeta.getFields())
		);
		net.dryuf.gui.GuiDom.resetElement(this.currentElement, this.renderer.renderNew());
	},

	handleEdit:			function()
	{
		if (!this.curLoadData())
			this.renderer.closeEdit();
		else
			net.dryuf.gui.GuiDom.resetElement(this.currentElement, this.renderer.renderEdit());
	},

	handleEditSave:			function(form)
	{
		var this_ = this;
		var webMeta = this.webMeta;
		var renderer = this.renderer;
		var currentData = this.currentData;
		var currentEdit = this.currentEdit;
		var ok = true;
		var needForm = false;
		var modified = {};
		net.dryuf.foreach(
			function(field) {
				var el;
				if (field.getPath() in this_.bind && this_.objKey == null)
					webMeta.setEntityPathValue(modified, field.getPath(), this_.bind[field.name]);
				if ((this_.getFieldVisibility(field, this_.objKey == null ? "roleNew" : "roleSet")&2) == 0)
					return;
				if (!(el = currentEdit[field.getPath()]))
					return;
				var text = el.get();
				var internal = null;
				var err = null;
				if (field.getDisplay().match(/^file\(.*$/)) {
					if (text != null) {
						needForm = true;
						webMeta.setEntityPathValue(modified, field.name, text);
					}
					return;
				}
				if (text != "") {
					var textual = net.dryuf.createClass(field.getTextualName() === null ? "net.dryuf.core.Textual" : field.getTextualName());
					if ((err = textual.check(text = textual.prepare(text))) === null)
						internal = textual.convert(text);
				}
				else if (field.getDoMandatory() != null) {
					internal = field.getDoMandatory();
				}
				else if (field.getMandatory() != 0) {
					err = net.dryuf.clocalize(cls, "Field is mandatory");
					internal = null;
				}
				if (err !== null) {
					renderer.renderFieldError(el, err);
					ok = false;
				}
				else if ((internal === null) != (webMeta.getEntityPathValue(currentData.entity, field.getPath()) === null) || internal != webMeta.getEntityPathValue(currentData.entity, field.getPath()) || (this_.objKey == null && webMeta.isAdditionalPkField(field.name))) {
					webMeta.setEntityPathValue(modified, field.getPath(), internal);
				}
			}, webMeta.expandFieldsPaths(webMeta.getFields())
		);
		if (ok) {
			var arg = modified;
			var processor = this;
			var completor = function(datajs) {
				var response;
				try {
					response = net.dryuf.core.Eval.evalSafe("("+datajs+")");
				}
				catch (ex) {
					alert(net.dryuf.clocalize(cls, "Server communication problem: ")+ex.toString()+"\n"+syncjs+"\n"+(net.dryuf.core.RoleContextHolder.getSysRole().checkRole("devel") ? "\n"+net.dryuf.core.Json.json(arg) : ""));
					return false;
				}
				if (response._error) {
					var error = response._error;
					switch (error) {
					case 412:
						var msg = "";
						net.dryuf.foreachKey(function(v, k) { msg += (k != "" ? net.dryuf.localize(this_.dataClassName, k)+": " : "")+v+"\n"; }, response.errors);
						alert(msg);
						break;

					case 413:
						var msg = "";
						net.dryuf.foreach(function(v) { msg += v+"\n"; }, response.globals);
						alert(msg);
						break;

					default:
						alert(net.dryuf.clocalize(cls, "Failed to store object: ")+error);
						break;
					}
					ok = false;
				}
				else {
					processor.objKey == null ? processor.renderer.closeNew() : processor.renderer.closeEdit();
					if (processor.originalMode == "children")
						processor.owner.childUpdated();
				}
			};
			var actionPath = this.webMeta.getMethodPath(this.objKey == null ? this.rpcPath : this.webMeta.getEntityKeyUrl(this.rpcPath, this.objKey));
			if (needForm && net.dryuf.is_std) {
				if (!form.arg)
					form.arg = net.dryuf.gui.GuiDom.addElement(form, "input", { type: "hidden", name: "_arg" });
				form.arg.value = net.dryuf.core.Json.json(arg);
				form.action = actionPath;
				net.dryuf.core.Ajax.runForm(this.objKey == null ? "POST" : "PATCH", form, completor);
			}
			else {
				net.dryuf.core.Ajax.runJsonRest(this.objKey == null ? "POST" : "PATCH", actionPath, net.dryuf.core.Json.json(arg), completor);
			}
		}
		return ok;
	},

	handleEditCancel:		function()
	{
		this.objKey == null ? this.renderer.closeNew() : this.renderer.closeEdit();
	},

	handleRemove:			function()
	{
		if (!this.curLoadData())
			this.renderer.closeRemove();
		else
			net.dryuf.gui.GuiDom.resetElement(this.currentElement, this.renderer.renderRemove());
	},

	handleRemoveRemove:		function()
	{
		var response;
		try {
			var datajs = net.dryuf.core.Ajax.runJsonRestSync("DELETE", this.webMeta.getEntityKeyUrl(this.rpcPath, this.objKey));
			response = net.dryuf.core.Eval.evalSafe("("+datajs+")");
		}
		catch (ex) {
			alert(net.dryuf.clocalize(cls, "Failed to remove object on server: ")+ex.toString());
			return;
		}
		if (response._error) {
			alert(net.dryuf.clocalize(cls, "Failed to remove object: ")+response._error);
		}
		else {
			this.renderer.closeRemove();
			if (this.originalMode == "children")
				this.owner.childUpdated();
		}
	},

	handleRemoveCancel:		function()
	{
		this.renderer.closeRemove();
	},

	handleAction:			function()
	{
		var this_ = this;
		this.actionMeta = net.dryuf.meta.WebMeta.openCached(this.action.formName, net.dryuf.defvalue(this.action.form_view, "Default"));
		var actionData = this.actionData = {};
		net.dryuf.foreach(function(field) {
				if (field.getPath() in this_.actionset) {
					actionData[field.getPath()] = this_.actionset[field.getPath()];
				}
				else if (field.gui_init != null) {
					actionData[field.getPath()] = this_.getInitValue(field.gui_init);
				}
				else {
					actionData[field.getPath()] = null;
				}
			}, this.actionMeta.fields);
		net.dryuf.gui.GuiDom.resetElement(this.currentElement, this.renderer.renderAction());
	},

	handleActionDo:			function(form)
	{
		var this_ = this;
		var action_edit = this.action_edit;
		var ok = true;
		net.dryuf.foreach(function(field) {
				var el;
				if (!(el = action_edit[field.getPath()]))
					return;
				var text = el.get();
				var internal = null;
				var err = null;
				if (text != "") {
					var textual = net.dryuf.createClass(field.getTextualName() === null ? "net.dryuf.core.Textual" : field.getTextualName());
					if ((err = textual.check(text = textual.prepare(text))) === null)
						internal = textual.convert(text);
				}
				else {
					if (field.getMandatory() != 0)
						err = net.dryuf.clocalize(cls, "Field is mandatory");
					internal = null;
				}
				if (err != null) {
					this_.renderer.renderFieldError(el, err);
					ok = false;
				}
				else {
					this_.actionData[field.getPath()] = internal;
				}
			}, this.actionMeta.fields);
		if (ok) {
			var arg = { composKey: this.composKey ? this.composKey : null, key: this.objKey ? this.objKey : null, action: this.action.name, actionData: this.actionData, viewFilter: this.renderer.getViewFilters() };
			var completor = function(datajs) {
				try {
					var response = net.dryuf.core.Eval.evalSafe("("+datajs+")");
					if (response._error) {
						var error = response._error;
						switch (error) {
						case 412:
							var msg = "";
							net.dryuf.foreachKey(function(v, k) { msg += (k != "" ? net.dryuf.localize(this_.dataClassName, k)+": " : "")+v+"\n"; }, response.errors);
							alert(msg);
							break;

						case 413:
							var msg = "";
							net.dryuf.foreach(function(v) { msg += v+"\n"; }, response.globals);
							alert(msg);
							break;

						case 500:
							alert(response.message);
							break;

						default:
							alert(net.dryuf.clocalize(cls, "Failed to run action: ")+net.dryuf.dumpContent(response.error));
							break;
						}
						ok = false;
					}
					else {
						this_.renderer.renderActionResult(this_.action, response);
						ok = true;
					}
				}
				catch (ex) {
					alert(net.dryuf.clocalize(cls, "Server communication problem: ")+ex.toString()+"\n'("+datajs+")'\n"+(net.dryuf.core.RoleContextHolder.getSysRole().checkRole("devel") ? "\n"+net.dryuf.core.Json.json(arg) : ""));
					return false;
				}
			};

			if (net.dryuf.is_std) {
				if (!form.arg)
					form.arg = net.dryuf.gui.GuiDom.addElement(form, "input", { type: "hidden", name: "_arg" });
				form.arg.value = net.dryuf.core.Json.json(arg);
				form.method = "POST";
				form.action = this.webMeta.getMethodPath(!this.action.isStatic ? this.webMeta.getObjectKeyActionPath(this.rpcPath, this.objKey, this.action.name) : this.webMeta.getStaticActionPath(this.rpcPath, this.action.name), "action");
				net.dryuf.core.Ajax.runForm(form.method, form, completor);
			}
			else {
				var syncjs = null;
				try {
					syncjs = net.dryuf.core.Ajax.runAjaxSync(this.webMeta.getMethodPath(this.rpcPath, "action"), net.dryuf.core.Json.json(arg));
					completor(syncjs);
				}
				catch (ex) {
					alert(net.dryuf.clocalize(cls, "Server communication problem: ")+ex.toString()+"\n"+syncjs+"\n"+(net.dryuf.core.RoleContextHolder.getSysRole().checkRole("devel") ? "\n"+net.dryuf.core.Json.json(arg) : ""));
					return false;
				}
			}
		}
		return ok;
	},

	runActionDirect:		function(actionName, composKey, objKey, data)
	{
		var arg = { composKey: composKey, key: objKey, action: actionName, data: data, viewFilter: this.renderer.getViewFilters() };
		var datajs = "";
		try {
			datajs = net.dryuf.core.Ajax.runAjaxSync(this.webMeta.getMethodPath(this.rpcPath, "action"), net.dryuf.core.Json.json(arg));
			var response = net.dryuf.core.Eval.evalSafe("("+datajs+")");
		}
		catch (ex) {
			alert(net.dryuf.clocalize(cls, "Server communication problem: ")+ex.toString()+"\n"+datajs+"\n"+(net.dryuf.core.RoleContextHolder.getSysRole().checkRole("devel") ? "\n"+net.dryuf.core.Json.json(arg) : ""));
			return false;
		}
		if (response.error != 0) {
			switch (response.error) {
				case 412:
					var msg = "";
					net.dryuf.foreachKey(function(v, k) { msg += (k != "" ? net.dryuf.localize(this_.dataClassName, k)+": " : "")+v+"\n"; }, response.errors);
					alert(msg);
					break;

				case 500:
					alert(response.message);
					break;

				default:
					alert(net.dryuf.clocalize(cls, "Failed to run action: ")+response.error);
					break;
			}
			return false;
		}
		else {
			return true;
		}
	},

	showResponseResult:		function(response)
	{
		if (response.error != 0) {
			switch (response.error) {
				case 400:
					alert(response.message);
					break;

				case 412:
					var msg = "";
					net.dryuf.foreachKey(function(v, k) { msg += (k != "" ? net.dryuf.localize(this_.dataClassName, k)+": " : "")+v+"\n"; }, response.errors);
					alert(msg);
					break;

				case 500:
					alert(response.message);
					break;

				default:
					alert(net.dryuf.clocalize(cls, "Failed to run action: ")+response.error);
					break;
			}
			return false;
		}
		else {
			return true;
		}
	},

	handleActionCancel:		function()
	{
		this.renderer.closeAction();
	},

	handleDummy:			function()
	{
		if (this.objKey)
			this.curLoadData();
		net.dryuf.gui.GuiDom.resetElement(this.currentElement, this.renderer.renderDummy());
	},

	getInitValue:			function(init)
	{
		init = init.replace(/\_$time\b/, (new Date()).getTime()/1000);
		return net.dryuf.core.Eval.evalSafe(init);
	},

	getFieldVisibility:		function(field, mode)
	{
		if (field.getPath() in this.bind || (this.composKey && field.isCompos()))
			return 0;
		return this.webMeta.getFieldVisibility(field, mode, this.currentData.role);
	},

	childUpdated:			function()
	{
		if (this.originalMode == "children")
			this.owner.childUpdated();
		else
			this.refresh();
	},

	isChildren:			function()
	{
		return this.originalMode == "children";
	},

}); var superc = cls.superclass; })();


net.dryuf.registerClass("net.dryuf.datagrid.DataKey", null,
{
	constructor:			function(role, hashValue)
	{
		this.role = role;
		this.key = hashValue;
		return this;
	},

	eq:				function(second)
	{
		return net.dryuf.eqObj(this.key, second.key);
	},

	hash:				function()
	{
		if (this._hash != null)
			return this._hash;
		var h = 0;
		net.dryuf.foreachKey(function(v, k) { h ^= net.dryuf.hashObj(k)+net.dryuf.hashObj(v); }, this.key);
		return this._hash = h;
	},
});
