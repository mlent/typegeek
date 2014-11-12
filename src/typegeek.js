define([], function() {
	
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
			a.setAttribute('data-keycode', this.getKeyByValue(this.codes.keyCodes, k)); 
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
		var name = this.codes.keyCodes[code];
		if (!name) return;

		var toggle = this.keyMap.indexOf(name) !== -1;

		if (toggle)
			this.keyMap.splice(this.keyMap.indexOf(name), 1);
		else
			this.keyMap.push(name);

		// No keys in cache, so clear menu and return
		if (this.keyMap.length === 0) {
			e.preventDefault();
			this.clearUI();
			return;
		}

		// Dereference key and see whether we get a character or more options
		var key = this.convert(this.keyMap, 0, this.codes.dictionary);

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
			"86": "w",
			"87": "w",
			"88": "x",
			"89": "y",
			"90": "z",
			"187": "=",
			"188": ",",
			"192": "`",
			"219": "[",
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
			"w" : "ω",
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
					"w" : "Ω"	
				}
			},
			"[": {
				"options": {
					"a": "ἁ",
					"e": "ἑ",
					"h": "ἡ",
					"i": "ἱ",
					"o": "ὁ",
					"u": "ὑ",
					"w": "ὡ",

					"`": {
						"options": {
							"a": "ἃ",
							"e": "ἓ",
							"h": "ἣ",
							"i": "ἳ",
							"o": "ὃ",
							"u": "ὓ",
							"w": "ὣ",

							",": {
								"options": {
									"a": "ᾃ",
									"h": "ᾓ",
									"w": "ᾣ"
								}
							}
						}
					},
					"'": {
						"options": {
							"a": "ἅ",
							"e": "ἕ",
							"h": "ἥ",
							"i": "ἵ",
							"o": "ὅ",
							"u": "ὕ",
							"w": "ὥ",

							",": {
								"options": {
									"a": "ᾅ",
									"h": "ᾕ",
									"w": "ᾥ"
								}
							}
						}
					}
				}
			},
			"]": {
				"options": {
					"a": "ἀ",
					"e": "ἐ",
					"h": "ἠ",
					"i": "ἰ",
					"o": "ὀ",
					"u": "ὐ",
					"w": "ὠ",

					"`": {
						"options": {
							"a": "",
							"e": "",
							"h": "",
							"i": "",
							"o": "",
							"u": "",
							"w": "",

							",": {
								"options": {
									"a": "",
									"e": "",
									"h": "",
									"i": "",
									"o": "",
									"u": "",
									"w": ""
								}
							}
						}
					},
					"'": {
						"options": {
							"a": "",
							"e": "",
							"h": "",
							"i": "",
							"o": "",
							"u": "",
							"w": "",

							",": {
								"options": {
									"a": "",
									"e": "",
									"h": "",
									"i": "",
									"o": "",
									"u": "",
									"w": ""
								}
							}
						}
					},
					",": {
						"options": {
							"a": "",
							"e": "",
							"h": "",
							"i": "",
							"o": "",
							"u": "",
							"w": ""
						}
					}
				}
			},
			",": {
				"options": {
					"a": "ᾳ",
					"h": "ῃ",
					"w": "ῳ",
					"s": "ς"
				}
			},
			"=": {
				"options": {
					"a": "ᾶ",
					"h": "ῆ",
					"i": "ῖ",
					"u": "ῦ",
					"w": "ῶ",

					",": {
						"options": {
							"a": "",
							"e": "",
							"h": "",
							"i": "",
							"o": "",
							"u": "",
							"w": ""
						}
					}
				}
			},
			"`": {
				"options": {
					"a": "ὰ",
					"h": "ὴ",
					"e": "ὲ",
					"i": "ὶ",
					"o": "ὸ",
					"w": "ὼ",

					",": {
						"options": {
							"a": "",
							"e": "",
							"h": "",
							"i": "",
							"o": "",
							"u": "",
							"w": ""
						}
					}
				}
			},
			"'": {
				"options": {
					"a": "ά",
					"h": "ή",
					"e": "έ",
					"i": "ί",
					"o": "ό",
					"u": "ύ",
					"w": "ώ",

					",": {
						"options": {
							"a": "",
							"e": "",
							"h": "",
							"i": "",
							"o": "",
							"u": "",
							"w": ""
						}
					}
				}
			}
		}
	};

	return typegeek;
});
