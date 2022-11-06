const play = () => {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-elevator-tone-2863.mp3');
    audio.play();
};

$( "#buttonpress" ).click(function() {
    play();
});