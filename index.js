let arr = [1, 2, 3, 4, 5];
let obj = {
	a: 1,
	b: 2,
	c: 3,
	d: 4,
	e: 5
};

let arrLike = function() {
	return arguments;
}(1, 2, 3, 4, 5);