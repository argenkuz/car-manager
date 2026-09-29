/* 전역 변수로 선언 하고 작업 한다. */
var cookieCarAmount = 0;
var cookieCarAmountPer = 0;
var cookieIsCarAmountH = 0;
var cookieIsCarDealerH = 0;
var cookieIsCarShopH = 0;
var cookieIsCarLastUpdateH = 0;
var cookieIsCarNumberH = 0;
var cookieIsCarImageView = true;
var cookieIsLeaseMarkerView = true;
//////////////////////////////////////////////////////////////////
/* 기본 공용 함수 */
//////////////////////////////////////////////////////////////////

// 엔터키 이벤트
function IsKeyPressEnter(e, carno, id) {
    if (e.keyCode == 13) {
        reSetKeyLog(carno, id);
        return false;
    }
}

// 이전페이지로 이동
function goBack() {
    history.back();
}

// 바탕화면 숏컷 만들기
function createShotCut() {
    var agent = navigator.userAgent.toLowerCase();
    if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
        if (confirm("바탕화면에 바로가기 아이콘을 만드시겠습니까?")) {
            var vShell = new ActiveXObject("WScript.Shell");
            Desktoptemp = vShell.Specialfolders("Desktop");
            var vShotcutName = vShell.CreateShortcut(Desktoptemp + "\\중고차 카매니저.url");
            vShotcutName.TargetPath = "http://www.carmanager.co.kr";
            vShotcutName.Save();
            alert("[중고차 카매니저] 이름으로 아이콘이 생성되었습니다.");
        }
    }
    else {
        alert("인터넷 익스플로러 브라우저에서 사용가능하며\n크롬 브라우저는 Ctrl+D키를 누르시면 \n즐겨찾기에 추가하실 수 있습니다.");
    }
}

// 즐겨찾기 추가
function bookmarksiteAdd() {
    var _bookmarkurl = 'http://www.carmanager.co.kr';
    var _title = "카매니저 - 중고자동차 새로운 바람";

    if (window.sidebar) {
        // firefox 
        window.sidebar.addPanel(_title, _bookmarkurl, "");
    } else if (window.external && ('AddFavorite' in window.external)) {
        // Internet Explorer
        window.external.AddFavorite(_bookmarkurl, _title);
    }else if (window.opera && window.print) { // opera
        var elem = document.createElement('a');
        elem.setAttribute('href', _bookmarkurl);
        elem.setAttribute('title', _title);
        elem.setAttribute('rel', 'sidebar');
        elem.click();
    }else{
        // Google Chrome
        alert("Ctrl+D키를 누르시면 즐겨찾기에 추가하실 수 있습니다.");
    }
}

// 문자열 변경 html escape
function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
function htmlConvertSago(str) {
    return String(str)
    .replace(/font/g, '')
    .replace(/color/g, '')
    .replace(/=/g, '')
    .replace(/red/g, '')
    .replace(/blue/g, '')
    .replace(/strong/g, '')
    .replace(/>/g, '')
    .replace(/</g, '');
}

/* 윈도우 팝업 */
var openwindow;
function openPopup(url, width, height, position) {
    var screenW = screen.availWidth;
    var screenH = screen.availHeight;

    var posLeft = ( screenW - width ) / 2
    var posTop = (screenH - height) / 2

    var optionPara = "toolbar=no, scrollbars=yes, resizable=false, width=" + width + ", height=" + height;

    if (position) {
        optionPara += ", top=" + posTop + ", left=" + posLeft;
    }
    if (openwindow) {
        try {
            if (location.pathname.indexOf("/UserReg") > -1) {
                openwindow = window.open(url, url, optionPara);
            } else {
                openwindow.location.href = url;
            }
            // 크롬
            if (typeof openwindow.location.href === "undefined") {
                openwindow = window.open(url, "openwindowname", optionPara);
            }
        } catch (ex) {
            openwindow = window.open(url, "openwindowname", optionPara);
        }
    } else {
        openwindow = window.open(url, "openwindowname", optionPara);
    }
    openwindow.focus();
}

