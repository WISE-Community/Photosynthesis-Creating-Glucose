var canvasModel = this.__canvas = new fabric.StaticCanvas('model',{
	backgroundColor: 'rgb(173,216,230)'
});

// Elements on Model Canvas

// make chloroplast image and object in fabric
// modify the image, set dimensions and remove the white background
// add modified image to the canvas

// trial data that will be collected
var alertType = "";
var madeSingleOxy = "";
var madeGlucose = "";
var lightOnOff = "";

// an array of trial data objects
var trials = [];

// other global important variables
var carbDioxCounter = 0;
var waterCounter = 0;
var remainingNumH2O;
var glucoseMade = false;
var time = 1;
var isPaused = false;

var latestComponentStateId = null;

function initializeTrialData() {
    // initialize the trial data
		alertType = "none";
		madeSingleOxy = "no";
		madeGlucose = "no";
		lightOnOff = "on";
}

function addNewTrial() {
		// object to collect all trial related data
		var trialData = {};

    // create the trial
		trialData.alertType = alertType;
		trialData.amountCO2 = carbDioxCounter;
		trialData.amountH2O = waterCounter;
		trialData.madeSingleOxy = madeSingleOxy;
		trialData.madeGlucose = madeGlucose;
		trialData.lightOnOff = lightOnOff;
		var saveTime = Date.now();
		trialData.clientSaveTime = saveTime;

		trials.push(trialData);
		save();
}

var chloroplast = null;
fabric.Image.fromURL("./assets/chloroplast.png", function (img) {
  img.scale(8);
  img.setWidth(265);
  img.setHeight(150);
  img.setLeft(-160);
  img.setTop(17);
  img.set("selectable", false);
  chloroplast = img;
  canvasModel.add(img);
  canvasModel.moveTo(img, 0);
});

var membraneChannel = null;
fabric.Image.fromURL("./assets/membraneChannel.png", function (img) {
  img.scale(0.5);
  img.setWidth(600);
  img.setHeight(235);
  img.setAngle(-18);
  img.setLeft(230);
  img.setTop(128);
  membraneChannel = img;
  canvasModel.add(img);
});

var glucoseMachine = null;
fabric.Image.fromURL("./assets/glucoseMachine.png", function (img) {
  img.scale(0.4);
  img.setLeft(621);
  img.setTop(187);
  glucoseMachine = img;
  canvasModel.add(img);
});

// Calls the function to initialize ALL the objects

function initializeAnimation () {
	initializePhase1Objects();
	initializePhase2Objects();
	initializePhase3Objects();
	initializePhase4Objects();
	$("#equation").html("____CO<sub>2</sub>&nbsp;&nbsp;&nbsp;+&nbsp;&nbsp;____H<sub>2</sub>O&nbsp;&nbsp;=&nbsp;&nbsp;???");
	$('#speedSwitch').val(2).trigger('change');
	$('#co2Input, #h2oInput').val(0).trigger('change');
	$("#lightOn").prop('checked', true);
	$('#water').hide();
	initializeTrialData();
}

$(function() {
	initializeAnimation();
	setCanvasDimensions();

	$(window).on('resize', function(){
		setCanvasDimensions()
	});
});

function setCanvasDimensions() {
	var container = $("#modelWrapper")[0];
  var ratio = canvasModel.getWidth() / canvasModel.getHeight();
  const containerWidth = container.clientWidth > 1000 ? 1000 : container.clientWidth;
  const scale = containerWidth / canvasModel.getWidth();
  const zoom = canvasModel.getZoom() * scale;
  canvasModel.setDimensions({ width: containerWidth, height: containerWidth / ratio });
  canvasModel.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
}

var chlorophyll1 = null;
fabric.Image.fromURL("./assets/dominoH2O.png", function (img) {
  img.scale(0.3);
  img.setLeft(240);
  img.setTop(445);
  img.setAngle(0);
  chlorophyll1 = img;
  canvasModel.add(img);
});

var chlorophyll2 = null;
fabric.Image.fromURL("./assets/dominoH2O.png", function (img) {
  img.scale(0.3);
  img.setLeft(335);
  img.setTop(425);
  img.setAngle(0);
  chlorophyll2 = img;
  canvasModel.add(img);
});

var chlorophyll3 = null;
fabric.Image.fromURL("./assets/dominoH2O.png", function (img) {
  img.scale(0.3);
  img.setLeft(330);
  img.setTop(455);
  img.setAngle(0);
  chlorophyll3 = img;
  //canvasModel.add(img)
});

var atpDomino1 = null;
fabric.Image.fromURL("./assets/dominoATP.png", function (img) {
  img.scale(0.3);
  img.setLeft(495);
  img.setTop(445);
  atpDomino1 = img;
  canvasModel.add(img);
});

var atpDomino2 = null;
fabric.Image.fromURL("./assets/dominoATP.png", function (img) {
  img.scale(0.3);
  img.setLeft(540);
  img.setTop(425);
  atpDomino2 = img;
  canvasModel.add(img);
});

var energyCarrierEMPTY99 = null;
fabric.Image.fromURL("./assets/energyCarrierEMPTY.png", function (img) {
  img.scale(0.15);
  img.setAngle(44);
  img.setLeft(613);
  img.setTop(395);
  energyCarrierEMPTY99 = img;
  canvasModel.add(img);
});

var energyCarrierFULL99 = null;
fabric.Image.fromURL("./assets/energyCarrierFULL.png", function (img) {
  img.scale(0.15);
  img.setLeft(595);
  img.setTop(385);
  energyCarrierFULL99 = img;
});

var releasedGasText = new fabric.Text('Released Gas', {
	fontFamily: "Arial, san-serif",
	fontSize: 24,
	fontWeight: 'bold',
	left: 10,
	top: 83
	});

var glucoseRxn = new fabric.Text("Glucose Reaction", {
  fontFamily: "Arial, san-serif",
  fontSize: 24,
  fontWeight: "bold",
  left: 626,
  top: 324,
});
canvasModel.add(glucoseRxn);

var chloroStacks = new fabric.Text("Chlorophyll Stacks", {
  fontFamily: "Arial, san-serif",
  fontSize: 24,
  fontWeight: "bold",
  left: 20,
  top: 440,
});
canvasModel.add(chloroStacks);

var chargeBlocks = new fabric.Text("Charging Blocks", {
  fontFamily: "Arial, san-serif",
  fontSize: 24,
  fontWeight: "bold",
  left: 585,
  top: 485,
});
canvasModel.add(chargeBlocks);

//Phase 1 of the reaction
// Creates arrays for all the objects that have been initialized
var carbonDioxide = {};
var water = {};
var photon = {};

