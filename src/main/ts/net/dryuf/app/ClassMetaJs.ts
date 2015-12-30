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

export module net.dryuf.app {

class ClassMetaJs<ET> implements ClassMeta<ET>
{
	public static openCached(dataClassName: String, viewName: String): ClassMeta
	{
		if (ClassMetaJs.cache.get(dataClassName) == null) {
			ClassMetaJs.cache.set(dataClassName+"-"+viewName, new ClassMetaJs(dataClassName, viewName));
		}
		return ClassMetaJs.cache.get(dataClassName);
	}

	public ClassMetaJs(dataClassName: String, viewName: String)
	{
		this.dataClassName = dataClassName;
		this.viewName = viewName;
		this.fullName = this.dataClassName+"-"+this.viewName;
	}

	public getDefaultRpcBase(): String
	{
		return this.rpcBase;
	}

	public getField(name: String): FieldMeta
	{
		var field: FieldDef;
		if (!(field = net.dryuf.find(function(field) { return field.name == name; }, this.fields)))
			throw new Error("asking for unknown field "+this.dataClassName+"."+name);
		return field;
	}

	public getPathField(path: String): FieldMeta
	{
		var p: int;
		if ((p = path.indexOf(".")) < 0) {
			return getField(path);
		}
		else {
			var fieldDef: FieldDef = getField(path.substring(0, p));
			if (!fieldDef.getEmbedded())
				throw new Error("asking for non-existing path "+this.dataClassName+"."+path);
			return fieldDef.getEmbedded().getPathField(path.substring(p+1));
		}
	}

	public getEntityFieldValue(entity: FT, name: String):  Object
	{
		var fieldDef: FieldDef = this.getField(name);
		return fieldDef.getValue(entity);
	}

	public setEntityFieldValue(entity, name, value): void
	{
		var fieldDef: FieldDef = this.getField(name);
		return fieldDef.setValue(entity, value);
	}

	public getEntityPathValue(entity: ET, path: String): Object
	{
		var p: int;
		if ((p = path.indexOf(".")) < 0) {
			return this.getEntityFieldValue(entity, path);
		}
		else {
			var fieldDef: FieldDef = this.getField(path.substring(0, p));
			return fieldDef.getEmbedded().getEntityPathValue(fieldDef.getValue(entity), path.substring(p+1));
		}
	}

	public setEntityPathValue(entity: ET, path: String, value: Object): void
	{
		var p: int;
		if ((p = path.indexOf(".")) < 0) {
			this.setEntityFieldValue(entity, path, value);
		}
		else {
			var fieldDef: FieldDef = this.getField(path.substring(0, p));
			var interValue: Object = fieldDef.getValue(entity);
			if (interValue == null) {
				interValue = fieldDef.getEmbedded().createEmpty();
				fieldDef.setValue(entity, interValue);
			}
			fieldDef.getEmbedded().setEntityPathValue(interValue, path.substring(p+1), value);
		}
	}

	public expandFieldsPaths(fields: FieldDef[]): FieldDef[]
	{
		var result: FieldDef[] = [];
		net.dryuf.foreach(function(fieldDef) {
			if (fieldDef.getEmbedded()) {
				net.dryuf.foreach(function(embeddedField) {
						result.push(embeddedField);
					},
					fieldDef.getEmbedded().expandFieldsPaths(fieldDef.getEmbedded().getFields())
				);
			}
			else {
				result.push(fieldDef);
			}
		}, fields);
		return result;
	}

	public getRefName(): String
	{
		return this.pkFieldName;
	}

	public getRefFields(): FieldDef[]
	{
		return this.refFields;
	}

	public getFields(): FieldDef[]
	{
		return this.fields;
	}

	public getModeFieldList(mode: String): FieldDef[]
	{
		return []/*.concat(this.compos ? [ this.compos ] : [])*/.concat(net.dryuf.listMap(function(field) {
			return [ field ];
		}, this.fields));
	}

	public getFieldVisibility(fdef: FieldDef, modify_req: String, role: String): boolean
	{
		var roles: CallerContext = fdef.roles;
		var modifyName: String = modify_req;
		net.dryuf.assert(role);
		var result: boolean = (role.checkRole(roles[modifyName]() ? roles[modifyName]() : this.entityRoles[modifyName]()) ? 2 : 0) | (role.checkRole(roles.roleGet() ? roles.roleGet() : this.entityRoles.roleGet()) ? 1 : 0);
		return result;
	}