function UpLoadPhotoFile(carno) {
    var features = 'width=380, height=350, scrollbars=no, resizable=no, toolbar=no'
    window.open('/include/se/photo_uploader/popup/photo_uploader.html?carno=' + carno, '사진업로드', features);
}
function UpLoadSingleFile(carno, carimageno) {
    // carimageno 가 공백이면 등록, 있으면 수정
    var features = 'width=380, height=200, scrollbars=no, resizable=no, toolbar=no'
    var url = carimageno.length > 0 ? '/FileUpLoad/PopupSingle/' + carno + '?carphotono=' + carimageno : '/FileUpLoad/PopupSingle/' + carno;
    window.open(url, '사진업로드', features);
}

//// 전체페이지 에서 스크롤 생성할 부분을 생성시킨다. ////
function reSetScrollEvent() {
    $(".scrollbar ul > li").each(function () {
        $(this).click(function () {
            var vImage = $(this).find("img");
            var vDataNo = "";   // 데이터 전송때 사용
            if (vImage.length != 0) {
                if (vImage.attr('src').indexOf('_on') > 0) {
                    vImage.attr('src', vImage.attr('src').replace('_on', '_off'));
                    $(this).removeClass("uc_selectedcolor");
                    $(this).css('background-color', 'transparent');
                    // vDataNo += vDataNo.replace(($(this).attr("data-no") + ","),"");
                } else {
                    vImage.attr('src', vImage.attr('src').replace('_off', '_on'));
                    $(this).addClass("uc_selectedcolor");
                    $(this).css('background-color', '#f5f5f5');
                    // vDataNo += $(this).attr("data-no") + ",";
                }
            } else {
                // 이미지가 없는 것은 다중이 아님으로 초기화 한다.
                var vBGround = $(this).css('background-color');
                // 값을 기억한 후 초기화 한다.
                $(this).parent('.uc_selectitem').find('li').each(function (index) {
                    $(this).removeClass("uc_selectedcolor");
                });
                reSetSelected(this, vBGround);
                vDataNo = $(this).attr("data-no");
            }
        });
    });
}

function reSetSelected(selectitem, vBGround) {
    // crome 에서는 rgba 를 사용
    if (!$(selectitem).hasClass('uc_selectedcolor')) {
        $(selectitem).parent('.uc_selectitem').find('li').removeClass("uc_selectedcolor");
        $(selectitem).addClass('uc_selectedcolor');
    } else {
        $(selectitem).removeClass('uc_selectedcolor');
    }
}