//  Function to instantiates all the objects in the array and defines which characteristics they will have
function makeCO2(id, scale, left, top, angle, opacity) {
	fabric.Image.fromURL("./assets/carbonDioxide.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    img.setAngle(angle);
    img.setOpacity(opacity);
    carbonDioxide[id] = img;
  });
}

function resetCO2Objects() {
		for (var i = 0; i < 12; i++) {
			var carbDioxObject = carbonDioxide[i + 1];
			canvasModel.remove(carbDioxObject);
		}
		carbonDioxide = {};
}

function makeH2O(id, scale, left, top, opacity) {
	fabric.Image.fromURL("./assets/water.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    img.setOpacity(opacity);
    water[id] = img;
  });
}

function resetH2OObjects() {
		for (var i = 0; i < 2; i++) {
			var waterObject = water[i + 1];
			canvasModel.remove(waterObject);
		}
		water = {};
}

// repeat for all var {} objects

function makePhoton(id, scale, left, top, angle) {
	fabric.Image.fromURL("./assets/photon.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    img.setAngle(angle);
    photon[id] = img;
  });
}

function resetPhotonObjects() {
		for (var i = 0; i < 2; i++) {
			var photonObject = photon[i + 1];
			canvasModel.remove(photonObject);
		}
		photon = {};
}

// Function to set all the objects in the array with their starting/initial values
function initializeCO2() {
	makeCO2(1, 0.6, 325, 20, 40, 1);
	makeCO2(2, 0.6, 287, 29, 40, 1);
	makeCO2(3, 0.6, 298, 77, 40, 1);
	makeCO2(4, 0.6, 345, 77, 40, 1);
	makeCO2(5, 0.6, 387, 85, 40, 1);
	makeCO2(6, 0.6, 386, 55, 40, 1);
	makeCO2(7, 0.6, 305, 20, 40, 1);
	makeCO2(8, 0.6, 267, 29, 40, 1);
	makeCO2(9, 0.6, 278, 77, 40, 1);
	makeCO2(10, 0.6, 325, 77, 40, 1);
	makeCO2(11, 0.6, 367, 85, 40, 1);
	makeCO2(12, 0.6, 366, 55, 40, 1);
}

function initializeH2O() {
	makeH2O(1, 0.6, 340, 25, 1);
	makeH2O(2, 0.6, 383, 35, 1);
}

function initializePhoton() {
	makePhoton(1, 0.35, 32, 29, 140);
	makePhoton(2, 0.35, 32, 29, 140);
}

// Function to retrieve a specific object in the array
function getCO2(id) {
	return carbonDioxide[id];
}

function getH2O(id) {
	return water[id];
}

function getPhoton(id) {
	return photon[id];
}

// Function to simultaneously set ALL the objects on the canvas with their starting/initial values
function initializePhase1Objects() {
	initializeCO2();
	initializeH2O();
	initializePhoton();
}


// *** Non-canvas Controls ***//

$("#start").on('click', function() {
	if (isPaused) {
		isPaused = false;
		continueAnimation();
	} else {
		animationStart();
	}
});

$("#pause").on("click", function () {
	$('#pause').prop('disabled', true);
	isPaused = true;
});

$('#co2Input').on('change', function () {
  carbDioxCounter = $(this).val();
});

$('#h2oInput').on('change', function () {
  waterCounter = $(this).val();
});

$("#resetAnimation").on('click', function() {
	resetAll();
});

$("#replay").on('click', function() {
	replay();
});

$("#speedSwitch").on("change", function() {
	var speedSwitchValue = $(this).val();
  var displayValue = "";
  if (speedSwitchValue == 1) {
    time = 1;
    displayValue = "Slow";
  } else if (speedSwitchValue == 2) {
    time = 0.5;
    displayValue = "1x";
  } else {
    time = 0.25;
    displayValue = "2x";
  }
  $("#currentSpeed").text(displayValue);
});

$('#lightOn').on('change', function() {
	if ($(this).is(':checked')) {
		canvasModel.setOverlayColor("rgba(0, 0, 0, 0)", canvasModel.renderAll.bind(canvasModel));
	} else {
		canvasModel.setOverlayColor("rgba(0, 0, 0, 0.2)", canvasModel.renderAll.bind(canvasModel));
	}
});

var lowReactantsAlert = null;
fabric.Image.fromURL("./assets/lowReactantsAlert.jpg", function (img) {
  img.scale(0.6);
  img.setLeft(230);
  img.setTop(100);
  lowReactantsAlert = img;
});

function lowAlertDelay() {
	var pause = setTimeout(lowAlert, (2500 * time));
}

function lowAlert() {
	alertType = "lowReactantsAlert";
	alert("THE REACTION FAILED!\n\nLook at the message for more information.");
	canvasModel.add(lowReactantsAlert);
	lightOnOff = "off";
	addNewTrial();
	resetPlaybackButtons();
}

function animationStart() {
	// add the new trial to the array of trials
	remainingNumH2O = waterCounter;
	$('#start, #resetAnimation, #replay, #lightOn, #co2Input, #h2oInput').prop('disabled', true);
	$('#pause').prop('disabled', false);
	if (carbDioxCounter == 0 && waterCounter == 0) {
		$("#totalH2O").html("Remaining H<sub>2</sub>O = " + waterCounter);
		alert("THE REACTION FAILED!\n\nLook at the message for more information.");
		canvasModel.add(lowReactantsAlert);
		if (!$("#lightOn").is(':checked')) {
			lightOnOff = "off";
		}
		alertType = "lowReactantsAlert";
		addNewTrial();
		resetPlaybackButtons();
	} else if (carbDioxCounter > 0 && waterCounter == 0 && (!$("#lightOn").is(':checked'))){
		$("#totalH2O").html("Remaining H<sub>2</sub>O = " + waterCounter);
		addCarbonDioxide();
		lowAlertDelay();
	} else {
		$("#totalH2O").html("Remaining H<sub>2</sub>O = " + waterCounter);
		addCarbonDioxide();
		addWater();
	}
}

