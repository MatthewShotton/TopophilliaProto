import Scene from "./Scene";
import ImageSequencePlayer from "../ImageSequencePlayer.js";


export default class Scene2 extends Scene{
	constructor(vc){
		super(vc);

        let videoNode = vc.createVideoSourceNode("assets/topophillia/honeysuckle_test1_chroma_h264.mov", undefined, undefined, true);
        let bgNode = vc.createVideoSourceNode("assets/topophillia/ceibwr_sea_loop1_h264.mov", undefined, undefined, true);
        bgNode.registerCallback("loaded", ()=>{bgNode._element.volume = 0.0});


        this.registerSource(videoNode);
        this.registerSource(bgNode);


        let gsNode = vc.createEffectNode({
                title:"Hue Threshold",
                description: "Turns all pixels transparent depending on their closeness to a specified hue value.",
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
                    uniform float hueTarget;\
                    uniform float alphaCeiling;\
                    varying vec2 v_texCoord;\
                    varying float v_mix;\
                    \
                    vec3 rgb2hsv(vec3 c)\
                    {\
                        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\
                        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\
                        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\
                        \
                        float d = q.x - min(q.w, q.y);\
                        float e = 1.0e-10;\
                        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\
                    }\
                    \
                    void main(){\
                        vec4 color = texture2D(u_image, v_texCoord);\
                        vec3 hsv = rgb2hsv(vec3(color[0],color[1],color[2]));\
                        float alpha = abs(hueTarget - hsv[0])*2.0;\
                        if (alpha>alphaCeiling){\
                            alpha = 1.0;\
                        }\
                        color = vec4(color[0], color[1], color[2], alpha);\
                        \
                        gl_FragColor = color;\
                    }",
                properties:{
                    "hueTarget":{type:"uniform", "value":0.45},
                    "alphaCeiling":{type:"uniform", "value":0.28}
                },
                inputs:["u_image"]
            });

        bgNode.connect(this.output);
        videoNode.connect(gsNode);
        gsNode.connect(this.output);
	}

}