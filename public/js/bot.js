function Battle(cfg, render) {
	var me=this;
	var bots=[];
	var running=false;
	
	me.addBot=function(name, botCode) {
		try {
			bots.push(new Bot(bots.length, name, botCode));
		} catch (e) {
			console.log(e);
			render(name,'exception');
		}
	};
	
	me.start=function() {
		render(null,'started', bots.length);
		onBots(doInit);
		onBots(doMove);
		onBots(doRadar);
		running=true;
	}
	
	me.step=function() {
		if (running) {
			onBots(doCpu);
			onBots(doMove);
			onBots(doShot);
			onBots(doRadar);
			
			var alives=[];
			onBots(function(bot) {
				if (bot.health>0)
					alives.push(bot);
			});
			
			if (alives.length==1) {
				render(alives[0].name,'winner',alives[0].posX, alives[0].posY);
				running=false;
			} else if (alives.length==0) {
				render(null,'tie');
				running=false;
			}	
		}
		return running;
	};
	
	function onBots(action) {
		for(var i=0;i<bots.length;i++) {
			action(bots[i]);
		}
	}
	
	function doInit(bot) {
		bot.posAge=-1;
		bot.posX=Math.random()*cfg.width;
		bot.posY=Math.random()*cfg.width;
		bot.health=cfg.health;
		//Stop engine
		bot.driveX=-1;
		bot.driveY=-1;
		bot.driveSpeed=0;
	}
	
	function doShot( bot) {
		var dx,dy,d,k;
		if (bot.shotX>=0 && bot.shotX<=cfg.width && bot.shotY>=0 && bot.shotY<=cfg.height) {
			render(bot.name, 'shot', bot.__posX__, bot.__posY__, bot.shotX, bot.shotY);
			onBots(function(botD) {
				dx=botD.posX-bot.shotX;
				dy=botD.posY-bot.shotY;
				d=Math.sqrt(dx*dx+dy*dy);
				if (d<=cfg.shotRadius) {
					k=1.0-d/cfg.shotRadius;
					botD.health-=k*cfg.shotDamage;
					render(botD.name, 'damage', botD.shotX, botD.shotY, k*cfg.shotDamage, botD.health);
				}
			});					
		}
		bot.shotX=-1;
		bot.shotY=-1;
	}
	
	function doMove(bot) {
		var inc=cfg.moveIncrementBySpeed[bot.driveSpeed];
		var dx,dy,d,k;
		bot.__posX__=bot.posX;
		bot.__posY__=bot.posY;
		bot.__driveSpeed__=bot.driveSpeed;
		if (inc>0 && bot.driveX>=0 && bot.driveX<=cfg.width && bot.driveY>=0 && bot.driveY<=cfg.height) {
			dx=bot.driveX-bot.posX;
			dy=bot.driveY-bot.posY;
			d=Math.sqrt(dx*dx+dy*dy);
			if (d<=inc) {
				bot.posX=bot.driveX;
				bot.posY=bot.driveY;
				bot.posAge=0;
				//Stop engine
				bot.driveX=-1;
				bot.driveY=-1;
				bot.driveSpeed=0;
			} else {
				k=inc/d;
				bot.posX += k * dx;
				bot.posY += k * dy;
				bot.posAge=0;
			}
		} else {
			bot.posAge++;
		}
		render(bot.name, 'move', bot.__posX__, bot.__posY__, bot.posX, bot.posY);
	}
	
	function doCpu(bot) {
		try {
			bot.cpu();
		} catch(e) {
			console.log(e);
		}
	}
	
	function doRadar(bot) {
		var radarRadius=cfg.radarRadiusBySpeed[bot.__driveSpeed__];
		var nearest=findNearestBot(bot);
		if (nearest.distance<=radarRadius) {
			bot.radarX=nearest.bot.posX;
			bot.radarY=nearest.bot.posY;
			bot.radarAge=0;
		} else {
			bot.radarAge++;
		}
		render(bot.name, 'radar', bot.posX, bot.posY, radarRadius);
	}
	
	function findNearestBot(bot1) {
		var bot2=null,
			dx,
			dy,
			mind=cfg.width+cfg.height,
			minbot=null;
		
		for(var i=0;i<bots.length;i++) {
			bot2=bots[i];
			if (bot1!=bot2) {
				dx=bot1.posX-bot2.posX;
				dy=bot1.posY-bot2.posY;
				d=Math.sqrt(dx*dx+dy*dy);
				if (d<mind) {
					mind=d;
					minbot=bot2;
				}
			}
		}
		return {
			bot: minbot,
			distance: mind
		};
	}
	
	function Bot(index, name, sourceCode) {
		var cpu=null;
		var code='cpu = function() {\r\n' + sourceCode.replace(/[$]/g,'this.') + '\r\n}';
		var backupKeys=['index','name','radarX','radarY','radarAge','posX','posY','posAge','health'];
		var bot= {
			index: index,
			name: name,
			//Sensori ... R
			radarX:0,
			radarY:0,
			radarAge:0,
			posX:0,
			posY:0,
			posAge:0,
			health:cfg.health,
			//Attuatori .. RW
			driveX:-1,
			driveY:-1,
			driveSpeed:0,
			shotX:-1,
			shotY:-1
		};
		
		function drive(speed,x,y) {
			bot.driveX=(x==undefined?-1:x);
			bot.driveY=(y==undefined?-1:y);
			bot.driveSpeed=(speed==undefined?0:speed);
		}
		
		function shot(x,y) {
			bot.shotX=(x==undefined?-1:x);
			bot.shotY=(y==undefined?-1:y);
		}
		
		function rnd(from, to) {
			return Math.random()*(to-from)+from;
		}
		
		console.log(code);
		eval(code);


		bot.cpu=function() {
			//Backup readonly vars per evitare errori e bari
			var backup={};
			for(var i=0;i<backupKeys.length;i++) {
				backup[backupKeys[i]]=bot[backupKeys[i]];
			}
			cpu.call(bot);
			//Restore
			for(var i=0;i<backupKeys.length;i++) {
				bot[backupKeys[i]]=backup[backupKeys[i]];
			}
		}
		
		return bot;
	}
}