// loop Tester: $("#test").html("loop test = " + i);
function stackCO2(id, left, top, angle) {
	var carbonDioxide = getCO2(id);
	canvasModel.add(carbonDioxide);
	carbonDioxide.animate({left: left, top: top, angle: angle}, {
		duration: (2000 * time),
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
}

function addCarbonDioxide() {
	for (var i = 0; i < carbDioxCounter; i++) {
		if (i < 6){
			stackCO2(i + 1, 470, 186 + (i * 20), 0);
		} else {
			stackCO2(i + 1, 390, 186 + ((i - 6) * 20), 0);
		}
	}
}


var waterLoopCounter = 0;

function addWater() {
	if (remainingNumH2O == 0 && (!$("#lightOn").is(':checked'))) {
		return;
	} else if (remainingNumH2O == 0) {
		addPhotons();
	} else if (remainingNumH2O == 1) {
		moveWater1();
		$('#water').show();
		return;
	} else {
		$('#water').show();
		moveWater1();
		moveWater2();
		return;
	}
}

function moveWater1() {
	var water1 = getH2O(1);
	canvasModel.add(water1);
	water1.animate({left: 272, top: 457}, {
		duration: (2000 * time),
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function(){
			addPhotons();
		}
	});
}

function moveWater2() {
	var water2 = getH2O(2);
	canvasModel.add(water2);
	water2.animate({left: 372, top: 437}, {
		duration: (2000 * time),
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
}

// Phase 2 objects
var oxygenAtom = {};
var hydrogenAtom = {};
var oxygenGas = {};

function makeOxyAtom(id, scale, left, top) {
	fabric.Image.fromURL("./assets/oxygenAtom.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    oxygenAtom[id] = img;
  });
}

function resetOxyObjects() {
		for (var i = 0; i < 2; i++) {
			var oxyObject = oxygenAtom[i + 1];
			canvasModel.remove(oxyObject);
		}
		oxygenAtom = {};
}

function makeHydroAtom(id, scale, left, top) {
	fabric.Image.fromURL("./assets/hydrogen.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    hydrogenAtom[id] = img;
  });
}

function resetHydroObjects() {
		for (var i = 0; i < 4; i++) {
			var hydroObject = hydrogenAtom[i + 1];
			canvasModel.remove(hydroObject);
		}
		hydrogenAtom = {};
}

function makeOxyGas(id, scale, left, top, angle) {
	fabric.Image.fromURL("./assets/oxygen.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    img.setAngle(angle);
    oxygenGas[id] = img;
  });
}

function resetOxyGasObjects() {
		for (var i = 0; i < 6; i++) {
			var oxyGasObject = oxygenGas[i + 1];
			canvasModel.remove(oxyGasObject);
		}
		oxygenGas = {};
}

function initializeOxyAtom() {
	makeOxyAtom(1, 0.6, 284, 454);
	makeOxyAtom(2, 0.6, 383, 436);
}

function initializeHydroAtom() {
	makeHydroAtom(1, 0.5, 274, 473);
	makeHydroAtom(2, 0.5, 304, 470);
	makeHydroAtom(3, 0.5, 374, 452);
	makeHydroAtom(4, 0.5, 404, 450);
}

function initializeOxyGas() {
	makeOxyGas(0, 0.55, 303, 372, 190);
	makeOxyGas(1, 0.55, 30, 135, 190);
	makeOxyGas(2, 0.55, 30, 162, 190);
	makeOxyGas(3, 0.55, 30, 189, 190);
	makeOxyGas(4, 0.55, 30, 216, 190);
	makeOxyGas(5, 0.55, 30, 243, 190);
	makeOxyGas(6, 0.55, 30, 270, 190);
}

function getOxyAtom(id) {
	return oxygenAtom[id];
}

function getHydroAtom(id) {
	return hydrogenAtom[id];
}

function getOxyGas(id) {
	return oxygenGas[id];
}

function initializePhase2Objects() {
	initializeOxyAtom();
	initializeHydroAtom();
	initializeOxyGas();
}

var chlorophyllLightAlert = null;
fabric.Image.fromURL('./assets/chlorophyllLightAlert.jpg', function(img) {
	img.scale(0.6);
	img.setLeft(50);
	img.setTop(50);
	chlorophyllLightAlert = img;
});

function addPhotons() {
	if (!$("#lightOn").is(':checked')) {
		alert("THE REACTION FAILED!\n\nLook at the message for more information.");
		canvasModel.add(chlorophyllLightAlert);
		alertType = "chlorophyllLightAlert";
		lightOnOff = "off";
		addNewTrial();
		resetPlaybackButtons();
		return;
	} else {
		var photon1HasH2O = false;
		var photon2HasH2O = false;
		if (remainingNumH2O > 0) {
			photon1HasH2O = true;
		}
		if (remainingNumH2O > 1) {
			photon2HasH2O = true;
		}
		movePhoton1(photon1HasH2O);
		movePhoton2(photon2HasH2O);
		return;
	}
}

var chlorophyllWaterAlert = null;
fabric.Image.fromURL("./assets/chlorophyllWaterAlert.jpg", function (img) {
  img.scale(0.6);
  img.setLeft(360);
  img.setTop(310);
  chlorophyllWaterAlert = img;
});

function movePhoton1(hasH20) {
	var photon1 = getPhoton(1);
	photon1.setOpacity(1);
	canvasModel.add(photon1);
	var photonSound = new Audio("./assets/photonSound.mp3");
	photonSound.play();
	photon1.animate({left: 263, top: 452}, {
		duration: (1500 * time),
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function (){
			chlorophyll1.animate({left: 272, top: 445, angle:42}, {
				duration: (100 * time),
				onChange: canvasModel.renderAll.bind(canvasModel),
				onComplete: function (){
					if (!hasH20) {
						alert("THE REACTION FAILED!\n\nLook at the message for more information.");
						canvasModel.add(chlorophyllWaterAlert);
						alertType = "chlorophyllWaterAlert";
						addNewTrial();
						resetPlaybackButtons();
						return;
					} else {
						var waterSplitSound = new Audio("./assets/waterSplitSound.mp3");
						waterSplitSound.play();
						photon1.setOpacity(0);
						photon1.setLeft(32);
						photon1.setTop(29);
						var water1 = getH2O(1);
						water1.setOpacity(0);
						initializeH2O();
						var oxygenAtom1 = getOxyAtom(1);
						canvasModel.add(oxygenAtom1);
						oxygenAtom1.animate({left: 303, top: 370}, {
							duration: (1000 * time),
							onChange: canvasModel.renderAll.bind(canvasModel)
						});
						var hydrogenAtom1 = getHydroAtom(1);
						hydrogenAtom1.setOpacity(1);
						canvasModel.add(hydrogenAtom1);
						hydrogenAtom1.animate({left: 494, top: 448, opacity: 1}, {
							duration: (1000 * time),
							onChange: canvasModel.renderAll.bind(canvasModel),
							onComplete: function() {
								hydrogenAtom1.setOpacity(0);
								hydrogenAtom1.setLeft(274);
								hydrogenAtom1.setTop(473);
							}
						});
						var hydrogenAtom2 = getHydroAtom(2);
						hydrogenAtom2.setOpacity(1);
						canvasModel.add(hydrogenAtom2);
						hydrogenAtom2.animate({left: 501, top: 448, opacity: 1}, {
							duration: (1000 * time),
							onChange: canvasModel.renderAll.bind(canvasModel),
							onComplete: function() {
								hydrogenAtom2.setOpacity(0);
								hydrogenAtom2.setLeft(304);
								hydrogenAtom2.setTop(470);
							}
						});
						return;
					}
				}
			});
		}
	});
}

function movePhoton2 (hasH20) {
	var photon2 = getPhoton(2);
	photon2.setOpacity(1);
	canvasModel.add(photon2);
	photon2.animate({left: 355, top: 433}, {
		duration: (1500 * time),
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			chlorophyll2.animate({left: 372, top: 425, angle: 56}, {
				duration: (100 * time),
				onChange: canvasModel.renderAll.bind(canvasModel),
				onComplete: function() {
					/*chlorophyll3.animate({left: 372, top: 454, angle: 49}, {
						duration: (100 * time),
						onChange: canvasModel.renderAll.bind(canvasModel),
						//easing: fabric.util.ease.easeInExpo
					});*/
					if (!hasH20) {
						remainingNumH2O = 0;
						$("#totalH2O").html("Remaining H<sub>2</sub>O = " + remainingNumH2O);
						alert("THE REACTION FAILED!\n\nLook at the message for more information.");
						canvasModel.add(chlorophyllWaterAlert);
						if (alertType = "none"){
							alertType = "chlorophyllWaterAlert";
							addNewTrial();
						}
						resetPlaybackButtons();
						return;
					} else {
						waterLoopCounter += 1;
						remainingNumH2O -= 2;
						//$("#loops").html("# of Rounds = " + waterLoopCounter);
						$("#totalH2O").html("Remaining H<sub>2</sub>O = " + remainingNumH2O);
						photon2.setOpacity(0);
						photon2.setLeft(32);
						photon2.setTop(29);
						canvasModel.remove(photon2);
						var water2 = getH2O(2);
						water2.setOpacity(0);
						var oxygenAtom2 = getOxyAtom(2);
						canvasModel.add(oxygenAtom2);
						oxygenAtom2.animate({left: 306, top: 373}, {
							duration: (1000 * time),
							onChange: canvasModel.renderAll.bind(canvasModel)
						});
						var hydrogenAtom3 = getHydroAtom(3);
						hydrogenAtom3.setOpacity(1);
						canvasModel.add(hydrogenAtom3);
						hydrogenAtom3.animate({left: 508, top: 448, opacity: 1}, {
							duration: (1000 * time),
							onChange: canvasModel.renderAll.bind(canvasModel),
							onComplete: function() {
								hydrogenAtom3.setOpacity(0);
								hydrogenAtom3.setLeft(374);
								hydrogenAtom3.setTop(452);
							}
						});
						var hydrogenAtom4 = getHydroAtom(4);
						hydrogenAtom4.setOpacity(1);
						canvasModel.add(hydrogenAtom4);
						hydrogenAtom4.animate({left: 515, top: 448, opacity: 1}, {
							duration: (1000 * time),
							onChange: canvasModel.renderAll.bind(canvasModel),
							onComplete: function () {
								hydrogenAtom4.setOpacity(0);
								hydrogenAtom4.setLeft(404);
								hydrogenAtom4.setTop(450);
								makeOxy();
								hydrogenWheelLoop();
								hydroCascade();
							}
						});
					}
				}
			});
		}
	});
}
 function releaseOxy(id) {
	 var oxygenGas = getOxyGas(id);
	 canvasModel.add(oxygenGas);
 }

