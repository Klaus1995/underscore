(function() {

	//_是一个构造函数
	let _ = function(obj) {

		//如果obj已经是_的实例对象，则返回obj
		if (obj instanceof _) {
			return obj;
		}

		//如果非new调用构造函数，则返回一个用new调用的实例对象
		if (!(this instanceof _)) {
			return new _(obj);
		}

		//new调用的话会返回一个实例对象，实例的_wrapped属性绑定obj
		this._wrapped = obj;
	};

	window._ = _;

	//createCallback方法
	//内置方法
	//根据传入参数的类型生成相对应的方法
	let createCallback = function(value, context) {

		//如果传入undefined，则返回_.identity
		if (_.isUndefined(value)) {
			return _.identity;
		}

		//如果传入的是function，则判断有没有context，有则绑定this
		if (_.isFunction(value)) {
			if (_.isUndefined(context)) {
				return value;
			} else {
				return value.bind(context);
			}
		}

		//如果传入的是object（不包括function），则返回_.matcher判断给定的对象是否有某些键值对
		if (_.isObject(value)) {
			return _.matcher(value);
		}

		//如果传入剩下的类型值（null，number，boolean，string, synbol），则返回_.property返回对象的某一特定属性的值
		return _.property(value);
	}


	//集合函数 (Collections Functions)


	//each方法
	//_.each(list, iteratee, [context])
	//遍历list中的所有元素，按顺序用遍历输出每个元素。如果传递了context参数，则把iteratee绑定到context对象上。每次调用iteratee都会传递三个参数：(element, index, list)。如果list是个JavaScript对象，iteratee的参数是 (value, key, list))。返回list以方便链式调用。
	_.each = function(list, iteratee, context) {

		iteratee = createCallback(iteratee, context);

		if (_.isNumber(list.length)) {
			list = Array.from(list);
			list.forEach(iteratee);
		} else {
			for (let [key, value] of Object.entries(list)) {
				iteratee(value, key, list);
			}
		}

		return list;
	};

	//map方法
	//_.map(list, iteratee, [context]) 
	//通过转换函数(iteratee迭代器)映射列表中的每个值产生价值的新数组。iteratee传递三个参数：value，然后是迭代 index(或 key 愚人码头注：如果list是个JavaScript对象是，这个参数就是key)，最后一个是引用指向整个list。
	_.map = function(list, iteratee, context) {

		let result = [];

		iteratee = createCallback(iteratee, context);

		if (_.isNumber(list.length)) {
			list = Array.from(list);
			result = list.map(iteratee);
		} else {
			for (let [key, value] of Object.entries(list)) {
				result.push(iteratee(value, key, list));
			}
		}

		return result;
	};

	//reduce方法
	//_.reduce(list, iteratee, [memo], [context])
	//别名为 inject 和 foldl, reduce方法把list中元素归结为一个单独的数值。Memo是reduce函数的初始值，reduce的每一步都需要由iteratee返回。这个迭代传递4个参数：memo,value 和 迭代的index（或者 key）和最后一个引用的整个 list。
	//如果没有memo传递给reduce的初始调用，iteratee不会被列表中的第一个元素调用。第一个元素将取代 传递给列表中下一个元素调用iteratee的memo参数。
	_.reduce = function(list, iteratee, memo, context) {

		let result;

		iteratee = createCallback(iteratee, context);

		if (_.isNumber(list.length)) {
			list = Array.from(list);
			if (_.isUndefined(memo)) {
				result = list.reduce(iteratee);
			} else {
				result = list.reduce(iteratee, memo);
			}
		} else {
			let entries = Object.entries(list);
			if (_.isUndefined(memo)) {
				memo = entries.shift()[1];
			}
			for (let [key, value] of entries) {
				memo = iteratee(memo, value, key, list);
			}
			result = memo;
		}

		return result;
	};

	//reduceRight方法
	//_.reduceRight(list, iteratee, memo, [context]) 
	//reducRight是从右侧开始组合的元素的reduce函数，如果存在JavaScript 1.8版本的reduceRight，则用其代替。
	_.reduceRight = function(list, iteratee, memo, context) {

		let result;

		iteratee = createCallback(iteratee, context);

		if (_.isNumber(list.length)) {
			list = Array.from(list);
			if (_.isUndefined(memo)) {
				result = list.reduceRight(iteratee);
			} else {
				result = list.reduceRight(iteratee, memo);
			}
		} else {
			let entries = Object.entries(list).reverse();
			if (_.isUndefined(memo)) {
				memo = entries.shift()[1];
			}
			for (let [key, value] of entries) {
				memo = iteratee(memo, value, key, list);
			}
			result = memo;
		}

		return result;
	};

	//find方法
	//_.find(list, predicate, [context]) 
	//在list中逐项查找，返回第一个通过predicate迭代函数真值检测的元素值，如果没有值传递给测试迭代器将返回undefined。 如果找到匹配的元素，函数将立即返回，不会遍历整个list。
	_.find = function(list, predicate, context) {

		let result;

		predicate = createCallback(predicate, context);

		if (_.isNumber(list.length)) {
			list = Array.from(list);
			result = list.find(predicate);
		} else {
			for (let [key, value] of Object.entries(list)) {
				if (predicate(value, key, list)) {
					result = value;
					break;
				}
			}
		}

		return result;
	};

	//filter方法
	//_.filter(list, predicate, [context]) 
	//遍历list中的每个值，返回包含所有通过predicate真值检测的元素值。（愚人码头注：如果存在原生filter方法，则用原生的filter方法。）
	_.filter = function(list, predicate, context) {

		let result = [];

		predicate = createCallback(predicate, context);

		_.each(list, function(value, key, list) {

			if (predicate(value, key, list)) {
				result.push(value);
			}
		});

		return result;
	};

	//where方法
	//_.where(list, properties) 
	//遍历list中的每一个值，返回一个数组，这个数组包含properties所列出的属性的所有的 键 - 值对。
	_.where = function(list, properties) {

		return _.filter(list, _.matcher(properties));
	};

	//findWhere方法
	//_.findWhere(list, properties) 
	//遍历整个list，返回匹配 properties参数所列出的所有 键 - 值 对的第一个值。
	//如果没有找到匹配的属性，或者list是空的，那么将返回undefined。
	_.findWhere = function(list, properties) {

		return _.find(list, _.matcher(properties));
	};

	//reject
	//_.reject(list, predicate, [context]) 
	//返回list中没有通过predicate真值检测的元素集合，与filter相反。
	_.reject = function(list, predicate, context) {

		predicate = createCallback(predicate, context);

		return _.filter(list, _.negate(predicate));
	};

	//every方法
	//_.every(list, [predicate], [context]) 
	//如果list中的所有元素都通过predicate的真值检测就返回true。（愚人码头注：如果存在原生的every方法，就使用原生的every。）
	_.every = function(list, predicate, context) {

		let result = true;

		predicate = createCallback(predicate, context);

		if (_.isNumber(list.length)) {
			list = Array.from(list);
			result = list.every(predicate);
		} else {
			for (let [key, value] of Object.entries(list)) {
				if (!predicate(value, key, list)) {
					result = false;
					break;
				}
			}
		}

		return result;
	};

	//some方法
	//_.some(list, [predicate], [context]) 
	//如果list中有任何一个元素通过 predicate 的真值检测就返回true。一旦找到了符合条件的元素, 就直接中断对list的遍历. （愚人码头注：如果存在原生的some方法，就使用原生的some。）
	_.some = function(list, predicate, context) {

		predicate = createCallback(predicate, context);

		return !_.every(list, _.negate(predicate));
	};

	//contains方法
	//_.contains(list, value, [fromIndex]) 
	//如果list包含指定的value则返回true（愚人码头注：使用===检测）。如果list 是数组，内部使用indexOf判断。使用fromIndex来给定开始检索的索引位置。
	_.contains = function(list, value, fromIndex = 0) {

		let result = false;

		if (_.isNumber(list.length)) {
			list = Array.from(list);
			result = list.indexOf(value, fromIndex) !== -1;
		} else {
			for (let item of Object.values(list)) {
				if (Object.is(value, item)) {
					result = true;
					break;
				}
			}
		}

		return result;
	};

	//invoke方法
	//_.invoke(list, methodName, *arguments) 
	//在list的每个元素上执行methodName方法。 任何传递给invoke的额外参数，invoke都会在调用methodName方法的时候传递给它。
	_.invoke = function(list, methodName, ...args) {

		return _.map(list, function(value) {

			if (!_.isFunction(methodName)) {
				methodName = value[methodName];
			}

			return methodName.call(value, ...args);
		});
	};

	//pluck方法
	//_.pluck(list, propertyName)
	//pluck也许是map最常使用的用例模型的简化版本，即萃取数组对象中某属性值，返回一个数组。
	_.pluck = function(list, propertyName) {

		return _.map(list, _.property(propertyName));
	};

	//max
	//_.max(list, [iteratee], [context]) 
	//返回list中的最大值。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。如果list为空，将返回-Infinity，所以你可能需要事先用isEmpty检查 list 。
	_.max = function(list, iteratee, context) {

		let result = -Infinity;

		iteratee = createCallback(iteratee, context);

		_.reduce(list, function(max, item, index, array) {

			let current = iteratee(item, index, array);

			if (current >= max) {
				result = item;
				return current;
			} else {
				return max;
			}
		}, -Infinity);

		return result;
	};

	//min方法
	//_.min(list, [iteratee], [context]) 
	//返回list中的最小值。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。如果list为空，将返回-Infinity，所以你可能需要事先用isEmpty检查 list 。
	_.min = function(list, iteratee, context) {

		let result = Infinity;

		iteratee = createCallback(iteratee, context);

		_.reduce(list, function(min, item, index, array) {

			let current = iteratee(item, index, array);

			if (current <= min) {
				result = item;
				return current;
			} else {
				return min;
			}
		}, Infinity);

		return result;
	};


	//数组函数（Array Functions）


	//first方法
	//_.first(array, [n])
	//返回array（数组）的第一个元素。传递 n参数将返回数组中从第一个元素开始的n个元素（愚人码头注：返回数组中前 n 个元素.）。
	_.first = function(array, n) {

		array = Array.from(array);

		if (!_.isUndefined(n)) {
			if (n > array.length) {
				n = array.length;
			} else if (n < 0) {
				n = 0;
			}
			return array.slice(0, n);
		}

		return array[0];
	};

	//initial方法
	//_.initial(array, [n]) 
	//返回数组中除了最后一个元素外的其他全部元素。 在arguments对象上特别有用。传递 n参数将从结果中排除从最后一个开始的n个元素（愚人码头注：排除数组后面的 n 个元素）。
	_.initial = function(array, n = 1) {

		array = Array.from(array);

		if (n > array.length) {
			n = array.length;
		} else if (n < 0) {
			n = 0;
		}

		return array.slice(0, array.length - n);
	};

	//last方法
	//_.last(array, [n]) 
	//返回array（数组）的最后一个元素。传递 n参数将返回数组中从最后一个元素开始的n个元素（愚人码头注：返回数组里的后面的n个元素）。
	_.last = function(array, n) {

		array = Array.from(array);

		if (!_.isUndefined(n)) {
			if (n > array.length) {
				n = array.length;
			} else if (n < 0) {
				n = 0;
			}
			return array.slice(array.length - n, array.length);
		}

		return array[array.length - 1];
	};

	//rest方法
	//_.rest(array, [index])
	//返回数组中除了第一个元素外的其他全部元素。传递 index 参数将返回从index开始的剩余所有元素 。
	_.rest = function(array, index = 1) {

		array = Array.from(array);

		return array.slice(index, array.length);
	};

	//compact方法
	//_.compact(array) 
	//返回一个除去所有false值的 array副本。 在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.
	_.compact = function(array) {

		return _.filter(array, _.identity);
	};

	//flatten方法
	//_.flatten(array, [shallow]) 
	//将一个嵌套多层的数组 array（数组） (嵌套可以是任何层数)转换为只有一层的数组。 如果你传递 shallow参数，数组将只减少一维的嵌套。
	_.flatten = function(array, shallow) {

		let result = [];

		flatten(array, false);

		return result;

		function flatten(array, boolean) {

			array = Array.from(array);

			array.forEach(function(item, index, array) {

				if (_.isArray(item) && !boolean) {
					flatten(item, shallow);
					return;
				}
				result.push(item);
			});
		}
	};

	//without方法
	//_.without(array, *values) 
	//返回一个删除所有values值后的 array副本。（愚人码头注：使用===表达式做相等测试。）
	_.without = function(array, ...values) {

		return _.filter(array, function(item) {

			return !_.contains(values, item);
		});
	};


	//与函数有关的函数（Function Functions）


	//negate方法
	//_.negate(predicate) 
	//返回一个新的predicate函数的否定版本。
	_.negate = function(predicate) {

		return function(...args) {

			return !predicate(...args);
		}
	};


	//对象函数（Object Functions）


	//keys方法
	//_.keys(object)
	//检索object拥有的所有可枚举属性的名称。
	_.keys = Object.keys;

	//allKeys方法
	//_.allKeys(object) 
	//检索object拥有的和继承的所有属性的名称。
	_.allKeys = function(obj) {

		let keys = [];

		for (let key in obj) {
			keys.push(key);
		}

		return keys;
	};

	//values方法
	//_.values(object) 
	//返回object对象所有的属性值。
	_.values = Object.values;

	//mapObject方法
	//_.mapObject(object, iteratee, [context]) 
	//它类似于map，但是这用于对象。转换每个属性的值。
	_.mapObject = function(object, iteratee, context) {

		iteratee = createCallback(iteratee, context);

		let result = {};

		for (let [key, value] of Object.entries(object)) {
			result[key] = iteratee(value, key, object);
		}

		return result;
	};

	//pairs方法
	//_.pairs(object) 
	//把一个对象转变为一个[key, value]形式的数组。
	_.pairs = Object.entries;

	//invert方法
	//_.invert(object) 
	//返回一个object副本，使其键（keys）和值（values）对换。对于这个操作，必须确保object里所有的值都是唯一的且可以序列化成字符串。
	_.invert = function(object) {

		let result = {};

		for (let [key, value] of Object.entries(object)) {
			result[value] = key;
		}

		return result;
	};

	//create方法
	//_.create(prototype, props) 
	//创建具有给定原型的新对象，可选附加props作为own的属性。基本上，和Object.create一样， 但是没有所有的属性描述符。
	_.create = function(prototype, props) {

		let result = Object.create(prototype);

		if (props) {
			result = Object.assign(result, props);
		}

		return result;
	};

	//functions方法
	//_.functions(object)
	//返回一个对象里所有的方法名, 而且是已经排序的 — 也就是说, 对象里每个方法(属性值是一个函数)的名称。
	_.functions = function(object) {

		let result = [];

		for (let key in object) {
			if (_.isFunction(object[key])) {
				result.push(key);
			}
		}

		return result.sort();
	};

	//findKey方法
	//_.findKey(object, predicate, [context]) 
	//跟数组方法的 _.findIndex 类似，找到对象的键值对中第一个满足条件的键值对，并返回该键值对 key 值。
	_.findKey = function(object, predicate, context) {

		predicate = createCallback(predicate, context);

		for (let [key, value] of Object.entries(object)) {
			if (predicate(value, key, object)) {
				return key;
			}
		}
	};

	//extend方法
	//_.extend(destination, *sources) 
	//复制source对象中的所有属性覆盖到destination对象上，并且返回 destination 对象。 复制是按顺序的, 所以后面的对象属性会把前面的对象属性覆盖掉(如果有重复)。
	_.extend = function(destination, ...sources) {

		sources.forEach(function(source) {
			for (let key in source) {
				destination[key] = source[key];
			}
		});

		return destination;
	};

	//extendOwn方法
	//_.extendOwn(destination, *sources) 
	//类似于 extend, 但只复制自己的属性覆盖到目标对象。（愚人码头注：不包括继承过来的属性）。
	_.extendOwn = Object.assign;

	//pick方法
	//_.pick(object, *keys) 
	//返回一个object副本，只过滤出keys(有效的键组成的数组)参数指定的属性值。或者接受一个判断函数，指定挑选哪个key。
	_.pick = function(object, ...args) {

		let result = {},
			iteratee;

		if (_.isFunction(args[0])) {
			iteratee = createCallback(...args);
			for (let key in object) {
				if (iteratee(object[key], key, object)) {
					result[key] = object[key];
				}
			}
		}

		if (_.isArray(args[0])) {
			args = [...args[0]];
		}

		for (let key of args) {
			if (key in object) {
				result[key] = object[key];
			}
		}

		return result;
	};

	//omit方法
	//_.omit(object, *keys) 
	//返回一个object副本，只过滤出除去keys(有效的键组成的数组)参数指定的属性值。 或者接受一个判断函数，指定忽略哪个key。
	_.omit = function(object, ...args) {

		let result = {},
			iteratee;

		if (_.isFunction(args[0])) {
			iteratee = createCallback(...args);
			for (let key in object) {
				if (!iteratee(object[key], key, object)) {
					result[key] = object[key];
				}
			}
		}

		if (_.isArray(args[0])) {
			args = [...args[0]];
		}

		for (let key in object) {
			if (args.indexOf(key) === -1) {
				result[key] = object[key];
			}
		}

		return result;
	};

	//defaults方法
	//_.defaults(object, *defaults) 
	//用defaults对象填充object 中的undefined属性。 并且返回这个object。一旦这个属性被填充，再使用defaults方法将不会有任何效果。
	_.defaults = function(object, ...defaults) {

		defaults.forEach(function(item) {
			for (let key in item) {
				if (_.isUndefined(object[key])) {
					object[key] = item[key];
				}
			}
		});

		return object;
	};

	//clone方法
	//_.clone(object) 
	//创建 一个浅复制（浅拷贝）的克隆object。任何嵌套的对象或数组都通过引用拷贝，不会复制。
	_.clone = function(object) {

		if (_.isArray(object)) {
			return object.slice();
		} else {
			return _.extend({}, object);
		}
	};

	//tap方法
	//_.tap(object, interceptor) 
	//用 object作为参数来调用函数interceptor，然后返回object。这种方法的主要意图是作为函数链式调用 的一环, 为了对此对象执行操作并返回对象本身。
	_.tap = function(object, interceptor) {

		interceptor(object);

		return object;
	};

	//has方法
	//_.has(object, key) 
	//对象是否包含给定的键吗？等同于object.hasOwnProperty(key)，但是使用hasOwnProperty 函数的一个安全引用，以防意外覆盖。
	_.has = function(object, key) {

		return Object.prototype.hasOwnProperty.call(object, key);
	};

	//property方法
	//_.property(key) 
	//返回一个函数，这个函数返回任何传入的对象的key属性。
	_.property = function(key) {

		return function(object) {
			return object[key];
		};
	};

	//propertyOf方法
	//_.propertyOf(object) 
	//和_.property相反。需要一个对象，并返回一个函数,这个函数将返回一个提供的属性的值。
	_.propertyOf = function(object) {

		return function(key) {
			return object[key];
		};
	};

	//matcher方法
	//_.matcher(attrs)
	//返回一个断言函数，这个函数会给你一个断言 可以用来辨别 给定的对象是否匹配attrs指定键/值属性。
	_.matcher = function(attrs) {

		return function(object) {

			for (let [key, value] of Object.entries(attrs)) {
				if (object[key] !== value || !(key in object)) {
					return false;
				}
			}

			return true;
		};
	};

	//isEqual方法
	//_.isEqual(object, other) 
	//执行两个对象之间的优化深度比较，确定他们是否应被视为相等。
	_.isEqual = function(a, b) {

		return eq(a, b);

		function eq(a, b, aStack, bStack) {

			//先简单判断是否全等，包括基本类型的值相同，或者引用类型的引用相同
			//注意+0和-0会认为是不等的，而NaN和NaN会认为是相等的
			if (Object.is(a, b)) {
				return true;
			}

			// 如果 a 和 b 是 underscore 的实例对象
			// 那么比较 _wrapped 属性值（Unwrap）
			if (a instanceof _) a = a._wrapped;
			if (b instanceof _) b = b._wrapped;

			//比较a和b的数据类型，如果数据类型不同直接返回false
			if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
				return false;
			}

			//js七大数据类型：undefined，null，string，number，boolean，symbol，object
			//前六种可以简单处理以后比较
			//object要进行递归比较
			if (_.isUndefined(a) || _.isNull(a)) {
				//如果数据类型是undefined或者null，并且toString判断类型想吐，那么一定相等
				//其实这步判断没有意义，因为前面Object.is()判断一定已经返回true了
				//但是为了理顺判断思路还是写了
				return true;
			} else if (_.isString(a) || _.isRegExp(a)) {
				//如果数据类型是string或者正则表达式，那么先要转为string基本类型值再进行比较
				//因为 'a' === new String('a') 的结果为false，但是_.isEqual认为相等
				//转化方法用 ''+a 的黑科技
				return '' + a === '' + b;
			} else if (_.isNumber(a) || _.isDate(a) || _.isBoolean(a)) {
				//如果数据类型是number，boolean或者Date对象，那么先要转为number基本类型值再进行比较
				//因为 1 === new String(1) 或者 true === new Boolean(true)的结果为false，但是_.isEqual认为相等
				//转化方法用 +a 的黑科技，Date对象会返回时间戳，是Date时间和 1970 年 1 月 1 日 0 点的毫秒数
				//ES6的Object.is(a, b)方法会对+0、-0和NaN的情况进行正确处理
				return Object.is(+a, +b);
			} else if (_.isSymbol(a)) {
				//如果数据类型是symbol，可以直接进行比较
				//但是如果相等的话前面Object.is()应该已经返回true
				//所以此处一定不相等
				return false;
			} else if (_.isSet(a) || _.isMap(a)) {
				//如果数据类型是set或者map，需要把它转化成数组进一步比较
				a = [...a];
				b = [...b];
			} else if (_.isWeakSet(a) || _.isWeakMap(a)) {
				//如果数据类型是weakset或者weakmap，只能判断变量指针是否相同
				//但是如果相等的话前面Object.is()应该已经返回true
				//所以此处一定不相等
				return false;
			} else if (_.isFunction(a)) {
				//如果数据类型是function，也只能判断变量指针是否相同
				//因为把 function a(){} 和 function b(){} 认为是equal是没有意义的
				//但是如果相等的话前面Object.is()应该已经返回true
				//所以此处一定不相等
				return false;
			}

			//如果执行到这一步还没有返回值，那么剩下的类型只有array和狭义上的object
			//狭义上的object指的是{key1:value1,key2:value2}这类
			//这时候就需要递归展开判断，需要避免一种无限循环的情况
			//例如 :
			//let a = {};
			//a.key = a;
			//或者
			//let a = [];
			//a[0] = a;
			//为了避免，需要创建一个栈
			aStack = aStack || [];
			bStack = bStack || [];

			//当判断的对象是狭义object或者array时遍历这个栈，判断栈内是否已经存在该对象的引用
			//据此避免无限循环递归
			for (let i = 0; i < aStack.length; i++) {
				if (aStack[i] === a) {
					return bStack[i] === b;
				}
			}

			//如果不存在则将该对象推入栈
			aStack.push(a);
			bStack.push(b);

			//然后进行递归展开判断
			if (_.isArray(a)) {
				//如果是数组，则先判断数组长度
				//因为如果长度不等那两个数组一定不equal
				if (a.length !== b.length) {
					return false;
				}

				//长度相等则把数组展开递归判断每一个元素
				for (let i = 0; i < a.length; i++) {
					if (!eq(a[i], b[i], aStack, bStack)) {
						return false;
					}
				}
			}

			//只剩下狭义上的object
			//首先判断对象的构造函数，如果不同则认为是unequal
			let aCtor = a.__proto__,
				bCtor = b.__proto__;

			//第二个判断条件是为了不同iframe间内置的Object构造函数不同，
			if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
				return false;
			}

			//判断狭义object的键的数量是否相等，不等则一定unequal
			if (Object.keys(a).length !== Object.keys(b).length) {
				return false;
			}

			//狭义object展开递归判断每一个键值对
			for (let [key, value] of Object.entries(a)) {
				if (!(_.has(b, key) && eq(value, b[key], aStack, bStack))) {
					return false;
				}
			}

			//经过重重判断后，则认为a和b是equal的
			//退栈，并返回true
			aStack.pop();
			bStack.pop();

			return true;
		}
	};

	//isMatch方法
	//_.isMatch(object, properties) 
	//告诉你properties中的键和值是否包含在object中。
	_.isMatch = function(object, properties) {

		for (let [key, value] of Object.entries(properties)) {
			if (object[key] !== value || !(key in object)) {
				return false;
			}
		}

		return true;
	};

	//isEmpty方法
	//_.isEmpty(object) 
	//如果object 不包含任何值(没有可枚举的属性)，返回true。 对于字符串和类数组（array-like）对象，如果length属性为0，那么_.isEmpty检查返回true。
	_.isEmpty = function(object) {

		if (_.isNull(object)) {
			return true;
		}

		if (_.isArray(object) || _.isString(object)) {
			return object.length === 0;
		}

		if (_.isObject(object)) {
			if (_.isNumber(object.length)) {
				return object.length === 0;
			}

			return Object.keys(object).length === 0;
		}
	};

	//isElement方法
	//_.isElement(object) 
	//如果object是一个DOM元素，返回true。
	_.isElement = function(object) {

		return object.nodeType === 1;
	};

	//isArray方法
	//_.isArray(object)
	//如果object是一个数组，返回true。
	//因为有内置的方法所以单独提出来
	_.isArray = Array.isArray;

	//isObject方法  
	//_.isObject(value) 
	//如果object是一个对象，返回true。需要注意的是JavaScript数组和函数是对象，字符串和数字不是。
	//function和object会返回true，null会返回false
	_.isObject = function(object) {

		const type = typeof object;

		//除去null类型
		if (!object) return false;

		return type === 'function' || type === 'object';
	};

	//isUndefined,isNull,isString,isNumber,isBoolean,isFunction,isDate,isRegExp,isArguments,isSet,isMap,isWeakeSet,isWeakMap,isSymbol方法
	//因为方法类似，所以统一定义
	//数据类型数组集合
	['Undefined', 'Null', 'String', 'Number', 'Boolean', 'Function', 'Date', 'RegExp', 'Arguments', 'Error', 'Set', 'Map', 'WeakSet', 'WeakMap', 'Symbol'].forEach(function(type) {

		_['is' + type] = function(object) {

			return Object.prototype.toString.call(object) === '[object ' + type + ']';
		};
	});

	//isFinite方法
	//_.isFinite(object) 
	//如果object是一个有限的数字，返回true。
	_.isFinite = Number.isFinite;

	//isNaN方法
	//_.isNaN(object) 
	//如果object是 NaN，返回true。 
	//注意： 这和原生的isNaN 函数不一样，如果变量是undefined，原生的isNaN 函数也会返回 true 。
	_.isNaN = Number.isNaN;

	_.identity = function(value) {
		return value;
	};
})()