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
//Requires: MlFakeFile
function MlCordovaDevice(root) {
  joo_global_object.console.log('MlCordovaDevice');
  joo_global_object.console.log (root);
  var device = this ;
  window.requestFileSystem(joo_global_object.LocalFileSystem.PERSISTENT, 0, function (fs) { device.fs = fs ; }) ;
  this.root = root;
  this.content = {};
}

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

// FIXME: support flags
MlCordovaDevice.prototype.open = function(name, f) {
  var path = this.nm(name) ;
  var res ;
  var loaded = false ;
  this.fs.root.getFile(path, { create: false },
                       function () {
                           var reader = new joo_global_object.FileReader();
                           reader.onloadend = function() { res = new MlFakeFile(this.result) ;
                                                           loaded = true } ;
                           reader.readAsBinaryText() ;
                       },
                       function () { loaded = true ; }) ;

    (function wait() { if (loaded) { return } else { joo_global_object.setTimeout(wait(), 5000) ; } }) ();
}

MlCordovaDevice.prototype.constructor = MlCordovaDevice