function makeOxy() {
	initializeOxyAtom();
	var oxygenAtom1 = getOxyAtom(1);
	var oxygenAtom2 = getOxyAtom(2);
	var movingOxyGas = getOxyGas(0);
	canvasModel.add(movingOxyGas);
	canvasModel.remove(oxygenAtom1);
	canvasModel.remove(oxygenAtom2);
	movingOxyGas.animate({top: 135}, {
		duration: (2000 * time),
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			movingOxyGas.animate({left: 53, top: 159}, {
				duration: (1000 * time),
				onChange: canvasModel.renderAll.bind(canvasModel),
				onComplete: function() {
					canvasModel.remove(movingOxyGas);
					movingOxyGas.setLeft(323);
					movingOxyGas.setTop(392);
					if (waterLoopCounter == 1) {
						canvasModel.add(releasedGasText);
						releaseOxy(1);
						canvasModel.remove(chlorophyll1);
						canvasModel.remove(chlorophyll2);
						canvasModel.remove(chlorophyll3);
						canvasModel.remove(atpDomino1);
						canvasModel.remove(atpDomino2);
						chlorophyll1.setAngle(0);
						chlorophyll2.setAngle(0);
						chlorophyll3.setAngle(0);
						atpDomino1.setAngle(0);
						atpDomino2.setAngle(0);
						energyCarrierEMPTY99.setAngle(44);
						energyCarrierEMPTY99.setLeft(800);
						energyCarrierEMPTY99.setTop(800);
						resetForWaterLoop();
					} else {
						releaseOxy(waterLoopCounter);
						canvasModel.remove(chlorophyll1);
						canvasModel.remove(chlorophyll2);
						canvasModel.remove(chlorophyll3);
						canvasModel.remove(atpDomino1);
						canvasModel.remove(atpDomino2);
						chlorophyll1.setAngle(0);
						chlorophyll2.setAngle(0);
						chlorophyll3.setAngle(0);
						atpDomino1.setAngle(0);
						atpDomino2.setAngle(0);
						energyCarrierEMPTY99.setAngle(44);
						energyCarrierEMPTY99.setLeft(800);
						energyCarrierEMPTY99.setTop(800);
						resetForWaterLoop();
					}
				}
			});
		}
	});
}

