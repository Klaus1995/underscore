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
		isFunction(object) {
			return Object.prototype.toString.call(object) === '[object Function]';
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
					result = list.reduce((sum, value, index, array) => iteratee.call(context, sum, value, index, array), memo);
				} else {
					result = list.reduce((sum, value, index, array) => iteratee.call(context, sum, value, index, array));
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
					result = list.reduceRight((sum, value, index, array) => iteratee.call(context, sum, value, index, array), memo);
				} else {
					result = list.reduceRight((sum, value, index, array) => iteratee.call(context, sum, value, index, array));
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
				return entries.every((item) => obj[item[0]] === item[1]);
			}
		},
		findWhere(list, properties) {
			let result = [],
				entries = Object.entries(properties);
			result = _.find(list, check);
			return result;

			function check(obj) {
				return entries.every((item) => obj[item[0]] === item[1]);
			}
		},
		reject(list, predicate, context) {
			let result = [];
			if (_.isArray(lsit)) {
				list.forEach((item, index, array) => {
					if (!predicate.call(context, item, index, array)) {
						result.push(item);
					}
				});
			} else if (_.isNumber(list.length)) {
				result = _.reject(Array.from(list), predicate, context);
			} else if (_.isObject(list)) {
				for (let key of Object.keys(list)) {
					if (!predicate.call(context, list[key], key, list)) {
						result.push(list[key]);
					}
				}
			}
			return result;
		},
		every(list, predicate = (value) => !!value, context) {
			let result = true;
			if (_.isArray(list)) {
				result = list.every(predicate, context);
			} else if (_.isNumber(list.length)) {
				result = _.every(Array.from(list), predicate, context);
			} else if (_.isObject(list)) {
				for (let key of Object.keys(list)) {
					if (!predicate.call(context, list[key], key, list)) {
						result = false;
						break;
					}
				}
			}
			return result;
		},
		some(list, predicate = (value) => !!value, context) {
			let result = false;
			if (_.isArray(list)) {
				result = list.some(predicate, context);
			} else if (_.isNumber(list.length)) {
				result = _.some(Array.from(list), predicate, context);
			} else if (_.isObject(list)) {
				for (let key of Object.keys(list)) {
					if (predicate.call(context, list[key], key, list)) {
						result = true;
						break;
					}
				}
			}
			return result;
		},
		contains(list, value) {
			let result = false;
			if (_.isArray(list)) {
				result = list.indexOf(value) !== -1;
			} else if (_.isNumber(list)) {
				result = _.contains(Array.from(list), value);
			} else if (_.isObject(list)) {
				for (let listValue of Object.values(list)) {
					if (listValue === value) {
						result = true;
						break;
					}
				}
			}
			return result;
		},
		invoke(list, methodName, ...args) {
			let result = [];
			result = _.map(list, (item) => item[methodName].call(item, ...args));
			return result;
		},
		pluck(list, propertyName) {
			let result = [];
			result = _.map(list, (item) => item[propertyName]);
			return result;
		},
		max(list, iteratee = (item) => item, context) {
			let result;
			result = _.reduce(list, function(memo, value, index, array) {
				if (iteratee.call(context, memo, index, array) >= iteratee.call(context, value, index, array)) {
					return memo;
				} else {
					return value;
				}
			})
			return result;
		},
		min(list, iteratee = (item) => item, context) {
			let result;
			result = _.reduce(list, function(memo, value, index, array) {
				if (iteratee.call(context, memo, index, array) <= iteratee.call(context, value, index, array)) {
					return memo;
				} else {
					return value;
				}
			})
			return result;
		},
		sortBy(list, iteratee, context) {
			let result = [];
			iteratee = _.isFunction(iteratee) ? iteratee : (item) => item[iteratee];
			result = _.map(list, function(item, index, list) {
				return {
					item: item,
					value: iteratee.call(context, item, index, list)
				};
			});
			result.sort(function(a, b) {
				return a.value <= b.value ? -1 : 1;
			});
			result = _.pluck(result, 'item');
			return result;
		},
		groupBy(list, iteratee, context) {

		}
	};
	window._ = _;
})();