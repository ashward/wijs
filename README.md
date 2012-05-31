# WiJS

Author: Ashley Ward
Version: 0.0.1-veryalpha

Note that this is just experimental at the moment and is *NOT PRODUCTION READY*
- not by a long shot!!! (But feel free to make it better and send me a pull
request!)

WiJS (which I think might be pronounced widges, like fridges, midges or bridges)
is a small library to provide a declarative, widgetised UI for Javascript. It is
currently based on the MooTools [http://mootools.net/] framework, but I plan to
remove the dependency in the future so it will work happily with any framework.

When dynamically creating a ui within javascript for a recent project there 
seemed to be two ways to go:

1 Building it programatically with the DOM.
2 Shoving it into the DOM in one chunk with innerHTML.

It's nice to do it using method 2 above as it's very concise and easy to see
the structure of the html but then not quite so easy to pick out certain
elements or controls to add more functionality to (you could introduce some ids
but they're not easy to ensure you keep them unique qithin the document - you
may have multiple instances of your widget within the page; or you may use some
kind of css or xpath selectors, but they can be britle to markup changes.)

The idea came from working with GWT, which provides a framework name UIBinder
(see https://developers.google.com/web-toolkit/doc/latest/DevGuideUiBinder).

The library allows you to define widgets (or wijits as I'll rather cheesily call
them!), each of which has an xml file to define the html markup, and a
JavaScript object which contains the logic for the widget.

There are a couple really cool things which are the raison d'etre of WiJS:
* The html markup in the xml file can include other wijits
* Elements within the html (both html elements and wijits) can
  be automatically linked to fields within the related JS object

## Note: Experimental Software

I knocked this up in a few hours, have only tried it on Google Chrome, and 

## Usage
For each wijit you need two things: an XML file and a JS class.

The best way to demonstrate is with a simple example where we define two
wijits.

For a widget named "Example"

### Example.xml
````xml
<?xml version="1.0" encoding="UTF-8"?>
<wijs:wij xmlns:wijs="http://github.com/ashward/wijs/2012" xmlns="http://www.w3.org/1999/xhtml">
	<h1 wijs:field="header">This is an example</h1>
	<wij:wijit wij:name="ButtonWijit" wijs:field="firstButton" test="This is a test" />
	<wij:wijit wij:name="ButtonWijit" wijs:field="secondButton" test="This is also a test" />
</wijs:wij>
````

### ButtonWijit.xml
````xml
<?xml version="1.0" encoding="UTF-8"?>
<wijs:wijs xmlns:wij="http://github.com/ashward/wijs/2012" xmlns="http://www.w3.org/1999/xhtml">
	<p>This is a button:
		<button wijs:field="button"></button>
	</p>
</wijs:wij>
````

### JavaScript
````javascript
var Example = new Class({
	Implements: [Wijs.Wij, Options],
	options: {},
	
	initialize: function(options) {
		this.setOptions(options);
		this.bind("Example");
		
		$(this.fields.header).set("text", "This is a dynamic header now");
		
		$(this.fields.firstButton).addEvent("click", function() {
			alert("First Button Clicked");
		});
		
		$(this.fields.secondButton).addEvent("click", function() {
			alert("Second Button Clicked");
		});
	},
});
````

A couple of points to note here: