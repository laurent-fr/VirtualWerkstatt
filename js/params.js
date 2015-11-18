"use strict";

// JSON.stringify(synth.params)

var paramList = {

default: {
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
		
	},

vibe: {"vco-freq":261.5,"vco-pwm":0.4994537488992188,"vco-wave":false,"vco-mod-source":false,"vco-mod-amount":0,"vco-mod-dest":false,"lfo-rate":9.49284687695719,"lfo-wave":false,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":1625.0496091627883,"vcf-res":0,"vcf-tracking":false,"vcf-mod-source":false,"vcf-mod-amount":0.8549655474790845,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.014516471342580781,"envelope-decay":0.3,"note-glide":0},
bass: {"vco-freq":130.6,"vco-pwm":0.4954934775599101,"vco-wave":false,"vco-mod-source":false,"vco-mod-amount":0.7347313133514639,"vco-mod-dest":false,"lfo-rate":70.61926041318094,"lfo-wave":true,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":4400.337517913117,"vcf-res":0.5020731460001541,"vcf-tracking":false,"vcf-mod-source":true,"vcf-mod-amount":0.5019694939376744,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.012165527107608551,"envelope-decay":0.3,"note-glide":0},
banjo: {"vco-freq":261.2,"vco-pwm":0.799294707161664,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0,"vco-mod-dest":false,"lfo-rate":5.3715573569540975,"lfo-wave":false,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":4498.972688605089,"vcf-res":0.000003875262501283515,"vcf-tracking":false,"vcf-mod-source":true,"vcf-mod-amount":0.6800745795997274,"vcf-mod-polarity":true,"envelope-sustain":false,"envelope-attack":0,"envelope-decay":0.253368223509316,"note-glide":0},
flute: {"vco-freq":522.8,"vco-pwm":0.5031764779081481,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.014516471342580781,"vco-mod-dest":false,"lfo-rate":4.264779863635,"lfo-wave":false,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":579.5571596310255,"vcf-res":0.5022724744691002,"vcf-tracking":true,"vcf-mod-source":false,"vcf-mod-amount":0,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.26122085341803963,"envelope-decay":0.3,"note-glide":0},
strings: {"vco-freq":261.2,"vco-pwm":0.5620040873053139,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.8900383788252882,"vco-mod-dest":true,"lfo-rate":65.29930856385357,"lfo-wave":false,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":8115.224220463721,"vcf-res":0.2506956309119518,"vcf-tracking":false,"vcf-mod-source":true,"vcf-mod-amount":0.5224260829080967,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.029468643393506067,"envelope-decay":0.3,"note-glide":0},
vibrato: {"vco-freq":261.5,"vco-pwm":0.37,"vco-wave":true,"vco-mod-source":true,"vco-mod-amount":0.53,"vco-mod-dest":true,"lfo-rate":6.189,"lfo-wave":false,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":14271,"vcf-res":0.34,"vcf-tracking":true,"vcf-mod-source":false,"vcf-mod-amount":0.67,"vcf-mod-polarity":true,"envelope-sustain":false,"envelope-attack":0.62,"envelope-decay":0.92,"note-glide":0.32},
drum: {"vco-freq":32.67,"vco-pwm":0.5,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.49722487132001175,"vco-mod-dest":true,"lfo-rate":0.476689918361447,"lfo-wave":false,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":226.30956271578353,"vcf-res":0.5062012658555534,"vcf-tracking":false,"vcf-mod-source":false,"vcf-mod-amount":0,"vcf-mod-polarity":true,"envelope-sustain":false,"envelope-attack":0.009916662881404349,"envelope-decay":0.2260296883330765,"note-glide":0},
chiptune: {"vco-freq":261.5,"vco-pwm":0.4994964246232889,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":1,"vco-mod-dest":false,"lfo-rate":14.980997066736913,"lfo-wave":true,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":20000,"vcf-res":0.00014866352003511403,"vcf-tracking":true,"vcf-mod-source":false,"vcf-mod-amount":0.00012967021412278826,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0,"envelope-decay":0.3,"note-glide":0},
wind1: {"vco-freq":521.9,"vco-pwm":0.7595302786357822,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.8244260843598312,"vco-mod-dest":true,"lfo-rate":260.64811165705703,"lfo-wave":true,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":3547.6772767111092,"vcf-res":0.37348172931912876,"vcf-tracking":true,"vcf-mod-source":true,"vcf-mod-amount":0.11976543905165761,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.25023679222961875,"envelope-decay":0.3,"note-glide":0.1804625023530253},
echo1: {"vco-freq":261.4,"vco-pwm":0.5,"vco-wave":false,"vco-mod-source":false,"vco-mod-amount":1,"vco-mod-dest":false,"lfo-rate":10.710065419595033,"lfo-wave":true,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":3238.481280219147,"vcf-res":0.008650742596453292,"vcf-tracking":false,"vcf-mod-source":false,"vcf-mod-amount":0.8484102695314898,"vcf-mod-polarity":true,"envelope-sustain":false,"envelope-attack":0,"envelope-decay":0.3,"note-glide":0},
echo2: {"vco-freq":87.22,"vco-pwm":0.56,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.35,"vco-mod-dest":true,"lfo-rate":266.9,"lfo-wave":false,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":1066,"vcf-res":0.39,"vcf-tracking":false,"vcf-mod-source":true,"vcf-mod-amount":0.69,"vcf-mod-polarity":true,"envelope-sustain":false,"envelope-attack":0.17,"envelope-decay":0.39,"note-glide":0},
echo3: {"vco-freq":65.39,"vco-pwm":0.65,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.58,"vco-mod-dest":false,"lfo-rate":4.1,"lfo-wave":true,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":19622,"vcf-res":0.11,"vcf-tracking":false,"vcf-mod-source":true,"vcf-mod-amount":0.53,"vcf-mod-polarity":false,"envelope-sustain":false,"envelope-attack":0.38,"envelope-decay":0.36,"note-glide":0},
echo4: {"vco-freq":65.39,"vco-pwm":0.22,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.56,"vco-mod-dest":false,"lfo-rate":6.787,"lfo-wave":true,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":358.4667399973341,"vcf-res":0.4605967139252082,"vcf-tracking":true,"vcf-mod-source":false,"vcf-mod-amount":0.27,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.44,"envelope-decay":0.41,"note-glide":0.37},
leadsynth1: {"vco-freq":261.1,"vco-pwm":0.5,"vco-wave":false,"vco-mod-source":false,"vco-mod-amount":0,"vco-mod-dest":false,"lfo-rate":0.502,"lfo-wave":false,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":1170.4577537207103,"vcf-res":0,"vcf-tracking":true,"vcf-mod-source":true,"vcf-mod-amount":0.7072965059601483,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0,"envelope-decay":0.3,"note-glide":0},
leadsynth2: {"vco-freq":261.1,"vco-pwm":0.4993919094274362,"vco-wave":false,"vco-mod-source":false,"vco-mod-amount":0.07875624316706048,"vco-mod-dest":false,"lfo-rate":5.279595578096385,"lfo-wave":false,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":2088.5805347693763,"vcf-res":0.32479144717157027,"vcf-tracking":true,"vcf-mod-source":true,"vcf-mod-amount":0.7529690587028455,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0,"envelope-decay":0.3,"note-glide":0},
leadsynth3: {"vco-freq":87.22,"vco-pwm":0.04,"vco-wave":false,"vco-mod-source":true,"vco-mod-amount":0.12,"vco-mod-dest":true,"lfo-rate":132.8,"lfo-wave":false,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":14210,"vcf-res":0.61,"vcf-tracking":false,"vcf-mod-source":false,"vcf-mod-amount":0.87,"vcf-mod-polarity":false,"envelope-sustain":false,"envelope-attack":0.92,"envelope-decay":0.77,"note-glide":0},
leadsynth4: {"vco-freq":130.8,"vco-pwm":0.42,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.64,"vco-mod-dest":false,"lfo-rate":210.4,"lfo-wave":true,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":6558,"vcf-res":0.6314698645696015,"vcf-tracking":false,"vcf-mod-source":true,"vcf-mod-amount":0.11605433636432823,"vcf-mod-polarity":true,"envelope-sustain":false,"envelope-attack":0.62,"envelope-decay":0.57,"note-glide":0.38},
wobble: {"vco-freq":261.5,"vco-pwm":0.86,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0,"vco-mod-dest":false,"lfo-rate":14.723138466132685,"lfo-wave":false,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":1366.1888515007706,"vcf-res":0.315241690119295,"vcf-tracking":false,"vcf-mod-source":false,"vcf-mod-amount":0.24530296469950572,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.09666818538543069,"envelope-decay":1,"note-glide":0},
basswind: {"vco-freq":65.36,"vco-pwm":0.5,"vco-wave":false,"vco-mod-source":false,"vco-mod-amount":0,"vco-mod-dest":false,"lfo-rate":0.2693559184324981,"lfo-wave":false,"lfo-tracking":false,"vca-mode":false,"vcf-cutoff":721.0793160381286,"vcf-res":0.3535770465855912,"vcf-tracking":false,"vcf-mod-source":false,"vcf-mod-amount":0.3417292979355188,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.13586985872036206,"envelope-decay":0.24403134244352956,"note-glide":0},
basswow: {"vco-freq":65.32,"vco-pwm":0.8519419209383122,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.18959813308169338,"vco-mod-dest":true,"lfo-rate":57.43851125823884,"lfo-wave":true,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":230.93141370891044,"vcf-res":0.7568127051950606,"vcf-tracking":true,"vcf-mod-source":true,"vcf-mod-amount":0.2708644863531836,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.060710805890373025,"envelope-decay":0.4924551097369536,"note-glide":0},
theremin: {"vco-freq":1043,"vco-pwm":0.9701200998907686,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.017726772710568207,"vco-mod-dest":false,"lfo-rate":4.980092245601176,"lfo-wave":false,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":7083.725976457737,"vcf-res":0,"vcf-tracking":true,"vcf-mod-source":true,"vcf-mod-amount":0.36311814706299633,"vcf-mod-polarity":false,"envelope-sustain":true,"envelope-attack":0.19013055517331895,"envelope-decay":0.4924551097369536,"note-glide":0.5089479162537508},
organ1: {"vco-freq":87.22,"vco-pwm":0.31,"vco-wave":true,"vco-mod-source":true,"vco-mod-amount":0.1854679120410011,"vco-mod-dest":true,"lfo-rate":378.5,"lfo-wave":true,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":11201,"vcf-res":0.19,"vcf-tracking":false,"vcf-mod-source":false,"vcf-mod-amount":0.68,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.45,"envelope-decay":0.54,"note-glide":0.07},
organ2: {"vco-freq":261.5,"vco-pwm":0.73,"vco-wave":true,"vco-mod-source":false,"vco-mod-amount":0.514977265782026,"vco-mod-dest":true,"lfo-rate":366.7,"lfo-wave":true,"lfo-tracking":true,"vca-mode":false,"vcf-cutoff":522.7782564879674,"vcf-res":0.21551694109721248,"vcf-tracking":false,"vcf-mod-source":true,"vcf-mod-amount":0.9986378903279003,"vcf-mod-polarity":true,"envelope-sustain":true,"envelope-attack":0.14,"envelope-decay":0.18,"note-glide":0}
};