var vertices = [];
var normals = [];
var colors = [];
var objects = [];
var lights = [];

var scene;

var gl;
var canvas;
var program;

var RLoc;
var SLoc;
var TLoc;
var intensityLoc;
var nLightsLoc;

var matWorldUniformLocation;
var matViewUniformLocation;
var matProjUniformLocation;
var matNormUniformLocation;

var worldMatrix;
var viewMatrix;
var projMatrix;
var normMatrix;

var xRotationMatrix;
var yRotationMatrix;
var zRotationMatrix;

var identityMatrix;
var sceneRotationAngle;

var TLRir;
var TUDir;
var TFBir;

var SXir;
var SYir;
var SZir;

var RXir;
var RYir;
var RZir;

var RWXir;
var RWYir;
var RWZir;

var SEyeXir;
var SEyeYir;
var SEyeZir;

var SCenXir;
var SCenYir;
var SCenZir;

var SLightXir;
var SLightYir;
var SLightZir;

var numObj = 0;
var objMenu;
var addedObjectsMenu;
var addedLightsMenu;
var projMenu;

var visibleChkB;
var colorInput;
var lightColorInput;

var nLights = 0;