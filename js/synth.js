"use strict";

var audioContext;
try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();
} catch(e) {
  alert('Web Audio API is not supported in this browser, try Chrome or Firefox !');
}

var fs=audioContext.sampleRate;

var table_def=[
	{ f:8, n: 1000, l:4096 },
	{ f:22, n: 500, l: 4096},
	{ f:44, n: 250, l:2048},
	{ f:88, n: 125, l:2048 },
	{ f:176,n: 60, l:2048},
	{ f:350, n: 30 ,l:1024},
	{ f:700, n:15, l:1024},
	{ f:1400, n:7,l:512 },
	{ f:3000, n:3,l:512 },
	{ f:7300,n:1,l:256},
];

// VCO
var VCOfreq=440; // 8hz - 16khz
var VCOpwm=.5;
var VCOout=0;
var VCOwave=false;
var VCOphase=0;

// VCOMOD
var VCOMODsource=false;
var VCOMODamount=0.5;
var VCOMODdest=false;

//LFO
var LFOfreq=5; // .2 - 600Hz
var LFOphase=0;
var LFOout=0;
var LFOwave=false;
var LFOtracking=false;

// VCA
var VCAmode=false;

//VCF
var VCFcutoff=20000; // 20hz - 20Khz
var VCFp=0;
var VCFk=0;
var VCFr=0;
var VCFy1=0;
var VCFy2=0;
var VCFy3=0;
var VCFy4=0;
var VCFoldx=0;
var VCFoldy1=0;
var VCFoldy2=0;
var VCFoldy3=0;

//VCFMOD
var VCFMODsource=false;
var VCFMODamount=0;
var VCFMODpolarity=false;

//ENVELOPE
var ENVELOPEsustain=true;
var ENVELOPEattack=0;
var ENVELOPEdecay=0; // full = 5s
var ENVELOPEvalue=0;
var ENVELOPEstate=0; // 1=attack , 2=sustain, 3=release

//Note
var NOTEglide=0;
var NoteValue=0;
var NoteOutValue=0;


function VCFUpdateCutoff(cutoff) {
	if (cutoff<0) cutoff=0;
	if (cutoff>20000) cutoff=20000;
	var fc = cutoff*2/fs;
	VCFp = fc*(1.8-0.8*fc);
	VCFk = 2*Math.sin(fc*Math.PI/2)-1;
}

function VCFUpdateRes(res) {
	console.log(res);
	var t1 = (1-VCFp)*1.386249;
	var t2 = 12+t1*t1;
	VCFr = res*(t2+6*t1)/(t2-6*t1);
}

function saw(freq,phase) {  
	
	var length=0;
	var num=0;
	
for(var i=9;i>=0;i--) {
	if (freq>=table_def[i].f) {
		length=table_def[i].l;
		num=i;
		break;
	}
}	
//console.log(num," ",length);	
  //return  phase*2-1;
  var p = phase*length;
  var t = Math.floor(p);
  var frac = p-t;  
  var t1=t+1;
  if (t1==length) t1=0;
  return saw_table[num][t]*(1-frac)+saw_table[num][t1]*frac;

}

function pulse(freq,phase,pwm) {
 //if (phase<pwm) return -1;
 //return 1;

	var t=phase+pwm;
	while(t>=1) t-=1;
	
	var out=(saw(freq,phase)-saw(freq,t))*0.9+0.5-pwm;
	if (out<-1) return -1;
	if (out>1) return 1;
	return out;
  	
}

function triangle_lfo(phase) {
	var p = phase*4096;
	var t = Math.floor(p);
	var frac = p-t;  
	var t1=t+1;
	if (t1==4096) t1=0;
	return triangle_table[t]*(1-frac)+triangle_table[t1]*frac;
}

function square_lfo(phase) {
	var p = phase*4096;
	var t = Math.floor(p);
	var frac = p-t;  
	var t1=t+1;
	if (t1==4096) t1=0;
	return square_table[t]*(1-frac)+square_table[t1]*frac;
}

function calcEnvelope() {
	
	if (ENVELOPEstate==1) {
		ENVELOPEvalue+=1/(ENVELOPEattack*(1*fs-1)+1);
		
		if (ENVELOPEvalue>=1) {
			ENVELOPEvalue=1;
			ENVELOPEstate=2;
		}
		
		return;
	}
	
	if (ENVELOPEstate==2) {
		if (ENVELOPEsustain==false) ENVELOPEstate=3;
		return;
	}
	
	if (ENVELOPEstate==3) {
			ENVELOPEvalue-=1/(ENVELOPEdecay*(2*fs-1)+1);

		
		if (ENVELOPEvalue<=0) {
			ENVELOPEvalue=0;
			ENVELOPEstate=0;
		}
		
		return;
	}

}