function hydrogenWheel(id, left, top) {
	var hydrogenInputAtom = getHydrogenInputAtom(id);
	canvasModel.add(hydrogenInputAtom);
	hydrogenInputAtom.animate({left: left, top: top}, {
		duration: (2500 * time),
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
}

function hydrogenWheelLoop() {
	for (var i = 1; i <= 4; i++) {
		var hydroId = ((waterLoopCounter * 4) + (i - 4));
		var top = (172 + (waterLoopCounter * 20));
		hydrogenWheel(hydroId, (540 + (i * 15)), top);
		if ((waterCounter >= 6) && (carbDioxCounter >= 6)) {
			glucoseMade = true;
		}
	}
}

function hydroCascade() {
	var chargingBlockSound = new Audio("./assets/chargingBlockSound.mp3");
	chargingBlockSound.play();
	for (var i = 1; i <= 4; i++) {
		var hydrogenAtom = getHydroAtom(i);
		canvasModel.remove(hydrogenAtom);
	}
	atpDomino1.animate({left: 522, top: 440, angle: 37}, {
		duration: (50 * time),
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			atpDomino2.animate({left: 565, top: 420, angle: 34}, {
				duration: (50 * time),
				onChange: canvasModel.renderAll.bind(canvasModel),
				onComplete: function() {
					energyCarrierEMPTY99.animate({angle: 0}, {
						duration: (50 * time),
						onChange: canvasModel.renderAll.bind(canvasModel),
						onComplete: function() {
							canvasModel.remove(energyCarrierEMPTY99);
							canvasModel.add(energyCarrierFULL99);
							loadMachine();
						}
					});
				}
			});
		}
	});
}

function energyMove(id, left, top) {
	var energyCarrierFULL = getEnergyCarrierFULL(id);
	canvasModel.add(energyCarrierFULL);
	energyCarrierFULL.animate({left: left, top: top, angle: 0}, {
		duration: (700 * time),
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
}

function loadMachine() {
	canvasModel.remove(energyCarrierFULL99);
	canvasModel.remove(energyCarrierEMPTY99);
	var carrierLeft1 = 630 + (waterLoopCounter * 35);
	var carrierLeft2 = 630 + ((waterLoopCounter - 3) * 35);
	if (waterLoopCounter < 4) {
		energyMove(waterLoopCounter, carrierLeft1, 193);
	} else if (waterLoopCounter > 3) {
		energyMove(waterLoopCounter, carrierLeft2 , 253);
	}
}

/*
function releaseEnergyLoop() {
	energyWheel.setLeft(747);
	energyWheel.setTop(473);
	energyWheel.setAngle(-90);
	canvasModel.add(energyWheel);
	hydrogenWheelLoop();
	var carrierLeft1 = 630 + (waterLoopCounter * 35);
	var carrierLeft2 = 630 + ((waterLoopCounter - 3) * 35);
	if (waterLoopCounter < 4) {
		energyMove(waterLoopCounter, carrierLeft1, 193);
	} else if (waterLoopCounter > 3) {
		energyMove(waterLoopCounter, carrierLeft2 , 253);
	}
}


function turnEnergyWheel() {
	var hydrogenAtom1 = getHydroAtom(1);
	var hydrogenAtom2 = getHydroAtom(2);
	var hydrogenAtom3 = getHydroAtom(3);
	var hydrogenAtom4 = getHydroAtom(4);
	var energyWheelGroup = new fabric.Group([hydrogenAtom1, hydrogenAtom2, hydrogenAtom3, hydrogenAtom4, energyWheel], {originX: 'center', originY: 'center'});
	canvasModel.add(energyWheelGroup);
	canvasModel.remove(energyWheel);
	hydrogenAtom1.setOpacity(0);
	hydrogenAtom2.setOpacity(0);
	hydrogenAtom3.setOpacity(0);
	hydrogenAtom4.setOpacity(0);
	initializeHydroAtom();
	energyWheelGroup.animate({angle: -90}, {
		duration: (1000 * time),
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	energyCarrierEMPTY1.animate({left: 767, top: 395, angle: 90}, {
		duration: (1000 * time),
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			energyCarrierEMPTY1.setOpacity(0);
			canvasModel.remove(energyWheelGroup);
			releaseEnergyLoop();
		}
	});
} */

//Phase 3 Objects
var energyCarrierFULL = {};
var hydrogenInputAtom = {};
var singleOxy = {};

function makeEnergyCarrierFULL(id, scale, left, top) {
	fabric.Image.fromURL("./assets/energyCarrierFULL.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    energyCarrierFULL[id] = img;
  });
}

function resetFullCarrierObjects() {
	for (var i = 0; i < 6; i++) {
		var fullCarrierObject = energyCarrierFULL[i + 1];
		canvasModel.remove(fullCarrierObject);
	}
	energyCarrierFULL = {};
}

function makeHydrogenInputAtom(id, scale, left, top) {
	fabric.Image.fromURL("./assets/hydrogen.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    hydrogenInputAtom[id] = img;
  });
}

function resetHydroInputObjects() {
	for (var i = 0; i < 24; i++) {
		var hydroInputObject = hydrogenInputAtom[i + 1];
		canvasModel.remove(hydroInputObject);
	}
	hydrogenInputAtom = {};
}


function makeSingleOxy(id, scale, left, top, opacity) {
	fabric.Image.fromURL("./assets/oxygenAtom.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    img.setOpacity(opacity);
    singleOxy[id] = img;
  });
}

function resetSingleOxyObjects() {
	for (var i = 0; i < 6; i++) {
		var singleOxyObject = singleOxy[i + 1];
		canvasModel.remove(singleOxyObject);
	}
	singleOxy = {};
}

function initializeEnergyCarrierFULL() {
	makeEnergyCarrierFULL(1, 0.15, 595, 385);
	makeEnergyCarrierFULL(2, 0.15, 595, 385);
	makeEnergyCarrierFULL(3, 0.15, 595, 385);
	makeEnergyCarrierFULL(4, 0.15, 595, 385);
	makeEnergyCarrierFULL(5, 0.15, 595, 385);
	makeEnergyCarrierFULL(6, 0.15, 595, 385);
}

function initializeHydrogenInputAtom() {
	makeHydrogenInputAtom(1, 0.5, 494, 448);
	makeHydrogenInputAtom(2, 0.5, 501, 448);
	makeHydrogenInputAtom(3, 0.5, 508, 448);
	makeHydrogenInputAtom(4, 0.5, 515, 448);
	makeHydrogenInputAtom(5, 0.5, 494, 448);
	makeHydrogenInputAtom(6, 0.5, 501, 448);
	makeHydrogenInputAtom(7, 0.5, 508, 448);
	makeHydrogenInputAtom(8, 0.5, 515, 448);
	makeHydrogenInputAtom(9, 0.5, 494, 448);
	makeHydrogenInputAtom(10, 0.5, 501, 448);
	makeHydrogenInputAtom(11, 0.5, 508, 448);
	makeHydrogenInputAtom(12, 0.5, 515, 448);
	makeHydrogenInputAtom(13, 0.5, 494, 448);
	makeHydrogenInputAtom(14, 0.5, 501, 448);
	makeHydrogenInputAtom(15, 0.5, 508, 448);
	makeHydrogenInputAtom(16, 0.5, 515, 448);
	makeHydrogenInputAtom(17, 0.5, 494, 448);
	makeHydrogenInputAtom(18, 0.5, 501, 448);
	makeHydrogenInputAtom(19, 0.5, 508, 448);
	makeHydrogenInputAtom(20, 0.5, 515, 448);
	makeHydrogenInputAtom(21, 0.5, 494, 448);
	makeHydrogenInputAtom(22, 0.5, 501, 448);
	makeHydrogenInputAtom(23, 0.5, 508, 448);
	makeHydrogenInputAtom(24, 0.5, 515, 448);
}

