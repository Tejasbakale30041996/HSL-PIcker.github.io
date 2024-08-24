
let parent = document.getElementById("container");

createHslPicker(parent, (h, s, l) => {
  let sample = document.getElementById("sample"),
      text = document.getElementById("hsl-values");
  
  sample.style.background = `hsl(${h}, ${s}%, ${l}%)`;
  text.innerHTML = `Hue: <b>${h}</b>, Saturation: <b>${s}</b>%, Lightness: <b>${l}</b>%`;
}, 50);


/*
  Main function, creates the HSL picker inside a parent that you provide (such as a div).
  As the user picks different HSL values, you are notified via the callback.
  The HSL values are provided as arguments, and you can use them to update other parts of your UI.
  You can also pass an initial hue, via the thrid argument.
*/
function createHslPicker(parent, callback, initialHue = 0) {
	parent.innerHTML = getHtml();
  
  let canvas = document.getElementById("canvas-hue"),
      rgSat = document.getElementById("rg-saturation"),
      rgLight = document.getElementById("rg-lightness"),
      hsl = [initialHue, 100, 50];
  
  
  drawColorWheel();
  onHslChanged();
  
  
  rgSat.addEventListener("change", onSaturationPicked);
  rgLight.addEventListener("change", onLightnessPicked);
  
  
  let xCircle = canvas.width / 2,
      yCircle = canvas.height / 2,
      radius = canvas.width / 2;
  
  
  canvas.addEventListener("mousemove", ev => {
    let dist = Math.sqrt(Math.pow(ev.offsetX - xCircle, 2) + Math.pow(ev.offsetY - yCircle, 2));
    canvas.style.cursor = dist <= radius ? "pointer" : "default";
  });

  
  canvas.addEventListener("mousedown", ev => {
    if(ev.button != 0) {
      return;
    }

    let dist = Math.sqrt(Math.pow(ev.offsetX - xCircle, 2) + Math.pow(ev.offsetY - yCircle, 2));

    if(radius < dist) {
      return;
    }

    let sine = (yCircle - ev.offsetY) / dist,
        radians = Math.atan2(yCircle - ev.offsetY, ev.offsetX - xCircle);

    if(radians < 0) {
      radians = 2 * Math.PI - Math.abs(radians);
    }

    let degrees = radians * 180 / Math.PI,
        hue = Math.round(degrees);

    onHuePicked(hue);
  });
  
  
  function onHuePicked(h) {
    hsl[0] = h;
    onHslChanged();
  }
  
  function onSaturationPicked() {
    hsl[1] = +document.getElementById("rg-saturation").value;
    drawColorWheel();
    
    onHslChanged();
  }
  
  function onLightnessPicked() {
    hsl[2] = +document.getElementById("rg-lightness").value;
    drawColorWheel();
    
    onHslChanged();
  }
  
  
  function onHslChanged() {
    if(callback) {
      callback(...hsl);
    }
  }

  
	function drawColorWheel() {
		let ctx = canvas.getContext("2d"),
			  radius = canvas.width / 2,
			  x = canvas.width / 2,
			  y = canvas.height / 2,
        [h, s, l] = hsl;
			
		for(let i = 0; i < 360; i++) {
		  let color = `hsl(${i}, ${s}%, ${l}%)`;
	  
		  ctx.beginPath();

		  ctx.moveTo(x, y);
		  ctx.arc(x, y, radius, -(i + 1) * Math.PI / 180, -i * Math.PI / 180);
		  ctx.lineTo(x, y);
		  ctx.closePath();

		  ctx.fillStyle = color;
		  ctx.strokeStyle = color;

		  ctx.fill();
		  ctx.stroke();
		}
	}
  
  function getHtml() {
    return `<div style="padding: 20px; border: 1px solid #999999; height: 330px; width: 700px; background: #f5f5f5; box-shadow: 0px 0px 30px #555555;">
		<div style="display: grid; grid-column-gap: 10px; grid-template-columns: 330px 350px; grid-template-rows: 130px 130px; grid-template-areas: 'hue saturation' 'hue lightness';">
		  <div style="grid-area: hue;">
			<span style="padding-left: 20px;">Hue:</span>
			<canvas id="canvas-hue" width="300" height="300"></canvas>
		  </div>
		  
		  <div style="grid-area: saturation; padding-top: 30px; padding-left: 20px;">
			<label for="rg-saturation">Saturation:</label>
			<input type="range" id="rg-saturation" min="0" max="100" value="100" style="width: 300px; display: block; cursor: pointer;">
			<span>0</span>
			<span style="margin-left: 270px; text-align: right;">100</span>
		  </div>
		  
		  <div style="grid-area: lightness; padding-top: 30px; padding-left: 20px;">
			<label for="rg-lightness">Lightness:</label>
			<input type="range" id="rg-lightness" min="0" max="100" value="50" style="width: 300px; display: block; cursor: pointer;">
			<span>0</span>
			<span style="margin-left: 270px; text-align: right;">100</span>
		  </div>
		</div>
    </div>`;
  }
}