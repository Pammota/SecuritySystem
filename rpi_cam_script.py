# Web streaming example
# Source code from the official PiCamera package
# http://picamera.readthedocs.io/en/latest/recipes2.html#web-streaming
# Test

import io
import picamera
import logging
import socketserver
from tendo import singleton
from threading import Condition
from http import server

me = singleton.SingleInstance()

PAGE="""\
<html>
<head>
<link rel="stylesheet" type="text/css" href="style.css">
<style>
@import url('https://fonts.googleapis.com/css?family=Arima+Madurai:300');
 *, *::before, *::after {
	 box-sizing: border-box;
}
 h1 {
	 font-family: 'Arima Madurai', cursive;
	 color: black;
	 font-size: 4rem;
	 letter-spacing: -3px;
	 text-shadow: 0px 1px 1px rgba(255, 255, 255, 0.6);
	 position: relative;
	 z-index: 3;
       	transition: all 3s;
}
 .container {
	 z-index: 1;
	 position: relative;
	 overflow: hidden;
	 display: flex;
	 align-items: center;
	 justify-content: center;
	 min-height: 35rem;
	 background-image: linear-gradient(to bottom, rgba(255, 168, 76, 0.6) 0%, rgba(255, 123, 13, 0.6) 100%), url('https://images.unsplash.com/photo-1446824505046-e43605ffb17f');
	 background-blend-mode: soft-light;
	 background-size: cover;
	 background-position: center center;
	 padding: 2rem;
}
 .bird {
	 background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells-new.svg);
	 background-size: auto 100%;
	 width: 88px;
	 height: 125px;
	 will-change: background-position;
	 animation-name: fly-cycle;
	 animation-timing-function: steps(10);
	 animation-iteration-count: infinite;
}
 .bird--one {
	 animation-duration: 1s;
	 animation-delay: -0.5s;
}
 .bird--two {
	 animation-duration: 0.9s;
	 animation-delay: -0.75s;
}
 .bird--three {
	 animation-duration: 1.25s;
	 animation-delay: -0.25s;
}
 .bird--four {
	 animation-duration: 1.1s;
	 animation-delay: -0.5s;
}
 .bird-container {
	 position: absolute;
	 top: 20%;
	 left: -10%;
	 transform: scale(0) translateX(-10vw);
	 will-change: transform;
	 animation-name: fly-right-one;
	 animation-timing-function: linear;
	 animation-iteration-count: infinite;
}
 .bird-container--one {
	 animation-duration: 15s;
	 animation-delay: 0;
}
 .bird-container--two {
	 animation-duration: 16s;
	 animation-delay: 1s;
}
 .bird-container--three {
	 animation-duration: 14.6s;
	 animation-delay: 9.5s;
}
 .bird-container--four {
	 animation-duration: 16s;
	 animation-delay: 10.25s;
}
 @keyframes fly-cycle {
	 100% {
		 background-position: -900px 0;
	}
}
 @keyframes fly-right-one {
	 0% {
		 transform: scale(0.3) translateX(-10vw);
	}
	 10% {
		 transform: translateY(2vh) translateX(10vw) scale(0.4);
	}
	 20% {
		 transform: translateY(0vh) translateX(30vw) scale(0.5);
	}
	 30% {
		 transform: translateY(4vh) translateX(50vw) scale(0.6);
	}
	 40% {
		 transform: translateY(2vh) translateX(70vw) scale(0.6);
	}
	 50% {
		 transform: translateY(0vh) translateX(90vw) scale(0.6);
	}
	 60% {
		 transform: translateY(0vh) translateX(110vw) scale(0.6);
	}
	 100% {
		 transform: translateY(0vh) translateX(110vw) scale(0.6);
	}
}
 @keyframes fly-right-two {
	 0% {
		 transform: translateY(-2vh) translateX(-10vw) scale(0.5);
	}
	 10% {
		 transform: translateY(0vh) translateX(10vw) scale(0.4);
	}
	 20% {
		 transform: translateY(-4vh) translateX(30vw) scale(0.6);
	}
	 30% {
		 transform: translateY(1vh) translateX(50vw) scale(0.45);
	}
	 40% {
		 transform: translateY(-2.5vh) translateX(70vw) scale(0.5);
	}
	 50% {
		 transform: translateY(0vh) translateX(90vw) scale(0.45);
	}
	 51% {
		 transform: translateY(0vh) translateX(110vw) scale(0.45);
	}
	 100% {
		 transform: translateY(0vh) translateX(110vw) scale(0.45);
	}
}

.cont2{
	display:grid;
	text-align:center;
	justify-content:center;
	align-items:center;
	grid-template-columns:1fr;
	grid-template-rows:min-content 1fr min-content 1fr;
	z-index:3;
}

body{
	margin:0;
	border:0;
	padding:0;
}

img{
	background-color: #c49e35;
	padding:10px 10px;
	box-shadow: rgba(0, 0, 0, 0.70) 0px 5px 15px;
	transition: all 3s;
}

img:hover{
	width:960px;
	height:720;
	box-shadow: rgba(0,0,0,0.95) 0px 10px 20px;
}

h1:hover{
	transform: scale(1.2);
}

</style>

<title>Bird Camera</title>
</head>
<body>
<!-- bird code -->

<div class="container">
	
	<div class = "cont2">
	<h1 id="titleofsite">Bird Camera</h1>
	<img src="stream.mjpg" width="640" height="480">
	</div>

	
	<div class="bird-container bird-container--one">
		<div class="bird bird--one"></div>
	</div>
	
	<div class="bird-container bird-container--two">
		<div class="bird bird--two"></div>
	</div>
	
	<div class="bird-container bird-container--three">
		<div class="bird bird--three"></div>
	</div>
	
	<div class="bird-container bird-container--four">
		<div class="bird bird--four"></div>
	</div>
	
</div>


<!-- bird code -->

</body>
</html>
"""