// 콤마 함수 생성
function digits(val){
    return val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

$.fn.digits = function () {
    return this.each(function () {
        $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    })
}


// jquery 필수 상단에 입력 해야 함
/*
conditions
 - jquery obj for input
 - data type(AP: alphabet, N: number, HA: hangul, AN: alphanumeric)
 - event type (click, keydown, keypress, keyup(*default) ...)
 - handler binded event type (*optional)
 - max length( *optional)
 
*/
function addInputHandler(conditions) {
    var $input = conditions.input;
    var dataType = conditions.dataType;
    var eventType = conditions.eventType;
    if ((!$input) || (!dataType)) {
        throw { error: "NotEnoughArguments", errorMsg: "required argument is missing " + ((!$input) ? " target input element" : " dataType") }
        return;
    }
    if ($input[0].tagName != "INPUT") {
        throw { error: "IlregalTargetElement", errorMsg: "target element is not input" };
        return;
    }
    if ((!eventType)) {
        eventType = "keyup";
    }
    var handlerFunc = conditions.handler;
    if ((!handlerFunc)) {
        handlerFunc = function (event) {
            // 입력 키코드 확인 
            // $("#divKeyCode").empty().html("<span> event key code = " + event.keyCode + "</span>");
            var regEx = null;
            if (dataType == "N") {
                regEx = /[^0-9]/gi;
            } else if (dataType == "AP") {
                regEx = /[^a-z]/gi;
            } else if (dataType == "AN") {
                regEx = /[^a-z0-9]/gi;
            } else if (dataType == "HA") {
                regEx = /[a-z0-9]/gi;
            } else if (dataType == "EM") {      /*기존 이메일 정규식 체크시 중간에 특수문자 _가 들어가지안아 이메일 형식 체크중 EM 추가*/
                regEx = /[^0-9a-zA-Z]([-_\.]?[^0-9a-zA-Z])/gi;
            } else {
                throw { error: "IlregalDataType", errorMsg: "dataType(" + dataType + ") is incorrect" }
            }
            remainOnlyTargetValue(regEx, $input, event);
            //return true;
        };  // end of handlerFunc
    } // end of if to check handlerFunc
    $input.on(eventType, handlerFunc);

    if (conditions.maxlength) {
        $input.attr("maxlength", conditions.maxlength);
    }

}


function remainOnlyTargetValue(regEx, $input, event) {
    if ((!(event.keyCode >= 34 && event.keyCode <= 40)) && event.keyCode != 16) {
        var inputVal = $input.val();
        if (regEx.test(inputVal)) {
            $input.val(inputVal.replace(regEx, ''));
        }
    }
}
/* 공용 페이지 */
function reLoadPaging(paging) {
    var innerHtml = "";
    var pagearea = 5;
    var totalpage = parseInt(paging.PageTCount / paging.PageRow);
    if ((paging.PageTCount % paging.PageRow) > 0) {
        totalpage++;
    }

    // 이전페이지
    var prepage = (parseInt(paging.PageNumber / pagearea) - 1) * pagearea + 1;
    prepage = prepage < 1 ? 1 : prepage;
    // 다음페이지
    var nexpage = (parseInt(paging.PageNumber / pagearea) + 1) * pagearea + 1;
    nexpage = totalpage < nexpage ? totalpage : nexpage;

    innerHtml = innerHtml + "<table>";
    innerHtml = innerHtml + "   <tr>";

    // 페이지 구하기
    if (paging.PageNumber == 1) {
        innerHtml = innerHtml + "           <th><img src='/include/image/page/btn_first.gif' /></th>";
    }
    else {
        innerHtml = innerHtml + "           <th class='uc_btnmode' onclick='goPageSubmit(1);'><img src='/include/image/page/btn_first.gif' /></th>";
    }
    if (totalpage > 0) {
        innerHtml = innerHtml + "           <th class='uc_btnmode' onclick='goPageSubmit(" + prepage + ");'><img src='/include/image/page/btn_prev.gif' /></th>";
    }

    // 페이지 번호 구성
    for (var ipage = 0; ipage < totalpage && ipage < pagearea; ipage++) {
        var ipagenow = ipage + parseInt(paging.PageNumber / pagearea) * pagearea + 1;
        if (ipagenow == paging.PageNumber) {
            innerHtml = innerHtml + "           <td class='uc_choose'>" + ipagenow + "</td>";
        }
        else {
            innerHtml = innerHtml + "           <td class='uc_btnmode' onclick='goPageSubmit(" + ipagenow + ");'>" + ipagenow + "</td>";
        }
    }

    // 페이지 마지막
    if (totalpage > 0) {
        innerHtml = innerHtml + "           <th class='uc_btnmode' onclick='goPageSubmit(" + nexpage + ");'><img src='/include/image/page/btn_next.gif' /></th>";
    }

    if (paging.PageNumber == totalpage) {
        innerHtml = innerHtml + "           <th><img src='/include/image/page/btn_last.gif' /></th>";
    }
    else {
        innerHtml = innerHtml + "           <th class='uc_btnmode' onclick='goPageSubmit(" + totalpage + ")'><img src='/include/image/page/btn_last.gif' /></th>";
    }

    innerHtml = innerHtml + "   </tr>";
    innerHtml = innerHtml + "</table>";

    /* 페이징 시킨다. */
    return innerHtml;
}


/* 정규식 이메일 체크 */
function ischeckEmail(strValue) {
    var regExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;
    //입력을 안했으면
    if (strValue.length == 0) { return false; }

    // 형식에 맞지않으면
    if (!strValue.match(regExp)){ return false; }

    return true;

}

/* 정규식 전화번호 체크 */
function ischeckPhone(strValue) {
    var regExp = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    //입력을 안했으면
    if (strValue.length == 0) { return false; }

    // 형식에 맞지않으면
    if (!strValue.match(regExp)) { return false; }

    return true;
}

function isDateFormat(d) {
    var df = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
    return df.test(d);
}

function digit_check(evt) {
    var code = evt.which ? evt.which : evt.keyCode;
    if ((code >= 48 && code <= 57) || (code == 8 ) || (code == 9)) {
        return;
    }

    return false;
}

function digit_Format(num, mode) {
    num = num.replace("-", "");

    var rex;
    if (mode == "HP") {
        if (num.length > 11) {
            num = num.substr(0,11);
        }
        if (num.length > 3 && num.length < 8) {
            return num.replace(/(\d{3})(\d{1,4})/, "$1-$2");
        } else if (num.length >= 8 && num.length < 11) {
            return num.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3");
        } else if (num.length == 11) {
            return num.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }
    }

    if (mode == "PHONE") {
        if (num.length > 11) {
            num = num.substr(0, 11);
        }
        if (num.indexOf("02") == 0) {
            if (num.length > 2 && num.length < 7) {
                return num.replace(/(\d{2})(\d{1,4})/, "$1-$2");
            } else if (num.length >= 7 && num.length < 10) {
                return num.replace(/(\d{2})(\d{3})(\d{1,4})/, "$1-$2-$3");
            } else if (num.length == 10) {
                return num.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
            }
        } else {
            if (num.length > 3 && num.length < 8) {
                return num.replace(/(\d{3})(\d{1,4})/, "$1-$2");
            } else if (num.length >= 8 && num.length < 11) {
                return num.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3");
            } else if (num.length == 11) {
                return num.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
            }
        }
    }
    
    if (mode == "DATE") {
        if (num.length > 8) { num = num.substr(0, 8); }
        if (num.length > 4 && num.length <= 6) {
            return num.replace(/(\d{4})(\d{1,2})/, "$1-$2");
        } else if (num.length > 6 && num.length <= 8) {
            return num.replace(/(\d{4})(\d{2})(\d{1,2})/, "$1-$2-$3");
        }
    }
    return num;
}

/* 정규식*/
function IsDateFormat(v) {
    var regExp = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
    return regExp.test(v);
}


/* 검색 두개의 시작일과 종료일 비교 */
function IsCompareSrDate(sStartDate, sEndDate) {
    if (sStartDate != "") {
        if (!IsDateFormat(sStartDate)) {
            alert("검색 시작일 을 정확히 입력하세요!")
            return false;
        }
    }
    if (sEndDate != "") {
        if (!IsDateFormat(sEndDate)) {
            alert("검색 종료일 을 정확히 입력하세요!")
            return false;
        }
    }
    if (sStartDate != "" && sEndDate != "") {
        var dtSDate = Date.parse(sStartDate);
        var dtEDate = Date.parse(sEndDate);
        if (dtSDate > dtEDate) {
            alert("시작일이 종료일보다 이후일 수는 없습니다. 다시입력하세요.");
            return false;
        }
    }
    return true;
}

/*작업자 : 김선오
현재 시간이 둘 시간 범위에 포함되는지 확인
파라미터값 ex) 202411221200
*/
function IsCompareSrDate2(StartDate, EndDate) {

    var now = new Date(); // 현재시간
    var year = now.getFullYear(); // 현재 시간 중 4자리 연도
    var month = now.getMonth() + 1; // 현재 시간 중 달 (0부터 시작하므로 +1)
    if (month < 10) {
        month = "0" + month; // 한 자리면 앞에 0을 붙임
    }
    var date = now.getDate(); // 현재 시간 중 날짜
    if (date < 10) {
        date = "0" + date;
    }
    var hour = now.getHours(); // 현재 시간 중 시간
    if (hour < 10) {
        hour = "0" + hour;
    }
    var minute = now.getMinutes(); // 현재 시간 중 분
    if (minute < 10) {
        minute = "0" + minute;
    }

    // 오늘 날짜 완성
    var today = year + "" + month + "" + date + "" + hour + "" + minute;

    if (eval(today) >= eval(StartDate) && eval(today) <= eval(EndDate)) {
        return true;
    }
    else {
        return false;
    }
}

/*작업자 : 정다은
숫자만 입력및 글자수 제한 제한
*/
function StrDayEndDayCheck(StrDay, EndDay) {
    $(StrDay).change(function (event) {
        var vStrDay = $(StrDay).val();
        var vEndDay = $(EndDay).val();
        vStrDay = replaceAllStrDayEndDay(vStrDay, "-", "");
        vEndDay = replaceAllStrDayEndDay(vEndDay, "-", "");
        vStrDay = Number(vStrDay);
        vEndDay = Number(vEndDay);
        if (vStrDay > vEndDay && vStrDay > 0 && vEndDay > 0) {
            alert("시작일이 종료일보다 큽니다. 날짜를 다시 선택해주세요");
            $(StrDay).val("");
            $(EndDay).val("");
            return false;
        }
        return true;

    });
    $(EndDay).change(function (event) {
        var vStrDay = $(StrDay).val();
        var vEndDay = $(EndDay).val();
        vStrDay = replaceAllStrDayEndDay(vStrDay, "-", "");
        vEndDay = replaceAllStrDayEndDay(vEndDay, "-", "");
        vStrDay = Number(vStrDay);
        vEndDay = Number(vEndDay);
        if (vStrDay > vEndDay && vStrDay > 0 && vEndDay > 0) {
            alert("시작일이 종료일보다 큽니다. 날짜를 다시 선택해주세요");
            $(StrDay).val("");
            $(EndDay).val("");
            return false;
        }
        return true;

    });
}
function replaceAllStrDayEndDay(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}


/**
 * JSON 객체로 폼 요소를 생성.
 * @Param data JSON 객체
 * @Param formName 생성할 폼 이름
 * @Return 생성된 폼 요소를 반환
 * 
 * [예제]
 * var form = makeFormElements({
 *     name:"apple",
 *     group: [{type:"A"},{type:"B"}],	// 배열 하위 항목이 객체일 경우 key가 존재하기 때문에 type이 key가 됨
 *     child: ["cat","dog"],			// 배열 하위 항목이 primitive value 일 경우 key 가 없기 때문에 배열의 이름인 child가 key가 됨 
 * }, "myform");
 * 
 * [생성된 폼]
 * <form name="myform">
 *     <input type="hidden" name="name" value="apple">
 *     <input type="hidden" name="type" value="A">
 *     <input type="hidden" name="type" value="B">
 *     <input type="hidden" name="child" value="cat">
 *     <input type="hidden" name="child" value="dog">
 * </form>
 */
function makeFormElements(data, formName) {
    var makeFormString = function (_data, parentKey) {
        var str = "";
        for (var key in _data) {
            if (/__|prototype/ig.test(key))				// 시스템 속성은 제외 (__proto__, __defineGetter__, prototype 등)
                continue;
            else if (_data[key] instanceof Array)		// 배열일 경우 (예: member["a", "b"])
                str += makeFormString(_data[key], key);	// "member"를 원소의 key로 지정 ("a","b"는 key가 존재하지 않기 때문) 
            else if (typeof _data[key] === "object")	// 하위요소를 포함한 객체일 경우 (예: member[{name:"a"},{name:"b"}])
                str += makeFormString(_data[key]);
            else
                str += "<input type='hidden' name='" + (parentKey ? parentKey : key) + "' value='" + _data[key] + "'/>";
        }
        return str;
    };
    $("form[name=" + formName + "]").remove();
    return $("<form  name='" + formName + "'>" + makeFormString(data) + "</form>").appendTo(document.body).data("json", data).get(0);
}
/**
makeFormElements
*/
function makeBlankFormElements(data, formName) {
    var makeFormString = function (_data, parentKey) {
        var str = "";
        for (var key in _data) {
            if (/__|prototype/ig.test(key))				// 시스템 속성은 제외 (__proto__, __defineGetter__, prototype 등)
                continue;
            else if (_data[key] instanceof Array)		// 배열일 경우 (예: member["a", "b"])
                str += makeFormString(_data[key], key);	// "member"를 원소의 key로 지정 ("a","b"는 key가 존재하지 않기 때문) 
            else if (typeof _data[key] === "object")	// 하위요소를 포함한 객체일 경우 (예: member[{name:"a"},{name:"b"}])
                str += makeFormString(_data[key]);
            else
                str += "<input type='hidden' name='" + (parentKey ? parentKey : key) + "' value='" + _data[key] + "'/>";
        }
        return str;
    };
    $("form[name=" + formName + "]").remove();
    return $("<form  target='_blank' name='" + formName + "'>" + makeFormString(data) + "</form>").appendTo(document.body).data("json", data).get(0);
}


/**
 * 데이터를 특정 페이지로 전달. post 방식 사용
 * ※ makeFormElements 과 연계됨
 * @Param url 페이지 url
 * @Param data 전달할 데이터 (JSON 객체) 또는 폼 객체
 * @Param formName 폼 이름
 * @Param type form 전송후 새창 열기  type = '_blank'일 경우 새창 그외의 경우 현재창에서 수행
 */
function postTo(url, data, formName, type) {
    if (type == "_blank")
    {
        var form = data && data instanceof HTMLFormElement ? data : makeBlankFormElements(data);
    }
    else {
        var form = data && data instanceof HTMLFormElement ? data : makeFormElements(data);
    }
    form.action = url;
    form.method = "post";
    setTimeout(function () {
        form.submit();
    }, 0);
    return form;
}


/**
 * 내차 수정및 등록페이지의 차량등록일 데이터 체크
 * @Param CarRegDay 차량 등록일 문자
 */
function CarRegDayCheck(CarRegDay)
{
    var num_check = /^[0-9]*$/;
    var recheckRegDay = CarRegDay;

    if (!num_check.test(CarRegDay) || CarRegDay.length != 8)
    {
        alert("최초등록 입력 형식이 잘못 되었습니다   ex) 19990101");
        return false;
    }
    var year, month, day;
    year = CarRegDay.substring(0, 4);
    month = CarRegDay.substring(4, 6);
    day = CarRegDay.substring(6, 8);

    if(Number(year) <1000)
    {
        alert("최초등록일 연도가 잘못 입력되었습니다 ex) 1000 ~ 9999");
        return false;
    }
    if (Number(month) < 0 || Number(month) > 12) {
        alert("최초등록일 등록 월이 잘못 입력되었습니다 ex) 01~12 ");
        return false;
    }
    if (Number(day) < 0 || Number(month) > 31) {
        alert("최초등록일 등록 일이 잘못 입력되었습니다  ex) 19990101  ");
        return false;
    }

    //유효기간 추가 체크
    var reCheckRegDayNum = reCheckRegDay(recheckRegDay);
    //console.log("CarRegDay :            ", recheckRegDay);
    //console.log("reCheckRegDayNum :             ", reCheckRegDayNum);

    if (reCheckRegDayNum != 0) {
        if (reCheckRegDayNum == 1) {
            alert("최초등록일 날짜가 해당월의 날짜를 넘었습니다.");
        } else if (reCheckRegDayNum == 2) {
            alert("최초등록일 등록하신 달이 존재하지 않는 달 입니다.");
        } else if (reCheckRegDayNum == 3) {
            alert("최초등록일 등록 일이 잘못 입력되었습니다  ex) 19990101  ");
        } else if (reCheckRegDayNum == 4) {
            alert("최초등록일 등록 일이 잘못 입력되었습니다  ex) 19990101  ");
        } else if (reCheckRegDayNum == 5) {
            alert("최초등록일은 현재날짜 이상 입력이 불가능합니다");
        }

        return false;

    } else {
        return true;
    }


    
}
//유효기간 추가 체크
function reCheckRegDay(yyyymmdd) {
    // input // yyyymmdd, yyyy-mm-dd, yyyy/mm/dd // output // 0: 정상, 1: 해당월의 날짜 넘음, 2: 존재하지 않는 달, 3: 포맷 안맞음, 4: -인 날짜
    if (yyyymmdd.length == 8) {
        if (!yyyymmdd.match(/[0-9]{8}/g))
            return 3;
        y = yyyymmdd.substring(0, 4);
        m = yyyymmdd.substring(4, 6);
        d = yyyymmdd.substring(6, 8);
    } else if (yyyymmdd.length == 10) {
        if (!yyyymmdd.match(/[0-9]{4}[-/][0-9]{2}[-/][0-9]{2}/g))
            return 3;
        y = yyyymmdd.split('-')[0];
        m = yyyymmdd.split('-')[1];
        d = yyyymmdd.split('-')[2];
    } else {
        return 3;
    }
    var limit_day;
    switch (eval(m)) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12: limit_day = 31;
            break;
        case 2:
            if ((y - 2008) % 4 == 0)
                limit_day = 29;
            else limit_day = 28;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            limit_day = 30;
            break;
        default: return 2;
            break;
    }
    if (eval(d) > limit_day) {
        return 1;
    }
    if (eval(d) < 1) {
        return 4;
    }

    //해당년도보다 크면 안됨
    /*날짜 구하기*/
    var Xdate = new Date();
    var Xyear = Xdate.getFullYear();
    var Xmonth = Xdate.getMonth() + 1
    var Xday = Xdate.getDate();
    if (Xmonth < 10) {
        Xmonth = "0" + Xmonth;
    }
    if (Xday < 10) {
        Xday = "0" + Xday;
    }
    var Xtoday = Xyear + "-" + Xmonth + "-" + Xday;
    Xtoday = Xtoday.replace(/-/gi, "");
    
    console.log("Xtoday:     ", Xtoday);
    if (Xtoday < yyyymmdd) {
        return 5;
    }

    return 0;

}


