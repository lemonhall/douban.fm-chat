/*
 * FormData for XMLHttpRequest 2  -  Polyfill for Web Worker  (c) 2012 Rob W
 * License: Creative Commons BY - http://creativecommons.org/licenses/by/3.0/
 * - append(name, value[, filename])
 * - toString: Returns an ArrayBuffer object
 * 
 * Specification: http://www.w3.org/TR/XMLHttpRequest/#formdata
 *                http://www.w3.org/TR/XMLHttpRequest/#the-send-method
 * The .append() implementation also accepts Uint8Array and ArrayBuffer objects
 * Web Workers do not natively support FormData:
 *                http://dev.w3.org/html5/workers/#apis-available-to-workers
 **/
(function() {
    var debug=true;
    if (debug===true) {
    // Export variable to the global scope
    (this == undefined ? self : this)['FormData'] = FormData;   

    var ___send$rw = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype['send'] = function(data) {
        if (data instanceof FormData) {
            if (!data.__endedMultipart) data.__append('--' + data.boundary + '--\r\n');
            data.__endedMultipart = true;
            this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + data.boundary);
            data = new Uint8Array(data.data).buffer;
        }
        // Invoke original XHR.send
        return ___send$rw.call(this, data);
    };

    // var ___open$rw = XMLHttpRequest.prototype.open;
    // XMLHttpRequest.prototype['open'] = function() {
    //     console.log(arguments);
    //     // Invoke original XHR.open
    //     return ___open$rw.apply(this, arguments);
    // };

    function FormData() {
        var myself=this;
        // Force a Constructor        
        if (!(this instanceof FormData)) return new FormData();
        //得到参数的类型？
        // var argumentsType = Object.prototype.toString.call(arguments[0]);
        // console.log("argumentsType???"+argumentsType);


        // Generate a random boundary - This must be unique with respect to the form's contents.
        this.boundary = '----WebKitFormBoundary' + Math.random().toString(36);
        var internal_data = this.data = [];
        this.args=arguments;
        
        var internal_data_string=this.data_string=[];
        /**
        * Internal method.
        * @param inp String | ArrayBuffer | Uint8Array  Input
        */
        this.__append = function(inp) {
            var i=0, len;
            if (typeof inp === 'string') {
                internal_data_string.push(inp);
                for (len=inp.length; i<len; i++){
                    internal_data.push(inp.charCodeAt(i) & 0xff);                   
                }
            } else if (inp && inp.byteLength) {/*If ArrayBuffer or typed array */   
                if (!('byteOffset' in inp))   /* If ArrayBuffer, wrap in view */
                    inp = new Uint8Array(inp);
                for (len=inp.byteLength; i<len; i++)
                    internal_data.push(inp[i] & 0xff);
            }
        };

    //使用了JQ和UNDERSCORE，来搞定传入的如果是一个现有FORM时的问题
    if (arguments[0] instanceof HTMLFormElement){
        var form_ser=$(arguments[0]).serializeArray();
              //console.log("I am a HTMLFormElement");
              //console.log(form_ser);
        _.each(form_ser, function(item){ 
                //console.log("I am in each");
                //console.log(item.name);
                myself.append(item.name,item.value);
        });
                
        }
    }
    /**
    * @param name     String                                  Key name
    * @param value    String|Blob|File|Uint8Array|ArrayBuffer Value
    * @param filename String                                  Optional File name (when value is not a string).
    **/
    FormData.prototype['append'] = function(name, value, filename) {
        if (this.__endedMultipart) {
            // Truncate the closing boundary
            this.data.length -= this.boundary.length + 6;
            this.__endedMultipart = false;
        }
        var valueType = Object.prototype.toString.call(value),
            part = '--' + this.boundary + '\r\n' + 
                'Content-Disposition: form-data; name="' + name + '"';

        if (/^\[object (?:Blob|File)(?:Constructor)?\]$/.test(valueType)) {
            return this.append(name,
                            new Uint8Array(new FileReaderSync().readAsArrayBuffer(value)),
                            filename || value.name);
        } else if (/^\[object (?:Uint8Array|ArrayBuffer)(?:Constructor)?\]$/.test(valueType)) {
            part += '; filename="'+ (filename || 'render.png').replace(/"/g,'%22') +'"\r\n';
            part += 'Content-Type: image/png\r\n\r\n';
            this.__append(part);
            this.__append(value);
            part = '\r\n';
        } else {
            part += '\r\n\r\n' + value + '\r\n';
        }
        this.__append(part);
    };
};//End of debug==true??
})(); 