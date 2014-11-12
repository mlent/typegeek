define([], function() {
	
	'use strict';

	function typegeek(selector, options) {
		/*jshint validthis:true */
		if (typeof(selector) === 'string')
			this.el = document.querySelector(selector);
		else
			this.el = selector;

		this.el.addEventListener('keydown', this.handleKeypress.bind(this));	
		this.el.addEventListener('keyup', this.handleKeypress.bind(this));	

		return this;
	}
	
	// Keep track of multiple keys pressed
	typegeek.prototype.keyMap = [];

	typegeek.prototype.handleKeypress = function(e) {

		// It's not a key we capture, so return
		var name = this.codes.keyCodes[e.keyCode];
		if (!name) return;

		var toggle = this.keyMap.indexOf(name) !== -1 && (e.type == 'keydown');

		if (e.type == 'keyup' ? !toggle : toggle) {
			var i = this.keyMap.indexOf(name);
			this.keyMap = this.keyMap.splice(i, 1);
		}
		else if (e.type == 'keydown') {
			this.keyMap.push(name);
		}

		if (this.keyMap.length === 0) return;

		var key = this.convert(this.keyMap, 0, this.codes.dictionary);

		if (!key) return;

		e.preventDefault();

		if (key.options) {
			this.showOptions(key);
			return;
		}

		// Type something, clear keyMap
		this.el.value == this.el.value ? this.el.value += key : key;
		this.keyMap = [];
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
			return key.options[k];
		}).join(', ');

		console.log(options);
		return options;
	};

	typegeek.prototype.codes = {
		"keyCodes": {
			"16": "shift",
			"20" : "capslock",
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
			"186": "semi-colon",
			"187": "equal-sign",
			"188": "comma",
			"189": "dash",
			"190": "period",
			"191": "forward-slash",
			"192": "backtick",
			"219": "open-bracket",
			"220": "back-slash",
			"221": "closing-bracket",
			"222": "single-quote"
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
			"shift": {
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
			"equal-sign": {
				"options": {
					"a": "ᾶ",
					"h": "ῆ",
					"i": "ῖ",
					"u": "ῦ",
					"v": "ῶ"
				}
			},
			"comma": {
				"options": {
					"single-quote": {
						"options": {
							"a": "ᾴ",
							"h": "",
							"v": ""
						},
						"backtick": {
							"options": {
								"a": "ᾲ"
							}
						},
						"equal-sign": {
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
			"backtick": {
				"options": {
					"shift": {
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
			"single-quote": {
				"options": {
					"shift": {
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
