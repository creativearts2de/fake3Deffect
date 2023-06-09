init();
async function init() {
    
    var img = new Image();
    img.src = "./../resources/image1.png";
    await new Promise( r=> img.onload = r);

    var depth = new Image();
    depth.src = "./../resources/depth1.png";
    await new Promise( r=> depth.onload = r);

    var canvas = document.createElement("canvas");
    canvas.height = img.height;
    canvas.width = img.width;

    var gl = canvas.getContext("webgl");

    Object.assign(canvas.style, {
        maxWidth: "100vw",
        maxHeight: "100vh",
        transform: 'scaleX(-1)',
        objectFit: "cover",
    })

    document.body.appendChild(canvas);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, -1, 1,
        1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    var vshader = `
    attribute vec2 pos;
    varying vec2 vpos;
    void main(){
        vpos = pos*-0.5 + vec2(0.5);
        gl_Position = vec4(pos, 0.0, 1.0);
    }
    `
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vshader);
    gl.compileShader(vs);

    var fshader = `
    precision highp float;
    uniform sampler2D img;
    uniform sampler2D depth; 
    uniform vec2 mouse;
    varying vec2 vpos;
    void main(){
        float dp = -0.5 + texture2D(depth, vpos).x;
        gl_FragColor = texture2D(img, vpos + mouse * 0.2 * dp);
    }
    `
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fshader);
    gl.compileShader(fs);

    var program = gl.createProgram();
    gl.attachShader(program, fs);
    gl.attachShader(program, vs);
    gl.linkProgram(program);
    gl.useProgram(program);


    function setTexture(im,name, num) {
        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + num);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        gl.uniform1i(gl.getUniformLocation(program, name), num);
    }

    setTexture(img, "img", 0);
    setTexture(depth, "depth", 1);

    loop();

    function loop() {
        gl.clearColor(0.25, 0.65, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(()=>loop());
    }

    var mouseLoc = gl.getUniformLocation(program, "mouse");
    canvas.onmousemove = function (d) {
        var mpos = [-0.1 + d.layerX / canvas.width, 0.1 - d.layerY / canvas.width]
        gl.uniform2fv(mouseLoc, new Float32Array(mpos));
    }
}