/*
    작업일자 : 2018-07-10
    작업자 : 정다은
    작업내용 : 카매니저 어플및 카매니저 웹전면 개편 알림 팝업창(2018-07-19일 오픈 알림창으로 이후 없어질 예정)
    */
function AppOpenPopUp() {
    //$('body').css('overflow', 'hidden');
    //if ($(".modal_carbackground").html() == undefined) {
    //    $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    //}
    //var vmodal = $(".modal_carbackground");
    //var vmodalcontent = $(".modal_carcontent");

    ///* 사이즈 설정 */
    //var vHeight = 550;
    //var vWidth = 980;
    //var vLeft = $(window).width() / 2 - vWidth / 2;
    //var vTop = $(window).height() / 2 - vHeight / 2 - 20;
    //var html = "<div class='pop-bg'></div>"
    //html += "<div class='layer- pop'>";
    //html += "<button class='btn'><img style='width:100%' src='/include/image/popup/delete-cross.png' /></button>";
    //html += "<img src='/include/image/popup/home_notice.jpg' />";
    //html += "</div>"
    //$(".modal_carbackground").show();
    //$(".modal_carcontent").html(html);
    //$(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });
    //$(".btn").css({ "width": 20, "height": 30, "position": "absolute", "background": "transparent", "border": "none", "out-line": "none", "right": 25, "top": 15, "cursor": "pointer" });
    //vmodal.show();
    //vmodalcontent.show();

    //$(vmodal).click(function () {
    //    $('body').css('overflow', 'visible');
    //    vmodal.hide();
    //    vmodalcontent.hide();
    //});
    //$(".btn").click(function () {
    //    $('body').css('overflow', 'visible');
    //    vmodal.hide();
    //    vmodalcontent.hide();
    //});
    location.href = "/external/mobileInfo";
}

