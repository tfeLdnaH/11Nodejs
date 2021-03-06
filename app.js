/*var http = require('http');

function handle_incoming_request (req, res) {
	console.log("INCOMING REQUEST: " + req.method + " " + req.url);
	res.writeHead(200, { "Content-Type" : "application/json" });
	res.end(JSON.stringify( { error: null }) + "\n");
}

var s = http.createServer(handle_incoming_request);
s.listen(8080); */
/* in order to execute and get the result open up new cmd and type ->curl -X GET http://localhost:8080/ (the result: {"error":null,"data":{"albums":[]}})
var http = require('http'),
fs = require('fs');
function load_album_list (callback) {
	fs.readdir("albums",
		function (err, files) {
			if (err) {
				callback(err);
				return;
			}
			var only_dirs = [];
			for (var i = 0; i < files.length; i++) {
				fs.stat("albums/" + files[i], function (err, stats) {
					if (stats.isDirectory()) {
						only_dirs.push(files[i]);
					}
				});
			}
			callback(null, only_dirs);
		}
	);
}*/ 
//in order to execute and get the result open up new cmd and type ->curl -X GET http://localhost:8080/ (the result: {"error":null,"data":{"albums":["australia","info.txt","italy","japan"]}}
//that function bellow does not identify the difference between file and folder, the code above does that
/*function load_album_list (callback) {
	fs.readdir("albums",
		function (err, files) {
			if (err) {
				callback(err);
				return;
			}
			callback(null, files);
		}
	);
}
*/
/*
function load_album_list (callback) {
	fs.readdir( "albums",
		function (err, files) {
			if (err) {
				callback(err);
				return;
			}
			var only_dirs = [];
			( function iterator(index) {
				if (index == files.length) {
					callback(null, only_dirs);
					return;
 				} 
				fs.stat( "albums/" + files[index],
				function (err, stats) {
					if (err) {
						callback(err);
						return;
					}
					if (stats.isDirectory()) {
						only_dirs.push(files[index]);
					}
					iterator(index + 1)
				});
			})(0);
		}
	);
}
*/
var http = require('http'),
    fs = require('fs');
//that point fixed the issue that the program  are reading either directory or file. the result -> {"error":null,"data":{"albums":["australia","italy","japan"]}}
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    fs.readdir("albums", (err, files) => {
        if (err) {
            callback(err);
            return;
        }

        var only_dirs = [];
        
        var iterator = (index) => {
            if (index == files.length) {
                callback(null, only_dirs);
                return;
            }

            fs.stat("albums/" + files[index], (err, stats) => {
                if (err) {
                    callback(err);
                    return;
                }
                if (stats.isDirectory()) {
                    only_dirs.push(files[index]);
                }
                iterator(index + 1)
            });
        }
        iterator(0);
    });
}

function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    load_album_list((err, albums) => {
        if (err) {
            res.writeHead(500, {"Content-Type": "application/json"});
            res.end(JSON.stringify(err) + "\n");
            return;
        }

        var out = { error: null,
                    data: { albums: albums }};
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(out) + "\n");
    });
}
/*function handle_incoming_request (req, res) {
	console.log("INCOMING REQUEST: " + req.method + " " + req.url);
	load_album_list( function (err, albums) {
		if (err) {
			res.writeHead(503, {"Content-Type": "application/json"});
			res.end(JSON.stringify(err) + "\n");
			return;
		}
		var out = { error: null,
		data: { albums: albums }};
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(out) + "\n");
	});
}*/

var s = http.createServer(handle_incoming_request);
s.listen(8080);