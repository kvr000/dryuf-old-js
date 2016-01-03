/*
 * Dryuf framework
 *
 * ----------------------------------------------------------------------------------
 *
 * Copyright (C) 2000-2015 Zbyněk Vyškovský
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
 * @author	2000-2015 Zbyněk Vyškovský
 * @link	mailto:kvr@matfyz.cz
 * @link	http://kvr.matfyz.cz/software/java/dryuf/
 * @link	http://github.com/dryuf/
 * @license	http://www.gnu.org/licenses/lgpl.txt GNU Lesser General Public License v3
 */

export module net { export module dryuf { export module core {


/**
 * {@code CallerContext} represents context of the calling party.
 *
 * It provides reference to application container and also information about the user.
 */
export interface CallerContext //extends AutoCloseable
{
	getAppContainer(): AppContainer;

	getWorkRoot(): String;

	getAppRoot(): String;

	/**
	 * Gets root context from this caller context.
	 *
	 * @return
	 *        root context
	 */
	getRootContext(): CallerContext;

	getUserId(): Object;

	getRealUserId(): Object;

	/**
	 * Checks whether the user is logged in.
	 *
	 * @return
	 *        the indicator whether the user is logged in
	 */
	isLoggedIn(): 	boolean;

	/**
	 * checks if the context has appropriate role (specified as comma separated list of roles)
	 *
	 * @return false
	 *        if the role is not available
	 * @return true
	 *        if the role is available
	 */
	checkRole(role: String): 	boolean;

	/**
	 * gets the list of roles
	 *
	 * @return array of available roles
	 */
	getRoles(): String[];

	getConfigValue<T>(name: String, defaultValue: T): T;

	getContextVar(name: String): Object;

	/**
	 * Closes all associated resources.
	 */
	close(): 	void;

	/**
	 * Checks whether handler of specified identifier is opened within this context.
	 *
	 * @return null
	 *        if no handler is found
	 * @return handler
	 *        handler associated with the identifier
	 */
	checkResource(identifier: String): AutoCloseable;

	/**
	 * Saves handler of specified name in this context.
	 *
	 * @param identifier
	 *        handler identifier
	 * @param handler
	 *        handler to be associated with identifier
	 */
	saveResource(identifier: String, handler: AutoCloseable): 	void;

	createFullContext(): CallerContext;

	createBeaned<T>(clazz: Class<T>, injects: Map<String, Object>): T;

	createBeanedArgs<T>(constructor: Constructor<T>, args: Object[],  injects: Map<String, Object>): T;

	/**
	 * Gets bean of the specified name.
	 *
	 * @param name
	 *        name of the bean
	 *
	 * @return bean
	 *        in case of success
	 *
	 * @throw RuntimeException
	 *        in case the bean was not found
	 */
	getBean(name: String): Object;

	/**
	 * Gets bean of the specified name and type.
	 *
	 * @param name
	 *        name of the bean
	 * @param clazz
	 *        type of the bean
	 *
	 * @return bean
	 *        in case of success
	 *
	 * @throw RuntimeException
	 *        in case the bean was not found
	 */
	getBeanTyped<T>(name: String, clazz: Class<T>): T;

	/**
	 * Notifies context about being logged off.
	 */
	loggedOut(): 	void;

	/**
	 * Gets UI Context for this context.
	 *
	 * @return ui context
	 */
	getUiContext(): UiContext;
}


} } }