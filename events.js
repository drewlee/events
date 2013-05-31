var Event = (function(){
	// unique id generator
	var count = 0;
	
	// prepares objects before saving data
	function setData(element, evtName, handler){
		// check events property on element
		if (!('events' in element)){
			element.events = {};
		}
		
		// check event name property on events object
		if( !(evtName in element.events)){
			element.events[evtName] = {};
		}
		
		// check if unique instance is assigned on handler
		if (!('instance' in handler)){
			handler.instance = 'guid' + count;
			count++;
		}
	}
	
	// fixes event object for IE
	function fixHandler(el, h){
		return function(){
			var e = window.event;
			
			e.preventDefault = function(){
				this.returnValue = false;	
			};
			
			e.stopPropagation = function(){
				this.cancelBubble = true;
			};
			
			e.target = e.srcElement;
			
			h.call(el, e);
		};
	}
	
	// iterate thru event names to get stored handlers
	function iterate(callback, element, evtName){
		for (var prop in element.events[evtName]){
			callback(element, evtName, element.events[evtName][prop]);
		}
	}
	
	// remove event listener in w3c compliant browsers
	function removeEventW3C(element, evtName, handler){
		element.removeEventListener(evtName, handler);
		delete element.events[evtName][handler.instance];
	}
	
	// remove event listener in IE
	function removeEventIE(element, evtName, handler){
		element.detachEvent('on' + evtName, element.events[evtName][handler.instance]);
		delete element.events[evtName][handler.instance];
	}
	
	// routing based on number of supplied arguments
	function handleRemove(callback, element, evtName, handler){
		switch(arguments.length - 1){
			// only element name given
			case 1:
				for(var eName in element.events){
					iterate(callback, element, eName);
				}
				break;
			
			// only element and event name given
			case 2:
				iterate(callback, element, evtName);
				break;
			
			// all three arguments have been given
			case 3:
				callback(element, evtName, handler);
				break;
		}
	}
	
	// PUBLIC MEMBERS
	// W3C compliant event model
	var w3c = {
		add: function(element, evtName, handler){
			// prepare element object properties
			setData.apply(this, arguments);
			
			// store handler function
			element.events[evtName][handler.instance] = handler;
			
			// bind event
			element.addEventListener(evtName, handler, false);
		},
		remove: function(){
			var args;

			// convert arguments to an array
			args = Array.prototype.slice.call(arguments);
			
			// add callback as first array element
			args.unshift(removeEventW3C);
			
			// handle unbinding events
			handleRemove.apply(this, args);
		}
	};
	
	// IE event model
	var ie = {
		add: function(element, evtName, handler){
			// fix IE event handler
			var fixedHandler = fixHandler(element, handler);
			
			// prepare element object properties
			setData.apply(this, arguments);
			
			// store unique id on fixed handler too
			fixedHandler.instance = handler.instance;
			
			// store fixed handler function
			element.events[evtName][handler.instance] = fixedHandler;
			
			// bind event
			element.attachEvent('on' + evtName, fixedHandler);
		},
		remove: function(){
			var args;

			// convert arguments to an array
			args = Array.prototype.slice.call(arguments);
			
			// add callback as first array element
			args.splice(0, 0, removeEventIE);
			
			// handle unbinding events
			handleRemove.apply(this, arguments);
		}
	};
	
	return document.addEventListener ? w3c : ie;
})();