	public getFieldValue(entity: ET, name: String): Object
	{
		net.dryuf.assert(entity);
		if (this.additionalPkFieldsHash[name]) {
			entityPk = this.getEntityPk(entity);
			net.dryuf.assert(entityPk);
			return entityPk[name];
		}
		return entity[name];
	}

	public setFieldValue(entity: ET, name: String, value: Object): void
	{
		if (this.additionalPkFieldsHash[name]) {
			if (!entity[this.pkField])
				entity[this.pkFieldName] = {};
			entity[this.pkFieldName][name] = value;
		}
		else {
			entity[name] = value;
		}
	}

	public getEntityPk(entity: ET): Object
	{
		net.dryuf.assert(entity);
		return entity[this.pkFieldName];
	}

	public getEntityField(entity: ET, name: String): Object
	{
		for (part in name.split(/\./)) {
			entity = entity[part];
		}
		return entity;
	}

	public createEmpty(): Object
	{
		var entity = {};
		net.dryuf.foreach(
			function(field) {
				if (field.getEmbedded())
					entity[field.getName()] = field.getEmbedded().createEmpty();
			},
			this.fields
		);
		return entity;
	}

	public getRelation(name: String): RelationDef
	{
		return net.dryuf.find(function(relation) { return relation.name == name; }, this.relations);
	}

	public getAction(name: String): ActionDef
	{
		return net.dryuf.find(function(action) { return action.name == name; }, this.actions);
	}

	public getObjectActionList(mode: String, objRole: CallerContext): ActionDef[]
	{
		/*DBG*/net.dryuf.assert(objRole);
		return net.dryuf.listMap(function(action) {
			if (!action.guiDef)
				return null;
			if (action.isStatic)
				return null;
			if (!objRole.checkRole(action.roleAction))
				return null;
			if (mode != null && action.reqMode != null && action.reqMode != mode) {
				return null;
			}
			return [ action ];
		}, this.actions);
	}

	public getGlobalActionList(mode: String, baseRole: CallerContext): ActionDef[]
	{
		/*DBG*/net.dryuf.assert(baseRole);
		return net.dryuf.listMap(function(action) {
			return action.guiDef && action.isStatic && baseRole.checkRole(action.roleAction) && (mode == null || action.reqMode == mode) ? [ action ] : [];
		}, this.actions);
	}

	public getMethodPath(rpcPath: String, method: String, addArgs: Map<String, String>): String
	{
		if (rpcPath == null)
			rpcPath = this.rpcBase;
		var path = rpcPath+"?_servmarsh=dryuf";
		if (method != null)
			path += "&_operation="+method;
		path += "&tz="+net.dryuf.tz+"&lang="+net.dryuf.lang;
		if (addArgs)
			net.dryuf.foreachKey(function (v, n) { if (v != null) path += "&"+n+"="+v; }, addArgs);
		return path;
	}

	public getStaticMethodPath(rpcPath: String, method: String, addArgs: Map<String, String>): String
	{
		return this.getMethodPath(rpcPath, method, addArgs);
	}

	public getObjectMethodPath(rpcPath: String, entityPk: Object, method: String, addArgs: Map<String, String>): String
	{
		return this.getMethodPath(this.getEntityKeyUrl(rpcPath, entityPk), method, addArgs);
	}

	public getStaticActionPath(rpcPath: String, action: String): String
	{
		if (rpcPath == null)
			rpcPath = this.rpcBase;
		if (!this.pkEmbedded) {
			rpcPath += "-/";
		}
		else {
			net.dryuf.foreach(function(pkPart) {
					rpcPath += "-/";
				},
				this.getAdditionalPkFields());
		}
		return rpcPath+action+"/";
	}

	public getObjectKeyActionPath(rpcPath: String, entityPk: Object, action: String): String
	{
		return this.getEntityKeyUrl(rpcPath, entityPk)+action+"/";
	}

	public getAdditionalPkFields(): FieldDef[]
	{
		return this.additionalPkFields;
	}

	public isAdditionalPkField(name: String): boolean
	{
		return name in this.additionalPkFieldsHash;
	}

