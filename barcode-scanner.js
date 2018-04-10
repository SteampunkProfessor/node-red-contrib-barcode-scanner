module.exports = function(RED) {
	"use strict";
	var hids = require('./node_modules/node-usb-barcode-scanner/usbscanner');
	var usbScanner = hids.usbScanner;
	var getDevices = hids.getDevices;

	function BarcodeScannerNode(n) {

		var devices = getDevices();
		var path;
		var vend_id;
        	// Create a RED node //print devices console.log(devices)

        	RED.nodes.createNode(this,n);
		//initialize new usbScanner
		findscanner();

	if (path != null) {
		var scanner = new usbScanner({vendorId:vend_id});
		//scanner emits a data event once a barcode has been read and parsed
		scanner.on("data", function(code){
			console.log("recieved code : " + code);
			var msg = {};
			msg.topic = node.topic;
			msg.payload = code;
			// send out the message to the rest of the workspace.
                 	// ... this message will get sent at startup so you may not see it in a debug node
                	node.send(msg);
		});
	} else {
		findscanner();
	}

	function findscanner() {
        	//get array of attached HID devices
        	for (var dev = 0; dev < devices.length; dev++) {
                	if (devices[dev].product.toLowerCase().indexOf('barcode') !== -1) {
                    	path = devices[dev].path;
                    	vend_id = devices[dev].vendorId;
                    	console.log("found Barcode Scanner at: "+path);
                    	break; // stop on first match
                	}
            	}
            	if (path === null) {
                	tout = setTimeout( function () {
                    		findscanner();
				},15000);
			}
		}
	}


    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("barcode-scanner",BarcodeScannerNode);
}
