//play the Youtube video  fullScreen
$(function(){
  $('#video').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });

  $(window).resize(function(){
    $('#video').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
  });
});


let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video'); //create the youtube API
}

$('#mute').one('click', function(event) { //unMute and remove button
    player.unMute();
    $('#mute').remove();
});
