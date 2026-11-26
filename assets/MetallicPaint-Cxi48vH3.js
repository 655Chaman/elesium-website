import{r as n,j as W}from"./vendor-react-BfJ8k5fD.js";const rt=`#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vP;
void main(){vP=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`,st=`#version 300 es
precision highp float;
in vec2 vP;
out vec4 oC;
uniform sampler2D u_tex;
uniform float u_time,u_ratio,u_imgRatio,u_seed,u_scale,u_refract,u_blur,u_liquid;
uniform float u_bright,u_contrast,u_angle,u_fresnel,u_sharp,u_wave,u_noise,u_chroma;
uniform float u_distort,u_contour;
uniform vec3 u_lightColor,u_darkColor,u_tint;

vec3 sC,sM;

vec3 pW(vec3 v){
  vec3 i=floor(v),f=fract(v),s=sign(fract(v*.5)-.5),h=fract(sM*i+i.yzx),c=f*(f-1.);
  return s*c*((h*16.-4.)*c-1.);
}

vec3 aF(vec3 b,vec3 c){return pW(b+c.zxy-pW(b.zxy+c.yzx)+pW(b.yzx+c.xyz));}
vec3 lM(vec3 s,vec3 p){return(p+aF(s,p))*.5;}

vec2 fA(){
  vec2 c=vP-.5;
  c.x*=u_ratio>u_imgRatio?u_ratio/u_imgRatio:1.;
  c.y*=u_ratio>u_imgRatio?1.:u_imgRatio/u_ratio;
  return vec2(c.x+.5,.5-c.y);
}

vec2 rot(vec2 p,float r){float c=cos(r),s=sin(r);return vec2(p.x*c+p.y*s,p.y*c-p.x*s);}

float bM(vec2 c,float t){
  vec2 l=smoothstep(vec2(0.),vec2(t),c),u=smoothstep(vec2(0.),vec2(t),1.-c);
  return l.x*l.y*u.x*u.y;
}

float mG(float hi,float lo,float t,float sh,float cv){
  sh*=(2.-u_sharp);
  float ci=smoothstep(.15,.85,cv),r=lo;
  float e1=.08/u_scale;
  r=mix(r,hi,smoothstep(0.,sh*1.5,t));
  r=mix(r,lo,smoothstep(e1-sh,e1+sh,t));
  float e2=e1+.05/u_scale*(1.-ci*.35);
  r=mix(r,hi,smoothstep(e2-sh,e2+sh,t));
  float e3=e2+.025/u_scale*(1.-ci*.45);
  r=mix(r,lo,smoothstep(e3-sh,e3+sh,t));
  float e4=e1+.1/u_scale;
  r=mix(r,hi,smoothstep(e4-sh,e4+sh,t));
  float rm=1.-e4,gT=clamp((t-e4)/rm,0.,1.);
  r=mix(r,mix(hi,lo,smoothstep(0.,1.,gT)),smoothstep(e4-sh*.5,e4+sh*.5,t));
  return r;
}

void main(){
  sC=fract(vec3(.7548,.5698,.4154)*(u_seed+17.31))+.5;
  sM=fract(sC.zxy-sC.yzx*1.618);
  vec2 sc=vec2(vP.x*u_ratio,1.-vP.y);
  float angleRad=u_angle*3.14159/180.;
  sc=rot(sc-.5,angleRad)+.5;
  sc=clamp(sc,0.,1.);
  float sl=sc.x-sc.y,an=u_time*.001;
  vec2 iC=fA();
  vec4 texSample=texture(u_tex,iC);
  float dp=texSample.r;
  float shapeMask=texSample.a;
  vec3 hi=u_lightColor*u_bright;
  vec3 lo=u_darkColor*(2.-u_bright);
  lo+=smoothstep(.6,1.4,sc.x+sc.y)*.04;
  vec2 fC=sc-.5;
  float rd=length(fC+vec2(0.,sl*.15));
  vec2 ag=rot(fC,(.22-sl*.18)*3.14159);
  float cv=1.-pow(rd*1.65,1.15);
  cv*=pow(sc.y,.35);
  float vs=shapeMask;
  vs*=bM(iC,.01);
  float fr=pow(1.-cv,u_fresnel)*.3;
  vs=min(vs+fr*vs,1.);
  float mT=an*.0625;
  vec3 wO=vec3(-1.05,1.35,1.55);
  vec3 wA=aF(vec3(31.,73.,56.),mT+wO)*.22*u_wave;
  vec3 wB=aF(vec3(24.,64.,42.),mT-wO.yzx)*.22*u_wave;
  vec2 nC=sc*45.*u_noise;
  nC+=aF(sC.zxy,an*.17*sC.yzx-sc.yxy*.35).xy*18.*u_wave;
  vec3 tC=vec3(.00041,.00053,.00076)*mT+wB*nC.x+wA*nC.y;
  tC=lM(sC,tC);
  tC=lM(sC+1.618,tC);
  float tb=sin(tC.x*3.14159)*.5+.5;
  tb=tb*2.-1.;
  float noiseVal=pW(vec3(sc*8.+an,an*.5)).x;
  float edgeFactor=smoothstep(0.,.5,dp)*smoothstep(1.,.5,dp);
  float lD=dp+(1.-dp)*u_liquid*tb;
  lD+=noiseVal*u_distort*.15*edgeFactor;
  float rB=clamp(1.-cv,0.,1.);
  float fl=ag.x+sl;
  fl+=noiseVal*sl*u_distort*edgeFactor;
  fl*=mix(1.,1.-dp*.5,u_contour);
  fl-=dp*u_contour*.8;
  float eI=smoothstep(0.,1.,lD)*smoothstep(1.,0.,lD);
  fl-=tb*sl*1.8*eI;
  float cA=cv*clamp(pow(sc.y,.12),.25,1.);
  fl*=.12+(1.05-lD)*cA;
  fl*=smoothstep(1.,.65,lD);
  float vA1=smoothstep(.08,.18,sc.y)*smoothstep(.38,.18,sc.y);
  float vA2=smoothstep(.08,.18,1.-sc.y)*smoothstep(.38,.18,1.-sc.y);
  fl+=vA1*.16+vA2*.025;
  fl*=.45+pow(sc.y,2.)*.55;
  fl*=u_scale;
  fl-=an;
  float rO=rB+cv*tb*.025;
  float vM1=smoothstep(-.12,.18,sc.y)*smoothstep(.48,.08,sc.y);
  float cM1=smoothstep(.35,.55,cv)*smoothstep(.95,.35,cv);
  rO+=vM1*cM1*4.5;
  rO-=sl;
  float bO=rB*1.25;
  float vM2=smoothstep(-.02,.35,sc.y)*smoothstep(.75,.08,sc.y);
  float cM2=smoothstep(.35,.55,cv)*smoothstep(.75,.35,cv);
  bO+=vM2*cM2*.9;
  bO-=lD*.18;
  rO*=u_refract*u_chroma;
  bO*=u_refract*u_chroma;
  float sf=u_blur;
  float rP=fract(fl+rO);
  float rC=mG(hi.r,lo.r,rP,sf+.018+u_refract*cv*.025,cv);
  float gP=fract(fl);
  float gC=mG(hi.g,lo.g,gP,sf+.008/max(.01,1.-sl),cv);
  float bP=fract(fl-bO);
  float bC=mG(hi.b,lo.b,bP,sf+.008,cv);
  vec3 col=vec3(rC,gC,bC);
  col=(col-.5)*u_contrast+.5;
  col=clamp(col,0.,1.);
  col=mix(col,1.-min(vec3(1.),(1.-col)/max(u_tint,vec3(.001))),length(u_tint-1.)*.5);
  col=clamp(col,0.,1.);
  oC=vec4(col*vs,vs);
}`;function ct(l){let r=l.naturalWidth||l.width,s=l.naturalHeight||l.height;if(r>384||s>384||r<256||s<256){const o=r>s?r>384?384/r:r<256?256/r:1:s>384?384/s:s<256?256/s:1;r=Math.round(r*o),s=Math.round(s*o)}const M=document.createElement("canvas");M.width=r,M.height=s;const y=M.getContext("2d");y.drawImage(l,0,0,r,s);const D=y.getImageData(0,0,r,s).data,h=r*s,w=new Float32Array(h),i=new Uint8Array(h),C=new Uint8Array(h);for(let o=0;o<h;o++){const c=D[o*4+3],u=c<10;w[o]=u?0:c/255,i[o]=w[o]>.1?1:0}for(let o=0;o<s;o++)for(let c=0;c<r;c++){const u=o*r+c;i[u]&&(c===0||c===r-1||o===0||o===s-1||!i[u-1]||!i[u+1]||!i[u-r]||!i[u+r])&&(C[u]=1)}const m=new Float32Array(h),O=90,U=.01,I=1.85;for(let o=0;o<O;o++)for(let c=1;c<s-1;c++)for(let u=1;u<r-1;u++){const f=c*r+u;if(!i[f]||C[f])continue;const b=(i[f+1]?m[f+1]:0)+(i[f-1]?m[f-1]:0)+(i[f+r]?m[f+r]:0)+(i[f-r]?m[f-r]:0),E=(U+b)/4;m[f]=I*E+(1-I)*m[f]}let p=0;for(let o=0;o<h;o++)m[o]>p&&(p=m[o]);p===0&&(p=1);const g=y.createImageData(r,s);for(let o=0;o<h;o++){const c=o*4,u=m[o]/p,f=Math.round(255*(1-u*u));g.data[c]=g.data[c+1]=g.data[c+2]=f,g.data[c+3]=Math.round(w[o]*255)}return g}function j(l){const x=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(l);return x?[parseInt(x[1],16)/255,parseInt(x[2],16)/255,parseInt(x[3],16)/255]:[1,1,1]}function nt({imageSrc:l,seed:x=42,scale:L=2.6,refraction:r=.01,blur:s=.012,liquid:M=.75,speed:y=.45,brightness:Z=2.1,contrast:D=.55,angle:h=0,fresnel:w=1.1,lightColor:i="#ffffff",darkColor:C="#2e2e32",patternSharpness:m=1,waveAmplitude:O=.9,noiseScale:U=.45,chromaticSpread:I=0,mouseAnimation:p=!1,distortion:g=1.1,contour:o=.25,tintColor:c="#ffffff",resolution:u=512,alt:f="Elesium"}){const b=n.useRef(null),E=n.useRef(null),N=n.useRef({}),k=n.useRef(null),G=n.useRef(0),z=n.useRef(0),B=n.useRef(null),Y=n.useRef(y),tt=n.useRef({x:.5,y:.5,targetX:.5,targetY:.5}),q=n.useRef(p),[T,et]=n.useState(!1),[V,H]=n.useState(!1);n.useEffect(()=>{Y.current=y},[y]),n.useEffect(()=>{q.current=p},[p]);const $=n.useCallback(()=>{const e=b.current;if(!e)return!1;const t=e.getContext("webgl2",{antialias:!0,alpha:!0});if(!t)return!1;const _=(S,F)=>{const X=t.createShader(F);return!X||(t.shaderSource(X,S),t.compileShader(X),!t.getShaderParameter(X,t.COMPILE_STATUS))?null:X},a=_(rt,t.VERTEX_SHADER),d=_(st,t.FRAGMENT_SHADER);if(!a||!d)return!1;const v=t.createProgram();if(!v)return!1;t.attachShader(v,a),t.attachShader(v,d),t.linkProgram(v);const P={},A=t.getProgramParameter(v,t.ACTIVE_UNIFORMS);for(let S=0;S<A;S++){const F=t.getActiveUniform(v,S);F&&(P[F.name]=t.getUniformLocation(v,F.name))}const R=new Float32Array([-1,-1,1,-1,-1,1,1,1]),ot=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,ot),t.bufferData(t.ARRAY_BUFFER,R,t.STATIC_DRAW),t.useProgram(v);const Q=t.getAttribLocation(v,"a_position");return t.enableVertexAttribArray(Q),t.vertexAttribPointer(Q,2,t.FLOAT,!1,0,0),E.current=t,N.current=P,!0},[]),J=n.useCallback(e=>{const t=E.current,_=N.current;if(!t||!e)return;k.current&&t.deleteTexture(k.current);const a=t.createTexture();t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e.width,e.height,0,t.RGBA,t.UNSIGNED_BYTE,e.data),t.uniform1i(_.u_tex,0),t.uniform1f(_.u_imgRatio,e.width/e.height),t.uniform1f(_.u_ratio,1),k.current=a},[]);n.useEffect(()=>{if(!$())return;const e=b.current;if(!e||!E.current)return;const t=u*Math.min(window.devicePixelRatio||1,2);e.width=e.height=t,E.current.viewport(0,0,t,t),et(!0)},[$,u]),n.useEffect(()=>{if(!T||!l)return;let e=!1;H(!1);const t=new Image;return t.crossOrigin="anonymous",t.onload=()=>{e||(J(ct(t)),H(!0))},t.src=l,()=>{e=!0}},[T,l,J]),n.useEffect(()=>{const e=E.current,t=N.current;if(!e||!T)return;e.uniform1f(t.u_seed,x),e.uniform1f(t.u_scale,L),e.uniform1f(t.u_refract,r),e.uniform1f(t.u_blur,s),e.uniform1f(t.u_liquid,M),e.uniform1f(t.u_bright,Z),e.uniform1f(t.u_contrast,D),e.uniform1f(t.u_angle,h),e.uniform1f(t.u_fresnel,w);const _=j(i),a=j(C),d=j(c);e.uniform3f(t.u_lightColor,_[0],_[1],_[2]),e.uniform3f(t.u_darkColor,a[0],a[1],a[2]),e.uniform3f(t.u_tint,d[0],d[1],d[2]),e.uniform1f(t.u_sharp,m),e.uniform1f(t.u_wave,O),e.uniform1f(t.u_noise,U),e.uniform1f(t.u_chroma,I),e.uniform1f(t.u_distort,g),e.uniform1f(t.u_contour,o)},[T,x,L,r,s,M,Z,D,h,w,i,C,m,O,U,I,g,o,c]),n.useEffect(()=>{if(!T||!V)return;const e=E.current,t=N.current,_=b.current,a=tt.current,d=window.matchMedia("(prefers-reduced-motion: reduce)").matches,v=A=>{const R=_.getBoundingClientRect();a.targetX=(A.clientX-R.left)/R.width,a.targetY=(A.clientY-R.top)/R.height};window.addEventListener("mousemove",v,{passive:!0});const P=A=>{const R=A-z.current;z.current=A,d||(q.current?(a.x+=(a.targetX-a.x)*.08,a.y+=(a.targetY-a.y)*.08,G.current=a.x*3e3+a.y*1500):G.current+=R*Y.current),e.uniform1f(t.u_time,G.current),e.drawArrays(e.TRIANGLE_STRIP,0,4),d||(B.current=requestAnimationFrame(P))};return z.current=performance.now(),B.current=requestAnimationFrame(P),()=>{B.current&&cancelAnimationFrame(B.current),window.removeEventListener("mousemove",v)}},[T,V]);const K=!T||!V;return W.jsxs("div",{className:"relative h-full w-full",children:[W.jsx("canvas",{ref:b,className:`block h-full w-full object-contain transition-opacity duration-500 ${K?"opacity-0":"opacity-100"}`}),W.jsx("img",{src:l,alt:f,className:`pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${K?"opacity-100":"opacity-0"}`})]})}export{nt as M};