function initializeSingleOxy() {
	makeSingleOxy(1, 0.6, 630, 210, 0);
	makeSingleOxy(2, 0.6, 630, 225, 0);
	makeSingleOxy(3, 0.6, 630, 240, 0);
	makeSingleOxy(4, 0.6, 630, 255, 0);
	makeSingleOxy(5, 0.6, 630, 270, 0);
	makeSingleOxy(6, 0.6, 630, 285, 0);
}

function getEnergyCarrierFULL(id) {
	return energyCarrierFULL[id];
}

function getHydrogenInputAtom(id) {
	return hydrogenInputAtom[id];
}

function getSingleOxy(id) {
	return singleOxy[id];
}

function initializePhase3Objects() {
	initializeEnergyCarrierFULL();
	initializeHydrogenInputAtom();
	initializeSingleOxy();
}

function deathAlertDelay() {
	var pause = setTimeout(deathAlert, (7500 * time));
}

var singleOxygenAlert = null;
fabric.Image.fromURL("./assets/singleOxygenAlert.jpg", function (img) {
  img.scale(0.6);
  img.setLeft(205);
  img.setTop(105);
  singleOxygenAlert = img;
});

function deathAlert() {
	alert("REACTION ERROR!\n\nLook at the message for more information.");
	canvasModel.add(singleOxygenAlert);
	alertType = "singleOxygenAlert";
	madeSingleOxy = "yes";
	addNewTrial();
	resetPlaybackButtons();
}

function formH20() {
	for (var i = 1; i <= (waterCounter - 6); i++) {
		var singleOxy = getSingleOxy(i);
		canvasModel.remove(singleOxy);
		var outputH2O = getOutputH2O(i);
		canvasModel.add(outputH2O);
		outputH2O.animate({left: 560, top: (140 + (i * 25)), opacity: 1}, {
			duration: (1500 * time),
			onChange: canvasModel.renderAll.bind(canvasModel),
		});
	}
	for (var j = 1; j <= ((waterCounter - 6) * 2); j++) {
		var hydrogenInputAtom = getHydrogenInputAtom(j + 12);
		canvasModel.remove(hydrogenInputAtom);
	}
	if (waterCounter == 12) {
		delaySuccess();
	} else {
		deathAlertDelay();
	}
}

function delayFormH20() {
	var pause = setTimeout(formH20, (3000 * time));
}

function scatterSingleOxy(id) {
	madeSingleOxy = true;
	var singleOxySound = new Audio("./assets/singleOxySound.mp3");
	singleOxySound.play();
	var singleOxy = getSingleOxy((waterCounter - 6) + id);
	canvasModel.add(singleOxy);
	singleOxy.animate({left: (Math.random() * (randomLeftMax - randomLeftMin + 1)) + randomLeftMin, top: (Math.random() * (randomTopMax - randomTopMin + 1)) + randomTopMin, opacity: 1}, {
		duration: (1500 * time),
		onChange: canvasModel.renderAll.bind(canvasModel),
		onComplete: function() {
			singleOxy.animate({left: (Math.random() * (randomLeftMax - randomLeftMin + 1)) + randomLeftMin, top: (Math.random() * (randomTopMax - randomTopMin + 1)) + randomTopMin}, {
				duration: (1500 * time),
				onChange: canvasModel.renderAll.bind(canvasModel),
				onComplete: function() {
					singleOxy.animate({left: (Math.random() * (randomLeftMax - randomLeftMin + 1)) + randomLeftMin, top: (Math.random() * (randomTopMax - randomTopMin + 1)) + randomTopMin}, {
						duration: (1500 * time),
						onChange: canvasModel.renderAll.bind(canvasModel),
						onComplete: function() {
							singleOxy.animate({left: (Math.random() * (randomLeftMax - randomLeftMin + 1)) + randomLeftMin, top: (Math.random() * (randomTopMax - randomTopMin + 1)) + randomTopMin}, {
								duration: (1500 * time),
								onChange: canvasModel.renderAll.bind(canvasModel)
							});
						}
					});
				}
			});
		}
	});
}

function destroyCell() {
	for (var i = 1; i <= (12 - waterCounter); i++) {
		scatterSingleOxy(i);
	}
	if (waterCounter == 6) {
		deathAlertDelay();
	}
}

var randomLeftMax = 980;
var randomLeftMin = 295;
var randomTopMax = 505;
var randomTopMin = 105;

//Math.random() * (max - min + 1)) + min;

