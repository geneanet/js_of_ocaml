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
//Requires: MlFakeDevice
function MlCordovaDevice(root) {
  joo_global_object.console.log('MlCordovaDevice');
  joo_global_object.console.log (root);
  var device = this ;
  window.requestFileSystem(joo_global_object.LocalFileSystem.PERSISTENT, 0, function (fs) { device.fs = fs ; }) ;
  this.root = root;
  this.content = {};
  this.fake = new MlFakeDevice(root);
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
  this.fake.unlink (name) ;
  return res ;
}

// FIXME: handle f
MlCordovaDevice.prototype.open = function(name, f) {
  if (this.fake.exists (name)) { joo_global_object.console.log('exists in fake') ; return this.fake.open (name, f) }
  joo_global_object.console.log('Entering MlCordovaDevice.prototype.open ' + name);
  var res ;
  var loaded = false ;
  joo_global_object.console.log('Foo');
  joo_global_object.console.log(loaded);
  this.fs.root.getFile(name, { create: false },
                       function () {
                           joo_global_object.console.log('Allez');
                           var reader = new joo_global_object.FileReader();
                           reader.onload = function (e) {
                               joo_global_object.console.log('loadend');
                               this.fake.register(name, e.target.result);
                               res = this.fake.open(name, f);
                               loaded = true ;
                               joo_global_object.console.log('loaded = true');
                           } ;
                           reader.readAsBinaryText() ;
                       },
                       function () {
                           joo_global_object.console.log('Should it be? ( ' + this.nm(name) + ')');
                           loaded = true ;
                       }
                      ) ;
  joo_global_object.console.log('Bar');
  joo_global_object.console.log(loaded);
    var wait = function () {
        joo_global_object.console.log('.') ;
        if (loaded) { return } else { joo_global_object.setTimeout(wait, 500) }
    } ;
    wait () ;
    joo_global_object.console.log('Returning from MlCordovaDevice.prototype.open');
    joo_global_object.console.log(loaded);
    res
}

MlCordovaDevice.prototype.constructor = MlCordovaDevice
