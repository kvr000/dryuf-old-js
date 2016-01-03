export module net.dryuf.app
{


export interface ClassMeta<ET>
{
	convertField(callerContext: CallerContext, fdef: FieldDef<Object>, value:String): Object;

	getDataClassName(): String;

	instantiate(): ET;

	canNew(callerContext:CallerContext): boolean;

	canDel(callerContext:CallerContext): boolean;

	hasCompos(): boolean;

	isPkEmbedded(): boolean;

	/**
	 * @return
	 *    list of additional PK fields within
	 */
	getAdditionalPkFields(): String[];

	/**
	 * Gets list of field definitions.
	 */
	getFields(): FieldDef<Object>[];

	/**
	 * Gets the field name of the key.
	 */
	getRefName(): String;

	/**
	 * Gets object key from the existing object.
	 */
	getEntityPkValue(entity:ET): Object;

	/**
	 * Sets object key.
	 */
	setEntityPkValue(entity:ET, value:Object): void;

	setComposKey(entity:ET, composKey:Object): void;

	getComposKey(entity:ET): Object;

	getActions(): ActionDef[];

	getFieldRoles(name:String): FieldRoles;

	getField(name:String): FieldDef<Object>;

	getEntityFieldValue(entity:ET, fieldName:String): Object;

	setEntityFieldValue(entity:ET, fieldName:String, value:Object): void;

	getPathField(path:String): FieldDef<Object>;

	getEntityPathValue(entity:ET, path:String): Object;

	setEntityPathValue(entity:ET, path:String, value:Object): void;

	getAction(name:String): ActionDef;

	getRelation(name:String): RelationDef;

	urlDisplayKey(callerContext:CallerContext, entity:ET): String;

	urlPkEntityKey(callerContext:CallerContext, pk:Object): String;

	getGlobalActionList(callerContext:CallerContext): List<ActionDef>;

	getObjectActionList(obj:EntityHolder<ET>): List<ActionDef>;

	getDataClass(): Class<ET>;

	getDataView(): String;

	getEmbedded(): boolean;

	getViewInfo(): ViewInfo;

	getPkClass(): Class<Object>;

	getPkName(): String;

	getComposClass(): Class<Object>;

	getComposPkClass(): Class<Object>;

	getComposPath(): String;

	getEntityRoles(): FieldRoles;

	getFieldOrder(): String[];

	getSuggestFields(): String[];

	getRefFields(): String[];

	getDisplayKeys(): String[];

	getRelations(): Map<String, RelationDef>;

	getPkFieldDef(): FieldDef<Object>;

	getFilterDefsHash(): Map<String, FilterDef>;

	formatAssocType(assocType:int): String;
}


}
