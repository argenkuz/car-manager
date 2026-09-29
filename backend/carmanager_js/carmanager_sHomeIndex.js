function reLoadSidoMain(sidono) {
    var Url = "/CodeBase/JsonBaseCodeSiDo";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            $('.uc_sido').html("");  // 초기화
            var innerHtml = "<option selected>전체</option>";
            for (var row = 0; row < arrData.length ; row++) {
                if (arrData[row].SiDoNo) {
                    var vno = arrData[row].SiDoNo;
                    var vname = arrData[row].SiDoCodeName;
                    var vselected = vno == sidono ? " selected" : "";

                    innerHtml += "<option value='" + vno + "'" + vselected + ">" + vname + "</option>\r\n";
                }
            }
            $('.uc_sido').html(innerHtml).selectbox('detach').selectbox('attach');
        },
        fail: function (data) {
            alert("데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}

function setCookie(cName, cValue, cDay) {
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if (typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if (start != -1) {
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if (end == -1) end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}

function popDetail(danjino) {
    if (danjino == "93001") {
        window.open("http://carmanager.co.kr/include/Image/dycalandOfficial.jpg", "_blank");
    }
    else {
        window.open("http://carmanager.co.kr/include/Image/airportOfficial.jpg", "_blank");
    }
}

//임시팝업
function PopUp(url) {
    var _popObj = window.open(url);
    try {
        var $_popObj = _popObj.document.getElementsByTagName("img");
    } catch (e) {
    }
} 