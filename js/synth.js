"use strict";

var VCO = {

	out:0, //  0 - 1
	phase:0, // 0 - 1
	freq:0,
	pwm:0, // 0 - 1
	fs: 48000,
	min:0,
	max:0,
	
	new: function(fs) {
		var obj = Object.create(this);
		if (!(typeof fs==='undefined')) this.fs=fs;
		return obj;
	},
	
	_interpolate: function(table,p) {
		if (typeof p === 'undefined') p = this.phase*table.length; else p*=table.length;
		var t = Math.floor(p);
		var frac = p-t;  
		var t1=t+1;
		if (t1==table.length) t1=0;
		
		//var out = table[t]*(1-frac)+table[t1]*frac;
		var out=table[t];//TMP
		//if (isNaN(out)) console.log('interpolate',t,frac,t1,table.length);
		
		if (out<-1) out=-1;
		if (out>1) out=1;
		
		return out;
	},
	
	_get_table: function() {
		var length=0;
		var num=0;
	
		for(var i=9;i>=0;i--) {
			if (this.freq>=table_def[i].f) {
				length=table_def[i].l;
				num=i;
				break;
			}
		}	
		
		return num;
	},
	
	setFreq: function(freq) {
		//if (isNaN(this.freq)) { console.log('Freq NaN!');  }
		if (freq<0) freq=0;
		if (freq>20000) freq=20000;
		this.freq=freq;
	},
	
	setPwm: function(pwm) {
		if (pwm<0) pwm=0;
		if (pwm>1) pwm=1;
		this.pwm=pwm;
		this.min=0;
		this.max=0;
	},
	
	_addPhase: function()  {
		//if (isNaN(this.phase)) { console.log('Phase NaN!'); this.phase=0; }
		this.phase+=this.freq/this.fs;
		while (this.phase>1) this.phase-=1;
		while (this.phase<0) this.phase+=1;
	},
	
	_saw: function(num,phase) {
		return this._interpolate(saw_table[num],phase);
	},
	
	saw: function() {  
		this._addPhase();
		var num = this._get_table();
		
		this.out = this._interpolate(saw_table[num]);
		return this.out;
	},

	pulse: function() {
		this._addPhase();
		
		var t=this.phase+this.pwm;
		while(t>=1) t-=1;
	
		var num = this._get_table();
	
		this.out=( this._saw(num,this.phase) - this._saw(num,t) )*0.9+(this.pwm*2-1)*0.7;
		if (this.out<-1) this.out=-1;
		if (this.out>1) this.out=1;
		
		if (this.out<this.min) this.min=this.out;
		if (this.out>this.max) this.max=this.out;
		
		return this.out;
  	},
	
	triangle_lfo: function() {
		this._addPhase();
		this.out = this._interpolate(triangle_table);
		return this.out;
	},

	square_lfo: function() {
		this._addPhase();
		this.out = this._interpolate(square_table);
		return this.out;
	}

};

var VCF = {

	// http://musicdsp.org/showArchiveComment.php?ArchiveID=24
	
	p:0,
	k:0,
	r:0,
	y1:0, y2:0, y3:0, y4:0,
	oldy1:0, oldy2:0, oldy3:0,
	oldx:0,
	fs: 48000,
	
	new: function(fs) {
		var obj = Object.create(this);
		if (!(typeof fs==='undefined')) this.fs=fs;
		return obj;
	},

	updateCutoff: function(cutoff) {
		if (cutoff<0) cutoff=0;
		if (cutoff>20000) cutoff=20000;
		var fc = cutoff*2/this.fs;
		this.p = fc*(1.8-0.8*fc);
		this.k = 2*Math.sin(fc*Math.PI/2)-1;
	},

	updateRes: function(res) {
		//console.log(res);
		var t1 = (1-this.p)*1.386249;
		var t2 = 12+t1*t1;
		this.r = res*(t2+6*t1)/(t2-6*t1);
	},

	filter: function(input) {
	
		if (input>1) input=1;
		if (input<-1) input=-1;
		
		var x = input - this.r*this.y4;

		//Four cascaded onepole filters (bilinear transform)
		this.y1=x*this.p + this.oldx*this.p - this.k*this.y1;
		this.y2=this.y1*this.p+this.oldy1*this.p - this.k*this.y2;
		this.y3=this.y2*this.p+this.oldy2*this.p - this.k*this.y3;
		this.y4=this.y3*this.p+this.oldy3*this.p - this.k*this.y4;

		//Clipper band limited sigmoid
		this.y4 -= (this.y4*this.y4*this.y4)/6;

		this.oldx = x;
		this.oldy1 = this.y1;
		this.oldy2 = this.y2;
		this.oldy3 = this.y3;
	
		if (this.y4<-1) this.y4=-1;
		if (this.y4>1) this.y4=1;
	
		return this.y4;
	
	}

};

