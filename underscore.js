(function(){
	const _ = {
		isUndefined(ele){
			return Object.prototype.toString.call(ele) === '[object Undefined]';
		},
		isNumber(ele){
			return Object.prototype.toString.call(ele) === '[object Number]';
		},
		isString(ele){
			return Object.prototype.toString.call(ele) === '[object String]';
		},
		isNull(ele){
			return Object.prototype.toString.call(ele) === '[object Null]';
		},
		isBoolean(ele){
			return Object.prototype.toString.call(ele) === '[object Boolean]';
		},
		isArray(ele){
			return Object.prototype.toString.call(ele) === '[object Array]';
		},
		isObject(ele){
			return Object.prototype.toString.call(ele) === '[object Object]';
		},
		each(ele,fn,context){
			if(_.isArray(ele)){
				ele.forEach(fn,context);
			}else if(_.isObject(ele)){
				let keys = Object.keys(ele),
					len = keys.length;
				for(let i =0; i <len; i++){
					let key = keys[i],
						value = ele[key];
					context = context||ele;
					console.log(ele,context)
					fn.call(context,value,key,ele);
				}
			}else if(ele.length !== undefined){
				let newArr = Array.from(ele);
				_.each(newArr,fn,context);
			}
			return ele;
		},
		map(ele,fn,context){
			if(_.isArray(ele)){
				ele.map(fn,context);
			}else if(_.isObject(ele)){
				let keys = Object.keys(ele),
					len = keys.length;
				for(let i =0; i <len; i++){
					let key = keys[i],
						value = ele[key];
					ele[key] = fn.apply(context||ele,[value,key,ele]);
				}
			}else if(ele.length !== undefined){
				let newArr = Array.from(ele);
				ele = _.map(newArr,fn,context);
			}
			return ele;
		},
		reduce(ele,fn,memo,context){

		}
	};
	window._ = _;
})();