function neutralize() {
	for (var i = 1; i <= (waterCounter - 6); i++) {
		var singleOxy = getSingleOxy(i);
		canvasModel.add(singleOxy);
		if (i == 1 || i == 2) {
			singleOxy.animate({left: 530 + (i * 30), top: 248, opacity: 1}, {
				duration: (1500 * time),
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 3 || i == 4) {
			singleOxy.animate({left: 470 + (i * 30), top: 268, opacity: 1}, {
				duration: (1500 * time),
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		} else if (i == 5 || i == 6) {
			singleOxy.animate({left: 410 + (i * 30), top: 288, opacity: 1}, {
				duration: (1500 * time),
				onChange: canvasModel.renderAll.bind(canvasModel)
			});
		}
	}
	if (waterCounter == 8 || waterCounter ==  10 || waterCounter == 12) {
		delayFormH20();
	}
}

function resetForWaterLoop() {
	chlorophyll1.setLeft(240);
	chlorophyll1.setTop(445);
	canvasModel.add(chlorophyll1);
	chlorophyll2.setLeft(335);
	chlorophyll2.setTop(425);
	canvasModel.add(chlorophyll2);
	chlorophyll3.setLeft(330);
	chlorophyll3.setTop(455);
	//canvasModel.add(chlorophyll3);
	atpDomino1.setLeft(495);
	atpDomino1.setTop(445);
	canvasModel.add(atpDomino1);
	atpDomino2.setLeft(540);
	atpDomino2.setTop(425);
	canvasModel.add(atpDomino2);
	canvasModel.add(energyCarrierEMPTY99);
	if (isPaused) {
		$('#start').prop('disabled', false);
	} else {
		continueAnimation();
	}
}

function continueAnimation() {
	$('#pause').prop('disabled', false);
	$('#start').prop('disabled', true);
	energyCarrierEMPTY99.animate({left: 613, top: 395}, {
		duration: (3000 * time),
		onChange: canvasModel.renderAll.bind(canvasModel)
	});
	for (var i = 1; i <= 4; i++) {
		var hydrogenAtom = getHydroAtom(i);
		canvasModel.add(hydrogenAtom);
	}
	var water1 = getH2O(1);
	if (remainingNumH2O > 0) {
		addWater();
		//$("#loops").html("# of Rounds = " + waterLoopCounter);
	} else if (glucoseMade && (5 < waterCounter < 12) && (carbDioxCounter == 6)) {
		collectMolecules();
		return;
	} else if (!glucoseMade || (glucoseMade && carbDioxCounter < 6)) {
		alert("THE REACTION FAILED!\n\nLook at the message for more information.");
		canvasModel.add(lowReactantsAlert);
		alertType = "lowReactantsAlert";
		addNewTrial();
		resetPlaybackButtons();
		return;
	} else if (glucoseMade && carbDioxCounter > 6) {
		alert("The glucose reaction can only use 6 CO2 at a time.");
		resetPlaybackButtons();
		collectMolecules();
	} else if (glucoseMade) {
		collectMolecules();
	}
}

function collectCO2() {
	for (var i = 1; i <= 6; i++) {
		var carbonDioxide = getCO2(i);
		carbonDioxide.animate({left: 579, top: (166 + (i * 20)), opacity: 0}, {
			duration: (2000 * time),
			onChange: canvasModel.renderAll.bind(canvasModel)
		});
	}
}

function collectInputHydro() {
	for (var i = 1; i <= 12; i++) {
		var hydrogenInputAtom = getHydrogenInputAtom(i);
		if (i <= 4) {
				var top = 192;
		} else if (4 < i <= 8) {
			var top = 212;
		} else {
			var top = 232;
		}
		hydrogenInputAtom.animate({left: 640, top: top, opacity: 0}, {
			duration: (2000 * time),
			onChange: canvasModel.renderAll.bind(canvasModel)
		});
	}
}

function delay() {
	var pause = setTimeout(makeGroup, (2500 * time));
}

function collectMolecules() {
	var glucoseRxnSound = new Audio("./assets/glucoseRxnSound.mp3");
	glucoseRxnSound.play();
	collectInputHydro();
	collectCO2();
	delay();
	neutralize();
	destroyCell();
}

var moleculesGroup;

function makeGroup() {
	for (var i = 1; i <= 12; i++) {
		if (i <= 6) {
			var hydrogenInputAtoms = getHydrogenInputAtom(i);
			var carbonDioxides = getCO2(i);
			var energyCarrierFULLs = getEnergyCarrierFULL(i);
		} else {
			var hydrogenInputAtoms = getHydrogenInputAtom(i);
		}
	}
	moleculesGroup = new fabric.Group(hydrogenInputAtom, carbonDioxide, energyCarrierFULL);
	canvasModel.add(moleculesGroup);
	if (carbDioxCounter < 6) {
		alert("THE REACTION FAILED!\n\nLook at the message for more information.");
		canvasModel.add(lowReactantsAlert);
		alertType = "lowReactantsAlert";
		addNewTrial();
		resetPlaybackButtons();
		return;
	} else {
		makeGlucose();
	}
}

// Phase 4 Objects
var glucose = null;
fabric.Image.fromURL("./assets/glucose.png", function (img) {
  img.scale(0.15);
  img.setLeft(736);
  img.setTop(165);
  img.setOpacity(0);
  glucose = img;
});

var outputH2O = {};
var emptyOutputEnergyCarrier = {};

function makeOutputH2O(id, scale, left, top) {
	fabric.Image.fromURL("./assets/water.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    outputH2O[id] = img;
  });
}

function resetWaterOutputObjects() {
		for (var i = 0; i < 6; i++) {
			var waterOutputObject = outputH2O[i + 1];
			canvasModel.remove(waterOutputObject);
		}
		outputH2O = {};
}

function makeEmptyOutputEnergyCarrier(id, scale, left, top) {
	fabric.Image.fromURL("./assets/energyCarrierEMPTY.png", function (img) {
    img.scale(scale);
    img.setLeft(left);
    img.setTop(top);
    emptyOutputEnergyCarrier[id] = img;
  });
}

function resetEnergyOutputObjects() {
		for (var i = 0; i < 6; i++) {
			var energyOutputObject = emptyOutputEnergyCarrier[i + 1];
			canvasModel.remove(energyOutputObject);
		}
		emptyOutputEnergyCarrier = {};
}

 function initializeOutputH2O() {
	 makeOutputH2O(1, 0.6, 548, 250);
	 makeOutputH2O(2, 0.6, 578, 250);
	 makeOutputH2O(3, 0.6, 548, 280);
	 makeOutputH2O(4, 0.6, 578, 280);
	 makeOutputH2O(5, 0.6, 548, 310);
	 makeOutputH2O(6, 0.6, 578, 310);
 }

 function initializeEmptyOutputEnergyCarrier() {
 	makeEmptyOutputEnergyCarrier(1, 0.15, 664, 193);
 	makeEmptyOutputEnergyCarrier(2, 0.15, 699, 193);
 	makeEmptyOutputEnergyCarrier(3, 0.15, 734, 193);
 	makeEmptyOutputEnergyCarrier(4, 0.15, 664, 253);
 	makeEmptyOutputEnergyCarrier(5, 0.15, 699, 253);
 	makeEmptyOutputEnergyCarrier(6, 0.15, 734, 253);
 }

function getOutputH2O(id) {
	return outputH2O[id];
}

function getEmptyOutputEnergyCarrier(id) {
	return emptyOutputEnergyCarrier[id];
}
function initializePhase4Objects () {
	initializeOutputH2O();
	initializeEmptyOutputEnergyCarrier();
}

var extraCO2Alert = null;
fabric.Image.fromURL("./assets/extraCO2Alert.jpg", function (img) {
  img.scale(0.6);
  img.setLeft(465);
  img.setTop(45);
  extraCO2Alert = img;
});

var successMessage = null;
fabric.Image.fromURL("./assets/successMessage.jpg", function (img) {
  img.scale(0.6);
  img.setLeft(80);
  img.setTop(330);
  successMessage = img;
});

function success() {
	if (carbDioxCounter > 6) {
		alert("REACTION CAUTION!\n\nLook at the message for more information.");
		canvasModel.add(extraCO2Alert);
		alertType = "extraCO2Alert";
		madeGlucose = "yes";
		addNewTrial();
		resetPlaybackButtons();
	} else {
		alert("CONGRATULATIONS!");
		canvasModel.add(successMessage);
		alertType = "successMessage";
		madeGlucose = "yes";
		addNewTrial();
		resetPlaybackButtons();
		return;
	}
}

function delaySuccess() {
	var pause = setTimeout(success, (1500 * time));
}

function makeGlucose() {
	canvasModel.remove(moleculesGroup);
	canvasModel.add(glucose);
	glucose.animate({left: 852, top: 165, opacity: 1}, {
		duration: (500 * time),
		onChange: canvasModel.renderAll.bind(canvasModel),
	});
	for (var i = 1; i <= (waterCounter/2); i++) {
		var emptyOutputEnergyCarrier = getEmptyOutputEnergyCarrier(i);
		canvasModel.add(emptyOutputEnergyCarrier);
	}
		/*outputH2O.animate({left: 790, top: (155 + (i * 25)), opacity: 1}, {
			duration: (500 * time),
			onChange: canvasModel.renderAll.bind(canvasModel),
		});*/
	//delaySuccess();
}

function resetCascade() {
	$("#start, #resetAnimation, #lightOn, #co2Input, #h2oInput, #speedSwitch").prop("disabled", false);
  $("#replay, #pause").prop("disabled", true);
  $("#totalH2O").html("");
  $("#water").hide();
	$("#lightOn").prop("checked", true);
	canvasModel.setOverlayColor("rgba(0, 0, 0, 0)", canvasModel.renderAll.bind(canvasModel));
	waterLoopCounter = 0;
  remainingNumH2O = waterCounter;
  canvasModel.remove(releasedGasText);
  canvasModel.remove(lowReactantsAlert);
  canvasModel.remove(chlorophyllWaterAlert);
  canvasModel.remove(chlorophyllLightAlert);
  canvasModel.remove(extraCO2Alert);
  canvasModel.remove(singleOxygenAlert);
  canvasModel.remove(successMessage);
	chlorophyll1.setAngle(0);
	chlorophyll1.setLeft(240);
	chlorophyll1.setTop(445);
	canvasModel.add(chlorophyll1);
	chlorophyll2.setAngle(0);
	chlorophyll2.setLeft(335);
	chlorophyll2.setTop(425);
	canvasModel.add(chlorophyll2);
	chlorophyll3.setAngle(0);
	chlorophyll3.setLeft(330);
	chlorophyll3.setTop(455);
	//canvasModel.add(chlorophyll3);
	atpDomino1.setAngle(0);
	atpDomino1.setLeft(495);
	atpDomino1.setTop(445);
	canvasModel.add(atpDomino1);
	atpDomino2.setAngle(0);
	atpDomino2.setLeft(540);
	atpDomino2.setTop(425);
	canvasModel.add(atpDomino2);
	energyCarrierEMPTY99.setAngle(44);
	energyCarrierEMPTY99.setLeft(613);
	energyCarrierEMPTY99.setTop(395);
	canvasModel.add(energyCarrierEMPTY99);
	resetCO2Objects();
  resetH2OObjects();
  resetPhotonObjects();
  resetOxyObjects();
  resetHydroObjects();
  resetOxyGasObjects();
  resetFullCarrierObjects();
  resetHydroInputObjects();
  resetWaterOutputObjects();
  resetEnergyOutputObjects();
  resetSingleOxyObjects();
  initializePhase1Objects();
  initializePhase2Objects();
  initializePhase3Objects();
  initializePhase4Objects();
  initializeTrialData();
  if (glucoseMade) {
    canvasModel.remove(glucose);
  }
}

function resetAll() {
	$('#co2Input, #h2oInput').val(0).trigger('change');
	$('#speedSwitch').val(2).trigger('change');
	waterCounter = 0;
	carbDioxCounter = 0;
	resetCascade();
}

function replay() {
	resetCascade();
}

function resetPlaybackButtons() {
	$('#replay, #resetAnimation').prop('disabled', false);
	$('#pause').prop('disabled', true);
}

//function addCarbonDioxide() {draw.rect(150,30).x(430).y(150).radius(10).fill('yellow').stroke({width:2}).opacity(1).attr({
  //      'fill-opacity': 0
    //}).click(function() {
    //	fabric.Image.fromURL('./carbonDioxide.png', function(img){
	//		img.scale(0.6);
	//		img.setLeft(130);
	//		img.setTop(24);
	//		canvas.add(img)
      //  });
  //  });
//}


// code to log the specifications of an object in the Inspector Console as the object is moved/selected real-time
function logSpecifications(ctx){
      console.log('Left: ' + ctx.target.getLeft() + ' Top: ' + ctx.target.getTop() + ' Angle: ' + ctx.target.getAngle());
  }
canvasModel.on ({
      'object:selected': logSpecifications
  });
// canvasControls.on ({
//       'object:selected': logSpecifications
//   });
// another way to set the canvas background image
//canvas.setBackgroundImage('./chloroplast.jpg', canvas.renderAll.bind(canvas));


// scale/zoom entire canvas
//canvas.setZoom();

//var makeshiftMakeGlucose = setTimeout(makeGlucose, 100900); */

/**
 * Save the student data to WISE
 */
function save() {
		// create a component state
    var componentState = {};
    componentState.isAutoSave = false;
    componentState.isSubmit = false;
    componentState.studentData = {
				"trials": trials
		};
		componentState.id = latestComponentStateId;

    // save the component state to WISE
    saveWISE5State(componentState);
}

/**
 * Send a component state to the parent
 * @param componentState the component state
 */
function saveWISE5State(componentState) {
    componentState.messageType = 'studentWork';
    componentState.id = latestComponentStateId;

    sendMessage(componentState);
}

/**
 * Send a message to the parent
 * @param the message to send to the parent
 */
function sendMessage(message) {
    window.postMessage(message, "*");
}

/**
 * Receive a message from the parent
 * @param message the message from the parent
 */
function receiveMessage(message) {

    if (message != null) {
        var messageData = message.data;

        if (messageData != null) {
            if (messageData.messageType == 'studentWork') {
                /*
                 * we have received a message that contains the latest student work from
                 * this component and other components in this node
                 */
                /*latestStudentWorkFromThisComponent = messageData.latestStudentWorkFromThisComponent;
                latestStudentWorkFromThisNode = messageData.latestStudentWorkFromThisNode;
                latestStudentWorkFromOtherComponents = messageData.latestStudentWorkFromOtherComponents;*/
            } else if (messageData.messageType == 'nodeSubmitClicked') {
                /*
                 * the student has clicked the submit button and the student
                 * work has been included in the message data
                 */
                /*latestStudentWorkFromThisComponent = messageData.latestStudentWorkFromThisComponent;
                latestStudentWorkFromThisNode = messageData.latestStudentWorkFromThisNode;
                latestStudentWorkFromOtherComponents = messageData.latestStudentWorkFromOtherComponents;*/
            } else if (messageData.messageType == 'componentStateSaved') {
                /*
                 * the student work that this model asked to save has now been saved
                 * to the server
                 */
                //latestStudentWorkFromThisComponent = messageData.componentState;
                //latestComponentStateSaved = messageData.componentState;
								latestComponentStateId = messageData.componentState.id;
            } else if (messageData.messageType == 'siblingComponentStudentDataChanged') {
                // the student work from another component in this node has changed
                /*updateLatestStudentWorkFromThisNode(messageData.componentState);*/
            }
        }
    }
}

// listen for messages from the parent
window.addEventListener('message', receiveMessage);
