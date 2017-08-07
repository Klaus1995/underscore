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
			} else if (_.isNumber(list.length)) {
				_.each(Array.from(list), iteratee, context);
			} else if (_.isObject(list)) {
				for (let key of Object.keys(list)) {
					iteratee.call(context, list[key], key, list);
				}
			}
			return list;
		},
		map(list, iteratee, context) {
			let result = [];
			if (_.isArray(list)) {
				result = list.map(iteratee, context);
			} else if (_.isNumber(list.length)) {
				result = _.map(Array.from(list), iteratee, context);
			} else if (_.isObject(list)) {
				for (let key of Object.keys(list)) {
					result.push(iteratee.call(context, list[key], key, list));
				}
			}
			return result;
		},
		reduce(list, iteratee, memo, context) {
			let result;
			if (_.isArray(list)) {
				if (memo) {
					result = list.reduce(function(sum, value, index, array) {
						return iteratee.call(context, sum, value, index, array);
					}, memo);
				} else {
					result = list.reduce(function(sum, value, index, array) {
						return iteratee.call(context, sum, value, index, array);
					});
				}
			} else if (_.isNumber(list.length)) {
				result = _.reduce(Array.from(list), iteratee, memo, context);
			} else if (_.isObject(list)) {
				let entries = Object.entries(list);
				if (!memo) {
					memo = entries[0][1];
					entries.shift();
				}
				for (let [key, value] of entries) {
					memo = iteratee.call(context, memo, value, key, list);
				}
				result = memo;
			}
			return result;
		},
		reduceRight(list, iteratee, memo, context) {
			let result;
			if (_.isArray(list)) {
				if (memo) {
					result = list.reduceRight(function(sum, value, index, array) {
						return iteratee.call(context, sum, value, index, array);
					}, memo);
				} else {
					result = list.reduceRight(function(sum, value, index, array) {
						return iteratee.call(context, sum, value, index, array);
					});
				}
			} else if (_.isNumber(list.length)) {
				result = _.reduceRight(Array.from(list), iteratee, memo, context);
			} else if (_.isObject(list)) {
				let entries = Object.entries(list);
				entries.reverse();
				if (!memo) {
					memo = entries[0][1];
					entries.shift();
				}
				for (let [key, value] of entries) {
					memo = iteratee.call(context, memo, value, key, list);
				}
				result = memo;
			}
			return result;
		},
		find(list, predicate, context) {
			let result;
			if (_.isArray(list)) {
				result = list.find(predicate, context);
			} else if (_.isNumber(list.length)) {
				result = _.find(Array.from(list), predicate, context);
			} else if (_.isObject(list)) {
				for (let key of Object.keys(list)) {
					if (predicate.call(context, list[key], key, list)) {
						result = list[key];
						break;
					}
				}
			}
			return result;
		},
		filter(list, predicate, context) {
			let result = [];
			if (_.isArray(list)) {
				result = list.filter(predicate, context);
			} else if (_.isNumber(list.length)) {
				result = _.filter(Array.from(list), predicate, context);
			} else if (_.isObject(list)) {
				for (let key of Object.keys(list)) {
					if (predicate.call(context, list[key], key, list)) {
						result.push(list[key]);
					}
				}
			}
			return result;
		},
		where(list, properties) {
			let result = [],
				entries = Object.entries(properties);
			result = _.filter(list, check);
			return result;

			function check(obj) {
				return entries.every(function(item) {
					return obj[item[0]] === item[1];
				});
			}
		},
		findWhere(list, properties) {
			let result = [],
				entries = Object.entries(properties);
			result = _.find(list, check);
			return result;

			function check(obj) {
				return entries.every(function(item) {
					return obj[item[0]] === item[1];
				});
			}
		}
	};
	window._ = _;
})();