function comma(num) {
    var len, point, str;
    if (num != null && num != "" ) {
        num = num + "";
        point = num.length % 3;
        len = num.length;

        str = num.substring(0, point);
        while (point < len) {
            if (str != "") str += ",";
            str += num.substring(point, point + 3);
            point += 3;
        }
    } else {
        str = "0";
    }

    return str;

}


function nullCheck(str) {
    var len, point, str;
    if (str != null) {
        return str;
    } else {
        return "";
    }
}


function nullCheckReturnStr(str,returnStr) {
    var len, point, str;
    if (str != null && str != "") {
        return str;
    } else {
        return returnStr;
    }
}


function InsurancePopup() {
    var uno = "";
    var configList = new cookieList("USERKEY");
    var itemconfigList = configList.items();
    if (itemconfigList.length == 1) {
        var vitemList = itemconfigList[0].toString();
        if (vitemList.indexOf("&")) {
            var arrItem = vitemList.split("&");
            for (var itemcount = 0; itemcount < arrItem.length; itemcount++) {
                var iteminfo = arrItem[itemcount];
                if (iteminfo.indexOf("=") > 0) {
                    arrItemInfo = iteminfo.split("=");
                    switch (arrItemInfo[0]) {
                        case "USERNO":
                            uno = arrItemInfo[1];
                            break;
                        default:
                            delaerFee = "1";
                    }
                }
            }
        }

    }

    ///* 사이즈 설정 */
    //var vHeight = 723;
    //var vWidth = $(window).width() - ($(window).width() / 4);
    //var vLeft = $(window).width() / 2 - vWidth / 2;
    //var vTop = $(window).height() / 2 - vHeight / 2 - 20;

    var vHeight = 733;
    var vWidth = 1100;
    var vLeft = $(window).width() / 2 - vWidth / 2;
    var vTop = $(window).height() / 2 - vHeight / 2 - 20;

    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = "userno";
    input.value = uno;   

    var form = document.createElement("form");

    window.open("", "form_" + uno, 'width=' + vWidth + ', height=' + vHeight + ',top=' + vTop + ', left=' + vLeft);
    form.appendChild(input);
    document.body.appendChild(form);

    form.action = "/external/ImprovementGuide";
    form.target = "form_" + uno;
    form.method = "post";
    form.submit();

}

