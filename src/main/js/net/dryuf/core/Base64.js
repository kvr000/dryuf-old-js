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

(function() { var cls = net.dryuf.registerClass("net.dryuf.core.Base64", null,
{
	constructor:			function()
	{
	},

	_st$encode:			function(data)
	{
		var b64_map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		var byte0, byte1, byte2;
		var ch0, ch1, ch2, ch3;
		var result = []; //array is used instead of string because in most of browsers working with large arrays is faster than working with large strings
		var j=0;
		for (var i=0; i < data.length; ) {
			byte0 = data[i++];
			byte1 = i < data.length ? data[i++] : null;
			byte2 = i < data.length ? data[i++] : null;
			ch0 = byte0 >> 2;
			ch1 = ((byte0 & 3) << 4) | (byte1 >> 4);
			ch2 = ((byte1 & 15) << 2) | (byte2 >> 6);
			ch3 = byte2 & 63;

			if (byte1 === null) {
				ch2 = ch3 = 64;
			} else if (byte2 === null) {
				ch3 = 64;
			}

			result[j++] = b64_map.charAt(ch0)+b64_map.charAt(ch1)+b64_map.charAt(ch2)+b64_map.charAt(ch3);
		}

		return result.join('');
	},

	_st$decode:			function(data)
	{
		data.replace('-', '+');
		data.replace('/', '_');
		data = data.replace(/[^a-z0-9\+\/=]/ig, '');// strip none base64 characters
		var b64_map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		var byte0, byte1, byte2;
		var ch0, ch1, ch2, ch3;
		var result = []; //array is used instead of string because in most of browsers working with large arrays is faster than working with large strings
		while ((data.length%4) != 0) {
			data += '=';
		}

		for (var i = 0; i < data.length; ) {
			ch0 = b64_map.indexOf(data.charAt(i++));
			ch1 = b64_map.indexOf(data.charAt(i++));
			ch2 = b64_map.indexOf(data.charAt(i++));
			ch3 = b64_map.indexOf(data.charAt(i++));

			byte0 = (ch0 << 2) | (ch1 >> 4);
			byte1 = ((ch1 & 15) << 4) | (ch2 >> 2);
			byte2 = ((ch2 & 3) << 6) | ch3;

			result.push(byte0);
			if (ch2 != 64)
				result.push(byte1);
			if (ch3 != 64)
				result.push(byte2);
		}

		return result;
	},
}); })();
