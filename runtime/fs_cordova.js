// Js_of_ocaml runtime support
// http://www.ocsigen.org/js_of_ocaml/
// Copyright (C) 2014 Jérôme Vouillon, Hugo Heuzard
// Laboratoire PPS - CNRS Université Paris Diderot
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, with linking exception;
// either version 2.1 of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.

//Provides: MlCordovaDevice
//Requires: MlCordovaFile, MlFakeFile
var MlCordovaDevice = (function () {
    var instance ;
    window.requestFileSystem(joo_global_object.LocalFileSystem.PERSISTENT, 0,
                             function (fs) { instance.fs = fs ; }) ;
    return function (root) {
        if (instance) {
            if (instance.root && instance.root != root) { throw "instance.root != root" }
            else if (instance.locked) { throw "locked" }
            else { return instance }
        } else {
            instance.root = root ;
            return intance
        }
    }
}) () ;


MlCordovaDevice.prototype.nm = function(name) {
  return (this.root + name);
}

MlCordovaDevice.prototype.exists = function(name) {
  var res ;
  this.fs.root.getFile(name, { create: false },
                       function () { res = true ; },
                       function () { res = false ; }) ;
  return res ;
}

MlCordovaDevice.prototype.is_dir = function(name) {
  var res ;
  this.fs.root.getFile(name, { create: false },
                       function (f) { res = f.isDirectory ; },
                       function () { res = false ; }) ;
  return res ;
}

MlCordovaDevice.prototype.unlink = function(name) {
  var res ;
  this.fs.root.getFile(name, { create: false },
                       function(f) { f.remove ( function () { res = true },
                                                function () { res = false } ) } ) ;
  return res ;
}

// FIXME: handle f
MlCordovaDevice.prototype.open = function(name, f) {
    var res ;

    this.fs.root.getFile (
        name, { create: false }, function (fe) {
            var reader = new joo_global_object.FileReader () ;
            reader.onload = function (e) {
                res = new MlCordovaFile(name, fe, new MlFakeFile(e.target.result) ) ;
            } ;
            reader.readAsBinaryText () ;
        },
        function () {  }
    ) ;
    return res
}

MlCordovaDevice.prototype.constructor = MlCordovaDevice

//Provides: MlCordovaFile
//Requires: MlFile, MlFakeFile
function MlCordovaFile(fs, name, fileEntry, fake) {
    this.fake = fake ;
    this.fileEntry = fileEntry ;
    this.name = name ;
}
MlCordovaFile.prototype.read = function (offset, buf, pos, len) {
    this.fake.read (offset, buf, pos, len) ;
}
MlCordovaFile.prototype.read_one = function (offset) {
    this.fake.read_one (offset) ;
}
MlCordovaFile.prototype.close = function () {
    this.fake.close () ;
}
MlCordovaFile.prototype.write = function(offset, buf, pos, len) {
    this.fake.write (offset, buf, pos, len) ;
    var done = false ;
    this.fileEntry.createWriter (function (fw) {
        fw.onwriteend = function () {
            var tmp = this.fs.open (this.name, {}) ;
            this.fake = tmp.fake ;
            this.fileEntry = tmp.fileEntry ;
            done = true ;
        } ;
        fw.write(new joo_global_object.Blob([ this.fake.data ], {type:'text/plain'})) ;
    });
    return 0
}

MlCordovaFile.prototype.constructor = MlCordovaFile
