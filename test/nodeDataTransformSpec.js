var DataTransform = require('../index.js').DataTransform,
    transform = require('../index.js').transform,
	_ = require("lodash");

var data = {
	posts: [{
		title: "title1",
		description: "description1",
		blog: "This is a blog.",
		date: "11/4/2013",
		clearMe: "text to remove",
		extra: {
			link: "http://goo.cm"
		},
		list1: [{
			name: "mike"
		}],
		list2: [{
			item: "thing"
		}]
	}]
};

var map = {
	list: 'posts',
	item: {
		name: "title",
		info: "description",
		text: "blog",
		date: "date",
		link: "extra.link",
		info: "list1.0.name"
	},
	operate: [{
		run: "(val) => Date.parse(val)",
		on: "date"
	},{
		run: ` 
		  (val) => {
			  if( 'string' === typeof val )
				  return val.toUpperCase();
			  return val.toString().toUpperCase();
		  }
		`,
		on: "name"
	}]
};

describe("node-json-transform", function() {

	it("should extract values", function() {

		var dataTransform = DataTransform(_.clone(data), map);

		expect(dataTransform.getValue(data, "posts.0.description")).toEqual("description1");

	});

	it("should transform data", function() {

		var dataTransform = DataTransform(_.clone(data), map);

		expect(dataTransform.transform()).toEqual([{
			name: "TITLE1",
			info: "description1",
			text: "This is a blog.",
			date: Date.parse('11/4/2013'),
			link: "http://goo.cm",
			info: "mike"
		}]);

	});

	it("should transform data asynchronously", function() {

		var dataTransform = DataTransform(_.clone(data), map);
		dataTransform.transformAsync().then(function(result){
			expect(result).toEqual([{
				name: "TITLE1",
				info: "description1",
				text: "This is a blog.",
				date: Date.parse('11/4/2013'),
				link: "http://goo.cm",
				info: "mike"
			}]);
		});
	});

	it("should allow you to clear out fields", function() {

		// Add a map item to  clear out the "clearMe" field.
		var newMap = _.clone(map);
		newMap.item = _.clone(map.item);
		newMap.item.clearMe = "";

		var dataTransform = DataTransform(_.clone(data), newMap);

		expect(dataTransform.transform()).toEqual([{
			name: "TITLE1",
			info: "description1",
			text: "This is a blog.",
			date: Date.parse('11/4/2013'),
			link: "http://goo.cm",
			info: "mike",
			clearMe: ""
		}]);

	});

	it("should allow you to set fields", function() {

		// Add a map item to  clear out the "clearMe" field.
		var newMap = _.clone(map);
		newMap.item = _.clone(map.item);
		newMap.item.fieldThatDoesntExist = "";

		var dataTransform = DataTransform(_.clone(data), newMap);

		expect(dataTransform.transform()).toEqual([{
			name: "TITLE1",
			text: "This is a blog.",
			date: Date.parse('11/4/2013'),
			link: "http://goo.cm",
			info: "mike",
			fieldThatDoesntExist: ""
		}]);

	});

	it("should allow you to map arrays", function() {

		// Add a map item to  clear out the "clearMe" field.
		var newMap = {
			list: 'posts',
			item: {
				fieldGroup: ["title", "description", "blog", "extra"]
			}
		};

		var dataTransform = DataTransform(_.clone(data), newMap);

		expect(dataTransform.transform()).toEqual([{
			fieldGroup: [
				"title1",
				"description1",
				"This is a blog.", {
					link: "http://goo.cm"
				}
			]
		}]);

	});

	it("should allow you to pass arrays without specifying a list", function() {

		// Add a map item to  clear out the "clearMe" field.
		var newMap = {
			item: {
				fieldGroup: ["title", "description", "blog", "extra"]
			}
		};

		var data = [{
			title: "title1",
			description: "description1",
			blog: "This is a blog.",
			date: "11/4/2013",
			clearMe: "text to remove",
			extra: {
				link: "http://goo.cm"
			},
			list1: [{
				name: "mike"
			}],
			list2: [{
				item: "thing"
			}]
		}];

		var dataTransform = DataTransform(_.clone(data), newMap);

		expect(dataTransform.transform()).toEqual([{
			fieldGroup: [
				"title1",
				"description1",
				"This is a blog.", {
					link: "http://goo.cm"
				}
			]
		}]);

	});

	it("should allow you to use custom functions as operators", function(){
		var newMap = _.clone(map);

		newMap.operate = [{
			run: `
			  (val) => { 
				  return val + " more info"; 
			  }
			`, 
			on: "info"
		}];

		var dataTransform = DataTransform(data, newMap);

		var result = dataTransform.transform();
		expect(result).toEqual([{ 
			name: 'title1',
		    info: 'mike more info',
		    text: 'This is a blog.',
		    date: '11/4/2013',
		    link: 'http://goo.cm' 
		}]);
	})

	it("should allow multiple operators", function(){
		var newMap = _.clone(map);

		newMap.operate = [
			{
				run: `
				  (val) => { 
					  return val + " more info"; 
				  }
			  `, 
				on: "info"
			},
			{
				run: `
					(val) => { 
					  return val + " more text"; 
				  }
				`, 
				on: "text"
			}
		];

		var dataTransform = DataTransform(data, newMap);

		var result = dataTransform.transform();
		expect(result).toEqual([{ 
			name: 'title1',
		    info: 'mike more info',
		    text: 'This is a blog. more text',
		    date: '11/4/2013',
		    link: 'http://goo.cm' 
		}]);
	})


	it("should allow each function to run on all items", function(){
		
		var data = {
			posts: [
				{name: "peter"},
				{name: "paul"},
				{name: "marry"}
			]
		};

		var map = {
			list: 'posts',
			each: `
        (item) => {
				  item.iterated = true;
				  return item;
			  }
			`
		};

		var dataTransform = DataTransform(data, map);

		var result = dataTransform.transform();
		expect(result).toEqual([
			{name: "peter", iterated: true},
			{name: "paul", iterated: true},
			{name: "marry", iterated: true}
		]);

	});

	it("should be able to combine mapping with each", function(){
		
		var data = {
			posts: [
				{name: "peter"},
				{name: "paul"},
				{name: "marry"}
			]
		};

		var map = {
			list: 'posts',
			item: {
				title: 'name',
			},
			each: `
				(item) => {
					item.iterated = true;
					return item;
				}
			`
		};

		var dataTransform = DataTransform(data, map);

		var result = dataTransform.transform();
		expect(result).toEqual([
			{title: "peter", iterated: true},
			{title: "paul", iterated: true},
			{title: "marry", iterated: true}
		]);

	});

	it("should delete attributes", function(){
		
		var data = {
			posts: [
				{name: "peter", unwanted: true},
				{name: "paul", unwanted: true},
				{name: "marry", unwanted: true}
			]
		};

		var map = {
			list: 'posts',
			remove: ['unwanted']
		};

		var dataTransform = DataTransform(data, map);

		var result = dataTransform.transform();

		expect(result).toEqual([
			{name: "peter"},
			{name: "paul"},
			{name: "marry"}
		]);

	});

	it("should use default attributes for missing data", function(){
		
		var data = {
			posts: [
				{name: "peter", valid: true},
				{name: "paul", valid: true},
				{name: "marry"}
			]
		};

		var map = {
			list: 'posts',
			item: {
				verified: 'valid',
				name: 'name'
			},
			defaults: {
				verified: false
			}
		};

		var dataTransform = DataTransform(data, map);

		var result = dataTransform.transform();

		expect(result).toEqual([
			{name: "peter", verified:true},
			{name: "paul", verified:true},
			{name: "marry", verified:false}
		]);

	});

	it("should exclude data if not specified", function(){
		
		var data = {
			posts: [
				{name: "peter", unwanted: true},
				{name: "paul", unwanted: true},
				{name: "marry", unwanted:true}
			]
		};

		var map = {
			list: 'posts',
			item: {
				name: 'name'
			}
		};

		var dataTransform = DataTransform(data, map);

		var result = dataTransform.transform();

		expect(result).toEqual([
			{name: "peter"},
			{name: "paul"},
			{name: "marry"}
		]);

	});

	it("should allow for dots in object keys", function (){
		var data = {
			input: [
				{ key: { 'dot.key': 'peter' } },
				{ key: { 'dot.key': 'paul' } },
				{ key: { 'dot.key': 'marry' } }
			]
		};

		var map = {
			list: 'input',
			item: {
				name: 'key["dot.key"]'
			}
		};

		var dataTransform = DataTransform(data, map);

		var result = dataTransform.transform();

		expect(result).toEqual([
			{name: "peter"},
			{name: "paul"},
			{name: "marry"}
		]);
	});

	it("should transform an object literal if list is not set and data is an object", function (){
		var data = {
			text: 'hello'
		};

		var map = {
			item: {
				message: 'text'
			}
		};

		var dataTransform = DataTransform(data, map);

		var result = dataTransform.transform();

		expect(result).toEqual({
			message: 'hello'
		});
	});

	it("should transform via transform function", function (){
		var data = {
			text: 'hello'
		};

		var map = {
			item: {
				message: 'text'
			}
		};

		var result = transform(data, map);

		expect(result).toEqual({
			message: 'hello'
		});
	});

	it("should try use the map directly if no item", function (){
		
		var data = {
			text: 'hello'
		};

		var map = {
			item: { message: 'text' }
		};
		
		var result = transform(data, map);

		expect(result).toEqual({
			message: 'hello'
		});
	});

	it("should omit undefined keys from the result", function (){
		
		var data = [
			{
				text: 'hello'
			},
			{

			}]


		var map = {
			item: { message: 'text' }
		};
		
		var result = transform(data, map);

		expect(result).toEqual([
			{
				message: 'hello'
			},
			{

			}
		]);
	});	

});
