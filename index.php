<?php

$id = $_REQUEST['id'] ?? '';
$id = cleanString($id);

$mode = $_REQUEST['mode'] ?? '';
$mode = cleanString($mode);

// unique code for js loading
$v = rand(10, 99999);

$app = 'app';
if ($mode === 'test') {
  $app = 'test';
}

$html = "<!DOCTYPE html>
<html lang='en'>
  <head>
    <title>Onland</title>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0, interactive-widget=resizes-visual' />
    <link rel='manifest' href='manifest.json' />
    <meta name='msapplication-TileColor' content='#8ec39c' />
    <meta name='theme-color' content='#ffffff' />
    <link rel='stylesheet' href='layout.css?{$v}' />
    <script type='module' id='{$id}' src='src/{$app}.js?{$v}'></script>
  </head>

  <body>
    <div class='scrollable'>
      <div id='blurOverlay'></div>
      <div id='world' class='world'></div>
    </div>
    <div id='overlay'></div>

    <div id='msg1' class='msg'></div>
    <div id='msg2' class='msg'></div>
    <div id='msg3' class='msg'></div>
    <div id='joystick'></div>
    <div id='stick'></div>
    <div id='start'></div>
    <svg>
      <filter id='noise-filter'>
        <feTurbulence 
          type='fractalNoise' 
          baseFrequency='0.9' 
          numOctaves='5' 
          stitchTiles='stitch' />
<!--        <feColorMatrix
          type='matrix'
          values=\"0 0 0 0 0 0 0.2 0 0 0 0 0 0 0 0 0 0 0 0.1 0\" />
        <feBlend mode='multiply' in2='SourceGraphic' />  
-->      </filter>
    </svg>
  </body>
</html>";

print $html;


/**
 * @param {string} $str the string to be cleaned of special characters
 * @return {string} the cleaned string
 */
function cleanString($str)
{
  $str = preg_replace('/[^a-z0-9]/i', '', $str);

  return substr($str, 0, 15);
}