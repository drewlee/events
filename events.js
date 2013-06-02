/**
 * Cross browser event handling utility.
 * @namespace
 */
var Event = (function(){
  /**
   * Application constants.
   * @member
   */
  var CONST = {
        NS_EVENTS: 'events',
        NS_INSTANCE: 'instance',
        NS_ID: 'guid_',
        NS_ON: 'on'
      },
      /**
       * Used to generate unique identifier for each handler function.
       * @member
       */
      count = 0;

  /**
   * Sets up namespacing for the utility's data store mechanism.
   * @param {HTMLElement} element - Element event handler is being attached to.
   * @param {String} type - Event type.
   * @param {Function} handler - Event handler function.
   */
  function setData(element, type, handler){
    // attach 'events' expando to element in order to track attached handlers
    if ( !(CONST.NS_EVENTS in element) ){
      element[CONST.NS_EVENTS] = {};
    }
    
    // attach expando to element based on event type
    if ( !(type in element[CONST.NS_EVENTS]) ){
      element[CONST.NS_EVENTS][type] = {};
    }
    
    // attach a unique id instance to handler
    if ( !(CONST.NS_INSTANCE in handler) ){
      handler[CONST.NS_INSTANCE] = CONST.NS_ID + count++;
    }
  }
  
  /**
   * Fixes IE's event API to match that of standard browsers.
   * @param  {HTMLElement} element - Element event handler is being attached to.
   * @param  {Function} handler - Event handler function.
   * @return {Function}
   */
  function fixHandler(element, handler){
    return function(){
      var evt = window.event;
      
      evt.preventDefault = function(){
        this.returnValue = false; 
      };
      
      evt.stopPropagation = function(){
        this.cancelBubble = true;
      };
      
      evt.target = evt.srcElement;
      
      handler.call(element, evt);
    };
  }
  
  /**
   * Iterates through all attached event handlers.
   * @param  {Function} callback - The callback function that handles event handler removal.
   * @param  {HTMLElement} element - Element event handler is being attached to.
   * @param  {String} type - Event type.
   */
  function iterate(callback, element, type){
    for (var handlerID in element[CONST.NS_EVENTS][type]){
      callback(element, type, element[CONST.NS_EVENTS][type][handlerID]);
    }
  }
  
  /**
   * Removes event handler in w3c compliant browsers.
   * @param  {HTMLElement} element - Element event handler is being attached to.
   * @param  {String} type - Event type.
   * @param  {Function} handler - Event handler function.
   */
  function removeEventW3C(element, type, handler){
    element.removeEventListener(type, handler);
    delete element[CONST.NS_EVENTS][type][handler[CONST.NS_INSTANCE]];
  }
  
  /**
   * Removes event handler in IE.
   * @param  {HTMLElement} element - Element event handler is being attached to.
   * @param  {String} type - Event type.
   * @param  {Function} handler - Event handler function.
   */
  function removeEventIE(element, type, handler){
    element.detachEvent(CONST.NS_ON + type, element[CONST.NS_EVENTS][type][handler[CONST.NS_INSTANCE]]);
    delete element[CONST.NS_EVENTS][type][handler[CONST.NS_INSTANCE]];
  }

  /**
   * Handles appropriate action based off of the number of supplied arguments.
   * @param  {Function} callback - The callback function that handles event handler removal.
   * @param  {HTMLElement} element - Element event handler is being attached to.
   * @param  {String} type - Event type.
   * @param  {Function} handler - Event handler function.
   */
  function handleRemove(callback, element, type, handler){
    switch (arguments.length - 1){
      // only element supplied
      case 1:
        // iterate through all the attached event types
        for (var evt in element[CONST.NS_EVENTS]){
          // iterate through all attached handlers
          iterate(callback, element, evt);
        }
        break;
      
      // only the element and event type was supplied
      case 2:
        // iterate through all attached handlers
        iterate(callback, element, type);
        break;
      
      // all three arguments supplied
      case 3:
        // directly remove event handler
        callback(element, type, handler);
        break;
    }
  }
  
  // W3C compliant event model
  var w3c = {
    /**
     * Add event method for standard compliant browsers.
     * @memberof Event
     * @param  {HTMLElement} element - Element event handler is being attached to.
     * @param  {String} type - Event type.
     * @param  {Function} handler - Event handler function.
     */
    add: function(element, type, handler){
      // setup expando properties
      setData(element, type, handler);
      
      // store event handler function on element as expando
      element[CONST.NS_EVENTS][type][handler[CONST.NS_INSTANCE]] = handler;
      
      // add event listener
      element.addEventListener(type, handler, false);
    },

    /**
     * Remove event handler for standard compliant browsers. As a convenienve, the remove method 
     * takes a variable number of arguments, with element as the only required argument. If only 
     * element is provided, all event handlers are removed from the element. If element and event 
     * type is provided, all event handlers of the same type are removed.
     * @memberof Event
     * @param  {HTMLElement} element - Element event handler is being attached to.
     * @param  {String} type - Event type.
     * @param  {Function} handler - Event handler function.
     */
    remove: function(){
      // convert arguments to true array
      var args = Array.prototype.slice.call(arguments);
      
      // add 'removeEventW3C' as first element in args array
      args.unshift(removeEventW3C);
      
      // handle removal of event handlers
      handleRemove.apply(this, args);
    }
  };
  
  // IE event model
  var ie = {
    /**
     * Add event method for IE.
     * @memberof Event
     * @param  {HTMLElement} element - Element event handler is being attached to.
     * @param  {String} type - Event type.
     * @param  {Function} handler - Event handler function.
     */
    add: function(element, type, handler){
      // normalize IE's event model
      var fixedHandler = fixHandler(element, handler);
      
      // setup expando properties
      setData(element, type, handler);
      
      // store unique id on fixed handler
      fixedHandler[CONST.NS_INSTANCE] = handler[CONST.NS_INSTANCE];
      
      // store fixed handler function
      element[CONST.NS_EVENTS][type][handler[CONST.NS_INSTANCE]] = fixedHandler;
      
      // attach event handler
      element.attachEvent(CONST.NS_ON + type, fixedHandler);
    },

    /**
     * Remove event handler for IE. As a convenienve, the remove method takes a variable number of
     * arguments, with element as the only required argument. If only element is provided, all event
     * handlers are removed from the element. If element and event type is provided, all event
     * handlers of the same type are removed.
     * @memberof Event
     * @param  {HTMLElement} element - Element event handler is being attached to.
     * @param  {String} type - Event type.
     * @param  {Function} handler - Event handler function.
     */
    remove: function(){
      // convert arguments to true array
      var args = Array.prototype.slice.call(arguments);
      
      // add 'removeEventIE' as first element in args array
      args.splice(0, 0, removeEventIE);
      
      // handle removal of event handlers
      handleRemove.apply(this, args);
    }
  };
  
  // expose public API based on browser support level
  return typeof document.addEventListener === 'function' ? w3c : ie;
})();