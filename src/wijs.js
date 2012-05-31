
var Wijs = {
	NS: "http://github.com/ashward/wijs/2012",
		
	createWij: function(name, callback) {
		var el = document.createElement("div");
		
		new Request({
			url: "wijits/" + name + ".xml",
			method: "get",
			onSuccess: function(responseText, responseXML) {
				var fields = {};
				var wijits = [];
				var rootNode = responseXML.documentElement;
				
				for(var i = 0; i < rootNode.childNodes.length; ++i) {
					var newNode = document.importNode(rootNode.childNodes[i], true);
					
					el.appendChild(newNode);
				}

				$(el).getElements("*").each(function(elem) {
					// We deal with Wij elements separately
					if(elem.namespaceURI != Wijs.NS) {
						var wijField = elem.getAttributeNS(Wijs.NS, "field");
						
						if(wijField) {
							fields[wijField] = elem;
							elem.removeAttributeNS(Wijs.NS, "field");
						}
					}
				});
				
				var wijitEls = el.getElementsByTagNameNS(Wijs.NS, "wijit");
				
				$$(wijitEls).each(function(el) {
					var wijName = el.getAttributeNS(Wijs.NS, "name");
					var wijField = el.getAttributeNS(Wijs.NS, "field");
					
					var options = {};
					
					for(var k = 0; k < el.attributes.length; ++k) {
						var attr = el.attributes[k];
						
						options[attr.name] = attr.value;
					}
					
					if(!wijName.match(/^[a-zA-Z_$][0-9a-zA-Z_$]*/)) {
						throw new Exception("Invalid wij class: " + wijName);
					}
					
					var newWij = eval("new " + wijName + "(options)");
					
					if(wijField) {
						fields[wijField] = newWij;
					}
					
					$(newWij).replaces($(el));
					wijits.push(newWij);
				});
				
				callback(fields, wijits);
			}
		}).send();
		
		return el;
	}
};

/**
 * Mixin for wijit classes
 */
Wijs.Wij = new Class({
	Implements: Events,
	
	element: null,
	fields: null,
	wijits: null,
	
	bindWij: function(wijName) {
		this.element = Wijs.createWij(wijName, function(fields, wijits) {
			this.fields = fields;
			this.wijits = wijits;
			
			var me = this;
			
			var wijCount = wijits.length;
			
			var fireWhenReady = function() {
				if(wijCount == 0) { // Once all of our children are ready
					me.wijReady();
					me.fireEvent("ready");
				}
			};

			for(var i = 0; i < wijits.length; ++i) {
				wijits[i].addEvent("ready", function() {
					--wijCount;
					
					fireWhenReady();
				}.bind(this));
			}
			
			fireWhenReady();
		}.bind(this));
	},
	
	toElement: function() {
		return this.element;
	},
	
	wijReady: function() {
		// Do nothing by default
	}
});