	public getEntityUrl(rpcBase: String, entity: ET): String
	{
		return this.getEntityKeyUrl(rpcBase, this.getEntityPk(entity));
	}

	public getEntityKeyUrl(rpcBase: String, entityPk: ET): String
	{
		if (entityPk == null)
			net.dryuf.reportError("entityPk undefined");
		if (rpcBase == null)
			rpcBase = this.rpcBase;
		if (!this.pkEmbedded) {
			rpcBase += entityPk+"/";
		}
		else {
			net.dryuf.foreach(function(pkPart) {
					rpcBase += entityPk[pkPart]+"/";
				},
				this.getAdditionalPkFields());
		}
		return rpcBase;
	}

	public runRpc(rpcPath: String, method: String, addArgs: Map<String, String>, data: Object): Object
	{
		var datajs: String = net.dryuf.core.Ajax.runAjaxSync(this.getMethodPath(rpcPath, method, addArgs), net.dryuf.core.Json.json(data));
		var response: Object = net.dryuf.core.Eval.evalSafe("("+datajs+")");
		return response;
	}

	public listAsyncSimple(rpcPath: String, composKey: Object, viewFilter: String, completor: Function): void
	{
		net.dryuf.core.Ajax.runAjax(this.getMethodPath(rpcPath, "list", { norole: 1 }), net.dryuf.core.Json.json({ composKey: composKey, viewFilter: viewFilter }), function(datajs) {
			var response: Object = net.dryuf.core.Eval.evalSafe("("+datajs+")");
			completor(response);
		});
	}

	public loadAsyncSimple(rpcPath: String, composKey, viewFilter, completor): 
	{
		net.dryuf.core.Ajax.runAjax(this.getMethodPath(rpcPath, "retrieve", { norole: 1 }), net.dryuf.core.Json.json({ composKey: composKey, viewFilter: viewFilter }), function(datajs) {
			var response: Map<String, Object> = net.dryuf.core.Eval.evalSafe("("+datajs+")");
			completor(response.get(entity));
		});
	}

	public suggestAsync(rpcPath, composKey, suggest, completor): 
	{
		net.dryuf.assert(completor);
		net.dryuf.core.Ajax.runAjax(this.getMethodPath(rpcPath, "suggest", { norole: 1 }), net.dryuf.core.Json.json({ composKey: composKey, _filters: { '-suggest': suggest } }), function(datajs) {
			var response: Map<String, Object> = net.dryuf.core.Eval.evalSafe("("+datajs+")");
			completor(response.objects);
		});
	}

	public loadSyncSimple(rpcPath, objkey): 
	{
		var response = net.dryuf.core.Eval.evalSafe("("+net.dryuf.core.Ajax.runAjaxSync(this.getMethodPath(this.getEntityKeyUrl(rpcPath, objkey), "retrieve", { norole: 1 }), net.dryuf.core.Json.json({ key: objkey }))+")");
		return response.entity;
	}

	public actionSyncSimple(rpcPath, objkey, actionName): 
	{
		var arg = { composKey: composKey, key: objKey, action: actionName, data: data };
		var datajs = null;
		try {
			datajs = net.dryuf.core.Ajax.runAjaxSync(this.webMeta.getMethodPath(rpcPath, "action"), net.dryuf.core.Json.json(arg));
			var response = net.dryuf.core.Eval.evalSafe("("+datajs+")");
		}
		catch (ex) {
			return { error: 400, message: net.dryuf.clocalize(cls, "Server communication problem: ")+ex.toString()+"\n"+datajs+"\n"+(net.dryuf.core.RoleContextHolder.getSysRole().checkRole("devel") ? "\n"+net.dryuf.core.Json.json(arg) : "") };
		}
		return response;
	}

	public cacheSyncSimple(rpcPath, objkey): 
	{
		var appc = net.dryuf.appCache();
		var obj = appc.findObject(this.fullName, objkey);
		if (!obj) {
			if (obj = this.loadSyncSimple(rpcPath, objkey)) {
				if (this.view.clientClass)
					obj = net.dryuf.require(this.view.clientClass).initFromMeta(obj, this);
				appc.addObject(this.fullName, objkey, obj);
			}
		}
		return obj;
	}