function noteTrigger(v) {
	console.log("trigger "+v);
	ENVELOPEstate=1;
	NoteValue=v;
}

function noteRelease(v) {
	ENVELOPEstate=3;
	console.log("release "+v);
}

function getAudio() {

	// ENVELOPE
	calcEnvelope();
	
	// LFO
	var lfo_freq=LFOfreq
	if (LFOtracking==true) { lfo_freq*=Math.pow(2,NoteOutValue); }
	LFOphase+=lfo_freq/fs;

	while(LFOphase<0) LFOphase+=1;
	while(LFOphase>=1) LFOphase-=1;
	
	if (LFOwave==false)
		LFOout = triangle_lfo(LFOphase);
	else 
		LFOout = square_lfo(LFOphase);
	
	var pwm = VCOpwm;
	//var phase = VCOphase;
	
	var lfoPitch=1;
	
	if (VCOMODsource==true) {
		if (VCOMODdest==false) {
			lfoPitch=Math.pow(2,ENVELOPEvalue*VCOMODamount);
		} else {
			pwm = (ENVELOPEvalue*VCOMODamount+1)/2;
		}
	} else {
		if (VCOMODdest==false) {
			lfoPitch=Math.pow(2,LFOout*VCOMODamount);
		} else {
			pwm = (LFOout*VCOMODamount+1)/2;
		}
	}

	// Note
	 if (NoteOutValue<NoteValue) { NoteOutValue+=1/(NOTEglide*(1*fs-1)+1); if (NoteOutValue>NoteValue) NoteOutValue=NoteValue; }
	 else if (NoteOutValue>NoteValue) { NoteOutValue-=1/(NOTEglide*(1*fs-1)+1); if (NoteOutValue<NoteValue) NoteOutValue=NoteValue; }
	var notePitch = Math.pow(2,NoteOutValue);
	

	// VCO
	VCOphase+=(VCOfreq*notePitch*lfoPitch)/fs;

	while(VCOphase<0) VCOphase+=1;
	while(VCOphase>=1) VCOphase-=1;
	
	if (VCOwave==false)
		VCOout = saw(VCOfreq,VCOphase);
	else
		VCOout = pulse(VCOfreq,VCOphase,pwm);
		
	
		
	//VCFMOD
	var cutoffPitch = 1;
	var cutoffPitchSign= 1;
	if (VCFMODpolarity==false) cutoffPitchSign=-1;
	if (VCFMODsource==false) {
		cutoffPitch=Math.pow(2,LFOout*VCFMODamount*4*cutoffPitchSign);
	} else {
		cutoffPitch=Math.pow(2,ENVELOPEvalue*VCFMODamount*4*cutoffPitchSign);
	}
	VCFUpdateCutoff(VCFcutoff*cutoffPitch);
	
	if (VCOout>1) VCOout=1;
	if (VCOout<-1) VCOout=-1;
	
	//VCF - http://musicdsp.org/showArchiveComment.php?ArchiveID=24
	var input = VCOout;
	var x = input - VCFr*VCFy4;

	//Four cascaded onepole filters (bilinear transform)
	VCFy1=x*VCFp + VCFoldx*VCFp - VCFk*VCFy1;
	VCFy2=VCFy1*VCFp+VCFoldy1*VCFp - VCFk*VCFy2;
	VCFy3=VCFy2*VCFp+VCFoldy2*VCFp - VCFk*VCFy3;
	VCFy4=VCFy3*VCFp+VCFoldy3*VCFp - VCFk*VCFy4;

	//Clipper band limited sigmoid
	VCFy4 -= (VCFy4*VCFy4*VCFy4)/6;

	VCFoldx = x;
	VCFoldy1 = VCFy1;
	VCFoldy2 = VCFy2;
	VCFoldy3 = VCFy3;
	
	if (VCFy4<-1) VCFy4=-1;
	if (VCFy4>1) VCFy4=1;
	
	var out = VCFy4;

	// VCA
	if (VCAmode==true) return out;
	return out*ENVELOPEvalue;
}




var bufferSize = 1024;
var myPCMProcessingNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
myPCMProcessingNode.onaudioprocess = function(e) {
  var output = e.outputBuffer.getChannelData(0);
  for (var i = 0; i < bufferSize; i++) {
     // Generate and copy over PCM samples.
     output[i] = getAudio();
  }
}
myPCMProcessingNode.connect(audioContext.destination);

