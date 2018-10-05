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
    return function (root) {
        if (instance) {
            if (instance.root != root) { throw "instance.root != root" }
            return instance
        } else {
            this.fs = window.requestFileSystemSync(joo_global_object.LocalFileSystem.PERSISTENT, 0) ;
            this.root = root ;
            this.content = {} ;
        }
    }
}) ()

// function MlCordovaDevice(root) {
//   var device = this ;
//   window.requestFileSystem(joo_global_object.LocalFileSystem.PERSISTENT, 0, function (fs) { device.fs = fs ; }) ;
//   this.root = root;
//   this.content = {};
// }

MlCordovaDevice.prototype.nm = function(name) {
  return (this.root + name);
}

MlCordovaDevice.prototype.exists = function(name) {
    try { this.fs.root.getFile(name, { create: false } ) ; return 1 }
    catch (e) { return 0 }
}

MlCordovaDevice.prototype.is_dir = function(name) {
    try { (this.fs.root.getFile(name, { create: false } )).isDirectory | 0 }
    catch (e) { return 0 }
}

MlCordovaDevice.prototype.unlink = function(name) {
    try { this.fs.root.getFile(name, { create: false }).remove () ; return true }
    catch (e) { return false }
}

// FIXME: handle f
MlCordovaDevice.prototype.open = function(name, f) {
    var fe = this.fs.root.getFile (name, { create: false }) ;
    var reader = new joo_global_object.FileReaderSync () ;
    return new MlCordovaFile(name, fe, reader.readAsBinaryText ())
}

MlCordovaDevice.prototype.constructor = MlCordovaDevice

//Provides: MlCordovaFile
//Requires: MlFile, MlFakeFile
function MlCordovaFile(name, fileEntry, fake) {
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
    var fw = this.fileEntry.createWriter () ;
    fw.write(new joo_global_object.Blob([ this.fake.data ], {type:'text/plain'})) ;
    return 0 ;
}

MlCordovaFile.prototype.constructor = MlCordovaFile
