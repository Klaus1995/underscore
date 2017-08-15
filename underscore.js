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

	let _previous = window._;

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

	//sortBy方法
	//_.sortBy(list, iteratee, [context]) 
	//返回一个排序后的list拷贝副本。如果传递iteratee参数，iteratee将作为list中每个值的排序依据。迭代器也可以是字符串的属性的名称进行排序的(比如 length)。
	_.sortBy = function(list, iteratee, context) {

		iteratee = createCallback(iteratee, context);

		list = _.map(list, function(item, index, array) {

			return {
				item: item,
				value: iteratee(item, index, array)
			};
		}).sort(function(a, b) {

			return a.value <= b.value ? -1 : 1;
		});

		return _.pluck(list, 'item');
	};

	//groupBy方法
	//_.groupBy(list, iteratee, context) 
	//把一个集合分组为多个集合，通过 iterator 返回的结果进行分组. 如果 iterator 是一个字符串而不是函数, 那么将使用 iterator 作为各元素的属性名来对比进行分组.
	_.groupBy = function(list, iteratee, context) {

		let result = {};

		iteratee = createCallback(iteratee, context);

		_.each(list, function(item, index, array) {

			let key = iteratee(item, index, array);

			if (!_.has(result, key)) {
				result[key] = [];
			}

			result[key].push(item);
		});

		return result;
	};

	//indexBy方法
	//_.indexBy(list, iteratee, [context]) 
	//给定一个list，和 一个用来返回一个在列表中的每个元素键 的iterator 函数（或属性名）， 返回一个每一项索引的对象。和groupBy非常像，但是当你知道你的键是唯一的时候可以使用indexBy 。
	_.indexBy = function(list, iteratee, context) {

		let result = {};

		iteratee = createCallback(iteratee, context);

		_.each(list, function(item, index, array) {

			let key = iteratee(item, index, array);

			result[key] = item;
		});

		return result;
	};

	//countBy方法
	//_.countBy(list, iteratee, [context]) 
	//排序一个列表组成一个组，并且返回各组中的对象的数量的计数。类似groupBy，但是不是返回列表的值，而是返回在该组中值的数目。
	_.countBy = function(list, iteratee, context) {

		let result = {};

		iteratee = createCallback(iteratee, context);

		_.each(list, function(item, index, array) {

			let key = iteratee(item, index, array);

			if (!_.has(result, key)) {
				result[key] = 0;
			}

			result[key]++;
		});

		return result;
	};

	//shuffle方法
	//_.shuffle(list) 
	//返回一个随机乱序的 list 副本, 使用 Fisher-Yates shuffle 来进行随机乱序.
	_.shuffle = function(list) {

		let result;

		if (_.isNumber(list.length)) {
			list = Array.from(list);
		} else {
			list = Object.values(list);
		}

		for (let i = 0; i < list.length; i++) {
			let random = _.random(i, list.length - 1);
			[list[i], list[random]] = [list[random], list[i]];
		}

		return list;
	};

	//sample方法
	//_.sample(list, [n]) 
	//从 list中产生一个随机样本。传递一个数字表示从list中返回n个随机元素。否则将返回一个单一的随机项。
	_.sample = function(list, n) {

		if (_.isNumber(list.length)) {
			list = Array.from(list);
		} else {
			list = Object.values(list);
		}

		if (_.isUndefined(n)) {
			return list[_.random(list.length - 1)];
		} else {
			return _.shuffle(list).slice(0, Math.max(0, n));
		}
	};

	//toArray方法
	//_.toArray(list)
	//把list(任何可以迭代的对象)转换成一个数组，在转换 arguments 对象时非常有用。
	_.toArray = function(list) {

		if (_.isNumber(list.length)) {
			list = Array.from(list);
		} else {
			list = Object.values(list);
		}

		return list;
	};

	//size方法
	//_.size(list)
	//返回list的长度。
	_.size = function(list) {

		if (_.isNumber(list.length)) {
			list = Array.from(list);
		} else {
			list = Object.keys(list);
		}

		return list.length;
	};

	//partition方法
	//_.partition(list, predicate)
	//拆分一个数组（array）为两个数组：  第一个数组其元素都满足predicate迭代函数， 而第二个的所有元素均不能满足predicate迭代函数。
	_.partition = function(list, predicate, context) {

		let result = [
			[],
			[]
		];

		predicate = createCallback(predicate, context);

		_.each(list, function(item, index, array) {

			if (predicate(item, index, array)) {
				result[0].push(item);
			} else {
				result[1].push(item);
			}
		});

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

	//union方法
	//_.union(*arrays) 
	//返回传入的 arrays（数组）并集：按顺序返回，返回数组的元素是唯一的，可以传入一个或多个 arrays（数组）。
	_.union = function(...arrays) {

		return _.uniq(_.flatten(arrays, true));
	};

	//intersection方法
	//_.intersection(*arrays) 
	//返回传入 arrays（数组）交集。结果中的每个值是存在于传入的每个arrays（数组）里。
	_.intersection = function(...arrays) {

		let result = [];

		array = arrays.shift();

		_.each(array, function(item) {

			if (_.every(arrays, function(value) {

					if (_.contains(value, item)) {
						return true;
					}
				})) {
				result.push(item);
			}
		});

		return _.uniq(result);
	};

	//difference方法
	//_.difference(array, *others) 
	//类似于without，但返回的值来自array参数数组，并且不存在于other 数组.
	_.difference = function(array, ...others) {

		others = _.flatten(others, true);

		return _.without(array, ...others);
	};

	//uniq方法
	//_.uniq(array, [iteratee], [context]) 
	//返回 array去重后的副本.如果要处理对象元素, 传递 iteratee函数来获取要对比的属性.
	_.uniq = function(array, iteratee, context) {

		array = _.map(array, iteratee, context);

		return [...new Set(array)];
	};

	//zip方法
	//_.zip(*arrays) 
	//将 每个arrays中相应位置的值合并在一起。在合并分开保存的数据时很有用. 如果你用来处理矩阵嵌套数组时, _.zip.apply 可以做类似的效果。
	_.zip = function(...arrays) {

		let result = [];

		let length = _.max(arrays, 'length').length;

		for (let i = 0; i < length; i++) {
			result[i] = _.pluck(arrays, i);
		}

		return result;
	};

	//unzip方法
	//_.unzip(array)
	//与zip功能相反的函数，给定若干arrays，返回一串联的新数组，其第一元素个包含所有的输入数组的第一元素，其第二包含了所有的第二元素，依此类推。通过apply用于传递数组的数组。
	_.unzip = function(array) {

		return _.zip(...array);
	};

	//object方法
	//_.object(list, [values]) 
	//将数组转换为对象。传递任何一个单独[key, value]对的列表，或者一个键的列表和一个值得列表。 如果存在重复键，最后一个值将被返回。
	_.object = function(list, values) {

		let result = {};

		_.each(list, function(item, index, array) {

			if (_.isUndefined(values)) {
				result[item[0]] = item[1];
			} else {
				result[item] = values[index];
			}
		});

		return result;
	};

	//indexOf方法
	//_.indexOf(array, value, [isSorted]) 
	//返回value在该 array 中的索引值，如果value不存在 array中就返回-1。使用原生的indexOf 函数，除非它失效。如果您正在使用一个大数组，你知道数组已经排序，传递true给isSorted将更快的用二进制搜索..,或者，传递一个数字作为第三个参数，为了在给定的索引的数组中寻找第一个匹配值。
	_.indexOf = function(array, value, fromIndex = 0) {

		array = Array.from(array);

		return array.indexOf(value, fromIndex);
	};

	//lastIndexOf方法
	//_.lastIndexOf(array, value, [fromIndex]) 
	//返回value在该 array 中的从最后开始的索引值，如果value不存在 array中就返回-1。如果支持原生的lastIndexOf，将使用原生的lastIndexOf函数。传递fromIndex将从你给定的索性值开始搜索。
	_.lastIndexOf = function(array, value, fromIndex = array.length - 1) {

		array = Array.from(array);

		return array.length - array.lastIndexOf(value, fromIndex);
	};

	//sortedIndex方法
	//_.sortedIndex(list, value, [iteratee], [context]) 
	//使用二分查找确定value在list中的位置序号，value按此序号插入能保持list原有的排序。如果提供iterator函数，iterator将作为list排序的依据，包括你传递的value 。iterator也可以是字符串的属性名用来排序(比如length)。
	_.sortedIndex = function(array, value, iteratee, context) {

		array = Array.from(array);

		iteratee = createCallback(iteratee, context);

		value = iteratee(value);

		let low = 0,
			high = array.length;

		while (low < high) {
			let mid = Math.floor((low + high) / 2);
			if (value <= iteratee(array[mid])) {
				high = mid;
			} else {
				low = mid + 1;
			}
		}

		return low;
	};

	//findIndex方法
	//_.findIndex(array, predicate, [context]) 
	//类似于_.indexOf，当predicate通过真检查时，返回第一个索引值；否则返回-1。
	_.findIndex = function(array, predicate, context) {

		return _.indexOf(array, _.find(array, predicate, context));
	};

	//findLastIndex方法
	//_.findLastIndex(array, predicate, [context]) 
	//和_.findIndex类似，但反向迭代数组，当predicate通过真检查时，最接近末端的索引值将被返回。
	_.findLastIndex = function(array, predicate, context) {

		return _.lastIndexOf(array, _.find(array, predicate, context));
	};

	//range方法
	//_.range([start], stop, [step]) 
	//一个用来创建整数灵活编号的列表的函数，便于each 和 map循环。如果省略start则默认为 0；step 默认为 1.返回一个从start 到stop的整数的列表，用step来增加 （或减少）独占。值得注意的是，如果stop值在start前面（也就是stop值小于start值），那么值域会被认为是零长度，而不是负增长。-如果你要一个负数的值域 ，请使用负数step.
	_.range = function(start, stop, step = 1) {

		let result = [];

		if (_.isUndefined(stop)) {
			[start, stop] = [0, start];
		}

		if (step > 0 && stop > start) {
			do {
				result.push(start);
				start += step
			} while (start < stop)
		} else if (step < 0 && start > stop) {
			do {
				result.push(start);
				start += step;
			} while (start > stop)
		}

		return result;
	};


	//与函数有关的函数（Function Functions）


	//bind方法
	//_.bind(func, object, ...args) 
	//绑定函数 function 到对象 object 上, 也就是无论何时调用函数, 函数里的 this 都指向这个 object.任意可选参数 arguments 可以传递给函数 function , 可以填充函数所需要的参数,这也被称为 partial application。对于没有结合上下文的partial application绑定，请使用partial。 
	_.bind = function(func, object, ...args) {

		return func.bind(object, ...args);
	};

	//bindAll方法
	//_.bindAll(object, *methodNames) 
	//把methodNames参数指定的一些方法绑定到object上，这些方法就会在对象的上下文环境中执行。绑定函数用作事件处理函数时非常便利，否则函数被调用时this一点用也没有。methodNames参数是必须的。
	_.bindAll = function(object, ...methodNames) {

		_.each(methodNames, function(item) {

			object[item] = object[item].bind(object);
		});

		return object;
	};

	//partial方法
	//_.partial(function, *arguments) 
	//局部应用一个函数填充在任意个数的 arguments，不改变其动态this值。和bind方法很相近。你可以传递_ 给arguments列表来指定一个不预先填充，但在调用时提供的参数。
	_.partial = function(func, ...args) {

		return function(...newArgs) {

			let actualArgs = _.map(args, function(item) {
				if (item === _) {
					return newArgs.shift();
				} else {
					return item;
				}
			}).concat(newArgs);

			return func.call(this, ...actualArgs);
		}
	};

	//memoize方法
	//_.memoize(function, [hashFunction])
	//Memoizes方法可以缓存某函数的计算结果。对于耗时较长的计算是很有帮助的。如果传递了 hashFunction 参数，就用 hashFunction 的返回值作为key存储函数的计算结果。hashFunction 默认使用function的第一个参数作为key。memoized值的缓存可作为返回函数的cache属性。
	_.memoize = function(func, hashFunction) {

		let memoize = function(...args) {

			let key;

			if (!_.isUndefined(hashFunction)) {
				key = hashFunction.call(this, ...args);
			} else {
				key = args[0];
			}

			if (!_.has(memoize.cache, key)) {
				memoize.cache[key] = func.call(this, ...args);
			}

			return memoize.cache[key];
		};

		memoize.cache = {};

		return memoize;
	};

	//delay方法
	//_.delay(function, wait, *arguments) 
	//类似setTimeout，等待wait毫秒后调用function。如果传递可选的参数arguments，当函数function执行时， arguments 会作为参数传入。
	_.delay = function(func, wait, ...args) {

		return setTimeout(function() {

			return func.call(null, ...args);
		}, wait);
	};

	//defer方法
	//_.defer(function, *arguments) 
	//延迟调用function直到当前调用栈清空为止，类似使用延时为0的setTimeout方法。对于执行开销大的计算和无阻塞UI线程的HTML渲染时候非常有用。 如果传递arguments参数，当函数function执行时， arguments 会作为参数传入。
	_.defer = _.partial(_.delay, _, 1);

	//throttle方法
	//_.throttle(function, wait, [options]) 
	//创建并返回一个像节流阀一样的函数，当重复调用函数的时候，至少每隔 wait毫秒调用一次该函数。对于想控制一些触发频率较高的事件有帮助。
	//默认情况下，throttle将在你调用的第一时间尽快执行这个function，并且，如果你在wait周期内调用任意次数的函数，都将尽快的被覆盖。如果你想禁用第一次首先执行的话，传递{leading: false}，还有如果你想禁用最后一次执行的话，传递{trailing: false}。
	_.throttle = function(func, wait, options = {}) {

		let previous = 0,
			timeout,
			result;

		return function(...args) {

			let now = _.now(),
				_this = this;

			if (!previous && options.leading === false) {
				previous = now;
			}

			let remaining = wait - (now - previous);

			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}

				previous = now;

				result = func.call(_this, ...args);
			} else if (!timeout && options.trailing !== false) {
				let later = function() {

					if (options.leading === false) {
						previous = 0;
					} else {
						previous = _.now();
					}

					timeout = null;

					result = func.call(_this, ...args);
				};

				timeout = setTimeout(later, remaining);
			}

			return result;
		}
	};

	//debounce方法
	//_.debounce(function, wait, [immediate])
	//返回 function 函数的防反跳版本, 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后. 对于必须在一些输入（多是一些用户操作）停止到达之后执行的行为有帮助。 例如: 渲染一个Markdown格式的评论预览, 当窗口停止改变大小之后重新计算布局, 等等.
	//传参 immediate 为 true， debounce会在 wait 时间间隔的开始调用这个函数 。（愚人码头注：并且在 waite 的时间之内，不会再次调用。）在类似不小心点了提交按钮两下而提交了两次的情况下很有用。
	_.debounce = function(func, wait, immediate) {

		let result, timeout, timestamp;

		return function(...args) {

			let later = function() {

				let last = _.now() - timestamp;

				if (last < wait && last >= 0) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					if (!immediate) {
						result = func.call(_this, ...args);
					}
				}
			};

			let _this = this,
				callNow = immediate && !timeout;

			timestamp = _.now();

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}

			if (callNow) {
				result = func.call(_this, ...args);
			}

			return result;
		}
	};

	//once方法
	//_.once(function) 
	//创建一个只能调用一次的函数。重复调用改进的方法也没有效果，只会返回第一次执行时的结果。 作为初始化函数使用时非常有用, 不用再设一个boolean值来检查是否已经初始化完成.
	_.once = _.partial(_.before, 2);

	//after方法
	//_.after(count, function) 
	//创建一个函数, 只有在运行了 count 次之后才有效果. 在处理同组异步请求返回结果时, 如果你要确保同组里所有异步请求完成之后才 执行这个函数, 这将非常有用。
	_.after = function(count, func) {

		return function(...args) {

			count--;

			if (count === 0) {
				return func.call(this, ...args);
			}
		};
	};

	//before方法
	//_.before(count, function) 
	//创建一个函数,调用不超过count 次。 当count已经达到时，最后一个函数调用的结果将被记住并返回。
	_.before = function(count, func) {

		let memo;

		return function(...args) {

			count--;

			if (count > 0) {
				memo = func.call(this, ...args);
			}

			return memo;
		};
	};

	//wrap方法
	//_.wrap(function, wrapper) 
	//将第一个函数 function 封装到函数 wrapper 里面, 并把函数 function 作为第一个参数传给 wrapper. 这样可以让 wrapper 在 function 运行之前和之后 执行代码, 调整参数然后附有条件地执行.
	_.wrap = function(func, wrapper) {

		return _.partial(wrapper, func);
	};

	//negate方法
	//_.negate(predicate) 
	//返回一个新的predicate函数的否定版本。
	_.negate = function(predicate) {

		return function(...args) {

			return !predicate(...args);
		}
	};

	//compose方法
	//_.compose(*functions) 
	//返回函数集 functions 组合后的复合函数, 也就是一个函数执行完之后把返回的结果再作为参数赋给下一个函数来执行. 以此类推. 在数学里, 把函数 f(), g(), 和 h() 组合起来可以得到复合函数 f(g(h()))。
	_.compose = function(...funcs) {

		return function(...args) {

			let result, _this = this;

			result = funcs.pop().call(this, ...args);

			result = _.reduceRight(funcs, function(memo, item) {

				return item.call(_this, memo);
			}, result);

			return result;
		};
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


	//实用功能(Utility Functions)


	//noConflict
	//_.noConflict()
	//放弃Underscore 的控制变量"_"。返回Underscore 对象的引用。
	_.noConflict = function() {

		window._ = _previous;

		return _;
	};

	//identity
	//_.identity(value) 
	//返回与传入参数相等的值. 相当于数学里的: f(x) = x
	//这个函数看似无用, 但是在Underscore里被用作默认的迭代器iterator.
	_.identity = function(value) {

		return value;
	};

	//constant
	//_.constant(value) 
	//创建一个函数，这个函数 返回相同的值 用来作为_.constant的参数。
	_.constant = function(value) {

		return function() {

			return value;
		};
	};

	//noop
	//_.noop() 
	//返回undefined，不论传递给它的是什么参数。 可以用作默认可选的回调参数。
	_.noop = function() {};

	//times
	//_.times(n, iteratee, [context]) 
	//调用给定的迭代函数n次,每一次调用iteratee传递index参数。生成一个返回值的数组。 
	_.times = function(n, iteratee, context) {

		let accum = new Array(Math.max(0, n));

		iteratee = createCallback(iteratee, context);

		accum = _.map(accum, function(item, index) {

			return iteratee.call(null, index);
		});

		return accum;
	};

	//random方法
	//_.random(min, max) 
	//返回一个min 和 max之间的随机整数。如果你只传递一个参数，那么将返回0和这个参数之间的整数。
	_.random = function(min, max) {

		if (_.isUndefined(max)) {
			max = min;
			min = 0;
		}

		return min + Math.floor(Math.random() * (max - min + 1));
	}

	//mixin
	//_.mixin(object)
	//允许用您自己的实用程序函数扩展Underscore。传递一个 {name: function}定义的哈希添加到Underscore对象，以及面向对象封装。
	let result = function(instance, obj) {

		if (instance._chain) {
			return _(obj).chain();
		} else {
			return obj;
		}
	};

	_.mixin = function(object) {

		_.each(_.functions(object), function(item) {

			_[item] = object[item];

			_.prototype[item] = function(...args) {

				return result(this, object[item].call(_, this._wrapped, ...args));
			}
		});
	};

	//iteratee
	//_.iteratee(value, [context]) 
	//一个重要的内部函数用来生成可应用到集合中每个元素的回调， 返回想要的结果 - 无论是等式，任意回调，属性匹配，或属性访问。 
	_.iteratee = function(value, context) {

		return createCallback(value, context);
	};

	//uniqueId
	//_.uniqueId([prefix]) 
	//为需要的客户端模型或DOM元素生成一个全局唯一的id。如果prefix参数存在， id 将附加给它。
	let idCount = 0;
	_.uniqueId = function(prefix) {

		return prefix ? prefix + (++idCount) : '' + (++idCount);
	};

	//result
	//_.result(object, property, [defaultValue]) 
	//如果指定的property 的值是一个函数，那么将在object上下文内调用它;否则，返回它。如果提供默认值，并且属性不存在，那么默认值将被返回。如果设置defaultValue是一个函数，它的结果将被返回。
	_.result = function(object, property, defaultValue) {

		let value = object[property];

		if (_.isUndefined(value)) {
			value = defaultValue;
		}

		if (_.isFunction(value)) {
			value = value.call(object);
		}

		return value;
	};

	//now
	//_.now() 
	//一个优化的方式来获得一个当前时间的整数时间戳。可用于实现定时/动画功能。
	_.now = Date.now;


	//链式语法(Chaining)


	//chain
	//_.chain(obj) 
	//返回一个封装的对象. 在封装的对象上调用方法会返回封装的对象本身, 直到 value 方法调用为止.
	_.chain = function(object) {

		let instance = _(object);

		instance._chain = true;

		return instance;
	};

	//value
	//_(obj).value() 
	//获取封装对象的最终值.
	_.prototype.value = function() {

		return this._wrapped;
	};

	_.mixin(_);
})()