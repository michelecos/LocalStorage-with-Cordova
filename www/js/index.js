/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function myLog(text, clear) {
  var span = document.getElementById('myLog');
  if (clear) {
    while (span.firstChild) {
      span.removeChild(span.firstChild);
    }
  }
  var para = document.createElement("P");
  var t = document.createTextNode(text);
  para.appendChild(t);
  document.body.appendChild(para);
  span.appendChild(para);
}

function errorHandler(fileName, e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'Storage quota exceeded';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'File not found';
      break;
    case FileError.SECURITY_ERR:
      msg = 'Security error';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'Invalid modification';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'Invalid state';
      break;
    default:
      msg = 'Unknown error';
      break;
  }

  myLog('Error (' + fileName + '): ' + msg);
}

var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    myLog("in onDeviceReady");
    app.receivedEvent('deviceready');

    function writeToFile(fileName, data) {
      data = JSON.stringify(data, null, '\t');
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(directoryEntry) {
        directoryEntry.getFile(fileName, {
          create: true
        }, function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
              // for real-world usage, you might consider passing a success callback
              myLog('Write of file "' + fileName + '"" completed.');
            };

            fileWriter.onerror = function(e) {
              // you could hook this up with our global error handler, or pass in an error callback
              myLog('Write failed: ' + e.toString());
            };

            var blob = new Blob([data], {
              type: 'text/plain'
            });
            fileWriter.write(blob);
          }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
      }, errorHandler.bind(null, fileName));
    }

    myLog("Writing file");
    writeToFile('example.json', {
      foo: 'bar'
    });

    // !! Assumes variable fileURL contains a valid URL to a path on the device,
    //    for example, cdvfile://localhost/persistent/path/to/downloads/

    function downloadFile(webaddr) {
      var uri = encodeURI(webaddr);
      var fileName = "localtest.zip";

      myLog('download ' + webaddr, false);

      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(directoryEntry) {
        directoryEntry.getFile(fileName, {
          create: true
        }, function(fileEntry) {
          var fileTransfer = new FileTransfer();
          fileTransfer.download(
            uri,
            fileEntry.toURL(),
            function(entry) {
              myLog("download complete: " + entry.toURL());
            },
            function(error) {
              myLog("download error source " + error.source);
              myLog("download error target " + error.target);
              myLog("upload error code" + error.code);
            },
            true, {}
          );
        });
      });
    }

    myLog("download file");
    downloadFile("http://192.168.1.107:8080/test.zip");

  }, // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    myLog('Received Event: ' + id);
  }
};
