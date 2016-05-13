import VideoContext from "../node_modules/videocontext/src/videocontext.js";

export default class VideoMandala{
	constructor(videoURL, alphaThreshold, vc, petals=8, rings=4){
		let _this = this;
		this.gsNode = vc.createEffectNode(VideoContext.DEFINITIONS.COLORTHRESHOLD);
		this.gsNode.colorAlphaThreshold = alphaThreshold;
		this.videoNode = vc.createVideoSourceNode(videoURL, undefined, undefined, true);
		setTimeout(function(){_this.videoNode._element.volume = 0.0;}, 1000);
		this.videoNode.connect(this.gsNode);
		
		this.rings = [];
		this.rotationSpeed = 0.01;
		this.scaleNodes = [];

		var rotate = {
            title:"Rotation Effect",
            description: "A rotation effect.",
            vertexShader : "\
                attribute vec2 a_position;\
                attribute vec2 a_texCoord;\
                varying vec2 v_texCoord;\
                void main() {\
                    gl_Position = vec4(vec2(2.0,2.0)*a_position-vec2(1.0, 1.0), 0.0, 1.0);\
                    v_texCoord = a_texCoord;\
                }",
            fragmentShader : "\
                precision mediump float;\
                uniform sampler2D u_image;\
                uniform float rotation;\
                uniform float mid;\
                varying vec2 v_texCoord;\
                void main(){\
                    vec2 pos = vec2(v_texCoord[0], v_texCoord[1]);\
      				vec2 rotated = vec2(cos(rotation) * (pos.x - mid) + sin(rotation) * (pos.y - mid) + mid,\
                          cos(rotation) * (pos.y - mid) - sin(rotation) * (pos.x - mid) + mid);\
                    vec4 color = texture2D(u_image, rotated);\
                    ;\
                    if (rotated[0] < 0.0 || rotated[0] > 1.0 || rotated[1] < 0.0 || rotated[1] > 1.0){\
                        color = vec4(0.0,0.0,0.0,0.0);\
                    }\
                    gl_FragColor = color;\
                }",
            properties:{
                "rotation":{type:"uniform", value:0.0},
                "mid":{type:"uniform", value:0.5}
            },
            inputs:["u_image"]
        };


		let rNode =  vc.createEffectNode(rotate);

		
		this.node = vc.createCompositingNode(VideoContext.DEFINITIONS.COMBINE);

		let ringNodes = [];

		for (let ring = 0; ring < rings; ring++) {
			let ringNode = vc.createCompositingNode(VideoContext.DEFINITIONS.COMBINE);
			let ringRotate = vc.createEffectNode(rotate);
			ringNode.connect(ringRotate);
			ringRotate.connect(this.node);
			ringNodes.push(ringRotate);

			for (let petal = 0; petal < petals; petal++) {
				let sNode = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_SCALE);
				sNode.scaleX = 0.6*(((rings - ring)+0.2)/rings);
				sNode.scaleY = 0.6*(((rings - ring)+0.2)/rings);
				this.scaleNodes.push(sNode);
				let pNode = vc.createEffectNode(VideoContext.DEFINITIONS.AAF_VIDEO_POSITION);
				pNode.positionOffsetY = 0.5;
				let rNode = vc.createEffectNode(rotate);
				rNode.rotation = ((2*Math.PI)/petals) * petal + ring*2;
				this.gsNode.connect(sNode);
				sNode.connect(pNode);
				pNode.connect(rNode);
				rNode.connect(ringNode);
			}
		}

		this.videoNode.registerCallback("render", function(node, dt){
			for (var i = 0; i < ringNodes.length; i++) {
				if (i%2 ===0){
					ringNodes[i].rotation += _this.rotationSpeed * (ringNodes.length/i);
				} else{
					ringNodes[i].rotation -= _this.rotationSpeed * (ringNodes.length/i);
				}
			}
		});
	}

}