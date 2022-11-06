var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

$( "#buttonpress" ).click(function() {
    alert( "YOU PRESSED ME" );
  });