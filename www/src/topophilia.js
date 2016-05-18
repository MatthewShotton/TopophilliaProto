import VideoContext from "../node_modules/videocontext/src/videocontext.js";
import ImageSequencePlayer from "./ImageSequencePlayer.js";
import VideoMandala from "./VideoMandala.js";
import Scene1 from "./scenes/Scene1.js";
import Scene2 from "./scenes/Scene2.js";
import Title from "./scenes/Title.js";

export default class Topophilia{
    constructor(canvas){
    	this.videocontext = new VideoContext(canvas);
        this.webcamCallbacks = [];
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

        let scene1 = new Scene1(vc);

        this.registerWebcamCallback(scene1.webcamCallback.bind(scene1));
        scene1.start(0);
        scene1.stop(32);
        vc.registerTimelineCallback(58, ()=>{
            scene1.start(0);
        })


        let title = new Title(vc, scene1);
        title.start(0);
        title.stop(10);

        let scene2 = new Scene2(vc);
        scene2.start(30);
        scene2.stop(60);
        
        let transitionNode = vc.createTransitionNode(VideoContext.DEFINITIONS.CROSSFADE);
        scene2.connect(transitionNode);
        scene1.connect(transitionNode);

        transitionNode.mix = 0.0;
        //scene1.bgNode.connect(vc.destination);


        transitionNode.connect(vc.destination);
        transitionNode.transition(30,32,1.0,"mix");
        transitionNode.transition(58,60,0.0,"mix");
        console.log(transitionNode.mix);
        title.output.connect(vc.destination);


        
        //let vMandala = new VideoMandala("assets/topophillia/honeysuckle_test1_chroma_h264.mov",[0.0,0.0,0.85], vc);
        // document.body.appendChild(VideoContext.createControlFormForNode(vMandala.gsNode, "GREENSCREEN NODE"));
        //vMandala.videoNode.startAt(0);
        //vMandala.node.connect(vc.destination);


        //this.initDebug();
        this.previousRate = 0.0;
        vc.play();
    }
    
    registerWebcamCallback(f){
        this.webcamCallbacks.push(f);
    }

    webcamCallback(direction){
        for (var i = 0; i < this.webcamCallbacks.length; i++) {
            this.webcamCallbacks[i](direction);
        }
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