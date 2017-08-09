(function() {
	let _ = {};
	window._ = _;
	//Object 部分


	//数据类型判断

	//isObject方法  
	//function和object会返回true，null会返回false
	_.isObject = function(obj) {
		const type = typeof obj;
		//除去null类型
		if (!obj) return false;
		return type === 'function' || type === 'object';
	};

	//数据类型
	const nativeTypes = ['Undefined', 'Null', 'String', 'Number', 'Boolean', 'Array', 'Function', 'Date', 'RegExp', 'Arguments'];
})()