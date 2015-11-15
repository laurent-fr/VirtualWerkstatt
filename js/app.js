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


var bufferSize = 1024;

var synth=Synth.new();

var myPCMProcessingNode = audioContext.createScriptProcessor(bufferSize, 1, 1);

myPCMProcessingNode.onaudioprocess = function(e) {
  var output = e.outputBuffer.getChannelData(0);
  for (var i = 0; i < bufferSize; i++) {
     // Generate and copy over PCM samples.
     output[i] = synth.getAudio();
  }
}

myPCMProcessingNode.connect(audioContext.destination);

