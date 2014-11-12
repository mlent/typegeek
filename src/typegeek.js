define(['src/dicts/grc'], function(GreekDict) {
	
	function typegeek(selector, options) {
		/*jshint validthis:true */
		if (typeof(selector) === 'string')
			this.el = document.querySelector(selector);
		else
			this.el = selector;

		this.dict = GreekDict;
		this.render();
		this.el.addEventListener('keydown', this.handleKeypress.bind(this));	

		return this;
	}

	/**
	 * Wraps the text input field in a div and puts <ul> below
	 */
	typegeek.prototype.render = function() {
		this.container = document.createElement('div');
		this.container.className = 'typegeek';

		this.menu = document.createElement('ul');
		this.insertAfter(this.container, this.el);

		this.container.appendChild(this.el);
		this.container.appendChild(this.menu);
	}

	/**
	 * Create some nice clickable buttons of available keys
	 */
	typegeek.prototype.renderKeys = function(keys) {
		this.menu.innerHTML = '';

		if (keys.length === 0) return;

		Object.keys(keys.options).forEach(function(k) {
			var el = document.createElement('li');
			var a = document.createElement('a');
			a.setAttribute('href', '#');
			
			// Decide on look of key
			var value = keys.options[k];
			a.innerHTML = typeof value === 'object' ? k : keys.options[k] + '<span>' + k + '</span>';
			a.setAttribute('data-keycode', this.getKeyByValue(this.dict.keyCodes, k)); 
			a.addEventListener('click', this.handleKeypress.bind(this));

			// Append key
			el.appendChild(a);
			this.menu.appendChild(el);

		}.bind(this));
	};
	
	// Keep track of multiple keys pressed
	typegeek.prototype.keyMap = [];

	typegeek.prototype.handleKeypress = function(e) {

		// If we're getting a click event and not a keypress, get keycode from element
		var code = e.keyCode || e.target.dataset.keycode;

		// If they're escaping, clear menu and return
		if (code === 27) {
			this.clearUI();
			return;
		}

		// It's not a key we capture, so return
		var name = this.dict.keyCodes[code];
		if (!name) return;

		var toggle = this.keyMap.indexOf(name) !== -1;

		if (toggle) {
			this.keyMap.splice(this.keyMap.indexOf(name), 1);
		}
		else {
			// TODO: Insert the key by priority: shift, breathing, accent, subscript, letter
			this.keyMap.push(name);
		}

		// No keys in cache, so clear menu and return
		if (this.keyMap.length === 0) {
			e.preventDefault();
			this.clearUI();
			return;
		}

		// Dereference key and see whether we get a character or more options
		var key = this.convert(this.keyMap, 0, this.dict.dictionary);

		// If we didn't get a key, they picked something not in any sequence
		if (!key) {
			e.preventDefault();
			this.clearUI();
			return;
		}

		e.preventDefault();

		if (key.options) {
			this.renderKeys(key);
			return;
		}

		// Type something!
		this.el.value == this.el.value ? this.el.value += key : key;
		this.clearUI();
		return false;
	};

	/**
	 * Clear keyMap cache and render empty keys
	 */
	typegeek.prototype.clearUI = function() {
		this.keyMap = [];
		this.renderKeys([]);
	};

	/**
	 * Hunts through dictionary for matching keys.
	 */
	typegeek.prototype.convert = function(keyMap, index, dictionary) {

		var keyName = keyMap[index];
		var lastKey = keyMap.length - 1 === index;
		var keyEntry = dictionary[keyName];
		index++;

		// They're in the middle of a sequence and picked a key that doesn't belong
		if (!keyEntry)
			return;

		// Continue dereferencing key in sequence
		if (keyEntry.options && !lastKey)
			return this.convert(keyMap, index, keyEntry.options)
		else
			return keyEntry;
	};

	/**
	 * Accepts a dictionary entry for the key.
	 */
	typegeek.prototype.showOptions = function(key) {
		var options = Object.keys(key.options).map(function(k) {
			if (typeof key.options[k] === 'object')
				return k;

			return key.options[k];
		});

		return options;
	};

	/**
	 * Shortcut function for inserting an HTML node after another in the DOM
	 */
	typegeek.prototype.insertAfter = function(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	};

	typegeek.prototype.getKeyByValue = function(obj, value) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (obj[prop] === value)
					return prop;
			}
		}
	};

	return typegeek;
});