	public formatFieldName(entity: Object, fieldName): 
	{
		var value = this.getFieldValue(entity, fieldName);
		if (value == null) {
			return "";
		}
		return value.toString();
	}

	public _st$translateAssocType(assocTypeName): 
	{
		if (!(assocTypeName in cls.assocTypesMap))
			net.dryuf.reportError("assocTypeName "+assocTypeName+" not defined");
		return cls.assocTypesMap[assocTypeName];
	}

	public loadAndParseXml(): 
	{
		var me = this;
		var xmlObject = net.dryuf.metaCache().findObject("net.dryuf.meta.WebMeta.XmlObject", { dataClassName: this.dataClassName, viewName: this.viewName });
		if (!xmlObject) {
			xmlObject = net.dryuf.core.Ajax.runAjaxSyncXmlRoot(net.dryuf.serverPath+"_meta/"+this.dataClassName+"/?view="+this.viewName+net.dryuf.srvArgs(), null, "meta");
			net.dryuf.metaCache().addObject("net.dryuf.meta.WebMeta.XmlObject", { dataClassName: this.dataClassName, viewName: this.viewName }, xmlObject);
		}

		this.rpcBase = xmlObject.getAttribute("rpc");
		var reqs = net.dryuf.xml.DomUtil.hashElementAttrs(net.dryuf.xml.DomUtil.getMandatoryElement(xmlObject, "req"));

		this.entityRoles = new net.dryuf.meta.FieldRolesImpl();
		net.dryuf.foreach(function (v) {
			me.entityRoles["role"+net.dryuf.capitalize(v)+"Value"] = reqs["role"+net.dryuf.capitalize(v)];
		}, [ "new", "set", "get", "del" ]);

		this.view = net.dryuf.xml.DomUtil.hashElementAttrs(net.dryuf.xml.DomUtil.getMandatoryElement(xmlObject, "view"));
		var fieldsSelected = net.dryuf.hashMap(function(s) { return [ s, 1 ]; }, this.view.fields.split(/,/));
		var actionsSelected = net.dryuf.hashMap(function(s) { return [ s, 1 ]; }, this.view.actions.split(/,/));

		this.fields = this.parseReadFields(net.dryuf.xml.DomUtil.getSubElements(xmlObject, "fields", "field"), fieldsSelected);

		var pkeyDefXml;
		if ((pkeyDefXml = net.dryuf.xml.DomUtil.getOptionalElement(xmlObject, "pkeyDef")) != null) {
			var pkeyDef = net.dryuf.xml.DomUtil.hashElementAttrs(pkeyDefXml);
			this.pkEmbedded = Number(pkeyDef.pkEmbedded) != 0;
			this.pkClassName = pkeyDef.pkClazz;
			this.pkFieldName = pkeyDef.pkField;
			this.composPkClassName = pkeyDef.composPkClass || null;
			this.composPath = pkeyDef.composPath || null;
			this.additionalPkFields = (pkeyDef.additionalPkFields || "").split(/,/);
			this.additionalPkFieldsHash = net.dryuf.arrayToHash(this.additionalPkFields, 1);
		}

		this.relations = net.dryuf.map(net.dryuf.xml.DomUtil.hashElementAttrs, net.dryuf.xml.DomUtil.getSubElements(xmlObject, "relations", "relation"));
		//this.checks = net.dryuf.map(net.dryuf.xml.DomUtil.hashElementAttrs, net.dryuf.xml.DomUtil.getSubElements(xmlObject, "checks", "check"));
		//net.dryuf.foreach(function(field) { field.role = ","+field.role+","; field.mandatory = Number(field.mandatory); field.doMandatory = field.doMandatory == "" ? null : net.dryuf.core.Eval.evalSafe(field.doMandatory); }, this.fields);

		this.actions = net.dryuf.map(
			function(actionXml) {
				return {
					name:			actionXml.name,
					options:		actionXml.options ? net.dryuf.hashMap(function(s) { return s.split(/\s*=\s*/); }, actionXml.options) : {},
					isStatic:		Number(actionXml.isStatic) != 0,
					guiDef:			actionXml.guiDef,
					formName:		actionXml.formName,
					formActioner:		actionXml.formActioner,
					reqMode:		actionXml.reqMode ? actionXml.reqMode : null,
					roleAction:		actionXml.roleAction,
				};
			},
			net.dryuf.filter(
				function(actionXml) {
					return actionsSelected[actionXml.name];
				},
				net.dryuf.map(net.dryuf.xml.DomUtil.hashElementAttrs, net.dryuf.xml.DomUtil.getSubElements(xmlObject, "actions", "action"))
			)
		);

		this.refFields = net.dryuf.xml.DomUtil.getMandatoryElement(xmlObject, "refFields").getAttribute("fields").split(/,/);
	}

