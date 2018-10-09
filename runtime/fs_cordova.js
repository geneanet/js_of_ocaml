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

//Provides: fs_cordova_supported
function fs_cordova_supported () {
    return (typeof joo_global_object.cordova !== 'undefined'
            && typeof joo_global_object.cordova.file !== 'undefined')
}

//Provides: MlCordovaDevice
//Requires: MlFakeDevice
function MlCordovaDevice (root) {
    MlFakeDevice.call (this, root) ;
}

MlCordovaDevice.prototype = new MlFakeDevice () ;

MlCordovaDevice.prototype.xhr = function (name) {
    var path = joo_global_object.cordova.file.applicationDirectory + name ;
    MlFakeDevice.prototype.xhr.call(this, name) ;
}

MlCordovaDevice.prototype.constructor = MlCordovaDevice ;
