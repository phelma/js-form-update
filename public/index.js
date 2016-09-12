'use strict';

// https://github.com/yanatan16/nanoajax
var reqfields = ['responseType', 'withCredentials', 'timeout', 'onprogress']
var ajax = function (params, callback) {
  var headers = params.headers || {}
    , body = params.body
    , method = params.method || (body ? 'POST' : 'GET')
    , called = false
  var req = getRequest(params.cors)
  function cb(statusCode, responseText) {
    return function () {
      if (!called) {
        callback(req.status === undefined ? statusCode : req.status,
                 req.status === 0 ? "Error" : (req.response || req.responseText || responseText),
                 req)
        called = true
      }
    }
  }
  req.open(method, params.url, true)
  var success = req.onload = cb(200)
  req.onreadystatechange = function () {
    if (req.readyState === 4) {success()}
  }
  req.onerror = cb(null, 'Error')
  req.ontimeout = cb(null, 'Timeout')
  req.onabort = cb(null, 'Abort')
  if (body) {
    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
    if (!window.FormData || !(body instanceof window.FormData)) {
      setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
    }
  }
  for (var i = 0, len = reqfields.length, field; i < len; i++) {
    field = reqfields[i]
    if (params[field] !== undefined){
      req[field] = params[field]
    }
  }
  for (var field in headers){
    req.setRequestHeader(field, headers[field])
  }
  req.send(body)
  return req
}
function getRequest(cors) {
  if (cors && window.XDomainRequest && !/MSIE 1/.test(navigator.userAgent)){
    return new XDomainRequest
  }
  if (window.XMLHttpRequest){
    return new XMLHttpRequest
  }
}
function setDefault(obj, key, value) {
  obj[key] = obj[key] || value
}
// END nanoajax


console.log('lets go');

var form = document.querySelector('#form');
var submitBtn = document.querySelector('#submit-btn');
var cameraSelect = document.querySelector('#cam-select');
var inputPan = document.querySelector('#input-pan');
var inputTilt = document.querySelector('#input-tilt');
var inputZoom = document.querySelector('#input-zoom');

var out = document.querySelector('#out');

var getCamState = function(camId) {
  console.log('fetching ' + camId);
  ajax({url: '/api/camera/' + camId}, function(status, res) {
    var state = JSON.parse(res);
    console.log('got', state);
    setState(state)
  })
};

var setState = function(state) {
  cameraSelect.value = state.camId,
  inputPan.value = state.pan;
  inputTilt.value = state.tilt;
  inputZoom.value = state.zoom;
};

var sendState = function(state) {
  console.log('sending', state);
  ajax({url: '/api/camera/' + state.camId, method: 'POST', body: state}, function(status, res) {
    var state = JSON.parse(res);
    console.log('got', state);
  })
}

submitBtn.onclick = function(event){
  event.preventDefault();

  var state = {
    camId : cameraSelect.value,
    pan : inputPan.value,
    tilt: inputTilt.value,
    zoom: inputZoom.value
  }

  sendState(state);
}

cameraSelect.onchange = function(event) {
  event.preventDefault();

  var cam = cameraSelect.value;
  console.log('getting cam ' + cam);
  getCamState(cam);
}

// get some initial values
getCamState('cam1');
