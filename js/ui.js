$(document).ready(function($) {

	$(".knob").knob({
	                change : function (value) {
						var id=this.$[0].id;
						knob_change(id,value/100);
					}
					
	});
	
	function logValue(v,min,max) {
		return (max-min)*Math.pow(1.1,v*100/max-100)+min;
	}
	
	function revLogValue(l,min,max) {
		return (max/100)*(Math.log((l-min)/(max-min))/Math.log(1.1)+100);
	}
	
	$(".knob-log").knob({
	                change : function (value) {
						console.log('change !');
						var id=this.$[0].id; 
						knob_change(id,logValue(value,this.o.min,this.o.max));
					},
					format: function(v) {
                        var log = logValue(v,this.min,this.max);
						var strLog =log.toString();
						if (strLog.substring(4,5)==".") return strLog.substring(0,4);
						return strLog.substring(0,5);
                    }
					
	});
	
	$(".knob").change(function(evt) {
		var id = evt.currentTarget.id;
		var value = evt.currentTarget.value/100;
		knob_change(id,value);
		
	});
	
	$(".knob-log").change(function(evt) {
		var id = evt.currentTarget.id;
		var value = evt.currentTarget.value;
		knob_change(id,value);
	});
	
	
	function knob_change(id,value) {
		console.log('knob_change',id," ",value);
		var p = {};
		p[id]=parseFloat(value);
		synth.setParams(p);
	}
	
	$("input[type=checkbox]").change( function(evt) {
		console.log(evt.currentTarget.id,evt.currentTarget.checked);
		var value=evt.currentTarget.checked;
		var key = evt.currentTarget.id;
		var p = {};
		p[key]=value;
		synth.setParams(p);
	});
	
	$("#vco-wave").switchButton({
	  on_label: 'PULSE',
	  off_label: 'SAW',
	  width: 50, height: 20, button_width: 30
	});
	
	$("#vca-mode").switchButton({
	  on_label: 'ON',
	  off_label: 'EG',
	  width: 50, height: 20, button_width: 30
	});
	
	$("#vco-mod-source").switchButton({
	  on_label: 'EG',
	  off_label: 'LFO',
	  width: 50, height: 20, button_width: 30
	});
	
	$("#vco-mod-dest").switchButton({
	  on_label: 'PWM',
	  off_label: 'FREQ',
	  width: 50, height: 20, button_width: 30
	});
	
	$("#vcf-mod-source").switchButton({
	  on_label: 'EG',
	  off_label: 'LFO',
	  width: 50, height: 20, button_width: 30
	});
	
	$("#vcf-mod-polarity").switchButton({
	  on_label: '[+]',
	  off_label: '[-]',
	  checked: true,
	  width: 50, height: 20, button_width: 30
	});
	
	$("#lfo-wave").switchButton({
	  on_label: 'SQUARE',
	  off_label: 'TRIANGLE',
	  width: 50, height: 20, button_width: 30
	});
	
	$("#envelope-sustain").switchButton({
	  on_label: 'ON',
	  off_label: 'OFF',
	  checked: true,
	  width: 50, height: 20, button_width: 30
	});
	
	
	var keys = {
		's':0,'e':1,'d':2,'r':3,'f':4,'g':5,'y':6,'h':7,'u':8,'j':9,'i':10,'k':11,'l':12
	}
	
	var keyPressed = false;
	
	$(document).keydown(function(evt) {	
		if (keyPressed==true) return;
		var key = String.fromCharCode(evt.keyCode).toLowerCase();;
		if (key in keys) {
			keyPressed = true;
			$('#key-'+key).toggleClass("hovered");
			//console.log(evt);
			synth.noteTrigger(keys[key]/12);
		}
	});
	
	$(document).keyup(function(evt) {
		if (keyPressed==false) return;
		var key = String.fromCharCode(evt.keyCode).toLowerCase();;
		if (key in keys) {
			keyPressed = false;
			$('#key-'+key).toggleClass("hovered");
			//console.log(evt);
			synth.noteRelease(keys[key]/12);
		}
	});
	
	$(".piano-key").mousedown(function(evt) {
		if (keyPressed==true) return;
		keyPressed=true;
		synth.noteTrigger( keys[evt.currentTarget.id.substring(4,5)]/12 );
	});
	
	$(".piano-key").mouseup(function(evt) {
		if (keyPressed==false) return;
		keyPressed=false;
		synth.noteRelease( keys[evt.currentTarget.id.substring(4,5)]/12 );
	});
	
	
	$( ".toggle-button, .push-button" ).button();
	
	$("#vco-c4").click( function(evt) {
		$('#vco-freq').val(revLogValue(261.626,8,16000)).trigger('change');
	});
	
	$("#vco-8down").click( function(evt) {
		var freq=$('#vco-freq').val()/2;
		if (freq<16) return;
		$('#vco-freq').val(revLogValue(freq,8,16000)).trigger('change');
	});
	
	$("#vco-8up").click( function(evt) {
		var freq=$('#vco-freq').val()*2;
		if (freq>16000) return;
		$('#vco-freq').val(revLogValue(freq,8,16000)).trigger('change');
	});
	
	$("#lfo-copy-vco").click( function(evt)  {
		var freq=$('#vco-freq').val();
		while (freq>600) freq/=2;
		$('#lfo-rate').val(revLogValue(freq,0.2,600)).trigger('change');
	});
	
	$("#lfo-minus-half").click( function(evt)  {
		var freq=$('#lfo-rate').val();
		freq*=Math.pow(2,-1/12);
		if (freq<0.2) return;
		$('#lfo-rate').val(revLogValue(freq,0.2,600)).trigger('change');
	});
	
	$("#lfo-plus-half").click( function(evt)  {
		var freq=$('#lfo-rate').val();
		freq*=Math.pow(2,1/12);
		if (freq>600) return;
		$('#lfo-rate').val(revLogValue(freq,0.2,600)).trigger('change');
	});
	
	setInterval(function() {
		var intensity = Math.floor((synth.lfo.out+1)*128);
		
		//var intensity = Math.floor((synth.eg.value)*255);
		
		$('#lfo-led').css('background-color','rgb('+intensity+',0,0)');
	}, 50);
	

	
	// INIT 
	var params = {
		// VCO
		"vco-freq":261.626, // 8hz - 16khz
		"vco-pwm":.5, // 0 - 1
		"vco-wave":false, // false = Saw, true = Pulse
		// VCO-MOD
		"vco-mod-source":false, // false = LFO, true = EG
		"vco-mod-amount":0,
		"vco-mod-dest":false, // false = VCO, true = PWM
		// LFO
		"lfo-rate":.5, // .2 - 600Hz
		"lfo-wave":false, // false = Triangle, true = Square
		"lfo-tracking":false,
		// VCA
		"vca-mode":false, // false = EF, true= ON
		// VCF
		"vcf-cutoff":20000, // 20hz - 20Khz
		"vcf-res":0, // 0 - 1
		"vcf-tracking":true,
		// VCF-MOD
		"vcf-mod-source":false, // false = LFO, true = EG
		"vcf-mod-amount":0,
		"vcf-mod-polarity":true,
		// ENVELOPE
		"envelope-sustain":true,
		"envelope-attack":0, // 0 - 1
		"envelope-decay":.3, // 0 - 1
		// NOTE
		"note-glide":0 // 0 - 1
		
	};
	
	
	for(key in params) {
		console.log('init:',key,params[key]);
		var el = $('#'+key);
		switch(el.get(0).className) {
			case 'onoff-button': el.switchButton({ checked: params[key] }); break;
			case 'toggle-button': el.prop('checked',params[key]).trigger('change'); break;
			case 'knob': el.val(params[key]*100).trigger('change');
			case 'knob-log':
				switch(key) {
					case 'vco-freq': $('#vco-freq').val(revLogValue(params[key],8,16000)).trigger('change'); break;
					case 'lfo-rate': $('#lfo-rate').val(revLogValue(params[key],0.2,600)).trigger('change'); break;
					case 'vcf-cutoff': $('#vcf-cutoff').val(revLogValue(params[key],20,20000)).trigger('change'); break;
				}
		}
		
	}
	
	
});