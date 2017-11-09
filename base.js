function init(){
	let loc = document.location.search;
	var NpcNumAttack = 0;
	switch(true){
		case loc.indexOf('packages') > -1:
			for(el of document.querySelectorAll('#inv div')){
				el.insertAdjacentHTML('beforeend', '<a href="javascript:this.parentNode.remove()" style="position: absolute;top: 0px;right: 5px;color: red;    text-decoration: none;">x</a>');
			}
		break;
		case loc.indexOf('location') > -1:
			if(document.querySelector('h2.section-header > span')) break;
			if(loc.indexOf('loc=4') > -1) NpcNumAttack=3;
			var npc = document.querySelectorAll('#expedition_list button[onclick*="attack"]');
			if(npc) npc[NpcNumAttack].click();
		break;
		case loc.indexOf('dungeon') > -1:
			var button = document.querySelector('img[onclick*="startFight"], div[onclick*="startFight"]');
			if(button){
				button.click();
			}else{
				if(document.querySelector('input[value="Искушенный"]')) document.querySelector('input[value="Искушенный"]').click();
			}
		break;
		case loc.indexOf('arena') > -1:
			if(document.querySelector('h2.section-header > span') || document.querySelector('[name="actionButton"]').disabled) return;
			var filterAttack = ['Alice_Cooper'];
			var players = [...document.querySelectorAll('section tbody > tr:not(:first-child)')]
				.filter(v => filterAttack.indexOf(v.cells[0].querySelector('a').innerText) == -1)
				.map(v => {
					return {name: v.cells[0].querySelector('a').innerText,
							level: v.cells[1].innerText,
							button: v.cells[3].firstElementChild}
				})
			players.sort((a, b) => ((a.level > b.level) ? true : false));
			if(players.length > 0) players[0].button.click();
		break;
		case loc.indexOf('auction') > -1:
			var Items = {}, inputs, paramsSearch = ['Урон', 'Сила%', 'Умение%', 'Ловкость%', 'Выносливость%', 'Харизма%', 'Интеллект%', 'Крит', 'Блок'];
			var searchUI = paramsSearch.map(function(i){return '<p><label>'+i+'</label><input type="text" name="search" value=""></p>';})
				searchUI.push('<tr><td colspan="2" style="text-align:center"><input type="button" value="Фильтр (Lite)" class="awesome-button"></td></tr>');
			document.getElementById('auction_table').insertAdjacentHTML('beforebegin', '<fieldset class="filter"><legend>Фильтр</legend>'+searchUI.join('')+'</fieldset>');
			document.querySelector('.filter input[type="button"]').onclick = function(){
				var numTrue = 0;
				for(var Item in Items){
					for(var i in paramsSearch){
						if(paramsSearch[i] in Items[Item] && (parseInt(Items[Item][paramsSearch[i]]) >= parseInt(inputs[i].value))){
							document.querySelector('[data-hash="'+Item+'"').parentNode.parentNode.parentNode.parentNode.style.opacity = 1;
							numTrue++;
							break;
						}else{
							document.querySelector('[data-hash="'+Item+'"').parentNode.parentNode.parentNode.parentNode.style.opacity = '0.2';
						}
					}
				}
				document.querySelector('.filter legend').innerText = 'Найдено ' + numTrue;
				return false;
			};
			inputs = document.getElementsByName('search');

			for(var el of document.querySelectorAll('[name=buyout]')){
				var isNext = el.nextSibling;
				while(isNext){
					isNext.remove();
					isNext = el.nextSibling;
				}
				el.remove();
			}
			for(var item of document.querySelectorAll('.auction_item_div [data-tooltip]')){
				Items[item.dataset.hash] = {};
				for(var param of JSON.parse(item.dataset.tooltip)[0]){
					if(typeof param[0] !== 'string') continue;
					if ((m = param[0].match(/(\W+) \+(.*)/i)) !== null) {
						if(m[2].indexOf('%') > -1){
							var p = m[2].match(/(\d+)?%/);
							Items[item.dataset.hash][m[1]+'%'] = p[1];
						}else{
							Items[item.dataset.hash][m[1]] = m[2];
						}
					}
				}
			}
		break;
	}
	if(document.getElementById('cooldown_bar_text_expedition').innerHTML == 'В Экспедицию'){
		//document.querySelector('#cooldown_bar_text_expedition + a').click();
		return null;
	}else if(document.getElementById('cooldown_bar_text_dungeon').innerHTML == 'В Подземелье'){
		//document.querySelector('#cooldown_bar_text_dungeon+ a').click();
		return null;
	}else if(document.getElementById('cooldown_bar_text_ct').innerHTML == 'Круг Турмы'){
		document.querySelector('#cooldown_bar_text_ct+ a').click();
		return null;
	/*
	}else if(document.getElementById('cooldown_bar_text_arena').innerHTML == 'На Арену'){
		document.querySelector('#cooldown_bar_text_arena+ a').click();
		return null;
	*/
	}
	console.log('init');
	setTimeout(init, 60000);
}
function wait(){
	if ( document.body !== undefined) {
		init();
	}else{
		setTimeout(wait, 250);
	}
}
function check_crafting(){
	var parser = new DOMParser();
	fetch('/game/index.php?mod=forge&submod=smeltery&sh=' + secureHash)
	.then(res => res.text())
	.then(res => {
		document = parser.parseFromString(res, "text/xml");
		var allSlot = document.querySelectorAll('#forge_nav .forge_closed').length;
		var craftSlot = document.querySelectorAll('#forge_nav .forge_crafting').length;
		console.log(`Плавильня - (${allSlot}) свободно, (${craftSlot}) ожидание`)
	})
}
function Item_sell_guild(id){
	jQuery.post(
		"/game/index.php?mod=guildMarket&sh="+secureHash,
		{
			sellid: id,
			preis: 1,
			dauer: 1,
			anbieten: "Предложить"
		},
		function(data){
			console.log(data);
		}
	);
}
wait();
