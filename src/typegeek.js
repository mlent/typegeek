define([], function() {
	
	'use strict';

	function typegeek(selector, options) {
		/*jshint validthis:true */
		if (typeof(selector) === 'string')
			this.el = document.querySelector(selector);
		else
			this.el = selector;

		this.render();
		this.el.addEventListener('keydown', this.handleKeypress.bind(this));	

		return this;
	}

	typegeek.prototype.render = function() {
		this.container = document.createElement('div');
		this.container.className = 'typegeek';

		this.menu = document.createElement('ul');
		this.insertAfter(this.container, this.el);

		this.container.appendChild(this.el);
		this.container.appendChild(this.menu);
	}

	typegeek.prototype.renderKeys = function(keys) {
		this.menu.innerHTML = '';
		var that = this;

		if (keys.length === 0) return;

		Object.keys(keys.options).forEach(function(k) {
			var el = document.createElement('li');
			var a = document.createElement('a');
			a.setAttribute('href', '#');
			
			// Decide on look of key
			var value = keys.options[k];
			a.innerHTML = typeof value === 'object' ? k : keys.options[k] + '<span>' + k + '</span>';
			a.setAttribute('data-keycode', this.codes.keyCodes.getKeyByValue(k)); 
			a.addEventListener('click', this.handleKeypress.bind(this));

			// Append key
			el.appendChild(a);
			that.menu.appendChild(el);

		}.bind(this));
	};
	
	// Keep track of multiple keys pressed
	typegeek.prototype.keyMap = [];

	typegeek.prototype.handleKeypress = function(e) {
		// If we're getting a click event and not a keypress, get keycode from element
		var code = e.keyCode || e.target.dataset.keycode;

		// It's not a key we capture, so return
		var name = this.codes.keyCodes[code];
		if (!name) return;

		var toggle = this.keyMap.indexOf(name) !== -1;

		if (toggle) {
			var i = this.keyMap.indexOf(name);
			this.keyMap = this.keyMap.splice(i, 1);
		}
		else {
			this.keyMap.push(name);
		}

		// No keys in cache, so clear menu and return
		if (this.keyMap.length === 0) {
			this.renderKeys([]);
			return;
		}

		// Dereference key and see whether we get a character or more options
		var key = this.convert(this.keyMap, 0, this.codes.dictionary);

		if (!key) return;

		e.preventDefault();

		if (key.options) {
			this.renderKeys(key);
			return;
		}

		// Type something, clear keyMap
		this.el.value == this.el.value ? this.el.value += key : key;
		this.keyMap = [];
		this.renderKeys([]);
		return false;
	};

	/**
	 * Hunts through dictionary for matching keys.
	 * key - current key
	 */
	typegeek.prototype.convert = function(keyMap, index, dictionary) {

		var keyName = keyMap[index];
		var lastKey = keyMap.length - 1 === index;
		var keyEntry = dictionary[keyName];
		index++;

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

	typegeek.prototype.insertAfter = function(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	};

	Object.prototype.getKeyByValue = function(value) {
		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				if (this[prop] === value)
					return prop;
			}
		}
	};

	typegeek.prototype.codes = {
		"keyCodes": {
			"16": "⇧",
			"65": "a",
			"66": "b",
			"67": "c",
			"68": "d",
			"69": "e",
			"70": "f",
			"71": "g",
			"72": "h",
			"73": "i",
			"74": "j",
			"75": "k",
			"76": "l",
			"77": "m",
			"78": "n",
			"79": "o",
			"80": "p",
			"81": "q",
			"82": "r",
			"83": "s",
			"84": "t",
			"85": "u",
			"86": "v",
			"87": "w",
			"88": "x",
			"89": "y",
			"90": "z",
			"186": ";",
			"187": "=",
			"188": ",",
			"189": "-",
			"190": ".",
			"191": "/",
			"192": "`",
			"219": "[",
			"220": "\\",
			"221": "]",
			"222": "'"
		},
		"dictionary": {
			"a" : "α",
			"b" : "β",
			"g" : "γ",
			"d" : "δ",
			"e" : "ε",
			"z" : "ζ",
			"h" : "η",
			"u" : "θ",
			"i" : "ι",
			"k" : "κ",
			"l" : "λ",
			"m" : "μ",
			"n" : "ν",
			"j" : "ξ",
			"o" : "ο",
			"p" : "π",
			"r" : "ρ",
			"s" : "σ",
			"w" : "ς",
			"t" : "τ",
			"y" : "υ",
			"f" : "φ",
			"x" : "χ",
			"c" : "ψ",
			"v" : "ω",
			"⇧": {
				"options": {
					"a" : "Α",
					"b" : "Β",
					"g" : "Γ",
					"d" : "Δ",
					"e" : "Ε",
					"z" : "Ζ",
					"h" : "Η",
					"u" : "Θ",
					"i" : "Ι",
					"k" : "Κ",
					"l" : "Λ",
					"m" : "Μ",
					"n" : "Ν",
					"j" : "Ξ",
					"o" : "Ο",
					"p" : "Π",
					"r" : "Ρ",
					"s" : "Σ",
					"w" : "Σ",
					"t" : "Τ",
					"y" : "Υ",
					"f" : "Φ",
					"x" : "Χ",
					"c" : "Ψ",
					"v" : "Ω"	
				}
			},
			"=": {
				"options": {
					"a": "ᾶ",
					"h": "ῆ",
					"i": "ῖ",
					"u": "ῦ",
					"v": "ῶ"
				}
			},
			",": {
				"options": {
					"'": {
						"options": {
							"a": "ᾴ",
							"h": "",
							"v": ""
						},
						"`": {
							"options": {
								"a": "ᾲ"
							}
						},
						"=": {
							"options": {
								"a": "ᾷ"
							}
						}
					},
					"a": "ᾳ",
					"h": "ῃ",
					"v": "ῳ"
				}
			},
			"`": {
				"options": {
					"⇧": {
						"options": {
							"a": "Ὰ",
							"h": "Ἢ",
							"e": "Ἒ",
							"i": "Ἳ",
							"o": "Ὸ",
							"u": "Ὓ",
							"v": "Ὼ"
						}
					},
					"a": "ὰ",
					"h": "ὴ",
					"e": "ὲ",
					"i": "ὶ",
					"o": "ὸ",
					"v": "ὼ"
				}
			},
			"'": {
				"options": {
					"⇧": {
						"options": {
							"a": "Ά"
						}
					},
					"a": "ά",
					"h": "ή",
					"e": "έ",
					"i": "ί",
					"o": "ό",
					"u": "ύ"
				}
			}
		}
	};

	return typegeek;
});
