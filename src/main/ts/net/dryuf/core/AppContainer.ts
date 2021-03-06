module net.dryuf.core {

/**
 * {@code AppContainer} manages the beans and set up of the application.
 */
export interface AppContainer {
	getWorkRoot(): String;

	getAppRoot(): String;

	getConfigValue<T>(name:String, defaultValue:T): T;

	//getCpResource(file:String): InputStream;

	getCpResourceContent(file:String): number[];

	postProcessBean<T>(bean:T, name: String, params: Map<String, Object>): T;

	createCallerContext(): CallerContext;

	getBean(name:String): Object;

	getBeanTyped<T>(name:String, clazz: ObjectConstructor): T;

	createBeaned<T>(clazz: ObjectConstructor, injects: Map<String, Object>): T;

	createBeanedArgs<T>(constructor: ObjectConstructor, args:Object[], injects: Map<String, Object>): T;

	getGlobalRoles(): String[];

	checkRoleDependency(roleName:String): String[];
}


}
