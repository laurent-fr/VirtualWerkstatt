

var out_file='table.js';

var table_size=4096;
var total_n=4000;
var freq_min=8;
var freq_max=16000;
var fs=44100;

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

function table(n,length) {


//var min=0;
//var max=0;
var out=[];
var amp=1.6;

  for(t=0;t<length;t++) {
	out[t]=0;
	for(i=1;i<=n;i ++) {
		out[t]+=(1/i)*Math.sin(i*t*2*Math.PI/length);
	}
	out[t]=-(amp/Math.PI)*out[t];
	if ((out[t]<-1)||(out[t]>1)||(isNaN(out[t]))) console.log('saw ERR !',t,out[t]);
  }
  
  return out;	
}

function table_triangle(n,length) {
var out=[];

var coef=8/(Math.PI*Math.PI);
  for(t=0;t<length;t++) {
	out[t]=0;
	var sign=1;
	for(i=1;i<=n;i+=2) {
		out[t]+=sign*(1/(i*i))*Math.sin(i*t*2*Math.PI/length);
		sign=-sign;
	}
	out[t]*=coef;
	if ((out[t]<-1)||(out[t]>1)||(isNaN(out[t]))) console.log('triangle ERR !',t,out[t]);
	
  }
  return out;	
}


function table_square(n,length) {

var out=[];
var coef=(4/Math.PI)*0.80;

  for(t=0;t<length;t++) {
	out[t]=0;
	for(i=1;i<=n;i+=2) {
		out[t]+=(1/i)*Math.sin(i*t*2*Math.PI/length);
	}
	out[t]*=coef;
	if ((out[t]<-1)||(out[t]>1)||(isNaN(out[t]))) console.log('square ERR !',t,out[t]);
  }
  return out;	

}

/*
var old_max_n=1;

for(f=freq_max;f>=freq_min;f--) {

	var max_n=Math.floor((fs/2)/f);

	if (max_n>total_n) continue;
	if (max_n==old_max_n) continue;

	old_max_n=max_n;

	console.log(f," ",max_n," ",Math.floor(fs/f));

}*/


function join_data(data,nb) {
	
	out="";
	for(var i=0;i<data.length;i++) {
		out+=data[i];
		if (i==(data.length-1)) break;
		out+=",";
		if (i%nb==0) out+="\n";
	}
	
	return out;
}



var js='var saw_table=[';
for(j=0;j<table_def.length;j++) {

	var data=table(table_def[j].n,table_def[j].l);
	js+='\n// table '+j+ ',fmin='+table_def[j].f+' n='+table_def[j].n+' length='+table_def[j].l+'\n';
	js+='[';
	js+= join_data(data,8);
	js+=']\n\n';
	
	if (j<(table_def.length-1)) js+=",";

}
js+='];\n\n';


data_square=table_square(30,4096);
js+='\nvar square_table=[';
js+=join_data(data_square,8);
js+=']\n\n';

data_triangle=table_triangle(30,4096);
js+='\nvar triangle_table=[';
js+=join_data(data_triangle,8);
js+=']\n\n';


var fs=require('fs');
fs.writeFileSync(out_file, js);



var plot='';
var data_plot=table(60,512);
for(i=0;i<data_plot.length;i++) { plot+=i+" "+data_plot[i]+ "\r\n";}
fs.writeFileSync('out.dat',plot);



//console.log(table(10,4096));
