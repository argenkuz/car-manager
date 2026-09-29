// 숫자형 확인
function isNumber(v) {
    var reg = /^(\s|\d)+$/;
    return reg.test(v);
}
function remakeNumber(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function remakeNumberKm(number) {
    if (isNumber(number)) {
        return remakeNumber(Math.round(number / 1000) / 10) + " 만";
    }
    return number;
}



/** 
* string String::cut(int len)
* 글자를 앞에서부터 원하는 바이트만큼 잘라 리턴합니다.
* 한글의 경우 2바이트로 계산하며, 글자 중간에서 잘리지 않습니다.
*/
String.prototype.cut = function(vLenLimit) {
    var str = this;
    var vLen = 0;
    var strTemp = "";
    for (var i = 0; i <= str.length; i++) {
        var iCodeAt = str.charCodeAt(i) > 128 ? 2 : 1
        vLen = vLen + iCodeAt;

        if (vLen > vLenLimit) return str.substring(0, i) + "...";
    } 
    

    return str;
}

/** 
* bool String::bytes(void)
* 해당스트링의 바이트단위 길이를 리턴합니다. (기존의 length 속성은 2바이트 문자를 한글자로 간주합니다)
*/
String.prototype.bytes = function() {
    var str = this;
    var l = 0;
    for (var i=0; i <= str.length; i++){
        l = l + str.charCodeAt(i) > 128 ? 2 : 1;
    } 
    return l;
}

// 배열크기
Array.max = function (array) {
    return Math.max.apply(Math, array);
};

/****************************************************************/
/* datetime to format string */
/**
*  convertion javascript in function
*  amadeux@naver.com
* 
**/
/****************************************************************/
Date.prototype.format = function (f) {
    if (!this.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };


function JsonDateStrToDateTime(cdate) {
    // date = /Date(1291548407008)/
    if (cdate.indexOf("Date") > -1 && cdate.indexOf("Date(-") < 0) {
        var substringedDate = cdate.substring(6); //substringedDate= 1291548407008)/
        var parsedIntDate = parseInt(substringedDate); //parsedIntDate= 1291548407008
        var date = new Date(parsedIntDate);  // parsedIntDate passed to date constructor

        return date.format("yyyy-MM-dd HH:mm");
    } else {
        return "";
    }
}


/****************************************************************/
/* cookie array module add, remove, clear, items */
/**
*  convertion jQuery cookie
*  http://www.jQuery.com & http://www.theguild.co.kr
*  amadeux@naver.com
**/
/****************************************************************/
//This is not production quality, its just demo code.
var cookieList = function (cookieName) {
    //When the cookie is saved the items will be a comma seperated string
    //So we will split the cookie by comma to get the original array
    var cookie = $.cookie(cookieName);

    //Load the items or a new array if null.
    var items = cookie ? cookie.split(/,/) : new Array();

    //Return a object that we can use to access the array.
    //while hiding direct access to the declared items array
    return {
        "add": function (val) {
            //Add to the items.
            if ($.cookie(cookieName) == "null") {
                items = new Array();
            }

            items.push(val);
            //Save the items to a cookie.
            $.cookie(cookieName, items.join(','), { path: "/", expires: 100});
        },
        "remove": function (val, indx) {
            //EDIT: Thx to Assef and luke for remove.
            if (indx == null)
                indx = items.indexOf(val);

            if (indx != -1) items.splice(indx, 1);
            $.cookie(cookieName, items.join(','));
        },
        "clear": function () {
            items = null;
            $.cookie(cookieName, null);
            //clear the cookie.
            $.removeCookie(cookieName);
        },
        "items": function () {
            //Get all the items.
            return items;
        }
    }
}




/* Base  64 encode decode in UTF8 */
/**
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}
/* event.keycode check */
function isOnlyNumber(e) {
    var keycode = window.event.keyCode;
    var evt = e || window.event;
    window.event.returnValue = false;
    if (keycode == 8 ||
        (keycode >= 35 && keycode <= 40) ||
        (keycode >= 46 && keycode <= 57) ||
        (keycode >= 96 && keycode <= 105) ||
        keycode == 110 || keycode == 190) {
        return e.returnValue = true;
    } else {
        return e.returnValue = false;
    }
}

var browser = function () {
    switch (true) {
        case $.browser.msie:
            return "MS";
        case $.browser.mozilla:
            return "MO";
        case $.browser.safari:
            return "SA";
        case $.browser.opera:
            return "OP";
        default:
            return "";
    }
}



// Numeric only control handler
jQuery.fn.ForceNumericOnly =
function () {
    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 ||
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

