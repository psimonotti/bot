$(function() {
	$('#btnStart').click(start);
	$('#btnStep').click(step).hide();
	$('.shot').hide();
	$('.bot').hide();
	$('.radar').hide();
	
	var battle=null;
	var cfg={
		width: 100, //larghezza mappa
		height: 100, //altezza mappa
		shotRadius: 5, //raggio del colpo
		shotDamage: 5, //danno del colpo al centro 
		health: 20,
		radarRadiusBySpeed: [50,10,0], //raggio del radar in funzione della velocità
		moveIncrementBySpeed: [0,2,5] //capacità di spostamento in funzione della velocità
	};

		
	function start() {
		battle=new Battle(cfg, render)
		battle.addBot('bot1',$('#bot1_code').text());
		battle.addBot('bot2',$('#bot2_code').text());
		battle.start();
		$('#btnStart').hide();
		$('#btnStep').show();
		setTimeout(step,500);
	}
	
	function step() {
		$('.shot').hide();
		var now=new Date();
		var running=battle.step();
		var now2=new Date();
		if (!running) {
			$('#btnStart').show();
			$('#btnStep').hide();
		} else {
			setTimeout(step,500);
		}
		return running;
	}
	
	function render(name, type, x1, y1, x2, y2 ) {
		var options={ 
			duration: 500,
			easing: 'linear',
			queue: false
		}
		if (type=='move') {
			$('#'+name+'_bot')
				.show()
				//.css('left', X(x1))
				//.css('top', Y(y1))
				.animate({left: X(x2)},options)
				.animate({top: Y(y2)},options)
		} else if (type=='shot') {
			$('#'+name+'_shot')
				.show()
				.css('left', X(x1))
				.css('top', Y(y1))
				.animate({left: X(x2)},options)
				.animate({top: Y(y2)},options)
		} else if (type=='started') {

		} else if (type=='winner') {

		} else if (type=='tie') {

		} else if (type=='damage') {
		
		} else if (type=='radar') {
			$('#'+name+'_radar')
				.show()
				.animate({left: X(x1-x2)},options)
				.animate({top: Y(y1-x2)},options)
				.animate({width: W(x2*2)},options)
				.animate({height: H(x2*2)},options)
		}
		console.log(arguments);
	}
	
	
	function W(w) {
		var fx=$('#battleField').width()/cfg.width;
		return ''+(w*fx)+'px';
	}
	function H(h) {
		var fy=$('#battleField').height()/cfg.height;
		return ''+(h*fy)+'px';
	}
	function X(x) {
		var fx=$('#battleField').width()/cfg.width;
		var ox=$('#battleField').offset().left;
		return ''+(ox+x*fx)+'px';
	}
	function Y(y) {
		var fy=$('#battleField').height()/cfg.height;
		var oy=$('#battleField').offset().top;
		return ''+(oy+y*fy)+'px';
	}
});
