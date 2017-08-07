(function() {
	const _ = {
		isUndefined(object) {
			return Object.prototype.toString.call(object) === '[object Undefined]';
		},
		isNumber(object) {
			return Object.prototype.toString.call(object) === '[object Number]';
		},
		isString(object) {
			return Object.prototype.toString.call(object) === '[object String]';
		},
		isNull(object) {
			return Object.prototype.toString.call(object) === '[object Null]';
		},
		isBoolean(object) {
			return Object.prototype.toString.call(object) === '[object Boolean]';
		},
		isArray(object) {
			return Object.prototype.toString.call(object) === '[object Array]';
		},
		isObject(object) {
			return Object.prototype.toString.call(object) === '[object Object]';
		},
		each(list, iteratee, context) {
			if (_.isArray(list)) {
				list.forEach(iteratee, context);
			} else if (!_.isUndefined(list.length)) {
				_.each(Array.from(list), iteratee, context);
			} else if (_.isObject(list)) {
				for (let key of Object.keys(list)) {
					iteratee.call(context, list[key], key, list);
				}
			}
			return list;
		},
		map(list, iteratee, context) {
			if (_.isArray(list)) {
				return list.map(iteratee, context);
			} else if (!_.isUndefined(list.length)) {
				_.map(Array.from(list), iteratee, context);
			} else if (_.isObject(list)) {
				let result = [];
				for (let key of Object.keys(list)) {
					result.push(iteratee.call(context, list[key], key, list));
				}
				return result;
			}
		},
		reduce(list, iteratee, memo, context) {

		}
	};
	window._ = _;
})();