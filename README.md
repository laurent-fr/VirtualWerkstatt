# VirtualWerkstatt
A virtual Analog Synthesizer which tries to emulate a Moog Werkstatt-01 on a Web page !

Try it online here (warning, sound !) : http://laurent-fr.github.io/VirtualWerkstatt/

Have a look at the real thing here : http://www.moogmusic.com/products/semi-modular/werkstatt-01-moogfest-2014-kit

## Status :

new javascript code: better, cleaner !

## Building the sources :

### Prerequisites :

you will need nodejs 4 or 5 , then :

```
npm -g install grunt-cli
npm -g install bower
```

In the main folder, install js dependancies :

```
bower install
npm install
```

to build the software :

```
grunt
```

That's all ! You can launch dist/index.html on a recent Chrome or Firefox

## Using the synthesizer :

You can play notes by clicking on the virtual keyboard on the bottom on the screen, or by pressing the letters shown on the buttons.

  * VCO : generates a saw ( /|/|/|/ ) or a pulse ( _||_||_ ) signal (8hz-16khz), you can change the duty cycle of the pulse with the PWM knob. 
  FREQ is the frequency of the first note on the keyboard

  * VCO MOD : you can modulate the VCO signal either with the LFO or the Envelope Generator (EG), with an amount from 0 to 100 (1 octave or 100%pwm).
  DEST applies the modulation either to the pitch (FREQ) or the duty cycle of the pulse wavve (PWM)

  * LFO : generates a triangle ( /\/\/\ ) or a square ( _||_||_ ) signal (0.2hz-600hz).

  * VCF : low pass filter (24db/octave), cutoff from 0hz to 20khz, with resonnance (RES) at cutoff frequency  (0=none, 100=100%)

  * VCF MOD : modulates VCF CUTOFF with either LFO or EG

  * VCA : if MODE=EG, then the amplitude of the signal is controlled by the Envelope Generator (EG), else it is always 100%
  * ENVELOPE : if SUSTAIN=OFF, the amplitude will be attack/decay, else it will be attack/sustain/decay. Attack is the attack delay (key down, 0 to 1s), 
  Decay is the decay delay (key up, 0 to 2s)

  * GLIDE : delay note change
  