var EG = {

	value:0,
	state:0, // 1=attack , 2=sustain, 3=release
	attack:0,
	release:0,
	sustain:false,
	fs:48000,
	
	new: function(fs) {
		var obj = Object.create(this);
		if (!(typeof fs==='undefined')) this.fs=fs;
		return obj;
	},

	calculate: function() {
	
		if (this.state==1) {
			this.value+=1/(this.attack*(1*this.fs-1)+1);
		
			if (this.value>=1) {
				this.value=1;
				this.state=2;
			}
			return;
		}
	
		if (this.state==2) {
			if (this.sustain==false) this.state=3;
			return;
		}
	
		if (this.state==3) {
			this.value-=1/(this.decay*(2*this.fs-1)+1);

			if (this.value<=0) {
				this.value=0;
				this.state=0;
			}
		
			return;
		}

	}


};


var Synth = {

	params : {
		// VCO
		"vco-freq":440, // 8hz - 16khz
		"vco-pwm":.5, // 0 - 1
		"vco-wave":false, // false = Saw, true = Pulse
		// VCO-MOD
		"vco-mod-source":false, // false = LFO, true = EG
		"vco-mod-amount":0,
		"vco-mod-dest":false, // false = VCO, true = PWM
		// LFO
		"lfo-rate":5, // .2 - 600Hz
		"lfo-wave":false, // false = Triangle, true = Square
		"lfo-tracking":false,
		// VCA
		"vca-mode":false, // false = EF, true= ON
		// VCF
		"vcf-cutoff":20000, // 20hz - 20Khz
		"vcf-res":0, // 0 - 1
		"vcf-tracking":false,
		// VCF-MOD
		"vcf-mod-source":false, // false = LFO, true = EG
		"vcf-mod-amount":0,
		"vcf-mod-polarity":false,
		// ENVELOPE
		"envelope-sustain":true,
		"envelope-attack":0, // 0 - 1 
		"envelope-decay":0, // 0 - 1 
		// NOTE
		"note-glide":0 // 0 - 1
		
	},
	
	vcoOut:0,
	lfoOut:0,
	
	fs: 48000, 
	
	new: function(fs) {
		var obj = Object.create(this);
		if (!(typeof fs==='undefined')) this.fs=fs;
		obj._init();
		return obj;
	},
	
	_init: function() {
		this.vco = VCO.new(this.fs);
		this.lfo = VCO.new(this.fs);
		this.vcf = VCF.new(this.fs);
		this.eg = EG.new(this.fs);
	},
	
	setParams:function(params) {
		for (var key in params) {
		console.log('setParams',key);
			if (! (key in this.params) ) continue;
			this.params[key] = params[key];
			
			switch(key) {		
				case "vco-pwm": this.vco.setPwm(params[key]); break;
				case "vcf-cutoff": this.vcf.updateCutoff(params[key]); break;
				case "vcf-res": this.vcf.updateRes(params[key]); break;
				case "envelope-sustain": this.eg.sustain = params[key]; break;
				case "envelope-attack": this.eg.attack = params[key]; break;
				case "envelope-decay": this.eg.decay = params[key]; break;
			}
			
		}
	},

	noteValue:0,
	noteOutValue:0,

	noteTrigger: function(v) {
		console.log("trigger "+v);
		this.eg.state=1;
		this.noteValue=v;
	},

	noteRelease: function(v) {
		this.eg.state=3;
		console.log("release "+v);
	},

	getAudio : function() {

		// ENVELOPE
		this.eg.calculate();
	
		// LFO
		var lfo_freq=this.params['lfo-rate'];
		if (this.params["lfo-tracking"]==true) { lfo_freq*=Math.pow(2,this.noteOutValue); }
		this.lfo.setFreq(lfo_freq);
		
		if (this.params["lfo-wave"]==false)
			this.lfoOut = this.lfo.triangle_lfo();
		else
			this.lfoOut = this.lfo.square_lfo();
	
		var pwm = this.params['vco-pwm'];
		var lfoPitch=1;
	
		if (this.params["vco-mod-source"]==true) { // VCO MOD SOURCE == EG
			if (this.params["vco-mod-dest"]==false) { // VCO MOD DEST == FREQ
				lfoPitch=Math.pow(2,this.eg.value*this.params["vco-mod-amount"]);
			} else { // VCO MOD DEST == PWM
				this.vco.setPwm(pwm+this.eg.value*this.params["vco-mod-amount"]/2);
			}
		} else { // VCO MOD SOURCE == LFO
			if (this.params["vco-mod-dest"]==false) { // VCO MOD DEST == FREQ		
				lfoPitch=Math.pow(2,this.lfo.out*this.params["vco-mod-amount"]);
			} else { // VCO MOD DEST == PWM
				this.vco.setPwm(pwm+this.lfoOut*this.params["vco-mod-amount"]/2);
			}
		}

		// Note Glide
		if (this.noteOutValue<this.noteValue) { 
			this.noteOutValue+=1/(this.params["note-glide"]*(1*this.fs-1)+1); 
			if (this.noteOutValue>this.noteValue) this.noteOutValue=this.noteValue; 
		} 
		else if (this.noteOutValue>this.noteValue) { 
			this.noteOutValue-=1/(this.params["note-glide"]*(1*this.fs-1)+1); 
			if (this.noteOutValue<this.noteValue) this.noteOutValue=this.noteValue; 
		}
		var notePitch = Math.pow(2,this.noteOutValue);
	
		// VCO
		/*if (isNaN(this.params['vco-freq']*notePitch*lfoPitch)) {
		console.log('problem',this.params['vco-freq'],notePitch,lfoPitch);
		}*/
		this.vco.setFreq(this.params['vco-freq']*notePitch*lfoPitch);
	
		if (this.params["vco-wave"]==false)
			this.vcoOut = this.vco.saw();
		else
			this.vcoOut = this.vco.pulse();
		
	
		//VCF MOD
		var cutoffPitch = 1;
		var cutoffPitchSign= 1;
		if (this.params["vcf-mod-polarity"]==false) cutoffPitchSign=-1;
		if (this.params["vcf-mod-source"]==false) {
			cutoffPitch=Math.pow(2,this.lfoOut*this.params["vcf-mod-amount"]*4*cutoffPitchSign);
		} else {
			cutoffPitch=Math.pow(2,this.eg.value*this.params["vcf-mod-amount"]*4*cutoffPitchSign);
		}
		var cutoff_freq = this.params["vcf-cutoff"];
		if (this.params["vcf-tracking"]==true) { cutoff_freq*=Math.pow(2,this.noteOutValue); }
		this.vcf.updateCutoff(cutoff_freq*cutoffPitch);

		// filter
		var out = this.vcf.filter(this.vcoOut);
		

		// VCA
		if (this.params["vca-mode"]==true) return out;
		return out*this.eg.value;
		
		
	}

};


