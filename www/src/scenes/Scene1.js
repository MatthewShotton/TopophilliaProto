import Scene from "./Scene";
import ImageSequencePlayer from "../ImageSequencePlayer.js";


export default class Scene1 extends Scene{
	constructor(vc){
		super(vc);
        this._webcamSmoothingBuffer = []

        let bgNode = vc.createVideoSourceNode("assets/topophillia/ceibwr_sea_loop2_h264.mov", undefined, undefined, true);
        this.registerSource(bgNode);
        bgNode.registerCallback("loaded", ()=>{bgNode._element.volume = 0.0});
        this.bgNode = bgNode;
        bgNode.connect(this.output);

        let imageURLS = [];
        for (var i = 1; i < 141; i++) {
            let pad = "00000";
            let n = i.toString();
            let result = (pad+n).slice(-pad.length);
            imageURLS.push("./assets/topophillia/meadowsweet_sd/meadowsweet_test1_png_sequence_"+result+".png");
        }
        imageURLS.reverse();	
        let imagePlayer = new ImageSequencePlayer(imageURLS, vc);
        this.imagePlayer = imagePlayer;
        this.registerSource(imagePlayer.node);
        //this.output = imagePlayer.node;
        //this.imagePlayer = imagePlayer;
        imagePlayer.node.connect(this.output);
        
	}

	webcamCallback(direction){
        //  console.log(direction.u, direction.v);
        this._webcamSmoothingBuffer.unshift(direction.u/80);
        if (this._webcamSmoothingBuffer.length > 10){
            this._webcamSmoothingBuffer.pop(0);
        }


        let progressDiff = 0;
        for (var i = 0; i < this._webcamSmoothingBuffer.length; i++) {
            progressDiff += this._webcamSmoothingBuffer[i]
        }
        progressDiff = progressDiff/this._webcamSmoothingBuffer.length;
        this.imagePlayer.progress += progressDiff;
	}
}