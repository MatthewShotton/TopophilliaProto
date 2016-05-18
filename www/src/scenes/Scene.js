import VideoContext from "../../node_modules/videocontext/src/videocontext.js";

export default class Scene{
	constructor(vc){
		this.vc = vc;
		this.output = vc.createCompositingNode(VideoContext.DEFINITIONS.COMBINE);
		this.sources = [];
	}
	
	registerSource(node){
		this.sources.push(node);
	}

	start(time){
		for (var i = 0; i < this.sources.length; i++) {
			this.sources[i].start(time);
		}
	}

	stop(time){
		for (var i = 0; i < this.sources.length; i++) {
			this.sources[i].stop(time);
		}
		this.vc.registerTimelineCallback(time, ()=>{
            this.clearTimelineState();
        });
	}

	connect(node){
		this.output.connect(node);
	}

	disconnect(node){
		this.output.disconnect(node);
	}

	clearTimelineState(){
		for (var i = 0; i < this.sources.length; i++) {
			this.sources[i].clearTimelineState();
		}
	}
}