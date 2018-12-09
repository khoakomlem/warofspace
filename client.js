// var socket=io();
var socket=io();
window.onload=function(){
	socket.emit('new');
}
$('#main').fadeOut(0);
function vao(){
	ok=true;
	if (vao_ed || $('#name').val()=='') return 0;
	vao_ed=true;
	weapon=$('#option2 option:selected').text();
	// alert(weapon);
	// setTimeout(function(){socket.emit('client',)},500);
	$('#a').fadeToggle(1000,'linear', function(){
		$('#main').fadeIn(1500, 'linear', function(){socket.emit('new player', $('#name').val());});
	});
}
window.onload = function(){
	$('#a').fadeIn(1000);
	$('#thongbao').slideToggle(1000);
	$('#replay').slideUp(1000);
}
