// DOM Level 0 event model
element.onclick = function(e){
	// do something
};


// DOM Level 3 event model
element.addEventListener(‘click’, function(e){ }, false);


// IE's event model
element.attachEvent(‘onclick’, function(){
    var event = window.event;
});


// function memoization
var doSomething = function(){
	if(condition){
		// redefine function
		doSomething = function(){
			// carry out action A
		};
		
	}else{
		// redefine function
		doSomething = function(){
			// carry out action B
		};
	}
};


// module pattern
var module = (function(){
    // private members
    var privateMethod1 = function(){
		// do something
	};

	var privateMethod2 = function(){
		// do something
	};

    // public members
    return {
        method1: function(){ },
        method2: function(){ }
	};
})();


// a simple event handling script
function addEvent(element, event, handler){
	// standard event model
	if(document.addEventListener){
		element.addEventListener(event, handler, false);
		
	// IE event model
	}else{
		element.attachEvent('on' + event, handler);
	}
}

function removeEvent(element, event, handler){
	// standard event model
	if(document.removeEventListener){
		element.removeEventListener(event, handler, false);
		
	// IE event model
	}else{
		element.detachEvent('on' + event, handler);
	}
}


// basic app structure
var Event = (function(){
	return {
		add: function(element, event, handler){
			// standard compliant browsers
			if(typeof document.addEventListener === 'function'){
				element.addEventListener(event, handler, false);
				
			// IE
			}else{
				element.attachEvent('on' + event, handler);
			}
		},
		remove: function(element, event, handler){
			// standard compliant browsers
			if(typeof document.removeEventListener === 'function'){
				element.removeEventListener(event, handler, false);
				
			// IE
			}else{
				element.detachEvent('on' + event, handler);
			}
		}
	};
})();


// memoized app structure
var Event = (function(){
	// standard compliant browsers
	var w3c = {
		add: function(element, event, handler){
			element.addEventListener(event, handler, false);
		},
		remove: function(element, event, handler){
			element.removeEventListener(event, handler, false);
		}
	};
	
	// IE
	var ie = {
		add: function(element, event, handler){
			element.attachEvent('on' + event, handler);
		},
		remove: function(element, event, handler){
			element.detachEvent('on' + event, handler);
		}
	};
	
	return typeof document.addEventListener === 'function' ? w3c : ie;
})();

