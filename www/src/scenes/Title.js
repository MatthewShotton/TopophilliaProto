import Scene from "./Scene";
import VideoContext from "../../node_modules/videocontext/src/videocontext.js";

export default class Title extends Scene{
	constructor(vc, input, destination){
		super(vc);
        this.input = input;
        let imagePlayer = vc.createImageSourceNode("./assets/topophillia/test_title.png");
        this.registerSource(imagePlayer);
        this.imagePlayer = imagePlayer;
        let hBlurEffect = vc.createTransitionNode(VideoContext.DEFINITIONS.HORIZONTAL_BLUR);
        let vBlurEffect = vc.createTransitionNode(VideoContext.DEFINITIONS.VERTICAL_BLUR);
        let titleFadeEffect = vc.createTransitionNode(VideoContext.DEFINITIONS.CROSSFADE);
        this.titleFadeEffect = titleFadeEffect;
        imagePlayer.connect(titleFadeEffect);

        hBlurEffect.connect(vBlurEffect);
        //imagePlayer.connect(this.output);
        //vBlurEffect.connect(this.output);
        
        hBlurEffect.blurAmount = 2.0;
        vBlurEffect.blurAmount = 2.0;

        this.hBlurEffect = hBlurEffect;
        this.vBlurEffect = vBlurEffect;
        
	}
    start(time){
        this.hBlurEffect.transition(time,time+5.0,0.00,"blurAmount");
        this.vBlurEffect.transition(time,time+5.0,0.00,"blurAmount");
        this.titleFadeEffect.transition(time,time+0.5,1.0,"mix");
        this.vc.registerTimelineCallback(time, ()=>{
            //this.input.disconnect(this.destination);
            this.input.connect(this.hBlurEffect);
            this.vBlurEffect.connect(this.output);
            this.titleFadeEffect.connect(this.output);

        });
        super.start(time);

    }

    stop(time){
        //this.hBlurEffect.transition(time-4.0,time,1.0,"blurAmount");
        //this.vBlurEffect.transition(time-4.0,time,1.0,"blurAmount");
        this.titleFadeEffect.transition(time-0.5,time,0.0,"mix");
        this.vc.registerTimelineCallback(time, ()=>{
            this.titleFadeEffect.disconnect(this.output);
            this.vBlurEffect.disconnect(this.output);
            this.input.disconnect(this.hBlurEffect);
            //this.input.connect(this.destination);

        });
        super.stop(time);

    }
}