function leaseEvnetGuidePopup(userNo) {
    var url = document.location.protocol + "//" + document.location.host;
    url = url + "/Lease/KbLeaseGuide?TabNo=2";

    var popup = window.open(url, '리스사용가이드', 'width=975px,height=1020px,scrollbars=no');
}
function auctionItems(CarNo, UserNo) {
    var url = document.location.protocol + "//" + document.location.host;

    url = url + "/Customer/CarAuction?CarNo=" + CarNo + "&Channel=" + "PC&UserNo=" + UserNo + "&RequestType=C";

    window.open(url, '카옥션 차량물품 신청', 'width = 640, height = 804, top = 226.5, left = 951.5,scrollbars=no');
}

/*유튜브 영상 안내팝업*/
function youtubeItems() {
    var url = document.location.protocol + "//" + document.location.host;
    url = url + "/popup/youtube_guide_pop.html";

    var vHeight = 750;
    var vWidth = 1000;
    var vLeft = $(window).width() / 2 - vWidth / 2;
    var vTop = $(window).height() / 2 - vHeight / 2 - 20;

    var popup_youtube = window.open(url, '유튜브 영상 URL 복사 방법', 'width=' + vWidth + ', height=' + vHeight + ',top=' + vTop + ', left=' + vLeft + ', scrollbars=yes, resizable=no');
}