import VideoContext from "../node_modules/videocontext/src/videocontext.js";
import ImageSequencePlayer from "./ImageSequencePlayer.js";

export default class Topophilia{
    constructor(canvas){
    	this.videocontext = new VideoContext(canvas);
        this._webcamSmoothingBuffer = []

    	let vc = this.videocontext;
    	//Fullscreen handler for canvas
    	canvas.onclick = function(){
    		if(canvas.webkitRequestFullScreen){
    			canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); //Chrome
    		}
    		if(canvas.mozRequestFullScreen){
				canvas.mozRequestFullScreen(); //Firefox
    		}
    	}

        //let testNode = vc.createVideoSourceNode("assets/wtf_frag.mp4", undefined, undefined, true);
        //this.testNode = testNode;
        //testNode.startAt(0);
        //testNode.stopAt(30);

        let bgNode = vc.createImageSourceNode("./assets/cat.jpg");
        bgNode.startAt(0);
        //bgNode.stopAt(100);

        bgNode.connect(vc.destination);
        //testNode.connect(vc.destination);


        let imageURLS = [];
        for (var i = 1; i < 50; i++) {
            let pad = "0000";
            let n = i.toString();
            let result = (pad+n).slice(-pad.length);
            imageURLS.push("./assets/cube/"+result+".png");
        }

        let imagePlayer = new ImageSequencePlayer(imageURLS, vc);
        this.imagePlayer = imagePlayer;
        imagePlayer.node.startAt(0);


        let videoPlayer = vc.createVideoSourceNode("./assets/clip.mp4", undefined, undefined, true);
        videoPlayer.startAt(0);


        let gsNode = vc.createEffectNode(VideoContext.DEFINITIONS.COLORTHRESHOLD);
        //gsNode.colorAlphaThreshold = [0,0.8,0];
        videoPlayer.connect(gsNode);
        let scaleNode1 = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_SCALE);
        let offsetNode1 = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_POSITION);
        gsNode.connect(scaleNode1);
        scaleNode1.scaleX = 0.6;
        scaleNode1.scaleY = 0.6;
        offsetNode1.positionOffsetX = 0.4;
        offsetNode1.positionOffsetY = -0.4;
        scaleNode1.connect(offsetNode1);


        let scaleNode2 = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_SCALE);
        let offsetNode2 = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_POSITION);
        gsNode.connect(scaleNode2);
        scaleNode2.scaleX = 0.6;
        scaleNode2.scaleY = 0.6;
        offsetNode2.positionOffsetX = -0.4;
        offsetNode2.positionOffsetY = -0.4;
        scaleNode2.connect(offsetNode2);




        //document.body.appendChild(VideoContext.createControlFormForNode(gsNode, "GREENSCREEN NODE"));
        
        imagePlayer.node.connect(vc.destination);
        let displaceNode4 = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_POSITION);
        let flipNode4 = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_FLIP);
        displaceNode4.positionOffsetX = 0.5;
        imagePlayer.node.connect(displaceNode4);
        displaceNode4.connect(flipNode4);


        let displaceNode5 = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_POSITION);
        let flipNode5 = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_FLIP);
        displaceNode5.positionOffsetX = -0.5;
        imagePlayer.node.connect(displaceNode5);
        displaceNode5.connect(flipNode5);




        gsNode.connect(vc.destination);        
        flipNode4.connect(vc.destination);
        flipNode5.connect(vc.destination);
        offsetNode1.connect(vc.destination);
        offsetNode2.connect(vc.destination);

        //this.initDebug();
        this.previousRate = 0.0;
        vc.play();

    }
    
    webcamCallback(direction){
        //  console.log(direction.u, direction.v);
        this._webcamSmoothingBuffer.unshift(direction.u/150);
        if (this._webcamSmoothingBuffer.length > 5){
            this._webcamSmoothingBuffer.pop(0);
        }


        let progressDiff = 0;
        for (var i = 0; i < this._webcamSmoothingBuffer.length; i++) {
            progressDiff += this._webcamSmoothingBuffer[i]
        }
        progressDiff = progressDiff/this._webcamSmoothingBuffer.length;
        this.imagePlayer.progress += progressDiff;
    }


    initDebug(){
        /****************************
        * GUI setup
        *****************************/
        /*
        * Create an interactive visualization canvas for debugging.
        */
        //Render a graph view
        var graphCanvas = document.getElementById("graph-canvas");
        VideoContext.visualiseVideoContextGraph(this.videocontext, graphCanvas);
        var visualisationCanvas = document.getElementById("timeline-canvas");
        let videocontext = this.videocontext;
        //Setup up a render function so we can update the playhead position.
        function render () {
            //VideoCompositor.renderPlaylist(playlist, visualisationCanvas, videoCompositor.currentTime); 
            VideoContext.visualiseVideoContextTimeline(videocontext, visualisationCanvas, videocontext.currentTime);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
        //catch mouse events to we can scrub through the timeline.
        visualisationCanvas.addEventListener("mousedown", function(evt){
            var x;
            if (evt.x!== undefined){
                x = evt.x - visualisationCanvas.offsetLeft;
            }else{
                //Fix for firefox
                x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;          
            }
            var secondsPerPixel = videocontext.duration / visualisationCanvas.width;
            videocontext.currentTime = secondsPerPixel*x;
        }, false);
    }




    	
}	