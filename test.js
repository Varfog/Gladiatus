//window.onload = loadPage;
Array.prototype.isOf = function (obj) {
	for(var i = 0; i < this.length; i ++) {
		if (this[i] == obj) return true;
	}
	return false;
}
String.prototype.isOf = function (obj) {return (this.indexOf(obj) != -1) ? true : false}
Element.prototype.isDisplay = function() {return (this.style.display == 'none') ? false : true}
document.querySelector('.column-right').addEventListener("DOMNodeInserted", function (event) {
    if(event.target.className == 'column-right-topbg') loadPage()
}, false);
loadPage()

function loadPage(){
	var loc = window.location.pathname.split('/').filter(Boolean);
	if(document.querySelector('[class="plus-icon"]').isDisplay()) showHPAlert();
/*
	var _Alert = document.querySelectorAll('#alert-text')
	if(_Alert.length){
		for(i of _Alert){
			if(i.innerText == 'Вы слишком слабы для нападения. Наберитесь сначала сил.'){
				showHPAlert();
				location.reload();
				break;
			}
		}
	}
	*/
	if (loc.isOf("neftlenin") || (loc.isOf("neftlenin") && loc.isOf("from_battle"))) neftlenin()
	else if (loc.isOf("alley") && loc.isOf("fight")) fightForward()
	else if (loc.isOf("alley")) console.log('Алея'); //document.querySelector('.button-big .btn .f3').click();
	else if (loc.isOf("fight")) FightGroup()
	else if (loc.isOf("metro")) Metro()
	else if (loc.isOf("shop") && loc.isOf("pharmacy")) shop()
	else if (loc.isOf("casino")) console.log('Казино');
	else if (loc.isOf("huntclub") && loc.isOf("wanted")) wanted()
	else if (loc.isOf("arbat")) automobile()
	else if (loc.isOf("player")) player();
		
	if(Object.keys(m.stats).length){
		localStorage['PlayerStats'] = JSON.stringify({
			health : m.stats.health.obj[0].innerText,
			strength : m.stats.strength.obj[0].innerText,
			dexterity : m.stats.dexterity.obj[0].innerText,
			resistance : m.stats.resistance.obj[0].innerText,
			intuition : m.stats.intuition.obj[0].innerText,
			attention : m.stats.attention.obj[0].innerText
		})
	}
	function player(){
		if(curTime() - localStorage['lastMetro'] > 60 * 20 && !loc.isOf("metro")){
			location.href = '/metro/'
			return;
		}else{
			/*location.href = '/alley/search/type/'
			alert('fightForward')*/
		}
	}
	function automobile(){
		if(localStorage['buypetrol'] == 2){
			$.post("/automobile/buypetrol/742627/ajax/", {}, function(response) {
				if (response.result == "OK") {
					alert(response)
					localStorage['buypetrol'] = 5
				}
			}, 'json');
			location.reload();
		}else if(document.querySelector('[onclick^="buyPetrol"]')){
			document.querySelector('[onclick^="buyPetrol"]').click()
			console.log(document.querySelector('[onclick^="buyPetrol"]'))
			location.href = '/arbat/'
		}else if(document.querySelector('.ride-time') != null){
			document.querySelector('.ride-button').click();
			localStorage['buypetrol'] = (localStorage['buypetrol'] - 1)
			console.log('ride-button', localStorage['buypetrol'])
		}else{
			document.querySelector('.auto-bombila #cooldown').getAttribute('endtime') - curTime()
		}
	}
	function wanted(){
		for(el of document.querySelectorAll('.name .user')){
			id = el.innerHTML.match(/\/player\/(\d+)\//)[1];
			el.insertAdjacentHTML('beforebegin', '<div class="button"><a class="f" href="javascript:" onclick="getParams('+id+', this.parentNode.parentNode); return false;"><i class="rl"></i><i class="bl"></i><i class="brc"></i><div class="c">GET</div></a></div>');
		}
		for(i of document.querySelectorAll('.action .wait')){i.parentNode.parentNode.remove();}
	}
	function shop(){
		key = document.querySelector('#mikstura .f').getAttribute('onclick').match(/params:\['(.+?)'/)[1];
		countBuy = Math.floor(m.player.wallet.money / 100);
		if(countBuy > 0) m.mall.buy(key,"51","/shop/section/pharmacy/",countBuy,"","Микстура");
	}
	function Fight(){
		fightForward()
	}
	function FightGroup(){
		var MW = {
			hp_1 : document.querySelector('[rel="Новогодняя карамель"]'),
			green_1 : document.querySelector('[rel="Граната «Светлячок»"]'),
			green_2 : document.querySelector('[rel="Граната «Поразительная»"]'),
			green_3 : document.querySelector('[rel="Граната «Дух»"]'),
			group_2 : document.querySelector('.group2'),
			attack : document.querySelector('[onclick="groupFightMakeStep();return false;"]')
		}
		//if(MW.group_2.innerText.isOf('Коммунистов') || MW.group_2.innerText.isOf('Крысомах') || MW.group_2.innerText.isOf('Понаехавшие') ){
			/*
			var hp = document.querySelector('.me .fighter_hp')
			if(hp != null){
				hp = hp.innerText.split('/');
				valueHP = (hp[0].replace(/[^0-9]/g, '') / hp[1].replace(/[^0-9]/g, '') * 100)
				if(valueHP <= 20){
					if(MW.hp_1) MW.hp_1.click();
					console.info('valueHP', valueHP)
				}else{
					//var enemyCount = document.querySelectorAll('.list-users--right > li.alive').length;
					if(MW.group_2.innerText.match(/(\d+)/g)[0] >= 2){
						console.info('enemyCount', MW.group_2.innerText.match(/(\d+)/g)[0])
						if(MW.green_1) MW.green_1.click();
						else if(MW.green_2) MW.green_2.click();
						else if(MW.green_3) MW.green_3.click();
					}
				}
				if(MW.attack) MW.attack.click();
			}
			*/
			console.log(MW.green_1)
		//}
	}
	function Metro(){
		if(document.querySelector('[onclick="metroFightRat();"]')){
			metroFightRat();
			localStorage['lastMetro'] = Math.round(new Date().getTime()/1000);
		}else if(document.querySelector('#welcome-no-rat') != null){
			if(document.querySelector('#welcome-no-rat').isDisplay() && document.querySelector('#action-rat-fight').isDisplay()) metroTrackRat();
		}
	}
	function neftlenin(){
		document.querySelector('.welcome').insertAdjacentHTML('beforebegin', '<div class="button"><a class="f" href="javascript:" onclick="postUrl(\'/neftlenin/\', {action: \'selectType\', type : \'usual\'}, \'post\', 1); return false;"><i class="rl"></i><i class="bl"></i><i class="brc"></i><div class="c">Обычный</div></a></div><div class="button"><a class="f" href="javascript:" onclick="postUrl(\'/neftlenin/\', {action: \'selectType\', type : \'hard\'}, \'post\', 1); return false;"><i class="rl"></i><i class="bl"></i><i class="brc"></i><div class="c">Темный</div></a></div>');
	}
	/*
	//(loc != "/alley/" && loc.split('/').indexOf('fight') != '-1' && (Math.round(new Date().getTime()/1000) - localStorage['lastFight']) > 60 * 5) ? ToLocation(0, 0, '/alley/') : console.log('wait fight');
	switch (loc) {
		case "/alley1/":
			if(document.querySelector('p.time').innerHTML == "Запись на бои  началась.") break;
			if(document.querySelector('#alley-patrol-button')){
				document.querySelector('#regions-choose-id').value = 18;
				document.querySelector('form.patrol select[name="time"]').value = 40;
				document.querySelector('#alley-patrol-button .f').click();
				break;
			}
			var time = document.querySelector('#alley-search-myself span.timer').getAttribute('timer');
			if(time > 0){ToLocation(time * 1000, time * 1000, '/alley/');break;}
			document.querySelector('.f1 > .f').click();
			break;
		case "/alley/search/again/":
		case "/alley/search/type/":
			if(!document.querySelector('.fight-log')){
				lvl = document.querySelector('.fighter2 .level').innerText.match(/(\d+)/)[0];
				if(lvl > 13 && lvl < 17 && document.querySelector('.fighter2 .resident')){
					sleep(random(1000, 3000));
					document.querySelector('.button-fight > a').onclick();
					localStorage['lastFight'] = Math.round(new Date().getTime()/1000);
					ToLocation(1000, 3000, '/alley/');
				}else{
					setTimeout(function(){document.querySelector('.button-search > a').onclick();}, 1000);
				}
			}else{
			}
			break;
		case "/factory/":
			btn = document.querySelector('.factory-nanoptric .button .f .c');
			if(btn) btn.click();
			break;
		case "/shaurburgers/":
			if(!document.querySelector('.shaurburgers-work select')) break;
			document.querySelector('.shaurburgers-work select').value = 2;
			document.querySelector('#shaurma-btn .f .c').click();
			break;
		case "/casino/blackjack/":
			setInterval(casino, 750);
			break;
		case "/neftlenin/":
			document.querySelector('.welcome').insertAdjacentHTML('beforebegin', '<div class="button"><a class="f" href="javascript:" onclick="postUrl(\'/neftlenin/\', {action: \'selectType\', type : \'usual\'}, \'post\', 1); return false;"><i class="rl"></i><i class="bl"></i><i class="brc"></i><div class="c">Обычный</div></a></div><div class="button"><a class="f" href="javascript:" onclick="postUrl(\'/neftlenin/\', {action: \'selectType\', type : \'hard\'}, \'post\', 1); return false;"><i class="rl"></i><i class="bl"></i><i class="brc"></i><div class="c">Темный</div></a></div>');
			break;
		case "/huntclub/wanted/":
			for(el of document.querySelectorAll('.name .user')){
				id = el.innerHTML.match(/\/player\/(\d+)\//)[1];
				el.insertAdjacentHTML('beforebegin', '<div class="button"><a class="f" href="javascript:" onclick="getParams('+id+', this.parentNode.parentNode); return false;"><i class="rl"></i><i class="bl"></i><i class="brc"></i><div class="c">GET</div></a></div>');
			}
			for(i of document.querySelectorAll('.action .wait')){i.parentNode.parentNode.remove();}
			break;
		case "/shop/section/pharmacy/":
				key = document.querySelector('#mikstura .f').getAttribute('onclick').match(/params:\['(.+?)'/)[1];
				countBuy = Math.floor(m.player.wallet.money / 100);
				if(countBuy > 0) m.mall.buy(key,"51","/shop/section/pharmacy/",countBuy,"","Микстура");
			break;
	  default:
		//console.log( this );
	}
	*/
	/*
	if (loc == "/alley/"){
		if(document.querySelector('#alley-patrol-button')){
			document.querySelector('#regions-choose-id').value = 18;
			document.querySelector('form.patrol select[name="time"]').value = 40;
			document.querySelector('#alley-patrol-button .f').click();
		}
		var time = document.querySelector('#alley-search-myself span.timer').getAttribute('timer');
		if(time > 0){
			ToLocation(time * 1000, time * 1000, '/alley/');
		}else{
			document.querySelector('.f1 > .f').click();
		}
	}else if (loc == "/alley/search/again/" || loc == "/alley/search/type/"){
		if(!document.querySelector('.fight-log')){
			level = document.querySelector('.fighter2 > .user > .level').innerHTML.replace(/[^0-9\.]/g, "");
			(level > 14 && level < 17) ? Attack__alley() : document.querySelector('.button-search > .f').click();
		}else{
			ToLocation(1000, 3000, '/alley/');
		}
	}else if (loc == "/factory/"){
		(document.querySelector('.factory-nanoptric')) ? document.querySelector('.factory-nanoptric .button > .f').click() : null;
	}else if (loc == "/factory/mf/"){
		itm = document.querySelectorAll('img[src="/@/images/obj/accessory7.png"]');
		for(i = 0;i < itm.length - 1;i++){
			if(itm[i].getAttribute('data-mf') < 8){
				itm[i].parentNode.querySelector('.action > span').click();
				break;
			}
		}
	}else if (loc == "/huntclub/wanted/"){
		var players = [...document.querySelectorAll('.list tr:not(:nth-child(-n+2))')]
			.filter(v => v.cells[4].firstElementChild.classList.contains('button'))
			.map(v => {
				return {name: v.cells[0].querySelector('a[href*="player"]').innerText,
						level: v.cells[0].querySelector('.level').innerText.replace(/\[(\d+)\]/, '$1'),
						button: v.cells[4].firstElementChild}
			});
		for(el of document.querySelectorAll('.name .user')){
			id = el.innerHTML.match(/href="\/player\/(\d+)\/"/)[1];
			el.insertAdjacentHTML('beforebegin', '<div class="button"><a class="f" href="javascript:" onclick="getParams('+id+', this.parentNode.parentNode); return false;"><i class="rl"></i><i class="bl"></i><i class="brc"></i><div class="c">GET</div></a></div>');
		}
	for(i of document.querySelectorAll('.action .wait')){i.parentNode.parentNode.remove();}
	}else if (loc == "/shaurburgers/"){
		document.querySelector('.shaurburgers-work select').value = 2;
		document.querySelector('#shaurma-btn .f .c').click();
	}else if (loc == "/thimble/"){
		setInterval(function(){
			keys = document.querySelectorAll('.icon.thimble-closed-active:not(.thimble-guessed):not(.thimble-empty)');
			if(keys.length != 6){
				num = random(0, keys.length);
				keys[num].click();
			}else{
				document.querySelector('.button.thimble-play[data-count="9"').click();
			}
		}, 500);
	}else{
		if(loc.match(/\/factory\/mf-item\/\d+\//g)){
			mfLVL = document.querySelector('.mf');
			if(mfLVL && document.querySelector('#alert-title') == null){
				msecond = Math.floor((Math.random() * 2000) + 1000);
				(mfLVL.innerHTML.replace(/[^0-9\.]/g, "") >= 8) ? ToLocation(1000, 1500, '/factory/mf/') : setTimeout(function(){document.querySelector('.f .c .ruda').click();}, msecond);
			}
		}
	}
	*/
}
function casino(){
	if(document.querySelector('.actions_row').classList.contains('ingame')){
		if(document.querySelector('#blackjack-split').style.display != "none") CasinoBlackJack.QueryAjaxSend('split');
		if(document.querySelector('#blackjack-double').style.display != "none") document.querySelector('#double');
		num = document.querySelector('.area.player .total span').innerText;
		(num > 15 && !document.querySelector('#blackjack-stand').classList.contains('disabled')) ? document.querySelector('#blackjack-stand').click() : document.querySelector('#blackjack-hit').click();
	}else{
		if(!document.querySelector('#blackjack-bet-1').classList.contains('disabled')) document.querySelector('#blackjack-bet-1').click();
	}
}
function getParams(id, el){
	console.log(el);
	var oReq = new XMLHttpRequest();
	oReq.onload = function() {
		var body = document.createElement("div");
		body.innerHTML = this.responseText;
		var player = JSON.parse(localStorage["PlayerStats"])
		el.insertAdjacentHTML('beforeend', '<p>ХП: ' + body.querySelector('.life #maxhp').innerText + '</p>');
		el.insertAdjacentHTML('beforeend', '<p>Здоровье: ' + (body.querySelector('[data-type="health"] .num').innerText < player.health) + '</p>');
		el.insertAdjacentHTML('beforeend', '<p>Сила: ' + (body.querySelector('[data-type="strength"] .num').innerText < player.strength) + '</p>');
		el.insertAdjacentHTML('beforeend', '<p>Ловкость: ' + (body.querySelector('[data-type="dexterity"] .num').innerText < player.dexterity) + '</p>');
		el.insertAdjacentHTML('beforeend', '<p>Выносливость: ' + (body.querySelector('[data-type="resistance"] .num').innerText < player.resistance) + '</p>');
		el.insertAdjacentHTML('beforeend', '<p>Хитрость: ' + (body.querySelector('[data-type="intuition"] .num').innerText < player.intuition) + '</p>');
		el.insertAdjacentHTML('beforeend', '<p>Внимательность: ' + (body.querySelector('[data-type="attention"] .num').innerText < player.attention) + '</p>');
	};
	oReq.open("get", "http://www.moswar.ru/player/" + id, true);
	oReq.send();
}
async function Attack__alley(){
    await sleep(random(1000, 3000));
	atk_btn = document.querySelector('.button.button-fight .c');
	(atk_btn) ? atk_btn.click() : null;
	localStorage['lastFight'] = Math.round(new Date().getTime()/1000);
	ToLocation(1000, 3000, '/alley/');
}

async function ToLocation(minWait, maxWait, loc = '/') {
    await sleep(random(minWait, maxWait));
    location.href = loc;
}
function curTime(){return Math.round(new Date().getTime() / 1000)}
function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
//function random(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}
//http://arhivach.org/storage/a/a0/aa018d280af3883bc448122921869522.webm