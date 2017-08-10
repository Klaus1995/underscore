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

		//如果传入剩下的类型值（null，number，boolean，string），则返回_.property返回对象的某一特定属性的值
		return _.property(value);
	}

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
		} else {
			for (let key of args) {
				if (key in object) {
					result[key] = object[key];
				}
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
		} else {
			for (let key in object) {
				if (args.indexOf(key) === -1) {
					result[key] = object[key];
				}
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
	_.clone = function(objcet) {

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
			let aCtor = a.constructor,
				bCtor = b.constructor;

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

	//isObject方法  
	//function和object会返回true，null会返回false
	_.isObject = function(obj) {
		const type = typeof obj;
		//除去null类型
		if (!obj) return false;
		return type === 'function' || type === 'object';
	};

	//isArray方法
	//因为有内置的方法所以单独提出来
	_.isArray = Array.isArray;

	//isUndefined,isNull,isString,isNumber,isBoolean,isFunction,isDate,isRegExp,isArguments,isSet,isMap,isWeakeSet,isWeakMap,isSymbol方法
	//因为方法类似，所以统一定义
	//数据类型数组集合
	const nativeTypes = ['Undefined', 'Null', 'String', 'Number', 'Boolean', 'Function', 'Date', 'RegExp', 'Arguments', 'Set', 'Map', 'WeakSet', 'WeakMap', 'Symbol'];
	nativeTypes.forEach((type) => {
		_['is' + type] = function(obj) {
			return Object.prototype.toString.call(obj) === '[object ' + type + ']';
		};
	});


	_.identity = function(value) {
		return value;
	};
})()