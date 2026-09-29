
// 초기화 하기
function setFooterBookMarkClear() {
    var Url = "/JsonUser/JsonSetConfigBookMarkClear";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            // 데이터 등록 // 페이지 구성
            if (arrData.ErrCode) {
                if (arrData.ErrCode != "0") {
                    alert(arrData.ErrMessage);
                }
            }
            else {
                alert("북마크 삭제중 오류가 발생하였습니다.");
            }
            getFooterBookMark();
        },
        fail: function (data) {
            alert("북마크 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
            return;
        }
    });
}
function reSetFooterBookMarkRemove(keyno) {
    var arrPara = { "keyno": keyno }

    var Url = "/JsonUser/JsonSetConfigBookMarkRemove";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify(arrPara),
        dataType: "json",
        success: function (arrData) {
            // 데이터 등록 // 페이지 구성
            if (arrData) {
                if (arrData.ErrCode != "0") {
                    alert(arrData.ErrMessage);
                }
            }
            else {
                alert("북마크 삭제중 오류가 발생하였습니다.");
            }
            getFooterBookMark();
        },
        fail: function (data) {
            alert("북마크 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
            return;
        }
    });
    
}

function goBookMark(obj) {
    var rememberurl = $(obj).parent().find(".uc_rememberurl").html();
    var rememberparameter = $(obj).parent().find('.uc_rememberparameter').html();
    //var newForm = jQuery('<form>', {
    //    'action': rememberurl,
    //    'method': 'post'
    //})
    //if (rememberparameter.length > 0) {
    //    rememberparameter = decodeURIComponent(rememberparameter);
        
    //    if (rememberparameter.indexOf("&amp;") > 0) {
    //        var arrPara = rememberparameter.split("&amp;");
    //        for (var irow = 0; irow < arrPara.length ; irow++) {
    //            var item = arrPara[irow].split("=");
    //            if (item) {
    //                if (item.length == 2) {
    //                    if (item[1].length > 0)
    //                    {
    //                        newForm.append(jQuery('<input>', {
    //                            'name': item[0],
    //                            'value': item[1].replace("%2C",",").replace("on",""),
    //                            'type': 'hidden'
    //                        }));
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}
    //newForm.appendTo($("body"));
    //newForm.submit();
    location.href = rememberurl + "?" + rememberparameter;
}

function getFooterBookMark() {
    var Url = "/JsonUser/JsonGetCarConfigBookMark";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            // 데이터 등록 // 페이지 구성
            reLoadFooterBookMark(arrData);
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
            return;
        }
    });
}
function reLoadFooterBookMark(arrPara) {
    var innerHtml = "";
    if (arrPara != null) {
        var arrParaCount = arrPara.length;
        if (arrParaCount > 0) {
            $("#ui_rememberurl").show();
            for (var irow = 0; irow < arrParaCount; irow++) {
                if (arrPara[irow] != null) {
                    innerHtml += "<li data-no='" + arrPara[irow].KeyNo + "'>";
                    innerHtml += "    <a class='uc_btnmode'>" + arrPara[irow].BMSubject + "</a><b class='uc_btnmode' style='margin-bottom:3px;'>X</b>";
                    innerHtml += "    <span class='uc_rememberurl uc_hide'>" + arrPara[irow].BMUrl + "</span>";
                    innerHtml += "    <span class='uc_rememberparameter uc_hide'>" + arrPara[irow].BMPara + "</span>";
                    innerHtml += "</li>";
                }
            }
        } else {
            $("#ui_rememberurl").hide();
        }
    }
    $(".uc_rememberurldata").html(innerHtml);
    // 이벤트 등록
    $(".uc_rememberurldata li").each(function (index) {
        var itemkeyno = $(this).attr("data-no");
        $(this).find("b").click(function () {
             reSetFooterBookMarkRemove(itemkeyno);
        });
    });
    $(".uc_rememberurldata li > a").click(function () {
        goBookMark(this);
    });
    remakeNav();
}

function setFooterBookMark(keyno, subject, url, para) {
    var arrPara = { 
        "bookmark" : {
            "KeyNo" : keyno,
            "BMSubject" : subject,
            "BMUrl" : url,
            "BMPara" : para
        }
    }
    var Url = "/JsonUser/JsonSetConfigBookMark";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify(arrPara),
        dataType: "json",
        success: function (arrData) {
            // 데이터 등록 // 페이지 구성
            getFooterBookMark();
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
            return;
        }
    });
}
// 페이지 초기값
var vDocIndex = 0;
var vDocNaviCount = 8;

function remakeNav() {
    var vDocW = $('#nav .areabox').width();  // 최대 가능한 폭
    var vConW = 0, vConMaxW = 0;
    var vNavW = 0;
    $('#ui_rememberurl > div').each(function (index) {
        vNavW += $(this).width() + 50;  // 여백도 포함한다.
    });
    $('#ui_rememberurl .uc_rememberurldata > li').each(function (index) {
        if (vDocIndex <= index) {
            vConW += $(this).width() + 3;    // 여백도 포함.
            if ((vDocW - vConW  - vNavW) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        } else {
            $(this).hide();
        }
    });
}