class StreamingOutput(object):
    def __init__(self):
        self.frame = None
        self.buffer = io.BytesIO()
        self.condition = Condition()

    def write(self, buf):
        if buf.startswith(b'\xff\xd8'):
            # New frame, copy the existing buffer's content and notify all
            # clients it's available
            self.buffer.truncate()
            with self.condition:
                self.frame = self.buffer.getvalue()
                self.condition.notify_all()
            self.buffer.seek(0)
        return self.buffer.write(buf)

class StreamingHandler(server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(301)
            self.send_header('Location', '/index.html')
            self.end_headers()
        elif self.path == '/index.html':
            content = PAGE.encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.send_header('Content-Length', len(content))
            self.end_headers()
            self.wfile.write(content)
        elif self.path == '/stream.mjpg':
            self.send_response(200)
            self.send_header('Age', 0)
            self.send_header('Cache-Control', 'no-cache, private')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME')
            self.end_headers()
            try:
                while True:
                    with output.condition:
                        output.condition.wait()
                        frame = output.frame
                    self.wfile.write(b'--FRAME\r\n')
                    self.send_header('Content-Type', 'image/jpeg')
                    self.send_header('Content-Length', len(frame))
                    self.end_headers()
                    self.wfile.write(frame)
                    self.wfile.write(b'\r\n')
            except Exception as e:
                logging.warning(
                    'Removed streaming client %s: %s',
                    self.client_address, str(e))
        else:
            self.send_error(404)
            self.end_headers()

class StreamingServer(socketserver.ThreadingMixIn, server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

with picamera.PiCamera(resolution='640x480', framerate=24) as camera:
    output = StreamingOutput()
    #Uncomment the next line to change your Pi's Camera rotation (in degrees)
    camera.rotation = 90
    camera.start_recording(output, format='mjpeg')
    try:
        address = ('', 8000)
        server = StreamingServer(address, StreamingHandler)
        server.serve_forever()
    finally:
        camera.stop_recording()
#640x480, 1280x960
