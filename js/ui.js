$(document).ready(function($) {

	$(".knob").knob({
	                change : function (value) {
						var id=this.$[0].id;
						knob_change(id,value);
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
		var value = evt.currentTarget.value;
		knob_change(id,value);
		
	});
	
	$(".knob-log").change(function(evt) {
		var id = evt.currentTarget.id;
		var value = evt.currentTarget.value;
		knob_change(id,value);
	});
	
	
	function knob_change(id,value) {
	console.log(id," ",value);
		switch(id) {
							case "vco-freq": VCOfreq=value;break;
							case "vco-pwm": VCOpwm=value/100;break;
							case "lfo-rate": LFOfreq=value;break;
							case "vco-mod-amount": VCOMODamount=value/100; console.log(VCOMODamount); break;
							case "vcf-cutoff" : VCFcutoff=value; VCFUpdateCutoff(VCFcutoff); break;
							case "vcf-res" : VCFUpdateRes(value/100); break;
							case "vcf-mod-amount": VCFMODamount = value/100; break;
							case "envelope-attack": ENVELOPEattack = value/100; break;
							case "envelope-decay": ENVELOPEdecay=value/100; break;
							case "note-glide": NOTEglide=value/100; break;
						
						}
	
	}
	
	$("input[type=checkbox]").change( function(evt) {
		console.log(evt.currentTarget.id,evt.currentTarget.checked);
		var value=evt.currentTarget.checked;
		switch(evt.currentTarget.id) {
			case "vco-wave": VCOwave = value; break;
			case "lfo-wave": LFOwave = value; break;
			case "lfo-tracking": LFOtracking = value; break;
			case "vcf-tracking": VCFtracking = value; break;
			case "vco-mod-source" : VCOMODsource = value; break;
			case "vco-mod-dest" : VCOMODdest = value; break;
			case "envelope-sustain": ENVELOPEsustain = value ; break;
			case "vcf-mod-source": VCFMODsource = value ; break;
			case "vcf-mod-polarity": VCFMODpolarity = value ; break;
			case "vca-mode": VCAmode = value; break;
		}
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
			noteTrigger(keys[key]/12);
		}
	});
	
	$(document).keyup(function(evt) {
		if (keyPressed==false) return;
		var key = String.fromCharCode(evt.keyCode).toLowerCase();;
		if (key in keys) {
			keyPressed = false;
			$('#key-'+key).toggleClass("hovered");
			//console.log(evt);
			noteRelease(keys[key]/12);
		}
	});
	
	$(".piano-key").mousedown(function(evt) {
		if (keyPressed==true) return;
		keyPressed=true;
		noteTrigger( keys[evt.currentTarget.id.substring(4,5)]/12 );
	});
	
	$(".piano-key").mouseup(function(evt) {
		if (keyPressed==false) return;
		keyPressed=false;
		noteRelease( keys[evt.currentTarget.id.substring(4,5)]/12 );
	});
	
	
	$( "#lfo-tracking, #vcf-tracking, #vco-c4, #vco-8up, #vco-8down, #lfo-copy-vco, #lfo-plus-half,#lfo-minus-half" ).button();
	
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
		var intensity = Math.floor((LFOout+1)*128);
		
		$('#lfo-led').css('background-color','rgb('+intensity+',0,0)');
	}, 50);
	

	
	// INIT 
	$('#vco-freq').val(revLogValue(261.626,8,16000)).trigger('change');
    $('#vco-wave').prop('checked',false);
	$('#vco-pwm').val(50).trigger('change');
	$('#vco-mod-source').prop('checked',false);
	$('#vco-mod-amount').val(0).trigger('change');
	$('#vco-mod-dest').prop('checked',false);
	$('#lfo-rate').val(revLogValue(5,0.2,600)).trigger('change');
	$('#lfo-wave').prop('checked',false);
	$('#lfo-tracking').prop('checked',false);
	$('#vcf-cutoff').val(20000).trigger('change');
	$('#vcf-res').val(0).trigger('change');
	$('#vca-mode').prop('checked',false);
	$('#vcf-mod-source').prop('checked',false);
	$('#vcf-mod-amount').val(0).trigger('change');
	$('#vcf-mod-polarity').prop('checked',true);
	$('#envelope-sustain').prop('checked',true);
	$('#envelope-attack').val(0).trigger('change');
	$('#envelope-decay').val(25).trigger('change');
	$('#note-glide').val(0).trigger('change');
	
	
	
});