var DataTransform = require('../index.js').DataTransform,
	_ = require("lodash");

var data = [{
	node_env: ""
}];

var map = {
	item: {
		node_env: "node_env",
	},
	operate: [{
		run: '() => process.env.SOME_ENV_VAR',
		on: 'node_env'
	},
	]

};


describe("node-json-transform", function() {

	it("should throw when trying to access process.env", function() {

		var dataTransform = DataTransform(_.clone(data), map);

		expect(dataTransform.transform).toThrow();

	});

});