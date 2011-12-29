function test1(){
	var count = 0;
	var trigger = document.getElementById('trigger_0');
	var dTrigger = document.getElementById('trigger_destroy_0');
	var output = document.getElementById('console_output_0');
	
	var handleTrigger = function(e){
		e.preventDefault();
		
		output.innerHTML += '<li>Trigger clicked: '+count+'</li>';
		count++;
	};
	
	Event.add(trigger, 'click', handleTrigger);
	Event.add(dTrigger, 'click', function(e){
		e.preventDefault();
		output.innerHTML = '';
		Event.remove(trigger, 'click', handleTrigger);
	});
}

function test2(){
	var trigger = document.getElementById('trigger_1');
	var output = document.getElementById('console_output_1');
	
	var countA = 0;
	var countB = 0;
	var countC = 0;
	
	var handleTriggerA = function(e){
		e.preventDefault();
		
		countA += 1;
		output.innerHTML += '<li>Trigger countA: ' + countA + '</li>';
	};
	var handleTriggerB = function(e){
		e.preventDefault();
		
		countB += 2;
		output.innerHTML += '<li>Trigger countB: ' + countB + '</li>';
	};
	var handleTriggerC = function(e){
		e.preventDefault();
		
		countC += 3;
		output.innerHTML += '<li>Trigger countC: ' + countC + '</li>';
	}
	
	Event.add(trigger, 'click', handleTriggerA);
	Event.add(trigger, 'click', handleTriggerB);
	Event.add(trigger, 'click', handleTriggerC);
	
	Event.add(document.getElementById('trigger_destroy_1A'), 'click', function(e){
		e.preventDefault();
		Event.remove(trigger, 'click', handleTriggerA);
	});
	Event.add(document.getElementById('trigger_destroy_1B'), 'click', function(e){
		e.preventDefault();
		Event.remove(trigger, 'click', handleTriggerB);
	});
	Event.add(document.getElementById('trigger_destroy_1C'), 'click', function(e){
		e.preventDefault();
		Event.remove(trigger, 'click', handleTriggerC);
	});
}

function test3(){
	var trigger = document.getElementById('trigger_2');
	var dTrigger = document.getElementById('trigger_destroy_2');
	var output = document.getElementById('console_output_2');
	
	var countA = 0;
	var countB = 0;
	var countC = 0;
	
	var handleTriggerA = function(e){
		e.preventDefault();
		
		countA += 1;
		output.innerHTML += '<li>Trigger countA: ' + countA + '</li>';
	};
	var handleTriggerB = function(e){
		e.preventDefault();
		
		countB += 2;
		output.innerHTML += '<li>Trigger countB: ' + countB + '</li>';
	};
	var handleTriggerC = function(e){
		e.preventDefault();
		
		countC += 3;
		output.innerHTML += '<li>Trigger countC: ' + countC + '</li>';
	}
	
	Event.add(trigger, 'click', handleTriggerA);
	Event.add(trigger, 'click', handleTriggerB);
	Event.add(trigger, 'click', handleTriggerC);
	
	Event.add(document.getElementById('trigger_destroy_2'), 'click', function(e){
		e.preventDefault();
		Event.remove(trigger, 'click');
	});
}

function test4(){
	var trigger = document.getElementById('trigger_3');
	var dTrigger = document.getElementById('trigger_destroy_3');
	var output = document.getElementById('console_output_3');
	
	var handleFocus = function(e){
		output.innerHTML += '<li>triggered focus</li>';
	};
	var handleBlur = function(e){
		output.innerHTML += '<li>triggered blur</li>';
	};
	var handleChange = function(e){
		output.innerHTML += '<li>triggered change</li>';
	};
	
	Event.add(trigger, 'focus', handleFocus);
	Event.add(trigger, 'blur', handleBlur);
	Event.add(trigger, 'change', handleChange);
	
	Event.add(dTrigger, 'click', function(e){
		e.preventDefault();
		Event.remove(trigger);
	});
}

function test5(){
	var triggerA = document.getElementById('trigger_4A');
	var triggerB = document.getElementById('trigger_4B');
	var triggerC = document.getElementById('trigger_4C');
	
	var dTriggerA = document.getElementById('trigger_destroy_4A');
	var dTriggerB = document.getElementById('trigger_destroy_4B');
	var dTriggerC = document.getElementById('trigger_destroy_4C');
	
	
	var output = document.getElementById('console_output_4');
	
	var eventHandler = function(e){
		e.preventDefault();
		
		var el = e.target;
		output.innerHTML += '<li>Click from trigger <b>#' + el.id + '</b></li>';
	};
	
	var destroyHandler = function(e){
		e.preventDefault();
		
		var el = e.target;
		
		if(el == dTriggerA){
			Event.remove(triggerA);
			
		}else if(el == dTriggerB){
			Event.remove(triggerB);
			
		}else if(el == dTriggerC){
			Event.remove(triggerC);
		}
	};
	
	Event.add(triggerA, 'click', eventHandler);
	Event.add(triggerB, 'click', eventHandler);
	Event.add(triggerC, 'click', eventHandler);
	
	Event.add(dTriggerA, 'click', destroyHandler);
	Event.add(dTriggerB, 'click', destroyHandler);
	Event.add(dTriggerC, 'click', destroyHandler);
}

function test6(){
	var outerTrigger = document.getElementById('outer_trigger');
	var trigger = document.getElementById('trigger_5');
	var console = document.getElementById('console_output_5');
	
	Event.add(outerTrigger, 'click', function(e){
		e.preventDefault();
		console.innerHTML += '<li>click from <b>#outer_trigger</b></li>'
	});
	
	Event.add(trigger, 'click', function(e){
		e.preventDefault();
		e.stopPropagation();
	});
}


Event.add(window, 'load', function(){
	test1();
	test2();
	test3();
	test4();
	test5();
	test6();
});