	public parseReadFields(fieldsXml, fieldsSet): 
	{
		var me = this;

		return net.dryuf.map(function(fieldHash) {
				try {
					var field = new net.dryuf.meta.WebFieldImpl();
					field.name = fieldHash.name;
					field.path = (me.basePath == null ? "" : me.basePath)+field.name;
					field.assocType = cls.translateAssocType(fieldHash.assocType);
					field.roles = new net.dryuf.meta.FieldRolesImpl();
					net.dryuf.foreach(function (role) {
						var roleName = "role"+net.dryuf.capitalize(role);
						field.roles[roleName+"Value"] = net.dryuf.defvalue(fieldHash[roleName], me.entityRoles[roleName]());
					}, [ "new", "set", "get", "del" ]);
					net.dryuf.foreach(function (attr) {
							if (attr in fieldHash)
								field[attr] = fieldHash[attr];
						},
						[ "display" ]);
					if ("mandatory" in fieldHash)
						field.mandatory = Number(fieldHash.mandatory) != 0;
					if ("doMandatory" in fieldHash)
						field.doMandatory = net.dryuf.core.Eval.evalSafe(fieldHash.doMandatory);
					if ("textual" in fieldHash)
						field.textualName = fieldHash.textual;
					if ("ref" in fieldHash)
						field.refClassName = fieldHash.ref;
					if (fieldHash.embedded)
						field.embedded = net.dryuf.meta.WebMeta.openEmbedded(me, fieldHash);
					return field;
				}
				catch (ex) {
					throw new Error("failed to process "+me.dataClassName+"."+fieldHash.name+": "+ex.toString());
				}
			},
			net.dryuf.filter(
				function(f) {
					return fieldsSet == null || f.name in fieldsSet;
				}, net.dryuf.map(
					function(fieldXml) {
						var fieldHash = net.dryuf.xml.DomUtil.hashElementAttrs(fieldXml, fieldsXml);
						fieldHash.fieldsXml = net.dryuf.xml.DomUtil.getOptionalElement(fieldXml, "fields");
						return fieldHash;
					},
					fieldsXml)));
	}

	public _st$openEmbedded(owner, fieldHash): 
	{
		var me = new net.dryuf.meta.WebMeta(fieldHash.embedded, owner.viewName);
		me.basePath = (owner.basePath != null ? ownerBasePath+fieldHash.name : fieldHash.name)+".";
		me.entityRoles = owner.entityRoles;
		me.parseEmbedded(fieldHash.fieldsXml);
		return me;
	}

	public parseEmbedded(fieldsXml): void
	{
		this.fields = this.parseReadFields(net.dryuf.xml.DomUtil.getImmediateElementsByTag(fieldsXml, "field"), null);
	}

	_st$assocTypesMap:			{
		"none":				net.dryuf.meta.WebFieldImpl.AST_None,
		"compos":			net.dryuf.meta.WebFieldImpl.AST_Compos,
		"reference":			net.dryuf.meta.WebFieldImpl.AST_Reference,
		"children":			net.dryuf.meta.WebFieldImpl.AST_Children,
	}

	_$require:			[
		"net.dryuf.core.Ajax",
		"net.dryuf.xml.DomUtil",
		"net.dryuf.core.Eval",
		"net.dryuf.core.Json",
		"net.dryuf.meta.FieldRolesImpl",
		"net.dryuf.meta.WebFieldImpl"
		],

	basePath:				null,

	pkEmbedded:				null,

	pkClassName:				null,

	pkFieldName:				null,

	composPkClassName:			null,

	composPath:				null,

	additionalPkFields:			null,

	additionalPkFieldsHash:			null,


	protected dataClassName: String;

	protected viewName: String;

	protected fullName: String;

	protected rpcBase: String;

	private static cache: Map<String, ClassMetaJs> = new Map<String, ClassMetaJs>();
}

}
