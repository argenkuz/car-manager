/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" />
// 전역 변수 로딩 페이지 설정
var vLoading;
var gsPhotoList;
var tickAction = true;
$(document).ready(function () {
    /**
     * +로딩 페이지 설정
     *   - local 테스트시 아래 소스 주석
     *   - 개발기 테스트시 아래 소스의 domain을 개발기로 맞추거나 소스 주석
     */
    //document.domain = 'carmanager.co.kr';
    vLoading = $('<div id="modal-background"></div><div id="modal-content"><img  style="width:100%;" src="/include/image/loading/loading.gif?v=2018" /></div>​');
    vLoading.insertBefore('#modal');

    //$(document).bind("ajaxComplete", function () {
    //    setTimeout(function () {
    //        if (vLoading.css("display") == "block") {
    //            vLoading.fadeOut();
    //        }
    //    }, 300);
    //});
    // 버튼 코너에 부드럽게 하기
    $(".messagebtn").corner('3px');

    /*****************************************************/
    /* 설명서 오픈 */
    /*****************************************************/
    $(".messagebox").hide();
    $(".messagebtn").mouseover(function () {
        $(this).parent().parent().find(".messagebox").show();
    }).mouseleave(function () {
        $(this).parent().parent().find(".messagebox").hide();
    });



    /*****************************************************/
    /* 와이드 기본 사이즈 확인 */
    /*****************************************************/
    $("#ui_gnb .uc_btnmode").click(function () {
        reSetWideMode();
    });
    /*****************************************************/
    /* 하단 푸터를 위한 자동 높이 조절 및 모바일 해상도 aside 배너 표시 */
    /*****************************************************/
    $('#container').css('min-height', $(window).height() - 180);
    var windowSize = window.outerWidth;
    if (windowSize <= 980) {
        setTimeout(function () {
            var rightBannerHeight = $('#ui_overcarlog').height();
            $('#ui_explorer_sub').css('top', rightBannerHeight + 195);
        }, 500);
    }
    $(window).resize(function () {
        $('#container').css('min-height', $(window).height() - 180);
        var rightBannerHeight = $('#ui_overcarlog').height();
        var windowSize = window.outerWidth;
        if (windowSize <= 980) {
            $('#ui_explorer_sub').css('top', rightBannerHeight + 195);
        } else {
            $('#ui_explorer_sub').css('top', '192px');
        }
    });

    function reSetWideMode() {
        var vDocLMaxW = 1200;
        var vDocLMinW = 980;
        var vDocW = $(document).width();
        if ($(".areabox").width() >= vDocLMaxW) {
            $.cookie('MODE_DOC', false, { expires: 1, path: "/", domain: 'dicar.co.kr' });
        } else {
            $.cookie('MODE_DOC', true, { expires: 1, path: "/", domain: 'dicar.co.kr' });
        }
        location.reload();
    }

    $("#ui_menu .uc_menu").mouseover(function () {
        var sUserGubunNo = $("#hdfUserGubunNo").val();
        var inHtml = "";
        var index = $(this).index();
        var vShopCarUseYn = $("#tbxShopCarUseYn").val();
        $("#ui_mainmenucontext .uc_menustep").hide();
        $("#ui_mainmenucontext .uc_menustep").eq(index).show();
    });


    // 스크롤을 생성한다.
    //$(".scrollbar").scroller();

    // 드롭다운 박스 생성
    $(".uc_selected").selectbox();  // 큰 드롭다운 박스
    $(".uc_selectedsmall").selectbox({
        classHolder: "sbHolderS",
        classHolderDisabled: "sbHolderDisabledS",
        classSelector: "sbSelectorS",
        classOptions: "sbOptionsS",
        classGroup: "sbGroupS",
        classSub: "sbSubS",
        classDisabled: "sbDisabledS",
        classToggleOpen: "sbToggleOpenS",
        classToggle: "sbToggleS",
        classFocus: "sbFocusS"
    }); // 작은 드롭다운 박스

    //스크롤 펼치기 닫기
    $.scrollerCustom = function () {
        if ($("#ui_searchcar .scrollbar").height() == 140) {
            $(".view").text("닫기");
            $(".scrollbar").css("height", "400px");
        } else {
            $(".view").text("더보기");
            $(".scrollbar").css("height", "140px");
            scrollerReSet();
        }
    }
    /**
    * 매물조회 , 매물현황조회 , 수출차량조회의 차량검색  초기화 한다.
    **/
    scrollerReSet();
});

/**
*매물조회 , 매물현황조회 , 수출차량조회의 차량검색 
*스크롤을 초기화 함수.
**/
function scrollerReSet() {
    setTimeout(function () {
        $("#ui_searchcar .scrollbar").each(function (index) {
            var position = $(this).find("ul li").index($(this).find("ul .uc_selectedcolor"));
            if (index > 1) {
                position = 0;
                $(this).find("ul li").each(function (index) {
                    if ($(this).find("img").length > 0 && $(this).find("img").attr("src").indexOf("btn_check_on.gif") > -1) {
                        position = index;
                        return false;
                    }
                });
            }
            var elLength = $(this).find("ul li").length;
            var positionHeight = $(this).find("ul li").eq(0).height();
            $(this).scrollTop(position * positionHeight);
        });
    }, 100)

}

/* 상세검색 숨기기 & 펼치기 */
function SearchView() {
    var vImage = $(this).attr('src');
    if ($('#ui_search').css('display') == 'none') {
        $('#ui_search').show();
        $("#btnSearchView").text("검색닫기");
    } else {
        $('#ui_search').hide();
        $("#btnSearchView").text("검색보기");
    }
}


/* 페이지 이동시 로딩 페이지 설정을 위해 함수화 한다. */
function goPageCarData() {
    location.href = "/Car/Data";
}
function goPageCarArticleState() {
    location.href = "/Car/ArticleState";
}
function goPageCarDataSale() {
    location.href = "/Car/DataSale";
}
function goPageCarPriceMarket() {
    location.href = "/CarPrice/Market";
}
function goPageCarPriceAverage() {
    location.href = "/CarPrice/Average";
}
function goPageCarPriceNewCar() {
    location.href = "/CarPrice/NewCar";
}
function goPageServiceShop() {
    location.href = "/Service/Shop";
}
function goPageServiceEmployee() {
    location.href = "/Service/Employee";
}
function goPageServiceCarCheckOut() {
    location.href = "/Service/CarCheckOut";
}
//차량이력조회
function goPageServiceCarHistory() {
    location.href = "/Service/CarHistory";
}
function goPageServiceWonbu() {
    location.href = "/Service/Wonbu";
}
function goPageMyShopBoard() {
    location.href = "/MyShop/Board";
}
function goPageMyShop() {
    location.href = "/MyShop/";
}
function goPageMyPageCar() {
    location.href = "/MyPageCar/";
}
function goPageSimpleWriteCar() {
    location.href = "/MyPageCar/SimpleWrite";
}
function goPageSimpleShopWriteCar() {
    location.href = "/MyShop/SimpleWrite";
}
function goPageMyProduct() {
    location.href = "/MyProduct/";
}
function goPageMyPage() {
    location.href = "/MyPage";
}
function goPageProduct() {
    location.href = "/GProduct/Product";
}
function goPageMyProduct() {
    location.href = "/GProduct/MyProduct";
}
//마이페이지-매입대상매물조회 
function goPageExMyCar() {
    location.href = "/MyPageCar/ExMyCar";
}
 
function goCarEdit(no) {
    var path = "/MyPageCar";
    if (location.pathname.indexOf("/MyShop") > -1) {
        path = "/MyShop";
    }
    $("form").attr("action", path + "/Edit/" + no);
    $("form").submit();
}

function goPageInquiry() {
    location.href = "/MyPage/Inquiry";
}

//중고부품 
function goPageCarUsedParts() {

    location.href = "/CarUsedParts/Search";
}


/********************** Temp Cookie Check Start **************************
    * 작업자 : 정다은
    * 작업일자 : 2017-04-13
    * 작업내용 : 실서버에서 디카페이지 이동시 오류로 인하여 소스 재배포를
                 하여야 하나 디카 수출 이벤트 상품 개발로 인하여 소스 배포를
                 하지 못하여 임시로 로그인 쿠키값 체크를 하여 스크립트로 페이지 
                 reload 반영
*/
//수출 
function goPageExCar() {

    if (getCookie("USERKEY") != null && getCookie("USERKEY") != "") {
        location.href = "/GExport/ExCar/ExCar";
    }
    else {
        location.reload();
    }
    /********************** Temp Cookie Check Start ***************************/

    //location.href = "/GExport/ExCar/ExCar";
}

/********************** Temp Cookie Check Start **************************
       * 작업자 : 정다은
       * 작업일자 : 2017-04-13
       * 작업내용 : 실서버에서 디카페이지 이동시 오류로 인하여 소스 재배포를
                    하여야 하나 디카 수출 이벤트 상품 개발로 인하여 소스 배포를
                    하지 못하여 임시로 로그인 쿠키값 체크를 하여 스크립트로 페이지 
                    reload 반영
   */

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



function goPageExCom() {
    if (getCookie("USERKEY") != null && getCookie("USERKEY") != "") {
        location.href = "/GExport/ExCar/ExCom";
    }
    else {
        location.reload();
    }
    //location.href = "/GExport/ExCar/ExCom";
}
/********************** Temp Cookie Check Start ***************************/

/* 인증 검증 후 체크를 해서 메세지 처리 */
function IscheckLogin(arrData) {
    try {
        if (arrData === "LOGINFAIL") {
            alert("로그인을 해야만 조회 가능합니다. 로그인 페이지로 이동합니다.");
            location.href = "/User/Login";
            return false;
        }

        if (arrData === "LOGINSESSIONOFF") {
            alert("로그인 세션이 만료 되었습니다. \r\n새로고침을 많이 할 경우 세션이 만료 될수 있습니다. 다시 로그인 하세요.");
            location.href = "/User/Login";
            return false;
        }

        if (arrData === "LOGINLIMIT") {
            alert("중복 로그인으로 현재 접속이 끊어집니다.\r\n\r\n동일한 계정으로 중복 접속이 감지되어 현재 접속은 종료됩니다.\r\n중복 접속을 시도한 사용자가 본인이 아닐경우, 비밀번호 변경을 권장합니다.");
            location.href = "/User/Login";
            return false;
        }
        return true;
    } catch (ex) {
        return false;
    }
}

/*****************************************************/
/* 지역 검색 초기*/
/*****************************************************/
function reLoadSiDoALL() {
    $("#cbxSearchSiDo").val('');
    reLoadSiDo();

    $("#cbxSearchSiDoArea").val('');
    reLoadSiDoArea();

    $("#cbxSearchDanji").val('');
}
function reSetSiDoAreaDanji() {
    reSetDefaultSiDo();
    reSetDefaultSiDoArea();
    reSetDefaultDanji();
}
var sidoDefult = {
    "수도권": "101,102,103",
    "충청권": "105,106,107",
    "영남권": "108,109,110,111,112",
    "호남권": "113,114,115"
}

function reSetDefaultSiDo() {
    var Url = "/CodeBase/JsonBaseCodeSiDo";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            $('.uc_sido').html("");  // 초기화
            var vsido = $("#hdfDefaultSido").val();
            var innerHtml = "";
            $.each(sidoDefult, function (key, value) {
                var vselected = value == vsido ? " selected" : "";
                innerHtml += "<option value='" + value + "'" + vselected + ">" + key + "</option>\r\n";
            });
            innerHtml += "<option value='' selected>전체</option>";
            for (var row = 0; row < arrData.length; row++) {
                if (arrData[row].SiDoNo) {
                    var vno = arrData[row].SiDoNo;
                    var vname = arrData[row].SiDoCodeName;
                    var vselected = vno == vsido ? " selected" : "";

                    innerHtml += "<option value='" + vno + "'" + vselected + ">" + vname + "</option>\r\n";
                }
            }
            $('.uc_sido').html(innerHtml).selectbox('detach');
            $('.uc_sido').selectbox({
                onChange: function (val, inst) {
                    $("#cbxSearchSiDo").val(val);
                    $("#cbxSearchSiDoArea").val('');
                    reLoadSiDoArea();
                }
            });
        },
        fail: function (data) {
            alert("데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
function reSetDefaultSiDoArea() {
    var val = $("#hdfDefaultSido").val();

    var Url = "/CodeBase/JsonBaseCodeSiDoArea/" + val;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            $('.uc_sidoarea').html("");  // 초기화
            var vsidoarea = $("#hdfDefaultCity").val();            
            var innerHtml = "<option value='' selected>전체</option>";
            for (var row = 0; row < arrData.length; row++) {
                if (arrData[row].AreaNo) {
                    var vno = arrData[row].AreaNo;
                    var vname = arrData[row].AreaCodeName;
                    var vselected = vno == vsidoarea ? " selected" : "";
                    innerHtml += "<option value='" + vno + "'" + vselected + " onclick=onclickArea();>" + vname + "</option>\r\n";
                }
            }
            $('.uc_sidoarea').html(innerHtml).selectbox('detach');
            if (vsidoarea) {
                $("#cbxSearchSiDoArea").val(vsidoarea);
                $("#cbxSearchSiDoArea").selectbox('detach').selectbox('attach');
            }
            $('.uc_sidoarea').selectbox({
                onChange: function (val, inst) {
                    $("#cbxSearchSiDoArea").val(val);
                    $("#cbxSearchDanji").val('');

                    reLoadDanji();
                }
            });
            // 시도선택시 단지를 초기화 한다.
            reSetDefaultDanji();
        },
        fail: function (data) {
            alert("지역 정보 리스트 데이터를 불러 들이지 못하였습니다.");
        }
    });
}
function reSetDefaultDanji() {
    // 값을 초기화 한다.
    var val = $("#hdfDefaultCity").val();
    if (val.length == 0) {
        $('#ui_danjidata').html("<li style='width:90%;'>지역을 먼저선택하세요!</li>");  // 초기화
        $('.uc_overview_area').html("<label class=\"uc_btnmode\" onclick=\"reviewDanji();\">클릭하시면 단지를 중복 선택하실 수 있습니다.</label>");
        $("#cbxSearchDanji").val('');
        return;
    }

    var Url = "/CodeBase/JsonBaseCodeDanji/" + val;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            $('#ui_danjidata').html("");  // 초기화
            $('.uc_overview_area').html("");  // 초기화

            var vDanji = $("#hdfDefaultDanji").val();

            var innerHtml = "";
            var indexSelected = "";

            for (var row = 0; row < arrData.length; row++) {
                if (arrData[row].DanjiNo) {
                    var vno = arrData[row].DanjiNo;
                    var vname = arrData[row].DanjiName;

                    innerHtml += "<li class='uc_btnmode' value='" + vno + "' onclick='reSetDanji(this, 1, " + vno + ",\"" + vname + "\")'>" + vname + "</li>";
                }
            }
            $("#ui_danjidata").html(innerHtml);

            // 선택된 정보가 있으면 호출 한다.
            if (vDanji.length > 0) {
                for (var row = 0; row < arrData.length; row++) {
                    if (arrData[row].DanjiNo) {
                        if (vDanji.indexOf(arrData[row].DanjiNo) > -1) {
                            indexSelected = row.toString();
                            $("#ui_danjidata li").eq(parseInt(indexSelected)).trigger("click");
                        }
                    }
                }

                $(".uc_overview_data").hide();
                reSetDanjiEvent();
            } else {
                $('.uc_overview_area').html("<label class=\"uc_btnmode\" onclick=\"reviewDanji();\">단지를 클릭하시면 중복 선택하실 수 있습니다.</label>");
            }
        },
        fail: function (data) {
            alert("단지 정보 리스트 데이터를 불러 들이지 못하였습니다.");
        }
    });
}

function reLoadSiDo() {
    var Url = "/CodeBase/JsonBaseCodeSiDo";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            $('.uc_sido').html("");  // 초기화
            var vsido = $("#cbxSearchSiDo").val();

            var innerHtml = "";
            $.each(sidoDefult, function (key, value) {
                var vselected = value == vsido ? " selected" : "";
                innerHtml += "<option value='" + value + "'" + vselected + ">" + key + "</option>\r\n";
            });
            innerHtml += "<option value='' selected>전체</option>";
            for (var row = 0; row < arrData.length; row++) {
                if (arrData[row].SiDoNo) {
                    var vno = arrData[row].SiDoNo;
                    var vname = arrData[row].SiDoCodeName;
                    var vselected = vno == vsido ? " selected" : "";

                    innerHtml += "<option value='" + vno + "'" + vselected + ">" + vname + "</option>\r\n";
                }
            }
            $('.uc_sido').html(innerHtml).selectbox('detach').selectbox('attach');
            $('.uc_sido').selectbox({
                onChange: function (val, inst) {
                    $("#cbxSearchSiDo").val(val);
                    $("#cbxSearchSiDoArea").val('');
                    reLoadSiDoArea();
                }
            });
        },
        fail: function (data) {
            alert("데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
function reLoadSiDoArea(val) {
    if (!val) val = $("#cbxSearchSiDo").val();

    var Url = "/CodeBase/JsonBaseCodeSiDoArea/" + val;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            $('.uc_sidoarea').html("");  // 초기화
            var vsidoarea = $("#cbxSearchSiDoArea").val();
            var innerHtml = "<option value='' selected>전체</option>";
            for (var row = 0; row < arrData.length; row++) {
                if (arrData[row].AreaNo) {
                    var vno = arrData[row].AreaNo;
                    var vname = arrData[row].AreaCodeName;
                    var vselected = vno == vsidoarea ? " selected" : "";
                    innerHtml += "<option value='" + vno + "'" + vselected + ">" + vname + "</option>\r\n";
                }
            }
            $('.uc_sidoarea').html(innerHtml).selectbox('detach');
            $('.uc_sidoarea').selectbox({
                onChange: function (val, inst) {
                    $("#cbxSearchSiDoArea").val(val);
                    if ($("#cbxSearchDanji") != undefined) {
                        $("#cbxSearchDanji").val('');
                        reLoadDanji();
                    }
                }
            });
            if ($("#cbxSearchDanji") != undefined) {
                // 시도선택시 단지를 초기화 한다.
                reLoadDanji();
            }
        },
        fail: function (data) {
            alert("지역 정보 리스트 데이터를 불러 들이지 못하였습니다.");
        }
    });
}
function reLoadDanji() {
    // 값을 초기화 한다.
    var val = $("#cbxSearchSiDoArea").val();

    if (val.length == 0) {
        $('#ui_danjidata').html("<li style='width:90%;'>지역을 먼저선택하세요!</li>");  // 초기화
        $('.uc_overview_area').html("<label class=\"uc_btnmode\" onclick=\"reviewDanji();\">지역을 먼저선택하세요!</label>");
        $("#cbxSearchDanji").val('');
        return;
    }

    var Url = "/CodeBase/JsonBaseCodeDanji/" + val;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            $('#ui_danjidata').html("");  // 초기화
            $('.uc_overview_area').html("");  // 초기화

            if ($("#cbxSearchDanji").val() != undefined) {
                var vDanji = $("#cbxSearchDanji").val();
                var innerHtml = "<li class='uc_btnmode uc_selectall' value='0' onclick=\"reSetDanji(this, 0, 0,'')\">전체선택</li>";
                var indexSelected = "";

                for (var row = 0; row < arrData.length; row++) {
                    if (arrData[row].DanjiNo) {
                        var vno = arrData[row].DanjiNo;
                        var vname = arrData[row].DanjiName;

                        innerHtml += "<li class='uc_btnmode' value='" + vno + "' onclick=\"reSetDanji(this, 1, " + vno + ",'" + vname + "')\">" + vname + "</li>";
                    }
                }
                $("#ui_danjidata").html(innerHtml);

                // 선택된 정보가 있으면 호출 한다.
                if (vDanji.length > 0) {
                    reSetDanjiEvent();
                    for (var row = 0; row < arrData.length; row++) {
                        if (arrData[row].DanjiNo) {
                            if (vDanji.indexOf(arrData[row].DanjiNo) > -1) {
                                indexSelected = row.toString();
                                $("#ui_danjidata li").eq(parseInt(row + 1)).trigger("click");
                            }
                        }
                    }

                    $(".uc_overview_data").hide();
                } else {
                    $('.uc_overview_area').html("<label class=\"uc_btnmode\" onclick=\"reviewDanji();\">전체선택-클릭하시면 단지를 선택할수 있습니다.</label>");
                }
            }
        },
        fail: function (data) {
            alert("단지 정보 리스트 데이터를 불러 들이지 못하였습니다.");
        }
    });
}
function reSetDanjiEvent() {
    $(".uc_overview_area").mouseover(function () {
        $(".uc_overview_data").show();
    }).mouseleave(function () {
        $(".uc_overview_data").hide();
    });
    $(".uc_overview_data").mouseover(function () {
        $(".uc_overview_data").show();
    }).mouseleave(function () {
        $(".uc_overview_data").hide();
    });
}
function reviewDanji() {
    var vSido = $("#cbxSearchSiDo").val();
    var vSidoArea = $("#cbxSearchSiDoArea").val();
    if (vSido.length > 0 && vSidoArea.length > 0) {
        openDropDownDanjiList();
    }
}
function reSetDanji(vtarget, vmode, vno, vname) {
    var vDanji = jQuery.trim($("#cbxSearchDanji").val());
    var innerHtml = $("#lblDanji").html();
    console.log("vmode", vmode);
    if (vmode == 1) {   // 추가
        if (vDanji.length < 1) {
            innerHtml = "<span class='uc_btnmode' data-danjino='" + vno + "' onclick=\"reSetDanji(this, 0 , " + vno + ", '" + vname + "' )\">" + vname + "</span>";
            vDanji = vno;
        } else {
            innerHtml += "<span class='uc_btnmode' data-danjino='" + vno + "' onclick=\"reSetDanji(this, 0 , " + vno + ", '" + vname + "' )\">" + vname + "</span>";
            if (vDanji.indexOf(vno) == -1) {
                vDanji += "," + vno;
            }
        }
        $("#cbxSearchDanji").val(vDanji);
        $("#lblDanji").html(innerHtml);
        $(vtarget).hide();
    } else {    // 삭제
        if (vno == 0) {
            $("#cbxSearchDanji").val("");
            reLoadDanji();
            return;
        }
        $("#ui_danjidata li").each(function () {
            if (vno == $(this).val()) {
                $(this).show();
            }
        });
        // 자리 정렬
        vDanji = vDanji.replace(vno, "").replace(",,", ",");
        vDanji = vDanji.substring(vDanji.length - 1, vDanji.length) == "," ? vDanji.substring(0, vDanji.length - 1) : vDanji;
        vDanji = vDanji.substring(0, 1) == "," ? vDanji.substring(1, vDanji.length) : vDanji;

        $(vtarget).remove();
        $("#cbxSearchDanji").val(vDanji);

        if (jQuery.trim(vDanji).length == 0) {
            $("#lblDanji").html("<label class=\"uc_btnmode\" onclick=\"reviewDanji();\">전체선택 - 클릭하시면 단지를 선택하실 수 있습니다.</label>");
        }
    }
    // 데이터가 존재 할 경우 화면에 표시
    openDropDownDanjiList();
    if (vDanji) {
        $(".uc_overview_area").mouseover(function () {
            reviewDanji();
        });
    } else {
        $(".uc_overview_area").unbind("mouseover");
    }
}

function openDropDownDanjiList() {
    var iVisibleCount = 0;
    $('#ui_danjidata li').each(function (index) {
        if ($(this).css("display") != "none") {
            iVisibleCount++;
        }
    });

    if (iVisibleCount == 0) {
        $(".uc_overview_data").hide();
    } else {
        $(".uc_overview_data").show();
    }
}

/*****************************************************/
/* 차량 검색 초기*/
/*****************************************************/
function reSetSearch() {
    //console.log("reSetSearch 들어옴");
    // 초기 값을 처리한다.
    reSetSearchMaker();
    //$(".scrollbar").scroller('reset');
}
function reSetSearchMaker() {    
    //console.log("reSetSearchModel() 들어옴 1111"); 

    $('#ui_searchcar .uc_carmaker li').removeClass('uc_selectedcolor');
    //$("#ui_searchcarmaker").scroller('reset');
    $("#tbxSearchMaker").val("");
    reSetSearchModel();
}
function reSetSearchModel() {
    //console.log("reSetSearchModel() 들어옴 2222"); 

    $('#ui_searchcar .uc_carmodel').html('<li style="pointer-events: none;">제조사를 선택하세요.</li>');
    //$("#ui_searchmodel").scroller('reset');
    $("#tbxSearchModel").val("");
    reSetSearchModelDetail();
}
function reSetSearchModelDetail() {
    $('#ui_searchcar .uc_carmodeldetail').html('<li style="pointer-events: none;">모델을 선택하세요.</li>');
    //$("#ui_searchcarmodeldetail").scroller('reset');
    $("#tbxSearchModelDetail").val("");
    //console.log("reSetSearchModelDetail() 들어옴ㅁㅁㅁㅁㅁㅁ"); 

    reSetSearchGrade();
}
function reSetSearchGrade() {
    //console.log("reSetSearchGrade() 들어옴"); 
    $('#ui_searchcar .uc_cargrade').html('<li style="pointer-events: none;">세부모델을 선택하세요!</li>');
    //$("#ui_searchgrade").scroller('reset');
    $("#tbxSearchGrade").val("");
    reSetSearchGradeDetail();
}
function reSetSearchGradeDetail() {
    $('#ui_searchcar .uc_cargradedetail').html('<li style="pointer-events: none;">등급을 선택하세요!</li>');
    //$("#ui_searchcargradedetail").scroller('reset');
    $("#tbxSearchGradeDetail").val("");
}
// 상세검색 초기
function reSetSearchOption() {
    $('#ui_searchcardetail .uc_selected').each(function () {
        $(this).selectbox('detach');
        $(this).val('');
        $(this).selectbox('attach');
    });
    $("#ui_search input[type='checkbox']").each(function () {
        $(this).attr("checked", false);
    });
}
// 퀵 부분 설정 초기
function reSetSearchQuick() {
    $('#ui_searchquick input').each(function () {
        $(this).val('');
    });
    $('.uc_ie input').each(function () {
        $(this).val('');
    });
    $('#ui_searchquick .uc_selected').each(function () {
        $(this).selectbox('detach');
        $(this).val('');
        $(this).selectbox('attach');
    });
}
/* function : Search Hide             */
function reSetSearchSidoHide() {
    $('.uc_searchsido').hide();
}
function reSetSearchCarDetailHide() {
    $('.uc_searchcardetail').hide();
}
function reSetSearchQuickHide() {
    $('.uc_searchquick').hide();
}




///* 검색데이터 조회*///
// 메이커 데이터 리스트 화
function reLoadMaker() {
    reSetSearchMaker();

    reSetSearchMakerList(Bizjs.GetMakerBase());
    reSetMakerScrollEvent();
    //$.ajax({
    //    type: 'POST',
    //    cache: false,
    //    contentType: "application/json; charset=utf-8",
    //    url: "/CarBase/JsonBaseCarMaker",
    //    dataType: "json",
    //    success: function (data) {
    //        // 데이터 등록
    //        reSetSearchMakerList(data);
    //        // 스크릴 이벤트 생성
    //        reSetMakerScrollEvent();
    //    },
    //    fail: function (data) {
    //        alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
    //    }
    //});
}
// 제조사 데이터 리스트 화
function reSetSearchMakerList(arrData) {
    
    $('#ui_search .uc_carmaker').html("");  // 초기화
    var innerHtml = "";
    for (var row = 0; row < arrData.length; row++) {
        if (arrData[row].MakerNo) {
            var vno = arrData[row].MakerNo;
            var vname = arrData[row].MakerName;

            innerHtml += "<li data-no='" + vno + "'>" + vname + "</li>\r\n";
        }
    }

    if (innerHtml.length == 0)
        innerHtml = "<li>등록된 제조사정보가 없습니다.</li>";

    $('#ui_search .uc_carmaker').html(innerHtml)
}
function reSetMakerScrollEvent() {
    
    $("#ui_searchcarmaker ul > li").each(function () {
        $(this).click(function () {
            $("#truckTonFrm select").val('').selectbox('detach').selectbox();

            //if ($(this).text() == "중대형화물") {
            //    //if (location.pathname.indexOf("/Car/Data") > -1) {
            //    $("#truckTonFrm").show();
            //    //}
            //} else {
            //    $("#truckTonFrm").hide();
            //}
            var vImage = $(this).find("img");
            var vSpan = $(this).find("span").html();
            var vDataNo = "";   // 데이터 전송때 사용

            //console.log("vImage", vImage);
            //console.log("vSpan", vSpan);
            //console.log("vImage.length", vImage.length);


            if (vImage.length != 0) {
                if (vImage.attr('src').indexOf('_on') > 0) {
                    vImage.attr('src', vImage.attr('src').replace('_on', '_off'));
                    $(this).css('background-color', 'transparent');
                } else {
                    vImage.attr('src', vImage.attr('src').replace('_off', '_on'));
                    $(this).css('background-color', '#f5f5f5');
                }
            } else {
                // 이미지가 없는 것은 다중이 아님으로 초기화 한다.
                var vBGround = $(this).css('background-color');
                // 값을 기억한 후 초기화 한다.
                //$(this).parent('.uc_selectitem').find('li').each(function (index) {
                //    $(this).removeClass("uc_selectedcolor");

                //});
                //
                reSetSelected(this, vBGround);
                //    vDataNo = vBGround == "transparent" || vBGround == "rgba(0, 0, 0, 0)" ? $(this).attr("data-no") : "";
                vDataNo = $(this).hasClass("uc_selectedcolor") ? $(this).attr("data-no") : "";
                $("#ui_searchcarmodel").css("background-color", "#fff");
            }
            //console.log("vDataNo", vDataNo);

            ///* 각 섹션별로 액션을 취한다. *///
            // var vGuid = $(this).attr("data-no");
            // 검색을 위한 값을 설정
            $("#tbxSearchMaker").val(vDataNo);
            $("#tbxSearchModel").val("");
            $("#tbxSearchModelDetail").val("");
            $("#tbxSearchGrade").val("");
            $("#tbxSearchGradeDetail").val("");


            //중대형화물 = 10061 /10135 = 소형화물
            if (vDataNo == "10061" || vDataNo == "10135") {
                $("#truckTonFrm").show();
                reLoadModel(vDataNo);
                if (vDataNo == "10061") {  
                    reLoadModelDetailTruck();
                }
            } else { 
                $("#truckTonFrm").hide();
                reLoadModel(vDataNo);
            }

        });
    });
}


// 모델 데이터 리스트 가지고오기
function reLoadModel(vno, compCallback) {
    // 설정 초기화
    //console.log("reLoadModel 설정 초기화");
    if (vno != "10061") {
        reSetSearchModel();
    }
    

    reSetSearchModelList(Bizjs.GetModelBase(vno.toString()));
    reSetModelScrollEvent(compCallback);
    //if (vno == "10061") {
    //    $("#truckReadOnly").removeAttr("onclick");
    //    document.getElementById("truckReadOnly").onclick = null;
    //}
    if (typeof compCallback === "function") {
        compCallback();
    }
}
// 모델 데이터 화면등록
function reSetSearchModelList(arrData) {
    //console.log("arrData", arrData);
    $('#ui_search .uc_carmodel').html("");  // 초기화
    var innerHtml = "";
    var tempKindCode = "A";
    for (var row = 0; row < arrData.length; row++) {
        if (arrData[row].ModelNo) {
            var vno = arrData[row].ModelNo;
            var vname = arrData[row].ModelName;
            var style = "";
            if (tempKindCode != arrData[row].KindCode && arrData[row].MakerNo == "10061") { 
                tempKindCode = arrData[row].KindCode;
            } else if (tempKindCode != arrData[row].KindCode) { 
                tempKindCode = arrData[row].KindCode;
            } else if (arrData[row].MakerNo == "10061") {
                style = 'style="solid;opacity: 0.5;"';
            }
            if (arrData[row].MakerNo == "10061") {
                var astyle = 'style="line-height: 30px;"';
                $("#ui_searchcarmodel").css("background-color", "#e9e9e9");
                //innerHtml += "<li data-no='" + vno + "' " + style + ">" + vname + "</li>\r\n";
                innerHtml += "<a " + astyle + "><li id='truck_" + vno + "' data-no='" + vno + "' " + style + " ><span>&nbsp;&nbsp;" + vname + "</span></li>\r\n";
            } else {
                $("#ui_searchcarmodel").css("background-color", "#fff");
                innerHtml += "<li data-no='" + vno + "' " + style + ">" + vname + "</li>\r\n";
            }

        }
    }
    //
    if (innerHtml.length == 0)
        innerHtml = "<li>등록된 모델정보가 없습니다.</li>";

    $('#ui_search .uc_carmodel').html(innerHtml)
}
// 모델 데이터 클릭 이벤트
function reSetModelScrollEvent(compcall) {
    //console.log("compcall", compcall);
    $("#ui_searchcarmodel ul > li").each(function () {
        //console.log("compcall each", compcall);
        $(this).click(function () {
            //console.log("compcall click", compcall);
            var vImage = $(this).find("img");
            var vDataNo = "";   // 데이터 전송때 사용
            if (vImage.length != 0) {
                if (vImage.attr('src').indexOf('_on') > 0) {
                    vImage.attr('src', vImage.attr('src').replace('_on', '_off'));
                    $(this).css('background-color', 'transparent');
                } else {
                    vImage.attr('src', vImage.attr('src').replace('_off', '_on'));
                    $(this).css('background-color', '#f5f5f5');
                }
            } else {
                // 이미지가 없는 것은 다중이 아님으로 초기화 한다.
                var vBGround = $(this).css('background-color');
                reSetSelected(this, vBGround);
                //    vDataNo = vBGround == "transparent" || vBGround == "rgba(0, 0, 0, 0)" ? $(this).attr("data-no") : "";
                vDataNo = $(this).hasClass("uc_selectedcolor") ? $(this).attr("data-no") : "";
            }
            // 검색을 위한 값을 설정
            $("#tbxSearchModel").val(vDataNo);
            $("#tbxSearchModelDetail").val("");
            $("#tbxSearchGrade").val("");
            $("#tbxSearchGradeDetail").val("");

            reLoadModeDetaill(vDataNo);
        });
    });
}
//중대형화물일경우 2뎁스후 바로 3뎁스 전체열림처리
function reLoadModelDetailTruck(modelDetail, compcall) {
    //console.log("reLoadModelDetailTruck", modelDetail);
    // 설정 초기화
    if (compcall != "ArticleState") {
        reSetSearchModelDetail();
        reSetSearchModelDetailList(Bizjs.GetModelDetailBase(""));
}
    
    reSetSearchModelDetailList(Bizjs.GetModelDetailBaseTruck("truck"), modelDetail);

    reSetModelDetailScrollEvent();
}


// 모델 상세 데이터 리스트화
function reLoadModeDetaill(vno, compCallback) {
    // 설정 초기화
    reSetSearchModelDetail();
    reSetSearchModelDetailList(Bizjs.GetModelDetailBase(vno.toString()));
    reSetModelDetailScrollEvent();
    if (typeof compCallback === "function") {
        compCallback();
    }
}
// 모델 상세 데이터 화면등록
function reSetSearchModelDetailList(arrData, modelDetail) {
    //console.log("modelDetail", arrData);
    $('#ui_search .uc_carmodeldetail').html("");  // 초기화
    var innerHtml = "";
    for (var row = 0; row < arrData.length; row++) {
        if (arrData[row].MDetailNo) {
            var vno = arrData[row].MDetailNo;
            var vname = arrData[row].MDetailName;
            var modelNo = arrData[row].ModelNo;
            innerHtml += "<li id='mdetail_" + vno + "' data-no='" + vno + "' data-model='" + modelNo + "'><img src='/include/image/btn/btn_check_off.gif'><span>" + vname + "</span></li>\r\n";                        
        }
    }
    if (innerHtml.length == 0)
        innerHtml = "<li>등록된 세부모델정보가 없습니다.</li>";

    $('#ui_search .uc_carmodeldetail').html(innerHtml);

    if (modelDetail) {
        var modelDetailSubArray = new Array();
        modelDetailSubArray = modelDetail.split(",");
        //console.log("modelDetailSubArray", modelDetailSubArray);
        for (var row = 0; row < modelDetailSubArray.length; row++) {
            var hasId = "#mdetail_" + modelDetailSubArray[row];
            var vImage = $(hasId).find("img");
            vImage.attr('src', vImage.attr('src').replace('_off', '_on'));
            $(hasId).css('background-color', '#eee');

            var selectId = "#truck_" +  $(hasId).attr("data-model");
            $(selectId).css('background-color', '#4959ec');
            $(selectId).css('color', '#FFFFFF');
            $(selectId).css('opacity', '0.8');

        }
    }
}
// 모델 상세 데이터 클릭 이벤트
function reSetModelDetailScrollEvent() {    
    var data_no = "";
    var isOff = "true";
    
    $("#ui_searchcarmodeldetail ul > li").each(function () {
        var isOffArray = new Array();
        $(this).click(function () {
            //console.log("_CheckTruckCode", _CheckTruckCode);
            
            data_no = $(this).attr("data-no");
            var vImage = $(this).find("img");
            var vDataNo = "";   // 데이터 전송때 사용
            if (vImage.length != 0) {
                if (vImage.attr('src').indexOf('_on') > 0) {
                    vImage.attr('src', vImage.attr('src').replace('_on', '_off'));
                    $(this).css('background-color', 'transparent');
                    $(this).css('color', '#303030');
                    // vDataNo += vDataNo.replace(($(this).attr("data-no") + ","),"");
                } else {
                    vImage.attr('src', vImage.attr('src').replace('_off', '_on'));
                    $(this).css('background-color', '#eee');
                    $(this).css('color', '#4959ec');
                    // vDataNo += $(this).attr("data-no") + ",";                    
                }
                
                // 중복 데이터 허용으로 계산을 하도록 한다.
                $(".uc_carmodeldetail > li").each(function (index) {
                    if ($(this).find("img").attr("src").indexOf("_on") > 0) {
                        vDataNo += $(this).attr("data-no") + ",";
                    }
                });
                //트럭코드 on / off
                for (var row = 0; row < _CheckTruckCode.length; row++) {
                    var selectId = "#truck_" + _CheckTruckCode[row].ModelNo;
                    $(selectId).css('background-color', '#e9e9e9');
                    $(selectId).css('color', '#303030');
                    $(selectId).css('opacity', '0.5');
                }
                for (var row = 0; row < _CheckTruckCode.length; row++) {
                    var selectId = "#truck_" + _CheckTruckCode[row].ModelNo;
                    var mDetailId = "#mdetail_" + _CheckTruckCode[row].MDetailNo;
                    
                    $(".uc_carmodeldetail > li").each(function (index) {
                        
                        if ($(mDetailId).val() != undefined) {
                            if ($(mDetailId).find("img").attr("src").indexOf("_on") > 0) {
                                $(selectId).css('background-color', '#4959ec');
                                $(selectId).css('color', '#FFFFFF');
                                $(selectId).css('opacity', '0.8');
                                
                            }
                        }

                    });

                }

                
                vDataNo = vDataNo.indexOf(",") > 0 ? vDataNo.substr(0, vDataNo.length - 1) : vDataNo;


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
            ///* 각 섹션별로 액션을 취한다. : 선택된 것이 2개일 경우 뒤에 섹션은 선택을 막는다. *///
            if (vDataNo.indexOf(",") > 0) {
                reSetModelDetailDup();
            } else {
                reLoadGrade(vDataNo);
            }

            // 검색을 위한 값을 설정
            if (vDataNo.indexOf(",") > 0) {
                if (vDataNo.substr(vDataNo.length - 1) == ",") {
                    vDataNo = vDataNo.substr(0, vDataNo.length - 1);
                }
            }
            $("#tbxSearchModelDetail").val(vDataNo);
            $("#tbxSearchGrade").val("");
            $("#tbxSearchGradeDetail").val("");



        });
    });
}
function reSetModelDetailDup() {
    $(".uc_cargrade").html("<li style='pointer-events: none;'><span><font color='blueviolet'>중복</font>으로 선택 할 경우<br /> 등급 선택이 <font color='red'>불가능</font> 합니다.</span></li>");
    reLoadGradeDetail("");
}


// 등급 데이터 리스트화
function reLoadGrade(vno) {
    //console.log("reLoadGrade 들어옴");
    // 설정 초기화
    reSetSearchGrade();
    reSetSearchGradeList(Bizjs.GetGradeBase(vno.toString()));    
    reSetGradeScrollEvent();
}
// 등급 데이터 화면 등록
function reSetSearchGradeList(arrData) {
    //console.log("등급 데이터 화면 등록");
    $('#ui_search .uc_cargrade').html("");  // 초기화
    var innerHtml = "";
    //if(arrData.index)
    for (var row = 0; row < arrData.length; row++) {
        if (arrData[row].GradeNo) {
            var vno = arrData[row].GradeNo;
            var vname = arrData[row].GradeName;

            innerHtml += "<li data-no='" + vno + "'><img src='/include/image/btn/btn_check_off.gif'><span>" + vname + "</span></li>\r\n";
        }
    }

    if (innerHtml.length == 0)
        innerHtml = "<li>등록된 등급정보가 없습니다.</li>";

    $('#ui_search .uc_cargrade').html(innerHtml)
}
// 등급 데이터 크릭 이벤트
function reSetGradeScrollEvent() {
    //console.log("asgasgasg");
    $("#ui_searchcargrade ul > li").each(function () {
        $(this).click(function () {
            //console.log("this.click");
            var vImage = $(this).find("img");
            var vDataNo = "";   // 데이터 전송때 사용
            if (vImage.length != 0) {
                if (vImage.attr('src').indexOf('_on') > 0) {
                    vImage.attr('src', vImage.attr('src').replace('_on', '_off'));
                    $(this).css('background-color', 'transparent');
                    $(this).css('color', '#303030');
                    // vDataNo += vDataNo.replace(($(this).attr("data-no") + ","),"");
                } else {
                    vImage.attr('src', vImage.attr('src').replace('_off', '_on'));
                    $(this).css('background-color', '#f5f5f5');
                    $(this).css('color', '#4959ec');
                    // vDataNo += $(this).attr("data-no") + ",";
                }
                // 중복 데이터 허용으로 계산을 하도록 한다.
                $(".uc_cargrade > li").each(function (index) {
                    if ($(this).find("img").attr("src").indexOf("_on") > 0) {
                        vDataNo += $(this).attr("data-no") + ",";
                    }
                });
                vDataNo = vDataNo.indexOf(",") > 0 ? vDataNo.substr(0, vDataNo.length - 1) : vDataNo;
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
            ///* 각 섹션별로 액션을 취한다. : 선택된 것이 2개일 경우 뒤에 섹션은 선택을 막는다. *///
            if (vDataNo.indexOf(",") > 0) {
                reSetGradeDup();
            } else {
                reLoadGradeDetail(vDataNo);
            }


            // 검색을 위한 값을 설정
            if (vDataNo.indexOf(",") > 0) {
                if (vDataNo.substr(vDataNo.length - 1) == ",") {
                    vDataNo = vDataNo.substr(0, vDataNo.length - 1);
                }
            }
            $("#tbxSearchGrade").val(vDataNo);
            $("#tbxSearchGradeDetail").val("");
        });
    });
}
function reSetGradeDup() {
    //$(".uc_cargradedetail").html("<li style='pointer-events: none;'><span class='uc_errcolor_blue'>중복</span>으로 선택 할 경우<br />세부 등급 선택이 <span class='uc_errcolor_red'>불가능</span> 합니다.</li>");
    $(".uc_cargradedetail").html("<li style='pointer-events: none;'><span><font color='blueviolet'>중복</font>으로 선택 할 경우<br />세부 등급 선택이<font color='red'>불가능</font>합니다.</span></li>");
}


// 등급 상세 데이터 리스트화
function reLoadGradeDetail(vno) {
    // 설정 초기화
    reSetSearchGradeDetail();
    reSetSearchGradeDetailList(Bizjs.GetGradeDetailBase(vno.toString()));
    reSetGradeDetailScrollEvent();
}
// 등급 데이터 화면 등록
function reSetSearchGradeDetailList(arrData) {
    $('#ui_search .uc_cargradedetail').html("");  // 초기화
    var innerHtml = "";
    for (var row = 0; row < arrData.length; row++) {
        if (arrData[row].GDetailNo) {
            var vno = arrData[row].GDetailNo;
            var vname = arrData[row].GDetailName;

            innerHtml += "<li data-no='" + vno + "'><img src='/include/image/btn/btn_check_off.gif'><span>" + vname + "</span></li>\r\n";
        }
    }
    if (innerHtml.length == 0)
        innerHtml = "<li>등록된 세부등급정보가 없습니다.</li>";

    $('#ui_search .uc_cargradedetail').html(innerHtml)
}
// 등급 데이터 크릭 이벤트
function reSetGradeDetailScrollEvent() {
    $("#ui_searchcargradedetail ul > li").each(function () {
        $(this).click(function () {
            var vImage = $(this).find("img");
            var vDataNo = "";   // 데이터 전송때 사용
            if (vImage.length != 0) {
                if (vImage.attr('src').indexOf('_on') > 0) {
                    vImage.attr('src', vImage.attr('src').replace('_on', '_off'));
                    $(this).css('background-color', 'transparent');
                    $(this).css('color', '#303030');
                } else {
                    vImage.attr('src', vImage.attr('src').replace('_off', '_on'));
                    $(this).css('background-color', '#f5f5f5');
                    $(this).css('color', '#4959ec');
                }
                // 중복 데이터 허용으로 계산을 하도록 한다.
                $(".uc_cargradedetail > li").each(function (index) {
                    if ($(this).find("img").attr("src").indexOf("_on") > 0) {
                        vDataNo += $(this).attr("data-no") + ",";
                    }
                });
                vDataNo = vDataNo.indexOf(",") > 0 ? vDataNo.substr(0, vDataNo.length - 1) : vDataNo;
                // 검색을 위한 값을 설정
                if (vDataNo.indexOf(",") > 0) {
                    if (vDataNo.substr(vDataNo.length - 1) == ",") {
                        vDataNo = vDataNo.substr(0, vDataNo.length - 1);
                    }
                }
                $("#tbxSearchGradeDetail").val(vDataNo);
            }
        });
    });
}



/*
 * 차량선택비교하기 수행전 수행조건 확인
 * 확인 완료후 recheckCarCompare 함수 실행
 * recheckCarCompare 함수 존재 파일명 : sCommonCar.js
 */
function reLoadCompareCar() {
    var vCarCompareKey = "";
    var vCarCompareCount = 0;
    $("#ui_context input[type=checkbox]:checked").each(function () {
        vCarCompareKey += "'"+jQuery.trim($(this).val()) + "',";
        vCarCompareCount++;
    });
    if (vCarCompareKey.indexOf(",") > 0) {
        vCarCompareKey = vCarCompareKey.substr(0, vCarCompareKey.length - 1);
    }

    if (vCarCompareKey.length > 0) {
        $('body').css({ overflow: 'hidden' });
        if (vCarCompareCount > 5 || vCarCompareCount < 2) {
            alert("비교할 차량은 최소 2대 이상 5대 이하입니다.");
        } else {
            recheckCarCompare(vCarCompareKey);
        }
    }
    else {
        alert("비교할 차랑을 먼저 선택하세요!");
    }

}
function checkCarHide() {
    var vCarHiddenKey = "";
    $("#ui_context input[type=checkbox]:checked").each(function () {
        vCarHiddenKey += jQuery.trim($(this).val()) + ",";
    });

    if (vCarHiddenKey.indexOf(",") > 0) {
        vCarHiddenKey = vCarHiddenKey.substr(0, vCarHiddenKey.length - 1);
    }
    if (vCarHiddenKey.length > 0) {
        reSetCarHide(vCarHiddenKey);
    }
    else {
        alert("매물을 먼저 선택하세요!");
    }
}
function reSetCarHide(carno) {
    var Url = "/CarHide/JsonCarHide";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carno": carno }),
        dataType: "json",
        success: function (data) {
            // 데이터 등록 // 페이지 구성
            if (data.ErrCode > 0)
                alert(data.ErrMessage);
            else {
                var vPage = $("#page").val();
                if ($("#searchOptType").val() == "001") {
                    goFormSubmitMulti(vPage);
                } else if ($("#searchOptType").val() == "002") {
                    goFormSubmitCs(vPage);
                } else {
                    goFormSubmit(vPage);
                }

                
            }
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
function reSetCarHideClear() {
    var Url = "/CarHide/JsonCarHideClear";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (data) {
            // 데이터 등록 // 페이지 구성
            if (data.ErrCode > 0)
                alert(data.ErrMessage);
            else {
                var vPage = $("#page").val();
                if ($("#searchOptType").val() == "001") {
                    goFormSubmitMulti(vPage);
                } else if ($("#searchOptType").val() == "002") {
                    goFormSubmitCs(vPage);
                } else {
                    goFormSubmit(vPage);
                }                
            }
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
function reSetHiddenCarButton(carcount) {
    var innerHtml = "";
    if (carcount > 0) {
        innerHtml += "<a href='javascript:reSetCarHideClear();'><img src='/include/image/btn/btn_select_carconfig_off.gif' /></a>";
    }

    innerHtml += " <a href='javascript:checkCarHide();'><img src='/include/image/btn/btn_select_carconfig_on.gif' /></a>";
    $("#ui_cheader .uc_carhidden").html(innerHtml);
}

function reLoadMyCarStateCount() {
    var Url = "/CarData/JsonMyCarCount";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (arrData) {
            if (arrData.length > 0) {
                for (var row = 0; row < arrData.length; row++) {
                    var carstate = arrData[row].CarState;
                    var carcount = arrData[row].CarCount + " 대";

                    switch (carstate) {
                        case 0:
                            $("#ui_mycarcount0").html(carcount);
                            break;
                        case 3:
                            $("#ui_mycarcount3").html(carcount);
                            break;
                    }
                }
            }
        },
        fail: function (data) {
            alert(data);
        }
    });
}


/* 마이로그 */
function reLoadLogInfo() {
    $("form").submit();
}

/*  로그인 영역 */
function commitLogin() {

    var vUserID = $("#userid").val();

    if (vUserID.length < 2 || vUserID.length > 20) {
        alert("로그인 아이디는 6자 이상 20자 이하입니다.");
        return;
    }

    if ($("#userpwd").val().length < 6) {
        alert("패스워드는 6자이상 20자리 이하 입니다.");
        return;
    }

    if (vUserID.charCodeAt(0) > 122) {
        alert("이름으로 로그인 하였습니다. \r\n이름으로 로그인 할 경우 (영문 아이디가 없을 경우) 딜러인증을 받아서 아이디를 발급 받으시길 바랍니다.\r\n 인증받기 페이지로 이동합니다.");
        location.href = "/UserReg/Dealer";
        return;
    }


    // 아이디 기억하기
    reSetRememberID();

    $("form").submit();
}
/* 로그인 영역 아이디 저장 */
function reSetRememberID() {
    if ($("#cbxrememberid")[0] == undefined)
        return;
    var rememberstate = $("#cbxrememberid")[0].checked;

    if (rememberstate) {
        userid = jQuery.trim($("#userid").val());
        $.cookie('rememberid', userid, { expires: 7 });
    } else {
        $.cookie('rememberid', '', { expires: -1 });
    }
}
function commitLoginShop() {
    if (confirm("선택하신 상사로 로그인 하시겠습니까?")) {
        var rememberstate = $("#cbxrememberid")[0].checked;

        if (rememberstate) {
            var memberno = $("#memberno").val().toString();
            $.cookie('rememberno', memberno, { domain: 'dicar.co.kr' });
        } else {
            $.cookie('rememberno', '', { expires: -1, domain: 'dicar.co.kr' });
        }

        $("#userpwd").prop('disabled', false);
        $("form").submit();
    }
}
function reSetUserNameInShop() {
    $("#userpwd").prop('disabled', false);
    $("#ui_loginshop").show();
    $("#ui_loginshopselect").hide();
    $('#memberno').html("<option value='' selected>상사선택</option>")
}
function reloadUserNameInShop(username) {
    $('#memberno').html("");  // 초기화
    var vremuserid = $.cookie('rememberid');
    var vremmemberno = "";
    if (vremuserid == username) {
        vremmemberno = $.cookie('rememberno');
        if (vremmemberno != null) {
            var innerHtml = "<option value='" + vremmemberno + "' selected>자동선택</option>";
            $('#rememberno').html(innerHtml);
            $("#userpwd").prop('disabled', false);
            $("form").submit();
        }
    }

    var Url = "/JsonUser/JsonUserNameInShop";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "username": username }),
        dataType: "json",
        success: function (arrData) {
            // 데이터 등록 // 페이지 구성
            $('#rememberno').html("");  // 초기화
            if (arrData.length < 2) {
                if (arrData.length == 1) {
                    var innerHtml = "<option value='" + arrData[0].MemberNo + "' selected>" + arrData[0].ShopName + "</option>";
                    $('#memberno').html(innerHtml);
                    $("#userpwd").prop('disabled', false);
                    $("form").submit();
                } else {
                    alert("상사 정보가 없거나 상사가 폐업중인 상태입니다. 해당 조합에 연락 하여 사원증을 발급 받아 주시길 바랍니다.");
                    return;
                }

            } else {
                $("#userpwd").prop('disabled', true);
                var innerHtml = "<option value='' selected>상사선택</option>";
                //if(arrData.index)
                for (var row = 0; row < arrData.length; row++) {
                    if (arrData[row].ShopNo) {
                        var vmemberno = arrData[row].MemberNo;
                        var vno = arrData[row].ShopNo;
                        var vname = arrData[row].ShopName;
                        var vempjob = arrData[row].EmpJob;
                        if (vempjob.length > 0)
                            innerHtml += "<option value='" + vmemberno + "'>" + vname + " - " + vempjob + "</option>";
                        else
                            innerHtml += "<option value='" + vmemberno + "'>" + vname + "</option>";
                    }
                }
                $("#ui_loginshopselect .uc_selected").selectbox('detach');
                $('#memberno').html(innerHtml)
                $("#ui_loginshopselect .uc_selected").selectbox('attach');
                $("#ui_loginshop").hide();
                $("#ui_loginshopselect").show();
            }
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}

/*
 * 최근본차량 전체선택
 */
function allselect() {
    if ($(".uc_btncheck.all").find("img").attr("src").indexOf("_on") > 0) {
        $(".uc_btncheck.btn_closeoverlay").find("img").attr("src", "/include/image/btn/check_off.png");
        $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_off.png");
        $("#compare_cardetail").attr("disabled", "disabled");
        $("#compare_cardetail").css("background", "#aaa");
    } else {
        $(".uc_btncheck.btn_closeoverlay").find("img").attr("src", "/include/image/btn/check_on.png");
        $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_on.png");
        $("#compare_cardetail").removeAttr("disabled");
        $("#compare_cardetail").css("background", "#4959ec");

    }
}


//모바일 체크 에러 발생시 PC로 판단
function carmanagerWinMobileCheck() {
    var filter = "win16|win32|win64|mac";
    if (navigator.platform) {
        if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
            //모바일
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

/*
 *카매니저 상세윈도우 팝업
 */
function carmangerDetailWindowPopUp_CHECK(encarno) {
    
    var Url = "/PopupFrame/CarDetailEnc/";
    /* 사이즈 설정 */
    var vHeight = 820;
    var vWidth = 1200;
    var vLeft = $(window).width() / 2 - vWidth / 2;
    var vTop = $(window).height() / 2 - vHeight / 2 - 20;
    var lockindex;

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", Url);
    form.setAttribute("target", "form_" + encarno);
    form.setAttribute("class", "cardetailPopClass");

    var inputencarno = document.createElement('input');
    inputencarno.type = 'hidden';
    inputencarno.name = "encarno";
    inputencarno.value = encarno;
    form.appendChild(inputencarno);

    var inputEncCheck = document.createElement('input');
    inputEncCheck.type = 'hidden';
    inputEncCheck.name = "EncCheck";
    inputEncCheck.value = jQuery.trim($("#EncCheck").val());
    form.appendChild(inputEncCheck);
    
    window.open("", "form_" + encarno, 'width=' + vWidth + ', height=' + vHeight + ',top=' + vTop + ', left=' + vLeft + ',location=0,toolbar=0, status=0, menubar=0, scrollbars=0, resizable=0');

    document.body.appendChild(form);
    form.submit();

     
    if ($(".cardetailPopClass") != null) {
        $(".cardetailPopClass").remove();
    } 
}

function a(encarno, carno, imagepath, carmakername, cargradename, strNumber, KeyCarRegDate, KeyCarUseKm, KeyCarSale, isOpenKey, tocken) { 
    if (encarno != '') {
        if (carmanagerWinMobileCheck() && $("#cardetail_img_" + carno + "").length == 0 && parseInt(getCookie('LOCKCOUNT')) != 5) {
            document.cookie = "encarno_" + carno + "=" + encarno +"; path=/";
            resentcarlog.one_create(carno, 0, imagepath, carmakername, cargradename, strNumber, KeyCarRegDate, KeyCarUseKm, KeyCarSale, encarno);
            var carlogcookie = cookie.get('CARLOG_BASE');
            document.cookie = "CARLOGCOUNT=" + jsonobject.converttojson(decoding(carlogcookie)).length;
            if (getCookie("CARLOGCOUNT") != null && getCookie("CARLOGCOUNT").toString() == "5") { 
                for (var i = 4; i >= 0; i--) {
                    if ($($('#ui_carlog .uc_visititems').find("div").eq(i)).find("li").eq(1).find("img").attr("src").indexOf("lock2_off") > -1) {
                        $('#ui_carlog .uc_visititems').find("div").eq(i).remove();
                        $(".car-detail").find("li").eq(i).remove();
                        $(".latest-car-list").find("li").eq(i).remove();
                        document.cookie = "CARLOGCOUNT=" + (parseInt(getCookie("CARLOGCOUNT")) - 1); 
                        break;
                    }
                }
            }

            var car_detail_list_html = "<li id='cardetail_list_li_" + carno + "' data-carlist='" + carno + "'><div class='uc_btnlock'><img class='lock2_img_" + carno + "' onclick='resentcarlog.lockstate(" + carno + ");' src='/include/image/btn/lock2_off.png' /></div><button type='button' class='btn esc' onclick='resentcarlog.remove(" + carno + ");'></button><div class='car-img'><img id='cardetail_img_" + carno + "' src='" + imagepath + "'  onerror=\"this.src = '/include/image/car/car_noimage_big.jpg'\"/></div><span id='cardetail_car_model_" + carno + "' class='car-model'>" + carmakername + "</span><span id='cardetail_car_grade_" + carno + "'  class='car-grade'>" + cargradename + "</span></li>";
             
            $(".latest-car-list").prepend(car_detail_list_html);
            $(".latest-car-list li").unbind("click").click(function () {
                var carlist = $(this).data("carlist");
                $(".car-detail li").css("display", "none");
                $(".car-detail").find("li[data-cardetail='" + carlist + "']").css("display", "block");
            });
            KeyCarRegDate = (KeyCarRegDate != null && KeyCarRegDate != "null" && KeyCarRegDate != "") ? KeyCarRegDate : "        ";
            reLoadCarConfig();
            $(".uc_carvisit").show();
            var innerHtml = "";
            innerHtml += "<div class='uc_visititem '  data-no='" + carno + "'>";
            innerHtml += "    <ul>";
            innerHtml += "        <li class='uc_btncheck btn_closeoverlay uc_carlogcheckbox'><img src='/include/image/btn/check_off.png' /></li>";
            innerHtml += "        <li class='uc_btnlock btn_closeoverlay'><img class='lock2_img_" + carno + "' onclick='resentcarlog.lockstate(" + carno + ");' src='/include/image/btn/lock2_off.png' /></li>";
            innerHtml += "        <li class='uc_carimage' ><img src='" + imagepath + "'  width='58' height='46' onerror=\"this.src = '/include/image/car/car_noimage_big.jpg'\" /></li>";
            innerHtml += "        <li class='uc_carmark'>" + strNumber + "</li>";
            innerHtml += "        <li class='uc_detail'><button type='button' class='btn esc btn_closeoverlay' onclick='resentcarlog.remove(" + carno + ");'></button><span class='model'>" + carmakername + "</span><span class='grade'>" + cargradename + "</span><span class='option'>" + decodeURI(KeyCarRegDate.toString().substr(0, 4) + "." + KeyCarRegDate.toString().substr(5, 2)) + "|" + $.number(KeyCarUseKm) + " km</span><span class='price' " + ((cookieIsCarAmountH) ? "style=display:none;" : "") + ">" + $.number(KeyCarSale) + "만원</span>";
            innerHtml += "</li>";
            innerHtml += "    </ul>";
            innerHtml += "</div>";
            $('#ui_carlog .uc_visititems').prepend(innerHtml);

            $(".uc_carlogcheckbox img").on("click", function (event) {
                var vSrc = $(this).attr("src");
                if (vSrc.indexOf("_on") > 0) {
                    $(this).attr("src", vSrc.replace("_on", "_off"));
                } else {
                    $(this).attr("src", vSrc.replace("_off", "_on"));
                }
                if ($(this).parent().hasClass("btn_closeoverlay")) {
                    var cnt = 0;
                    $(".uc_visititem").each(function () {
                        var onOffCheck = $(this).find(".uc_btncheck").find("img").attr("src");
                        if (onOffCheck.indexOf("_on") > 0) {
                            cnt++;
                        }
                    });
                    if (cnt == 0) {
                        $("#compare_cardetail").attr("disabled", "disabled");
                        $("#compare_cardetail").css("background", "#aaa");
                    }
                    else {
                        $("#compare_cardetail").removeAttr("disabled");
                        $("#compare_cardetail").css("background", "#4959ec");
                    }
                    if (cnt < $(".uc_visititems").children().size()) {
                        $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_off.png");
                    } else {
                        $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_on.png");
                    }
                }
                event.stopPropagation();
            });
            $(".uc_carlogcheckbox img").on("click", function (event) {
                event.stopPropagation();
            });
            if (isNaN(getCookie("CARLOGCOUNT"))) {
                document.cookie = "CARLOGCOUNT=" + "1";
            }
            else {
                document.cookie = "CARLOGCOUNT=" + (parseInt(getCookie("CARLOGCOUNT")) + 1);
            }
        }
        resentcarlog.carlog_right_list();
    }
}

function userDailyCountGet() {
    var Url = "/CarData/JsonUserDailyCountGet";
    var retCheck = true;
   
    $.ajax({
        type: 'POST',
        async: false,
        contentType: "application/json; charset=utf-8",
        url: Url, 
        dataType: "json",
        success: function (data) {
            retCheck = data;
            return retCheck;
            console.log(retCheck);
        },
        fail: function (data) {
            return true;
        }
    }); 
}

function carmangerDetailWindowPopUp(carno, imagepath, carmakername, cargradename, strNumber, KeyCarRegDate, KeyCarUseKm, KeyCarSale, isOpenKey, encarno) { 
    carmangerDetailWindowPopUp_CHECK(encarno);
}


//이미지 리스트만
function carmangerDetailWindowPopUpAll(carno, imagepath, carmakername, cargradename, strNumber, KeyCarRegDate, KeyCarUseKm, KeyCarSale) {

    var Url = "/PopupFrame/CarDetailEnc/";
    /* 사이즈 설정 */
    var vHeight = screen.height;
    var vWidth = screen.width; 
    if (vWidth > 1930) {
        vWidth = vWidth - 500;
    }

    var vLeft = $(window).width();
    var vTop = $(window).height();
    var lockindex;

    var carcompareid = "cbxcarcompare" + carno;
    $("input:checkbox[id=" + carcompareid + "]").prop("checked", true);

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", Url);
    form.setAttribute("target", "form_" + carno);

    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = "Id";
    input.value = carno;
    form.appendChild(input);
    document.body.appendChild(form);

    window.open(Url, "form_" + carno, 'width=' + vWidth + ', height=' + vHeight + ',top=' + vTop + ', left=' + vLeft + ',location=0,toolbar=0, status=0, menubar=0, scrollbars=0, resizable=0');
    form.submit();
    if (carmanagerWinMobileCheck() && $("#cardetail_img_" + carno + "").length == 0 && parseInt(getCookie('LOCKCOUNT')) != 5) {
        resentcarlogone_create(carno, 0, imagepath, carmakername, cargradename, strNumber, KeyCarRegDate, KeyCarUseKm, KeyCarSale);
        if (getCookie("CARLOGCOUNT") != null && getCookie("CARLOGCOUNT").toString() == "5") {
            for (var i = 4; i >= 0; i--) {
                if ($($('#ui_carlog .uc_visititems').find("div").eq(i)).find("li").eq(1).find("img").attr("src").indexOf("lock2_off") > -1) {
                    $('#ui_carlog .uc_visititems').find("div").eq(i).remove();
                    $(".car-detail").find("li").eq(i).remove();
                    $(".latest-car-list").find("li").eq(i).remove();
                    document.cookie = "CARLOGCOUNT=" + (parseInt(getCookie("CARLOGCOUNT")) - 1);
                    break;
                }
            }
        }
        var car_detail_html = "<li data-cardetail='" + carno + "'><iframe id='ui_frameview' src='/PopupFrame/CarDetail?encarno=" + encodeURIComponent(getCookie("encarno_" + carno.toString())) + "' scrolling='no' frameborder='0' allowtransparency='true' class='frameborder'></iframe></li>";
        var car_detail_list_html = "<li id='cardetail_list_li_" + carno + "' data-carlist='" + carno + "'><div class='uc_btnlock'><img class='lock2_img_" + carno + "' onclick='resentcarlog.lockstate(" + carno + ");' src='/include/image/btn/lock2_off.png' /></div><button type='button' class='btn esc' onclick='resentcarlog.remove(" + carno + ");'></button><div class='car-img'><img id='cardetail_img_" + carno + "' src='" + imagepath + "'  onerror=\"this.src = '/include/image/car/car_noimage_big.jpg'\"/></div><span id='cardetail_car_model_" + carno + "' class='car-model'>" + carmakername + "</span><span id='cardetail_car_grade_" + carno + "'  class='car-grade'>" + cargradename + "</span></li>";

        $(".car-detail").prepend(car_detail_html);
        $(".latest-car-list").prepend(car_detail_list_html);

        $(".latest-car-list li").unbind("click").click(function () {
            var carlist = $(this).data("carlist");
            $(".car-detail li").css("display", "none");
            $(".car-detail").find("li[data-cardetail='" + carlist + "']").css("display", "block");
        });
        KeyCarRegDate = (KeyCarRegDate != null && KeyCarRegDate != "null" && KeyCarRegDate != "") ? KeyCarRegDate : "        ";
        reLoadCarConfig();
        $(".uc_carvisit").show();
        var innerHtml = "";
        innerHtml += "<div class='uc_visititem '  data-no='" + carno + "'>";
        innerHtml += "    <ul>";
        innerHtml += "        <li class='uc_btncheck btn_closeoverlay uc_carlogcheckbox'><img src='/include/image/btn/check_off.png' /></li>";
        innerHtml += "        <li class='uc_btnlock btn_closeoverlay'><img class='lock2_img_" + carno + "' onclick='resentcarlog.lockstate(" + carno + ");' src='/include/image/btn/lock2_off.png' /></li>";
        innerHtml += "        <li class='uc_carimage' ><img src='" + imagepath + "'  width='58' height='46' onerror=\"this.src = '/include/image/car/car_noimage_big.jpg'\" /></li>";
        innerHtml += "        <li class='uc_carmark'>" + strNumber + "</li>";
        innerHtml += "        <li class='uc_detail'><button type='button' class='btn esc btn_closeoverlay' onclick='resentcarlog.remove(" + carno + ");'></button><span class='model'>" + carmakername + "</span><span class='grade'>" + cargradename + "</span><span class='option'>" + decodeURI(KeyCarRegDate.toString().substr(0, 4) + "." + KeyCarRegDate.toString().substr(5, 2)) + "|" + $.number(KeyCarUseKm) + " km</span><span class='price' " + ((cookieIsCarAmountH) ? "style=display:none;" : "") + ">" + $.number(KeyCarSale) + "만원</span>";
        innerHtml += "</li>";
        innerHtml += "    </ul>";
        innerHtml += "</div>";
        $('#ui_carlog .uc_visititems').prepend(innerHtml);

        $(".uc_carlogcheckbox img").on("click", function (event) {
            var vSrc = $(this).attr("src");
            if (vSrc.indexOf("_on") > 0) {
                $(this).attr("src", vSrc.replace("_on", "_off"));
            } else {
                $(this).attr("src", vSrc.replace("_off", "_on"));
            }
            if ($(this).parent().hasClass("btn_closeoverlay")) {
                var cnt = 0;
                $(".uc_visititem").each(function () {
                    var onOffCheck = $(this).find(".uc_btncheck").find("img").attr("src");
                    if (onOffCheck.indexOf("_on") > 0) {
                        cnt++;
                    }
                });
                if (cnt == 0) {
                    $("#compare_cardetail").attr("disabled", "disabled");
                    $("#compare_cardetail").css("background", "#aaa");
                }
                else {
                    $("#compare_cardetail").removeAttr("disabled");
                    $("#compare_cardetail").css("background", "#4959ec");
                }
                if (cnt < $(".uc_visititems").children().size()) {
                    $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_off.png");
                } else {
                    $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_on.png");
                }
            }
            event.stopPropagation();
        });
        $(".uc_carlogcheckbox img").on("click", function (event) {
            event.stopPropagation();
        });

        if (isNaN(parseInt(getCookie("CARLOGCOUNT"))) || getCookie("CARLOGCOUNT") == '') {
            document.cookie = "CARLOGCOUNT=" + 1;
        } else {
            document.cookie = "CARLOGCOUNT=" + (parseInt(getCookie("CARLOGCOUNT")) + 1);
        }
    }
    resentcarlog.carlog_right_list();
}

/*********************************************************************/
//-- 차량상세정보 로드 및 이벤트 등록
/*********************************************************************/
function reLoadPopupCarDetail(carno, mode, lockstate, imagepath, carmakername, cargradename) {
    $("#cardetail_list_li_" + carno).click();
    reLoadPopupCarDetail(carno, mode, '1', imagepath, carmakername, cargradename, lockstate);
}
function reLoadPopupCarDetailReal(carno) {
    $('body').css('overflow', 'hidden');
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");
    //var Url = "/Car/DataDetail/" + carno;
    var Url = "/PopupFrame/CarDetailS/" + carno;

    /* 사이즈 설정 */
    var vHeight = 540;
    var vWidth = 1020;
    var vLeft = $(window).width() / 2 - vWidth / 2;
    var vTop = $(window).height() / 2 - vHeight / 2 - 20;

    $(".modal_carbackground").show();
    $(".modal_carcontent").html("<iframe id='ui_frameview' src='" + Url + "' scrolling='no' frameborder='0' allowtransparency='true' class='frameborder'></iframe>");
    $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

    vmodal.show();
    vmodalcontent.show();

    $(vmodal).click(function () {
        $('body').css('overflow', 'visible');
        vmodal.hide();
        vmodalcontent.hide();
    });

    // reLoadEventPopupCarDetailTab();
    // reLoadEventPopupCarDetail();
    // 이벤트를 등록한다.
    //$("#ui_frameview .uc_cardetail .s1 .uc_btnmode").click(function () {
    //// $("#ui_cardetail .uc_header .uc_btnmode").click(function () {
    //    vmodal.hide();
    //    vmodalcontent.hide();
    //});
}
function SetClearPopupFrameCallBack() {
    $('body').css('overflow', 'visible');
    $(".modal_carcontent").html("");
    $(".modal_carbackground").trigger("click");
}
function SetClearCarPhotoPopupFrameCallBack() {
    $('body').css('overflow', 'visible');
    $(".modal_carcontent").html("");
    $(".modal_carbackground").trigger("click");
    location.reload();
}
function SetLoginPopupFrameCallBack() {
    location.href = "/User/Login";
}


//오늘 본 차량 LOCK상태 변경
function carLockState(carno) {
    // 차량 데이터 구성
    $.ajax({
        type: "GET",
        traditional: true,
        url: "/CarOption/CarLogItemLockStateChange?carno=" + carno,
        contentType: "jsonp",
        success: function (data) {
            if (data == "OK") {
                if ($(".lock2_img_" + carno).attr("src") == "/include/image/btn/lock2_on.png") {
                    $(".lock2_img_" + carno).attr("src", "/include/image/btn/lock2_off.png")
                }
                else {
                    $(".lock2_img_" + carno).attr("src", "/include/image/btn/lock2_on.png")
                }

            }
            else if (data == "LOCK") {
                if (parseInt(getCookie('LOCKCOUNT')) != 5) {
                    alert("Lock 상태이므로 삭제할 수 없습니다.")
                }
            }
            reLoadCarLog();

        },
        fail: function (data) {
            alert(data);
        }
    });
}



function reLoadPopupCarDetail(carno, mode, imagepath, carmakername, cargradename, lockstate) {
    $('body').css('overflow', 'hidden');
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");
    //var Url = "/Car/DataDetail/" + carno;
    var Url = "/PopupFrame/CarDetail/" + carno;
    var detailLength = $(".car-detail").find("li").length;
    /*
      작업일자 : 2018-09-05
      작업자   : 정다은
      작업내용 : mode가 1일 경우 현재 호출하는 부분이 없어 /Car/DataDetailMaster 해당 프로젝트를 주석처리 추후 다른 프로젝트에서 이상이 없을시에 삭제 진행
     */
    if (mode == "1") {
        Url = "/Car/DataDetailMaster/" + carno;

        $.ajax({
            type: 'POST',
            cache: false,
            contentType: "application/json; charset=utf-8",
            url: Url,
            success: function (arrData) {
                var vHeight = 540;
                var vWidth = 1020;
                var vLeft = $(window).width() / 2 - vWidth / 2;
                var vTop = $(window).height() / 2 - vHeight / 2 - 53;

                $(".modal_carbackground").show();
                $(".modal_carcontent").html(arrData);
                $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });
                vmodal.show();
                vmodalcontent.show();

                reLoadEventPopupCarDetailTab();
                reLoadEventPopupCarDetail();
                // 이벤트를 등록한다.
                reLoadCarLog();
                $("#cardetail_list_li_" + carno).click();
                // $(".uc_cardetail .s1 .uc_btnmode").click(function () {
                $("#ui_cardetail .uc_header .uc_btnmode").click(function () {
                    vmodal.hide();
                    vmodalcontent.hide();
                });

                $(vmodal).click(function () {
                    vmodal.hide();
                    vmodalcontent.hide();
                });
            },
            fail: function (data) {
                alert("데이터 로드에 실패하였습니다.");
            }
            // 데이터를 로드 해서 입력한다.
        });
    } else {
        /* 사이즈 설정 */
        var vHeight = 540;
        var vWidth = 1020;
        var vLeft = $(window).width() / 2 - vWidth / 2;
        var vTop = $(window).height() / 2 - vHeight / 2 - 53;
        if ($("#cardetail_img_" + carno + "").length == 0) {
            $(".latest-car-list li").unbind("click").click(function () {
                var carlist = $(this).data("carlist");
                $(".car-detail li").css("display", "none");
                $(".car-detail").find("li[data-cardetail='" + carlist + "']").css("display", "block");
            });

        }

        $('body').css('overflow', 'hidden');
        $(".modal_carbackground_cardetail").show();
        $("#cardetail_img_" + carno).click();
        $(".modal_carbackground_cardetail").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });
    }

    vmodal.show();
    vmodalcontent.show();

    $(vmodal).click(function () {
        $('body').css('overflow', 'visible');
        $(".modal_carbackground_cardetail").hide();
        vmodal.hide();
        vmodalcontent.hide();
    });
}



function reLoadEventPopupCarDetailTab() {
    /* 탭컨트롤 */
    $("#ui_cardetail .uc_tabcontrol li").each(function (index) {
        $(this).click(function () {
            $("#ui_cardetail .uc_tabcontrol li").removeClass("uc_tabon");
            $(this).addClass("uc_tabon");

            $(".uc_tabview > div").hide();
            $(".uc_tabview > div").eq(index).show();

            if (index == 3) {
                $(".uc_tabview").css("width", "100%");
                $(".uc_tabviewdetail").hide();
            } else {
                $(".uc_tabview").css("width", "600px");
                $(".uc_tabviewdetail").show();
            }
        });
    });
}
function reLoadEventPopupCarDetail() {
    $(".uc_imageview .uc_imageviewleft").click(function () {
        var vImageIndex = $("#ui_navino").val();
        var arrIndexMax = $("#ui_cardetail .uc_carimage li").length;

        if (vImageIndex == 0) {
            vImageIndex = arrIndexMax - 1;
        } else {
            vImageIndex--;
        }
        reLoadEvnetCarImageView(vImageIndex);
    });
    $(".uc_imageview .uc_imageviewright").click(function () {
        var vImageIndex = $("#ui_navino").val();
        var arrIndexMax = $("#ui_cardetail .uc_carimage li").length;

        if (vImageIndex == (arrIndexMax - 1)) {
            vImageIndex = 0;
        } else {
            vImageIndex++;
        }
        reLoadEvnetCarImageView(vImageIndex);
    });
    $(".uc_imagenaviview .uc_imageviewleft").click(function () {
        var vImageIndex = parseInt($("#ui_navino").val()) - 7;
        var arrIndexMax = $("#ui_cardetail .uc_carimage li").length;
        if (vImageIndex < 0) {
            vImageIndex = parseInt(arrIndexMax / 7) * 7;
        } else {
            vImageIndex = parseInt(vImageIndex / 7) * 7;
        }

        reLoadEvnetCarImageView(vImageIndex);
    });
    $(".uc_imagenaviview .uc_imageviewright").click(function () {
        var vImageIndex = parseInt($("#ui_navino").val()) + 7;
        var arrIndexMax = $("#ui_cardetail .uc_carimage li").length;
        if (vImageIndex > arrIndexMax) {
            vImageIndex = 0;
        } else {
            vImageIndex = parseInt(vImageIndex / 7) * 7;
        }
        reLoadEvnetCarImageView(vImageIndex);
    });
    $("#ui_cardetail .uc_carimage li").click(function () {
        var vImageIndex = $(this).index();
        reLoadEvnetCarImageView(vImageIndex);
    });

    $("#ui_cardetail .uc_selectedsmall").selectbox({
        classHolder: "sbHolderS",
        classHolderDisabled: "sbHolderDisabledS",
        classSelector: "sbSelectorS",
        classOptions: "sbOptionsS",
        classGroup: "sbGroupS",
        classSub: "sbSubS",
        classDisabled: "sbDisabledS",
        classToggleOpen: "sbToggleOpenS",
        classToggle: "sbToggleS",
        classFocus: "sbFocusS"
    });
    $("#ui_cardetail .uc_selectedsmall").selectbox('attach');
}
function reLoadEvnetCarImageView(vIndex) {

    $("#ui_cardetail .uc_carimage li").each(function (index) {
        $("#ui_cardetail .uc_carimage li").eq(index).find("img").addClass("uc_imageoff");
    });
    // 이미지 표시
    $("#ui_cardetail .uc_carimage li").eq(vIndex).find("img").removeClass("uc_imageoff")

    var vImageNameF = $("#ui_cardetail .uc_carimage li").eq(vIndex).find("img").attr("alt");
    var innerHtml = "<img src=\"" + vImageNameF + "\" onerror=\"this.src = '/include/image/car/car_noimage_big.jpg'\" width=\"590\" height=\"444\" />";
    $("#ui_carview_main").html(innerHtml);
    $("#ui_navino").val(vIndex);
    // 페이지 네이게이션
    reLoadEventCarNaviImageView(vIndex);
    return;
}
function reLoadEventCarNaviImageView(vIndex) {
    var page = parseInt(vIndex / 7);
    $("#ui_cardetail .uc_carimage li").each(function (index) {
        var workpage = parseInt(index / 7);
        if (workpage == page)
            $(this).fadeIn("slow").delay(400).show();
        else
            $(this).fadeOut("slow").delay(400).hide();
    });
}



/*********************************************************************/
//-- 차량 핫마크
/*********************************************************************/
//핫마크등록전 차량체크
function checkReLoadPopupHotMark(carno) {
    var Url = "/Pop/CheckCarEssentialData/" + carno;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ "carno": carno }),
        url: Url,
        success: function (result) {
            //console.log("result : " + result.CheckCount + "           " + result.PhotoYN);
            if (result.CheckCount == "11") {
                reLoadPopupHotMark(carno);
            } else {
                if (result.CheckCount == "10" && result.PhotoYN == "0") {
                    alert("핫마크는 차량 정보를 모두 입력해야 적용 가능합니다.\n매물정보는 존재하지만 사진정보가 부족합니다\n사진을 6장 이상 입력바랍니다.");
                } else {
                    if (confirm("핫마크는 차량 정보를 모두 입력해야 적용 가능합니다.\n매물수정에서 필수 정보를 모두 입력 후 진행해 주세요.\n매물수정 정보로 이동하시겠습니까?")) {
                        //goCarEditisCheck(carno);
                        //$("#isCheck").val("Y");
                        $("form").attr("action", "/MyPageCar/Edit/" + carno);
                        $("form").submit();
                    }
                }

            }
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }


    });
}
// 등록화면
function reLoadPopupHotMark(carno) {
    // 팝업 페이지 설정
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");


    var Url = "/Pop/HotMark/" + carno;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        success: function (arrData) {
            // 파일 사이즈를 가지고 온다.
            var vHeight = 624;
            var vWidth = 1020;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2;

            $(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

            // 탭이벤트를 먼저 등록
            reLoadEventPopupCarDetailTab();
            // 이미지 기능 등록

            reLoadPopupSortImage(carno);
            // 이벤트를 등록한다.
            $("#ui_popup_hotmark .uc_header .uc_btnmode").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $(vmodal).click(function () {
                vmodal.hide();
                vmodalcontent.hide();
            });
            // 설정을 완료 하후 오픈한다.
            vmodal.show();
            vmodalcontent.show();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}
function reLoadPopupHotMarkLog(mode) {
    // 팝업 페이지 설정
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");

    var Url = mode == 1 ? "/Pop/HotMarkUseLog" : "/Pop/HotMarkCashLog";

    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        success: function (arrData) {
            // 파일 사이즈를 가지고 온다.
            var vHeight = 554;
            var vWidth = 1020;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2;

            $(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });


            // 이벤트를 등록한다.
            $("#ui_popup_hotmark .uc_header .uc_btnmode").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $(vmodal).click(function () {
                vmodal.hide();
                vmodalcontent.hide();
            });
            // 설정을 완료 하후 오픈한다.
            vmodal.show();
            vmodalcontent.show();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}
// 가이드 팝업 : 필요 없음 openPopup 으로 변경
function reViewPopupHotMark() {
    // 팝업 페이지 설정
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");

    var Url = "/Pop/HotMark";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        success: function (arrData) {
            // 파일 사이즈를 가지고 온다.
            var vHeight = 524;
            var vWidth = 920;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2;

            $(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

            // 이벤트를 등록한다.
            $("#ui_popup_hotmark .uc_header .uc_btnmode").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $("#ui_popup_hotmark .uc_cancel").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $(vmodal).click(function () {
                vmodal.hide();
                vmodalcontent.hide();
            });
            // 설정을 완료 하후 오픈한다.
            vmodal.show();
            vmodalcontent.show();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}

function reSetHotMarkExplain() {
    $(".uc_hotmark img").click(function () {
        //reViewPopupHotMark();
        openPopup('/popup/hotmark.html', 980, 600, 'center');
    });
}
/*********************************************************************/
//-- 차량 이미지 등록 및 삭제 (차량관리)
/*********************************************************************/
function reLoadPopupBegin(carno) {
    $('body').css('overflow', 'hidden');
    $("#tbxpopupcarno").val(carno);
    reLoadPopupCarPhoto();
}
function reLoadPopupCarPhoto() {
    var carno = $("#tbxpopupcarno").val();
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");

    var Url = "";
    
    Url = "http://cmphoto.carmanager.co.kr/BaseBusiness/CarPhotoPopup?CarNo=" + carno + "&UserSidoAreaNo=" + $("#tbxUserSidoAreaNo").val();


    if (location.href.indexOf("https") > -1) {
        Url = Url.replace("http", "https");
    }
    /* 사이즈 설정 */
    var vHeight = 633;
    var vWidth = 1010;
    var vLeft = $(window).width() / 2 - vWidth / 2;
    var vTop = $(window).height() / 2 - vHeight / 2 - 20;

    $(".modal_carbackground").show();
    $(".modal_carcontent").html("<iframe id='ui_frameview2' src='" + Url + "' scrolling='no' frameborder='0' allowtransparency='true' class='frameborder'></iframe>");
    $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });
    vmodal.show();
    vmodalcontent.show();

    $(vmodal).click(function () {
        $('body').css('overflow', 'visible');
        vmodal.hide();
        vmodalcontent.hide();
        location.reload();
    });

}
function reLoadPopupCarPhotoEvent() {
    $(".uc_carimage_navi .uc_carimage li").each(function (index) {
        if (index > 6) {
            $(this).hide();
        }
    });
}

function reLoadPopupCarPhotoList(arrData) {
    $('#ui_carimages').html("");  // 초기화
    var innerHtml = "";

    if (arrData.length > 0) {
        var vImageNameM = arrData[0].CarImageFullName;
        innerHtml += "<input type=\"hidden\" id=\"ui_navino\" value=\"0\" />\r\n";
        innerHtml += "<div class=\"uc_carimage_view\">\r\n";
        innerHtml += "    <div style=\"width:590px; height:448px;\">\r\n";
        innerHtml += "        <div style=\"position:absolute\" id=\"ui_carview_main\">\r\n";
        innerHtml += "            <img src=\"" + vImageNameM + "\" onerror=\"this.src = '/include/image/car/car_noimage_big.jpg'\" width=\"590\" height=\"444\" />\r\n";
        innerHtml += "        </div>\r\n";
        innerHtml += "        <div class=\"uc_imageview\">\r\n";
        innerHtml += "            <div class=\"uc_imageviewleft uc_btnmode\">\r\n";
        innerHtml += "                <img src=\"/include/image/car/detail_img_b_allow_before.png\" width=\"40\" height=\"60\" />\r\n";
        innerHtml += "            </div>\r\n";
        innerHtml += "            <div class=\"uc_imageviewright uc_btnmode\">\r\n";
        innerHtml += "                <img src=\"/include/image/car/detail_img_b_allow_after.png\" width=\"40\" height=\"60\" />\r\n";
        innerHtml += "            </div>\r\n";
        innerHtml += "        </div>\r\n";
        innerHtml += "        <div class=\"uc_clearboth\"></div>\r\n";
        innerHtml += "    </div>\r\n";
        innerHtml += "    <div class=\"uc_clearboth\"></div>\r\n";
        innerHtml += "</div>\r\n";
        innerHtml += "<div class=\"uc_car[image_navi\">\r\n";
        innerHtml += "    <div class=\"uc_carimage\">\r\n";
        innerHtml += "        <ul class=\"uc_lileft\">\r\n";

        for (var row = 0; row < arrData.length; row++) {
            if (arrData[row].CarImageNo) {
                var vno = arrData[row].CarImageNo;
                var vsortno = arrData[row].CarImageSort;
                var vname = arrData[row].CarImageThumb;
                var vfullname = arrData[row].CarImageFullName;

                if (row == 0) {
                    innerHtml += "<li style='display: list-item;'>\r\n";
                    innerHtml += "    <img width='80' height='57' class='uc_btnmode' onerror=\"this.src = '/include/image/car/car_noimage_small.jpg'\" alt='" + vfullname + "' src='" + vname + "'>\r\n";
                }
                else {
                    if (row > 6) {
                        innerHtml += "<li style='display:none;'>\r\n";
                    } else {
                        innerHtml += "<li>\r\n";
                    }
                    innerHtml += "    <img width='80' height='57' class='uc_btnmode  uc_imageoff' onerror=\"this.src = '/include/image/car/car_noimage_small.jpg'\" alt='" + vfullname + "' src='" + vname + "'>\r\n";
                }

                innerHtml += "</li>\r\n";
            }
        }

        innerHtml += "        </ul>\r\n";
        innerHtml += "    </div>\r\n";
        innerHtml += "    <div class=\"uc_imagenaviview\">\r\n";
        innerHtml += "        <div class=\"uc_imageviewleft uc_btnmode\">\r\n";
        innerHtml += "            <img src=\"/include/image/car/detail_img_stc_allow_before.png\" width=\"25\" height=\"36\" />\r\n";
        innerHtml += "        </div>\r\n";
        innerHtml += "        <div class=\"uc_imageviewright uc_btnmode\">\r\n";
        innerHtml += "            <img src=\"/include/image/car/detail_img_stc_allow_after.png\" width=\"25\" height=\"36\" />\r\n";
        innerHtml += "        </div>\r\n";
        innerHtml += "    </div>\r\n";
        innerHtml += "    <div class=\"uc_clearboth\"></div>\r\n";
        innerHtml += "</div>\r\n";
    } else {

        var vImageNameM = "/include/image/guide/photoup_guide.gif";
        innerHtml += "<div>\r\n";
        innerHtml += "    <img src=\"" + vImageNameM + "\" onerror=\"this.src = '/include/image/car/car_noimage_big.jpg'\" width=\"590\" height=\"444\" />\r\n";
        innerHtml += "</div>\r\n";
        innerHtml += "<div class=\"uc_carimage_navi\" style=\"padding-right:8px;\">\r\n";
        innerHtml += "    <div class=\"uc_carimage_navi uc_areabox uc_textcenter\" style=\"height:44px;\">\r\n";
        innerHtml += "        <span class=\"uc_fontgray04\" style=\"line-height:44px;\">등록된 이미지 정보가 없습니다. 등록 및 삭제에서 차량 사진을 등록하시길 바랍니다.</span>\r\n";
        innerHtml += "    </div>\r\n";
        innerHtml += "</div>\r\n";
    }

    $('#ui_carimages').html(innerHtml);
}
/* 차량 수정 */
function reLoadImageInfo_success(oParameter) {
    alert("성공");
}
function reLoadImageInfo_error(oParameter) {
    alert("실패");
}

function reLoadPopupSortImage(carno) {
    var Url = "/CarData/JsonCarMyCarImage";
    return $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carno": carno }),
        dataType: "json",
        success: function (arrData) {
            // 데이터 등록 // 페이지 구성
            reLoadPopupSortImageList(carno, arrData);
            reLoadPopupSortImageEvent();
            reLoadPopupCarPhotoList(arrData);
            reLoadPopupCarPhotoEvent();
            reLoadEventPopupCarDetail();
            gsPhotoList = arrData;
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}

function reLoadPopupSortImageEvent() {
    $("#ui_imagesort").sortable({
        revert: true
    });
    $("#ui_imagesort, #ui_imagesort > li").disableSelection();
}
function reLoadPopupSortImageList(carno, arrData) {
    $('#ui_imagesort').html("");  // 초기화
    var innerHtml = "";
    for (var row = 0; row < arrData.length; row++) {
        if (arrData[row].CarImageNo) {
            var vno = arrData[row].CarImageNo;
            var vsortno = arrData[row].CarImageSort;
            var vname = arrData[row].CarImageThumb;
            var vfullname = arrData[row].CarImageFullName;

            innerHtml += "<li class='uc_imagesort' data-photo-no='" + vno + "'>\r\n";
            innerHtml += "  <div>\r\n";
            innerHtml += "      <table>\r\n";
            innerHtml += "          <tr>\r\n";
            innerHtml += "              <td style='padding:2px;'><span class='uc_fontnumber'>no : " + vsortno + "</span></td>\r\n";
            innerHtml += "              <td style='width:16px;' class='uc_btnmode'><span class='ui-icon ui-icon-image' onclick='reSetImagePhotoUDP(\"" + carno + "\",\"" + vno + "\")'></span></td>\r\n";
            innerHtml += "              <td style='width:16px;' class='uc_btnmode'><span class='ui-icon ui-icon-closethick' onclick='reSetImagePhotoDEL(" + vno + ")'></span></td>\r\n";
            innerHtml += "          </tr>\r\n";
            innerHtml += "          <tr>\r\n";
            innerHtml += "              <td colspan='3'>\r\n";
            innerHtml += "                  <img class='uc_btnmode' onerror=\"this.src = '/include/image/car/car_noimage_small.jpg'\" alt=\"" + vfullname + "\" src=\"" + vname + "\">\r\n";
            innerHtml += "              </td>\r\n";
            innerHtml += "          </tr>\r\n";
            innerHtml += "      </table>\r\n";
            innerHtml += "  </div>\r\n";
            innerHtml += "</li>\r\n";

        }
    }

    if (innerHtml.length == 0)
        innerHtml = "<li class='uc_contentno' style='float:none;'>등록된 이미지가 없습니다.</div>\r\n";

    $('#ui_imagesort').html(innerHtml);
}
var bPhotoTran = false;
function reSetImagePhotoDEL(imageno) {
    // ajax 호출 하고 삭제 시킨다.
    if (confirm('해당 사진을 삭제하시겠습니까?')) {
        reSetJSonImagePhotoDT(imageno);
    }
}
function reSetJSonImagePhotoDT(imageno) {
    var Url = "/CarData/JsonCarMyCarImageDT";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carimageno": imageno }),
        dataType: "json",
        success: function (arrData) {
            // 데이터 등록 // 페이지 구성
            if (arrData.ErrCode == 0) {
                $("#ui_imagesort .uc_imagesort").each(function (index) {
                    var vno = $(this).attr("data-photo-no");
                    if (vno == imageno) {
                        $(this).remove();
                        alert("삭제되었습니다.");
                    }
                });
            } else {
                alert("삭제중 오류가 발생하였스빈다. 계속 될경우 고객센터에 문의하세요.\r\n" + arrData.ErrMessage);
            }
            return;
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
            return;
        }
    });
}

function reSetImagePhotosDEL(carno) {
    // ajax 호출 하고 삭제 시킨다.
    if (confirm('사진을 전체 삭제하시겠습니까?')) {
        reSetJSonImagePhotosDT(carno);
    }
}
function reSetJSonImagePhotosDT(carno) {
    var Url = "/CarData/JsonCarMyCarImagesDT";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carno": carno }),
        dataType: "json",
        success: function (arrData) {
            // 데이터 등록 // 페이지 구성
            if (arrData.ErrCode == 0) {
                // 전체 이미지 새로 고침
                alert("삭제되었습니다. 페이지를 새로고침합니다.");
                location.reload();

            } else {
                alert("삭제중 오류가 발생하였스빈다. 계속 될경우 고객센터에 문의하세요.\r\n" + arrData.ErrMessage);
            }
            return;
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
            return;
        }
    });
}
function reSetImagePhotoUDP(carno, imageno) {
    UpLoadSingleFile(carno, imageno);
}
function reSetImageSortSave(carno) {
    if (confirm("해당 순서로 순번을 재설정하시겠습니까?")) {
        if (bPhotoTran) {
            alert("순번을 재설정 중입니다. 잠시만 기다려주세요!");
            return;
        }

        try {
            bPhotoTran = true;
            var msg = "";
            $("#ui_imagesort li").each(function (index) {
                var vimageno = $(this).attr("data-photo-no");
                // 데이터를 등록 합니다.
                msg += reSetImageSortSaveCommit(vimageno, index + 1);
            });

        } finally {
            bPhotoTran = false;
        }

        if (msg.length > 0)
            alert(msg);
        else
            alert("차량 순서가 저장되었습니다. 순번을 다시로드합니다.");

        // 데이터 등록이 완료되었습니다.
        setTimeout(function () {
            reLoadPopupSortImage(carno);
        }, 2000);
    }
}
function reSetImageSortSaveCommit(imageno, index) {
    var result = "";
    var Url = "/CarData/JsonGCarCarImageSortUP";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carimageno": imageno, "index": index }),
        dataType: "json",
        success: function (arrData) {
            // 데이터 등록 // 페이지 구성
            if (arrData.ErrCode != 0) {
                result += index + " 번째 파일 설정중 오류 발생. 오류내용은 " + arrData.ErrMessage + "\r\n";
            }
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });

    return result;
}
/* 메인 공지사항 보기 */
function goPopupNoBoardView(no) {
    $(".modal_carbackground").remove();
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");

    var Url = "/Pop/NBoardView/" + no;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        success: function (arrData) {
            var vHeight = 450;
            var vWidth = 920;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2 - 50;

            if (vTop < 10) {
                vTop = 10
            }

            $(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

            // 이벤트를 등록한다.
            $("#ui_popup .uc_cancel").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $(vmodal).click(function () {
                vmodal.hide();
                vmodalcontent.hide();
            });
            // 설정을 완료 하후 오픈한다.
            vmodal.show();
            vmodalcontent.show();

            // 스크롤 이벤트를 먼저 등록
            //$("#ui_popup .scrollbar").scroller();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}

/* 메인 사원구인정보 */
function reLoadPopupJobEmp(boardno) {
    var carno = $("#tbxpopupcarno").val();

    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }

    $(".modal_carcontent").addClass('wide_860')

    $('.uc_btnmode').click(function () {
        $(".modal_carcontent").removeClass('tt');
    });

    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");

    var Url = "/Home/PopupDetail/" + boardno;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        success: function (arrData) {
            var vHeight = 900;
            var vWidth = 920;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2 - 50;

            if (vTop < 10) {
                vTop = 10
            }

            $(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });
            $('.modal_carcontent').attr('style', 'width: "920px !important');

            // 이벤트를 등록한다.
            $("#ui_popup .uc_header .uc_btnmode").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $(vmodal).click(function () {
                vmodal.hide();
                vmodalcontent.hide();
            });
            
            // 설정을 완료 하후 오픈한다.
            vmodal.show();
            vmodalcontent.show();

            // 스크롤 이벤트를 먼저 등록
            //$("#ui_popup .scrollbar").scroller();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}

/**/
function goPopupContect() {
    alert("제휴제안은 유선으로 아래 고객센터로 문의 주시길 바랍니다.");
    return;
}
/* 메인 카메니저 이용약관 및 개인정보 수집 및 이용목적 */
function goPopupUseTerms() {
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");

    var Url = "/Pop/Index";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        success: function (arrData) {
            var vHeight = 600;
            var vWidth = 920;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2 - 50;

            if (vTop < 10) {
                vTop = 10
            }

            $(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

            // 이벤트를 등록한다.
            $("#ui_popup .uc_cancel").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $(vmodal).click(function () {
                vmodal.hide();
                vmodalcontent.hide();
            });
            // 설정을 완료 하후 오픈한다.
            vmodal.show();
            vmodalcontent.show();

            // 스크롤 이벤트를 먼저 등록
            //$("#ui_popup .scrollbar").scroller();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}
/* 개인정보 취급방침 */
function goPopupPersonPolicy() {
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");

    var Url = "/Pop/PersonPolicy";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        success: function (arrData) {
            var vHeight = 600;
            var vWidth = 920;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2 - 50;

            if (vTop < 10) {
                vTop = 10
            }

            $(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

            // 이벤트를 등록한다.
            $("#ui_popup .uc_cancel").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $(vmodal).click(function () {
                vmodal.hide();
                vmodalcontent.hide();
            });
            // 설정을 완료 하후 오픈한다.
            vmodal.show();
            vmodalcontent.show();

            // 스크롤 이벤트를 먼저 등록
            //$("#ui_popup .scrollbar").scroller();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}
function goPopupSiteMap() {
    alert("준비중입니다.");
    return;
}

/* 내차관리 & 상사매물관리 */
/* 차량 관리 처리 */
function reviewCarRefreshUPD(carno,page) {
    var vCarRefreshKey = "";     //차량고유번호 CarNo변수
    var vCarRefreshOnCarNoKey = "";     //차량고유번호 OnCarNo변수
    var vCarRefreshCount = 0;    //선택매물 차량 Count
    var vNotUpdateCount = 0;     //Update 미대상 차량수
    var vCarPlateNumbers = "";   //Update 대상 차량번호 변수
    var _timeDiff;

    var valAr;
    $("#ui_mypagecar input[type=checkbox]:checked").each(function () {
        if (jQuery.trim($(this).val()) != "on") {
            valAr = $(this).val().split(",");
            _timeDiff = valAr[1].split(":")[0];

            vCarRefreshCount++;
            if (Number(_timeDiff) >= 3 || Number(_timeDiff.toString().indexOf(".")) > 0) {
                vCarRefreshKey += jQuery.trim(valAr[0]) + ",";
                vCarRefreshOnCarNoKey += "'" + jQuery.trim(valAr[3]) + "',";
                vCarPlateNumbers = (vCarPlateNumbers == "") ? valAr[2] : vCarPlateNumbers + "," + valAr[2];
            }
            else {
                vNotUpdateCount++;
            }
        }
    });
    if (vCarRefreshKey.indexOf(",") > 0) {
        vCarRefreshKey = vCarRefreshKey.substr(0, vCarRefreshKey.length - 1);
    }

    if (vCarRefreshCount < 1) {
        alert("하나 이상의 매물을 선택하세요.");
        return;
    }
    if (vCarPlateNumbers == "") {
        alert("선택 차량중 마지막 새로고침후 3시간이 지난 차량이 존재하지 않아\n새로고침이 불가능 합니다.");
        return;
    }
    if (confirm("선택하신 매물을 새로고침 하시겠습니까? \r\n\r\n참고: 선택된 차량이 3시간 이전에 수정된 경우 새로 고침이 되지 않습니다.")) {
        reSetRefreshCarUP(vCarRefreshKey, vCarRefreshOnCarNoKey, '', '', '', vNotUpdateCount, vCarPlateNumbers,page);
    }
} 

/* 내차관리 & 상사매물관리 */
function recheckCarALL() {
    $("#ui_mypagecar input[type='checkbox']").prop("checked", $("#cbxcheckall")[0].checked);
}
/* 내차관리 & 상사매물관리 */
//차량 업데이트
function reSetRefreshCarUP(carno, oncarno, dateDiff, lastupdatetime, carplatenumber, notupdatecount, carplatenumbers,page) {
    vLoading.show();

    if (notupdatecount == "" && carplatenumbers == "") {
        var _lastAr = dateDiff.split(":");
        var _lastTiemAr = lastupdatetime.split(":");
        if (Number(_lastAr[0]) >= 3 || Number(_lastAr[0].toString().indexOf(".")) > 0) {
            // array 형태로 , 구분자로 보낸다.
            var Url = "/CarRefresh/JsonCarRefresh";
            $.ajax({
                type: 'POST',
                cache: false,
                contentType: "application/json; charset=utf-8",
                url: Url,
                data: JSON.stringify({ "carno": carno, "oncarno": oncarno, "page": page }),
                dataType: "json",
                success: function (data) {
                    // 데이터 등록 // 페이지 구성

                    if (data.ErrCode == "0") {
                        alert("차량 정보가 새로고침 되었습니다.");
                        location.reload();
                    }
                    else {
                        alert("새로고침중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
                        location.reload();
                    }
                },
                fail: function (data) {
                    alert("데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
                },
                complete: function () {
                    vLoading.hide();
                }
            });
        }
        else {
            alert("마지막 새로고침후 3시간이 지나지 않았습니다. \n새로고침 가능한 시간은 " + (Number(_lastTiemAr[0]) + 3) + "시 " + (_lastTiemAr[1]) + "분" + "이후입니다.");
            vLoading.hide();
        }
    }
    else {
        var Url = "/CarRefresh/JsonCarRefresh";
        $.ajax({
            type: 'POST',
            cache: false,
            contentType: "application/json; charset=utf-8",
            url: Url,
            data: JSON.stringify({ "carno": carno, "oncarno": oncarno }),
            dataType: "json",
            success: function (data) {
                // 데이터 등록 // 페이지 구성

                if (data.ErrCode == "0") {
                    if (notupdatecount > 0) {
                        if (notupdatecount == 1) {
                            alert(carplatenumbers + "번호 차량의 마지막 새로고침후 3시간이 지나지 않았습니다.");
                        }
                        else {
                            alert(carplatenumbers + "번호 차량 외 " + notupdatecount + "대의 차량이 마지막 새로고침후 3시간이 지나지 않았습니다.");
                        }
                    }
                    else {
                        alert("차량 정보가 새로고침 되었습니다.");
                    }
                }
                else {
                    alert("새로고침중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
                }
            },
            fail: function (data) {
                alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
            },
            complete: function () {
                vLoading.hide();
                location.reload();
            }
        })
    }

} 

//계약처리 ORG
/* 내차관리 & 상사매물관리 */
// 차량 계약 진행
function reSetContractCar(carno,page) {
    if (confirm("해당 차량을 광고중지 하시겠습니까?")) {
        var Url = "/CarData/JsonGCarContract";
        $.ajax({
            type: 'POST',
            cache: false,
            contentType: "application/json; charset=utf-8",
            url: Url,
            data: JSON.stringify({ "carno": carno, "page": page }),
            dataType: "json",
            success: function (data) {
                // 데이터 등록 // 페이지 구성

                if (data.ErrCode == "0") {
                    alert("광고중지 되었습니다.");
                    location.reload();
                }
                else {
                    alert("새로고침중 오류가 발생하였습니다. \r\n5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
                }
            },
            fail: function (data) {
                alert("광고중지 중 오류가 발생하였습니다. \r\n5분 후에 다시 시도해 주세요.  계속 될 경우 관리자에게 문의하세요.");
            }
        });
    }
}
/* 내차관리 & 상사매물관리 */
// 차량 계약 진행 취소
function reSetContractCarReturn(carno,page) {
    var Url = "/CarData/JsonGCarContractReturn";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carno": carno, "page": page }),
        dataType: "json",
        success: function (data) {
            // 데이터 등록 // 페이지 구성

            if (data.ErrCode == "0") {
                alert("해당 차량은 광고재개 되었습니다.");
                location.reload();
            }
            else {
                alert("광고재개중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
            }
        },
        fail: function (data) {
            alert("광고재개중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
/* 내차관리 & 상사매물관리 */
// 차량 계약 관련
function reSetContractCarCommit(carno,page) {
    if (confirm("판매처리 하시겠습니까?")) {
        var Url = "/CarData/JsonGCarContractCommit";
        $.ajax({
            type: 'POST',
            cache: false,
            contentType: "application/json; charset=utf-8",
            url: Url,
            data: JSON.stringify({ "carno": carno, "page": page }),
            dataType: "json",
            success: function (data) {
                // 데이터 등록 // 페이지 구성

                if (data.ErrCode == "0") {
                    alert("판매 처리 되었습니다.");
                    location.reload();
                }
                else {
                    alert("판매 처리 중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
                }
            },
            fail: function (data) {
                alert("판매 처리 중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
            }
        });
    }
    else {
        return false;
    }

}





/* 상사매물관리 & 상사보드판 */
// 차량 키 등록
function reSetCarKeyInfo(carno, id, changeid,page) {
    var uid = "#" + id;
    var carkeyinfo = $(uid).find(".tbxcarkeyno").val();

    if (carkeyinfo.length < 1) {
        alert("키정보는 1자리 이상 입력하셔야 합니다.");
        return;
    }

    var Url = "/CarData/JsonGCarKeyInfo";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carno": carno, "carkeyinfo": carkeyinfo,"page":page }),
        dataType: "json",
        success: function (data) {
            // 데이터 등록 // 페이지 구성

            if (data.ErrCode == "0") {
                alert("키정보가 등록(수정) 되었습니다.");
                $("#" + changeid).html(carkeyinfo);
                // location.reload();
            }
            else {
                alert(data.ErrMessage);
            }
        },
        fail: function (data) {
            alert("키정보가 등록(수정) 중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
/* 상사매물관리 & 상사보드판 */
// 차량 주취 위치 등록
function reSetCarParkingInfo(carno, id, changeid,page) {
    var uid = "#" + id;
    var carparkinginfo = $(uid).find(".tbxcarparking").val();

    if (carparkinginfo.length < 1) {
        alert("주차위치를 1자리 이상 입력하셔야 합니다.");
        return;
    }

    var Url = "/CarData/JsonGCarParkingInfo";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carno": carno, "carparkinginfo": carparkinginfo ,"page":page}),
        dataType: "json",
        success: function (data) {
            // 데이터 등록 // 페이지 구성

            if (data.ErrCode == "0") {
                alert("주차위치가 등록(수정) 되었습니다.");
                $("#" + changeid).html(carparkinginfo);
                // location.reload();
            }
            else {
                alert(data.ErrMessage);
            }
        },
        fail: function (data) {
            alert("주차위치 등록(수정) 중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
/* 상사매물관리 & 상사보드판 */
// 키이력 출고 등록
function reSetKeyLog(carno, id,page) {
    var uid = "#" + id;
    if ($(uid).find(".tbxlicenceno") == undefined) {
        alert("키 반출 할 객체 정보가 정확하지 않습니다. \r\n계속 될 경우 관리자에게 문의하세요.");
        return;
    }

    var licenceno = $(uid).find(".tbxlicenceno").val();
    var smssend = $(uid).find(".datasmssend").val();

    if (licenceno.length < 10) {
        alert("키 반출할 사원정보가 정확하지 않습니다. \r\n계속 될 경우 관리자에게 문의하세요.");
        return;
    }

    var Url = "/CarData/JsonGCarRentKeyLog";

    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carno": carno, "licenceno": licenceno, "smssend": smssend, "page": page }),
        dataType: "json",
        success: function (data) {
            // 데이터 등록 // 페이지 구성
            console.log(data);
            if (data.ErrCode == "0") {
                alert("키 불출이 적용되었습니다.");
                location.reload();
            }
            else {
                alert(data.ErrMessage + "\r\n키 불출 처리 중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
            }
        },
        fail: function (data) {
            alert("판매 처리 중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
/* 상사매물관리 & 상사보드판 */
// 키이력 입고 설정
function reSetKeyLogReturn(carno,page) {
    if (!confirm("차량을 반납 처리 하시겠습니까?")) {
        return;
    }
    var Url = "/CarData/JsonGCarRentKeyLogReturn";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        data: JSON.stringify({ "carno": carno, "page": page }),
        dataType: "json",
        success: function (data) {
            // 데이터 등록 // 페이지 구성

            if (data.ErrCode == "0") {
                alert("키 반납 처리 되었습니다.");
                location.reload();
            }
            else {
                alert("키 반납 처리 중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
            }
        },
        fail: function (data) {
            alert("키 반납 처리 중 오류가 발생하였습니다. \r\n 5분 후에 다시 시도해 주세요. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
/* 상사매물관리 & 상사보드판 */
function reviewCarParkingView(viewid, displayId) {
    var vid = "#" + viewid;
    var displayId = "#" + displayId;

    if ($(displayId).val() && $(displayId).val() == "1") {
        $(".uc_keyview").hide();
        $(".uc_keywrite").hide();
        $(vid).hide();
        $(displayId).val("");
    } else {
        if ($(vid).css("display") == "none") {
            $(".uc_keyview").hide();
            $(".uc_keywrite").hide();
            $(vid).show();
        } else {
            $(".uc_keyview").hide();
            $(".uc_keywrite").hide();
            $(vid).hide();
        }
    }
}

//2016-09-30 : 정다은
//내차관리 - 키관리 클릭시 키관리 영역을 보여주기는 하지만 숨기는 기능이 없어 생성
function reviewCarParkingHide(viewid) {
    var vid = "#" + viewid;
    $(vid).hide();
}

/* 상사보드판 */
function reviewCarKeyWrite(writeid, obj) {
    var vid = "#" + writeid;
    $("#ui_context tbody p.uc_wcancel").css("color", "black");
    if ($(vid).css("display") == "none") {
        $(".uc_keyview").hide();
        $(".uc_keywrite").hide();

        $(vid).show();
        $(vid).find(".tbxlicenceno").focus();
        $(obj).css("color", "blue");
    } else {
        $(".uc_keyview").hide();
        $(".uc_keywrite").hide();
        $(obj).css("color", "black");
    }
}
/* 상사보드판 */
function reSetCarKeySMSSend(id) {
    var uid = "#" + id;
    var smssend = $(uid).find(".tbxviewsmasend").html();
    var smssendstate = $(uid).find(".datasmssend").val();

    if (smssendstate == "1") {
        $(uid).find(".tbxviewsmasend").html("발송안함");
        $(uid).find(".datasmssend").val("0");
    } else {
        $(uid).find(".tbxviewsmasend").html("문자발송");
        $(uid).find(".datasmssend").val("1");
    }
}

/* 해더 상세 검색 */
function reSetSearchHD() {
    var vCarNumber = $("#tbxSearchHD").val();
    //
    alert("통합검색은 준비중입니다.");
    return;

    if (vCarNumber.length < 4) {
        alert("차량번호를 4자리 이상 입력하세요!");
        return;
    }



    var newForm = jQuery('<form>', {
        'action': '/Car/Data',
        'method': 'post'
    })
    newForm.append(jQuery('<input>', {
        'name': 'tbxSearchCarNumber',
        'value': vCarNumber,
        'type': 'hidden'
    }));
    // body 에 생성 한후 submit();
    newForm.appendTo($("body"));
    newForm.submit();
}


/* 차량 키로그 */
function reLoadCarKeyLog(carno) {
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");

    var Url = "/MyShop/PopupCarKeyLog/" + carno;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "html",
        success: function (arrData) {
            var vHeight = 624;
            var vWidth = 1020;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2;

            $(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

            $("#ui_carkeylog .uc_header .uc_btnmode").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });
            // 설정을 완료 하후 오픈한다.
            vmodal.show();
            vmodalcontent.show();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}


//////////////////////////////////////////////////////
/* 회원 관련 */
//////////////////////////////////////////////////////
/* 회원 영역 */
function goMyCar(state) {
    if (state != "0" && state != null) {
        location.href = "/MyPageCar/?state=" + state;
    } else {
        location.href = "/MyPageCar/";
    }
}

function goMyProduct() {
    location.href = "/GProduct/Product";
}

function goExCar() {
    location.href = "/GProduct/MyProduct/ExCarAdvertManagement";
}
//////////////////////////////////////////////////////
/* 차량 관련 */
//////////////////////////////////////////////////////

// 섬네일 이미지 이벤트 설정
function reSetEventCarThumbView() {
    $(".uc_carthumbview")
        .mouseover(function () {
            $(this).find("div").show();
        })
        .mouseout(function () {
            $(this).find("div").hide();
        });
}
// 차량 옵션 정보 보여주기
function reSetEventCarOptionView() {
    $(".uc_cardata_optionview")
        .mouseover(function () {
            $(this).find("div").removeClass("uc_hide");
        })
        .mouseout(function () {
            $(this).find("div").addClass("uc_hide");
        });
}



/******************************************************/
function goMyShopBoard() {
    location.href = "/myshop/board";
}


/* iframe 에서 호출 할 경우 여백이 생기는 문제를 해결 하기 위에서 상단에 프레임을 생성하도록 변경 */
function SetPrintPageCarTransCost(url) {
    $("#ui_printview").html("<a href='/Print/PrintTransferCost?" + url + "' class='btnPrint' style='display:none;'></a>");
    $(".btnPrint").printPage();
    $(".btnPrint").trigger('click');
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
    return $("<form name='" + formName + "'>" + makeFormString(data) + "</form>").appendTo(document.body).data("json", data).get(0);
}

/**
 * 데이터를 특정 페이지로 전달. post 방식 사용
 * ※ makeFormElements 과 연계됨
 * @Param url 페이지 url
 * @Param data 전달할 데이터 (JSON 객체) 또는 폼 객체
 * @Param formName 폼 이름
 */
function postTo(url, data, formName) {
    var form = data && data instanceof HTMLFormElement ? data : makeFormElements(data);
    form.action = url;
    form.method = "post";
    setTimeout(function () {
        form.submit();
    }, 0);
    return form;
}




//문자열 base64로 인코딩
function encode(encstring) {
    return encodeURIComponent(encstring);
}

//문자열 base64로 디코딩
function decoding(decstring) {
    return decodeURIComponent(decstring);
}

//최근본차량
 

var resentcarlog = {
    one_create: function (carno, carlockstate, imagepath, makername, gradename, platenumber, regdate, usekm, saleamt) {
        console.log(saleamt);
        var carlog_one_json = { carno: carno, carlockstate: carlockstate, imagepath: imagepath, makername: makername, gradename: gradename, platenumber: platenumber, regdate: regdate, usekm: usekm, saleamt: saleamt, createdate: Date()};
        resentcarlog.create_array_json(carlog_one_json);
    },
    //기존 최근본차량 쿠키값 배열 참조
    create_array_json: function (json_one) { 
        try {
            var carlogcookie = cookie.get('CARLOG_BASE');
            var carlogcookie2 = cookie.get('CARLOG2');
            var carlogobject = new Array();
            var carlogobject2 = new Array();
            var jsonstring = "";
            var value = "";
            var value2 = "";

            if (carlogcookie.toString() == "") {
                carlogobject.push(json_one);
            }
            else {
                if (carlogcookie2 == "") {
                    carlogobject = jsonobject.converttojson(decoding(carlogcookie));
                }
                else {
                    carlogobject = jsonobject.merge(jsonobject.converttojson(decoding(carlogcookie)), jsonobject.converttojson(decoding(carlogcookie2)));
                }
                carlogobject.push(json_one);
                carlogobject = resentcarlog.sort(carlogobject);

                carlogobject2 = carlogobject.splice(4, 1);
                if (carlogobject.length > 2) {
                    value2 = encode(jsonobject.converttostr(carlogobject2));
                } 
            }
            value = encode(jsonobject.converttostr(carlogobject.splice(0, 4)));
            carlogobject = jsonobject.converttojson(decoding(value)); 
            var date = new Date();
            var newdate = new Date(date);
            document.cookie = "CARLOG_BASE=" + value+"; +; path=/";
            carlogcookie = cookie.get('CARLOG_BASE');
            carlogobject = jsonobject.converttojson(decoding(carlogcookie)); 
            cookie.set('CARLOG2', value2.toString(), 7, '/');
        }
        catch (e) {
            console.log(e.toString())
            return e.toString();
        }
        finally {
            $("#compare_cardetail").attr("disabled", "disabled");
            $("#compare_cardetail").css("background", "#aaa");
            return 'OK';
        }

    },
    sort: function (jsonobject) {
        try {
            var jsonLockData = new Array();
            var jsonData = new Array();
            for (var i = 0; i < jsonobject.length; i++) {
                if (jsonobject[i].carlockstate == true || jsonobject[i].carlockstate == 'true' || jsonobject[i].carlockstate == 1) {
                    jsonLockData.unshift(jsonobject[i]);
                }
                else {
                    jsonData.unshift(jsonobject[i]);
                }
            }
            jsonLockData = jsonLockData.sort(function (a, b) {
                return (a.createdate > b.createdate) ? -1 : (a.createdate < b.createdate) ? 1 : 0;
            });
            jsonData = jsonData.sort(function (a, b) {
                return (a.createdate > b.createdate) ? -1 : (a.createdate < b.createdate) ? 1 : 0;
            });
            jsonobject = $.merge(jsonLockData, jsonData);

            
            if (jsonobject.length >5) {
                $.removeCookie(jsonobject[5].toString());
            }

            return jsonobject;
        }
        catch (e) {
            console.log(e.toString());
        }


    },
    carloglist: function () {
        var carlogcookie = cookie.get('CARLOG_BASE');
        var carlogcookie2 = cookie.get('CARLOG2');
        var CHECKCARLOGS = cookie.get('CHECKCARLOGS');
        var value;
        if (CHECKCARLOGS != "YES") {
            if (carlogcookie != "") {
                var car_detail_html = "";
                var car_detail_list_html = "";
                var count = 0;
                if (carlogcookie2 == "") {
                    carLogDataList = jsonobject.converttojson(decoding(carlogcookie));
                }
                else {
                    carLogDataList = jsonobject.merge(jsonobject.converttojson(decoding(carlogcookie)), jsonobject.converttojson(decoding(carlogcookie2)));
                }

                carLogDataList = resentcarlog.sort(carLogDataList); 
                for (var row = 0; row < carLogDataList.length; row++) {
                    var strCarNo = carLogDataList[row].carno;
                    if (row < 5) {
                        if (strCarNo) {
                            var strNumber = decodeURI(carLogDataList[row].platenumber);
                            var strImage = carLogDataList[row].imagepath;
                            car_detail_html += "<li data-cardetail='" + strCarNo + "' id='cardetail_" + strCarNo + "'><iframe id='ui_frameview' src='/PopupFrame/CarDetailEnc?encarno=" + encodeURIComponent(getCookie("encarno_" + strCarNo)) + "' scrolling='no' frameborder='0' allowtransparency='true' class='frameborder'></iframe></li>";
                            car_detail_list_html += "<li  id='cardetail_list_li_" + strCarNo + "' data-carlist='" + strCarNo + "'><div class='uc_btnlock'><img class='lock2_img_" + strCarNo + "' onclick='resentcarlog.lockstate(" + strCarNo + ");' src='/include/image/btn/lock2_" + ((carLogDataList[row].carlockstate) ? 'on' : 'off') + ".png' /></div><button type='button' class='btn esc' onclick='resentcarlog.remove(" + strCarNo + ")'></button><div class='car-img'><img id='cardetail_img_" + strCarNo + "' src='" + strImage + "'  onerror=\"this.src='/include/image/car/car_noimage_big.jpg'\"/></div><span id='cardetail_car_model_" + strCarNo + "' class='car-model'>" + decodeURI(carLogDataList[row].makername) + "</span><span id='cardetail_car_grade_" + strCarNo + "'  class='car-grade'>" + decodeURI(carLogDataList[row].gradename) + "</span></li>";
                            count += 1;
                        }
                    }
                    else { 
                        $("#cardetail_" + strCarNo).remove();
                        $("#cardetail_list_" + strCarNo).remove();
                    }
                }
                $(".car-detail").append(car_detail_html);
                $(".latest-car-list").append(car_detail_list_html);
                resentcarlog.clickEvent();
                reSetCarCompareBind();

            }
        }

        cookie.set('CHECKCARLOGS', "YES");
    },
    carlog_right_list: function () {
        $("#ui_carlog .uc_carvisit").hide();
        var carLogDataLockList = new Array;;
        var carLogDataNoLockList = new Array;;
        var innerHtml = "";
        var innerHtmlSelect = "";
        var carlogcookie = cookie.get('CARLOG_BASE');
        var carlogcookie2 = cookie.get('CARLOG2');
        reLoadCarConfig();
        if (carlogcookie != "") {
            var carLogDataList;
            if (carlogcookie2 == "") {
                carLogDataList = jsonobject.converttojson(decoding(carlogcookie));
            }
            else {
                carLogDataList = jsonobject.merge(jsonobject.converttojson(decoding(carlogcookie)), jsonobject.converttojson(decoding(carlogcookie2)));
            }
            carLogDataList = resentcarlog.sort(carLogDataList);
            innerHtmlSelect = "전체선택<div class='uc_btncheck all'><img onclick='allselect();' src='/include/image/btn/check_off.png' /></div>";
            //alert(carLogDataList.length);
            for (var row = 0; row < carLogDataList.length; row++) {
                if (row < 5) {
                    if (carLogDataList[row].carno) {
                        var vCarAmountSale = carLogDataList[row].saleamt > 0 ? carLogDataList[row].saleamt : "0"; 
                        if (vCarAmountSale) {
                            if (cookieCarAmount != 0) {
                                vCarAmountSale = parseInt(vCarAmountSale) + cookieCarAmount;
                            } else {
                                if (cookieCarAmountPer != 0) {
                                    vCarAmountSale = parseInt(vCarAmountSale) + (parseInt(vCarAmountSale) * cookieCarAmountPer / 100);
                                }
                            }
                             
                            if (parseInt(vCarAmountSale) > 0)
                                vCarAmountSale = $.number(vCarAmountSale) + "만원";
                            else
                                vCarAmountSale = "상담";
                        } else {
                            vCarAmountSale = "상담";
                        } 
                        var strCarNo = carLogDataList[row].carno;
                        var strNumber = decodeURI(carLogDataList[row].platenumber);
                        var strImage = carLogDataList[row].imagepath;
                        innerHtml += "<div class='uc_visititem ' id='visititem_" + strCarNo + "'  data-no='" + strCarNo + "'>";
                        innerHtml += "    <ul>";
                        innerHtml += "        <li class='uc_btncheck btn_closeoverlay uc_carlogcheckbox'  onclick=''><img src='/include/image/btn/check_off.png' /></li>";
                        innerHtml += "        <li class='uc_btnlock btn_closeoverlay'><img class='lock2_img_" + strCarNo + "' onclick='resentcarlog.lockstate(" + strCarNo + ");' src='/include/image/btn/lock2_" + ((carLogDataList[row].carlockstate) ? 'on' : 'off') + ".png' /></li>";
                        innerHtml += "        <li class='uc_carimage'><img src='" + strImage + "'  width='58' height='46' onerror=\"this.src = '/include/image/car/car_noimage_big.jpg'\" /></li>";
                        innerHtml += "        <li class='uc_carmark'>" + strNumber + "</li>";
                        innerHtml += "        <li class='uc_detail'><button type='button' class='btn esc btn_closeoverlay' onclick='resentcarlog.remove(" + strCarNo + ");'></button><span class='model'>" + decodeURI(carLogDataList[row].makername) + "</span><span class='grade'>" + decodeURI(carLogDataList[row].gradename) + "</span><span class='option'>" + ((carLogDataList[row].regdate != null && carLogDataList[row].regdate != "null" && carLogDataList[row].regdate != "") ? decodeURI(carLogDataList[row].regdate.toString().substr(0, 4) + "." + carLogDataList[row].regdate.toString().substr(5, 2)) : "") + "|" + $.number(carLogDataList[row].usekm) + " km</span><span class='price' " + ((cookieIsCarAmountH) ? "style=display:none;" : "") + ">" + vCarAmountSale + "</span>";
                        innerHtml += "</li>";
                        innerHtml += "    </ul>";
                        innerHtml += "</div>";
                        $("#ui_carlog .uc_carvisit").show();

                    }
                }
                else {
                    resentcarlog.remove(strCarNo);
                }


                $("#all_select_car_Log").html(innerHtmlSelect);
                $('#ui_carlog .uc_visititems').html(innerHtml);

                $(".uc_carlogcheckbox img").on("click", function (event) {
                    var vSrc = $(this).attr("src");
                    if (vSrc.indexOf("_on") > 0) {
                        $(this).attr("src", vSrc.replace("_on", "_off"));
                    } else {
                        $(this).attr("src", vSrc.replace("_off", "_on"));
                    }
                    if ($(this).parent().hasClass("btn_closeoverlay")) {
                        var cnt = 0;
                        $(".uc_visititem").each(function () {
                            var onOffCheck = $(this).find(".uc_btncheck").find("img").attr("src");
                            if (onOffCheck.indexOf("_on") > 0) {
                                cnt++;
                            }
                        });
                        if (cnt == 0) {
                            $("#compare_cardetail").attr("disabled", "disabled");
                            $("#compare_cardetail").css("background", "#aaa");
                        }
                        else {
                            $("#compare_cardetail").removeAttr("disabled");
                            $("#compare_cardetail").css("background", "#4959ec");
                        }
                        if (cnt < $(".uc_visititems").children().size()) {
                            $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_off.png");
                        } else {
                            $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_on.png");
                        }
                    }
                    event.stopPropagation();
                });
                $(".uc_carlogcheckbox img").on("click", function (event) {
                    event.stopPropagation();
                });
                // 바인딩은 등록 후 시킨다.
                reSetCarCompareBind();
            }
        }
    },
    clickEvent: function () {
        var flag = 0;
        $(".latest-car-more").unbind("click").click(function () {
            if (flag == 0) {
                $(".latest-car").css("height", "200px");
                $(".latest-car-more img").css("transform", "rotate(-180deg)");
                flag = 1;
            } else if (flag == 1) {
                $(".latest-car").css("height", "40px");
                $(".latest-car-more img").css("transform", "rotate(0deg)");
                flag = 0;
            }
        });

        $(".latest-car-list li").unbind("click").click(function () {
            var carlist = $(this).data("carlist");
            $(".car-detail li").css("display", "none");
            $(".car-detail").find("li[data-cardetail='" + carlist + "']").css("display", "block");
        });
    },
    remove: function (carno) {
        var carlogcookie = cookie.get('CARLOG_BASE');
        var carlogcookie2 = cookie.get('CARLOG2');
        var carLogDataList = jsonobject.merge(jsonobject.converttojson(decoding(carlogcookie)), jsonobject.converttojson(decoding(carlogcookie2)));
        var carLogDataList1 = carLogDataList;
        var carLogDataList2 = carLogDataList;
        for (var row = 0; row < carLogDataList.length; row++) {
            if (carLogDataList[row].carno == carno) {
                if (carLogDataList[row].carlockstate == 1) {
                    alert("Lock 상태이므로 삭제할 수 없습니다.");
                }
                else {
                    carLogDataList.splice(row, 1);
                    var value = "";
                    var value2 = "";
                    if (carLogDataList.length > 4) {
                        carLogDataList2 = carLogDataList.splice(4, 1);
                        value = encode(jsonobject.converttostr(carLogDataList));
                        value2 = encode(jsonobject.converttostr(carLogDataList2));
                    }
                    else {
                        value = encode(jsonobject.converttostr(carLogDataList));
                    }

                    cookie.set('CARLOG_BASE', value.toString(), 7, '/');
                    cookie.set('CARLOG2', value2.toString(), 7, '/');
                    $("#cardetail_list_li_" + carno).remove();
                    $("#cardetail_" + carno).remove();
                    $("#visititem_" + carno).remove();
                    $(".latest-car-list").find("li").eq(0).click();
                }
            }
        }
    },
    lockstate: function (carno) {
        try {
            var carlogcookie = cookie.get('CARLOG_BASE');
            var carlogcookie2 = cookie.get('CARLOG2');
            var carLogDataList = jsonobject.merge(jsonobject.converttojson(decoding(carlogcookie)), jsonobject.converttojson(decoding(carlogcookie2)));
            var carLogDataList2 = "";
            for (var row = 0; row < carLogDataList.length; row++) {
                if (carLogDataList[row].carno == carno) {
                    if ($(".lock2_img_" + carno).attr("src") == "/include/image/btn/lock2_on.png") {
                        $(".lock2_img_" + carno).attr("src", "/include/image/btn/lock2_off.png")
                    }
                    else {
                        $(".lock2_img_" + carno).attr("src", "/include/image/btn/lock2_on.png")
                    }
                    carLogDataList[row].carlockstate = !carLogDataList[row].carlockstate;

                    var value = "";
                    var value2 = "";
                    if (carLogDataList.length > 4) {
                        carLogDataList2 = carLogDataList.splice(4, 1);
                        carLogDataList = carLogDataList.splice(0, 4);
                        value = encode(jsonobject.converttostr(carLogDataList));
                        value2 = encode(jsonobject.converttostr(carLogDataList2));
                    }
                    else {
                        carLogDataList = carLogDataList.splice(0, 4);
                        value = encode(jsonobject.converttostr(carLogDataList));
                    }

                    cookie.set('CARLOG_BASE', value.toString(), 7, '/');
                    cookie.set('CARLOG2', value2.toString(), 7, '/');
                    $(".latest-car-list").find("li").eq(0).click();

                }
            }
        }
        catch (e) {
            console.log(e.toString());
        }

    }
}
var jsonobject = {
    //문자열을 json타입으로
    converttojson: function (str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return "";
        }

    },
    converttostr: function (jsonobject) {
        return JSON.stringify(jsonobject);
    },
    /*ie 11,edge17,chrome 49~ */
    sort_new: function (jsonobject, parm1, parm2) {
        return jsonobject.localeCompare(parm1, parm2)
    },
    jsontostring: function (jsonobject) {
        var results = [];
        for (var property in jsonobject) {
            var value = jsonobject[property];
            if (value)
                results.push(property.toString() + ': ' + value);
        }

        return '{' + results.join(', ') + '}';
    },
    merge: function (a, b) {
        var return_value = $.merge($.merge([], a), b);
        if (return_value == null || return_value == 'null') {
            return_value = '';
        }

        return return_value;
    }
}


var jsonobject = {
    //문자열을 json타입으로
    converttojson: function (str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return "";
        }

    },
    converttostr: function (jsonobject) {
        return JSON.stringify(jsonobject);
    },
    /*ie 11,edge17,chrome 49~ */
    sort_new: function (jsonobject, parm1, parm2) {
        return jsonobject.localeCompare(parm1, parm2)
    },
    jsontostring: function (jsonobject) {
        var results = [];
        for (var property in jsonobject) {
            var value = jsonobject[property];
            if (value)
                results.push(property.toString() + ': ' + value);
        }

        return '{' + results.join(', ') + '}';
    },
    merge: function (a, b) {
        var return_value = $.merge($.merge([], a), b);
        if (return_value == null || return_value == 'null') {
            return_value = '';
        }

        return return_value;
    }
}

var cookie = {
    get: function (key) {
        var value = "";
        try {
            value = $.cookie(key).toString();
        }
        catch (e) {
            return 'FAIL';
        }
        finally {
            return value;
        }
    },
    set: function (key, value, expires, path) {
        var date = new Date();
        var newdate = new Date(date);
        try { 
            $.cookie(key, value, { expires: date.setDate(newdate.getDate() + expires), path: path });
        }
        catch (e) {
            return 'FAIL';
        }
        finally {
            return 'SUCCESS';
        }
    }
}

function latest_list() {
    if ($('.latest-search span').hasClass('on')) {
        $('.latest-search span').removeClass('on');
    } else {
        $('.latest-search span').addClass('on');
    }
}

function cmappFullDanjiPopup(danjino, closeday, imgurl, ord, downurl, linkurl) {
    var cookieid = "todayClosePopUp_" + ord;
    if (getCookie(cookieid) != "Y") {
        if ($("#" + ord).html() == undefined) {
            $('<div class="modal_carbackground" id="b' + ord + '"></div><div class="modal_carcontent" id ="c' + ord + '"></div>​').insertBefore('#modal');
        }
        var vmodal = $("#b" + ord);
        var vmodalcontent = $("#c" + ord);

        var Url = "/Pop/DanjiPopup?danjino=" + danjino + "&closeday=" + closeday + "&imgurl=" + imgurl + "&ord=" + ord + "&downurl=" + downurl + "&linkurl=" + linkurl;
        $.ajax({
            type: 'POST',
            cache: false,
            contentType: "html",
            url: Url,
            success: function (arrData) {
                vmodal.show();
                vmodalcontent.show();

                var vHeight = $(window).height() - 100;
                var vWidth = $(window).width() - 100;
                var vLeft = $(window).width() / 2 - vWidth / 2 + vWidth / 30;
                var vTop = $(window).height() / 2 - vHeight / 2;

                vmodal.show();
                vmodalcontent.html(arrData);
                vmodalcontent.css({ "height": 100, "left": vLeft, "top": vTop, "right": vLeft });

                //// 이벤트를 등록한다.
                //$("#ui_popup .uc_cancel").click(function () {
                //    // 값을 초기화 한다.
                //    vmodal.hide();
                //    vmodalcontent.hide();
                //});
                $("#cmapppopupclose_" + ord).click(function () {
                    vmodal.hide();
                    vmodalcontent.hide();
                    if ($("#todayClose_" + ord).is(":checked")) {
                        setCookie(cookieid, "Y", 1);
                    }
                });

                $(vmodal).click(function () {
                    vmodal.hide();
                    vmodalcontent.hide();
                });
            },
            fail: function (data) {
                vmodal.hide();
                vmodalcontent.hide();
                console.log("데이터 로드에 실패하였습니다.");
            }
        });
    }
}

function cmappFullDanjiPopup_V2(danjino, closeday, imgurl, ord, downurl, linkurl) {
    var cookieid = "todayClosePopUp_" + ord;
    if (getCookie(cookieid) != "Y") {
        if ($("#" + ord).html() == undefined) {
            $('<div class="modal_carbackground" id="b' + ord + '"></div><div class="modal_carcontent" id ="c' + ord + '"></div>​').insertBefore('#modal');
        }
        var vmodal = $("#b" + ord);
        var vmodalcontent = $("#c" + ord);

        var Url = "/Pop/DanjiPopup?danjino=" + danjino + "&closeday=" + closeday + "&imgurl=" + imgurl + "&ord=" + ord + "&downurl=" + downurl + "&linkurl=" + linkurl;
        $.ajax({
            type: 'POST',
            cache: false,
            contentType: "html",
            url: Url,
            success: function (arrData) {
                vmodal.show();
                vmodalcontent.show();

                var vHeight = 400;
                var vWidth = 550;
                var vLeft = $(window).width() / 2 - vWidth / 2 + vWidth / 30;
                var vTop = $(window).height() / 2 - vHeight / 2;

                vmodal.show();
                vmodalcontent.html(arrData);
                vmodalcontent.css({ "height": 100, "left": vLeft, "top": vTop, "right": vLeft });

                //// 이벤트를 등록한다.
                //$("#ui_popup .uc_cancel").click(function () {
                //    // 값을 초기화 한다.
                //    vmodal.hide();
                //    vmodalcontent.hide();
                //});
                $("#cmapppopupclose_" + ord).click(function () {
                    vmodal.hide();
                    vmodalcontent.hide();
                    if ($("#todayClose_" + ord).is(":checked")) {
                        setCookie(cookieid, "Y", 1);
                    }
                });

                $(vmodal).click(function () {
                    vmodal.hide();
                    vmodalcontent.hide();
                });
            },
            fail: function (data) {
                vmodal.hide();
                vmodalcontent.hide();
                console.log("데이터 로드에 실패하였습니다.");
            }
        });
    }
}

function onClickFunctionPopup() {
    var cookieid = "todayClosePopUp_MainPop";
    if (getCookie(cookieid) != "Y") {
        if ($(".modal_carbackground").html() == undefined) {
            $('<div class="modal_carbackground"></div><div class="modal_carcontent mainpop"></div>​').insertBefore('#modal');
        }
        var vmodal = $(".modal_carbackground");
        var vmodalcontent = $(".modal_carcontent");

        var Url = "/Pop/onClickFunctionPopup";
        $.ajax({
            type: 'POST',
            cache: false,
            contentType: "html",
            url: Url,
            success: function (arrData) {
                vmodal.show();
                vmodalcontent.show();

                var vHeight = 380;
                var vWidth = 476;
                var vLeft = $(window).width() / 2 - vWidth / 2;
                var vTop = $(window).height() / 2 - vHeight / 2 - 53;
                $(".modal_carbackground").show();
                $(".modal_carcontent").html(arrData);
                $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

                $("#cmapppopupclose_OnClick").click(function () {
                    // 값을 초기화 한다.
                    vmodal.hide();
                    vmodalcontent.hide();

                    // 오늘하루 그만보기 선택시
                    if ($("#todayClose_OnClick").prop("checked")) {
                        setCookie("todayClosePopUp_MainPop", "Y", 1);
                    }
                });

                $(vmodal).click(function () {
                    vmodal.hide();
                    vmodalcontent.hide();
                });

                vmodal.show();
                vmodalcontent.show();
            },
            fail: function (data) {
                vmodal.hide();
                vmodalcontent.hide();
                console.log("데이터 로드에 실패하였습니다.");
            }
        });
    }
}


//api 호출후 popup   내용 ,   넓이 , 높이, 몇칠닫힘,   key값,  쿠키담을네이밍, 클레스네임(css)
function popupHtml(html, vWidth, vHeight, closeDay, odrNum, cookieName, className) {
    try {
        //alert(closeDay);
        //$('body').css('overflow', 'hidden');
        if (!className) {
            className = "modal_carbackground";
        }
        if ($("#" + odrNum).html() == undefined) {
            $('<div class="' + className + '" id="b' + odrNum + '"></div><div class="modal_carcontent" id ="c' + odrNum + '"></div>​').insertBefore('#modal');
        }
        var vmodal = $("#b" + odrNum + "");
        var vmodalcontent = $("#c" + odrNum);

        var baseHtml = "<div class='img-wrap'>";
        baseHtml += html;
        baseHtml += "</div>";
        baseHtml += "<div class='pop-bottom' style='margin:0px !important;'>";
        if (closeDay != "0") {
            baseHtml += " <input type='checkbox' id='todayClose_" + odrNum + "' />";
            baseHtml += "<label for='todayClose_" + odrNum + "'><span>" + closeDay + "</span>일 동안 보지 않기</label>";
        }
        baseHtml += "<button id='cmapppopupclose_" + odrNum + "'>X</button>";
        baseHtml += "</div>";
        //$(".img-wrap").append(closeHtml);

        //var vLeft = $(window).width() / 2 - vWidth / 2;
        //var vTop = $(window).height() / 2 - vHeight / 2 - 20;


        var vLeft = $(window).width() / 2 - vWidth / 2 + vWidth / 30;
        var vTop = $(window).height() / 2 - vHeight / 2;



        vmodal.show();
        vmodalcontent.html(baseHtml);
        vmodalcontent.css({ "height": vHeight, "left": vLeft, "top": vTop, "right": vLeft });
        vmodalcontent.css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });
        vmodalcontent.show();

        $("#cmapppopupclose_" + odrNum).click(function () {
            var nDayClosePopupCheck = $("#todayClose_" + odrNum).prop("checked");
            if (nDayClosePopupCheck) {
                setCookie(cookieName + odrNum, "Y", closeDay);
            }
            vmodal.hide();
            vmodalcontent.hide();
        });

        $(vmodal).click(function () {
            var nDayClosePopupCheck = $("#todayClose_" + odrNum).prop("checked");
            if (nDayClosePopupCheck) {
                setCookie(cookieName + odrNum, "Y", closeDay);
            }
            vmodal.hide();
            vmodalcontent.hide();
        });

    }
    catch (ex) {
        console.log(ex);
        alert("팝업 조회중 통신오류가 발생하였습니다.");
    }

}

function popupHtmlEmptybottom(html, vWidth, vHeight, closeDay, odrNum, cookieName, className) {
    try {
        //alert(closeDay);
        //$('body').css('overflow', 'hidden');
        if (!className) {
            className = "modal_carbackground";
        }
        if ($("#" + odrNum).html() == undefined) {
            $('<div class="' + className + '" id="b' + odrNum + '"></div><div class="modal_carcontent" id ="c' + odrNum + '"></div>​').insertBefore('#modal');
        }
        var vmodal = $("#b" + odrNum);
        var vmodalcontent = $("#c" + odrNum);

        var baseHtml = "<div class='img-wrap' style='border: 5px solid blanchedalmond;'>";
        baseHtml += html;
        baseHtml += "</div>"; 

        var vLeft = $(window).width() / 2 - vWidth / 2 + vWidth / 30;
        var vTop = $(window).height() / 2 - vHeight / 2;



        vmodal.show();
        vmodalcontent.html(baseHtml);
        vmodalcontent.css({ "height": vHeight, "left": vLeft, "top": vTop, "right": vLeft });
        vmodalcontent.css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });
        vmodalcontent.show();

        $("#cmapppopupclose_" + odrNum).click(function () {
            //vmodal.remove();
            //vmodalcontent.remove();
            $("#b0").remove();
            $("#b00").remove();
            $("#c0").remove();
        });

        $(vmodal).click(function () {
            $("#b0").remove();
            $("#b00").remove();
            $("#c0").remove();
            //vmodal.remove();
            //vmodalcontent.remove();
        });

    }
    catch (ex) {
        console.log(ex);
        alert("팝업 조회중 통신오류가 발생하였습니다.");
    }

}



function cmappFullDanjiPopup(danjino, closeday, imgurl, ord, downurl, linkurl) {
    var cookieid = "todayClosePopUp_" + ord;
    if (getCookie(cookieid) != "Y") {
        if ($("#" + ord).html() == undefined) {
            $('<div class="modal_carbackground" id="b' + ord + '"></div><div class="modal_carcontent" id ="c' + ord + '"></div>​').insertBefore('#modal');
        }
        var vmodal = $("#b" + ord);
        var vmodalcontent = $("#c" + ord);

        var Url = "/Pop/DanjiPopup?danjino=" + danjino + "&closeday=" + closeday + "&imgurl=" + imgurl + "&ord=" + ord + "&downurl=" + downurl + "&linkurl=" + linkurl;
        $.ajax({
            type: 'POST',
            cache: false,
            contentType: "html",
            url: Url,
            success: function (arrData) {
                vmodal.show();
                vmodalcontent.show();

                var vHeight = $(window).height() - 100;
                var vWidth = $(window).width() - 100;
                var vLeft = $(window).width() / 2 - vWidth / 2 + vWidth / 30;
                var vTop = $(window).height() / 2 - vHeight / 2;

                vmodal.show();
                vmodalcontent.html(arrData);
                vmodalcontent.css({ "height": 100, "left": vLeft, "top": vTop, "right": vLeft });

                //// 이벤트를 등록한다.
                //$("#ui_popup .uc_cancel").click(function () {
                //    // 값을 초기화 한다.
                //    vmodal.hide();
                //    vmodalcontent.hide();
                //});
                $("#cmapppopupclose_" + ord).click(function () {
                    vmodal.hide();
                    vmodalcontent.hide();
                    if ($("#todayClose_" + ord).is(":checked")) {
                        setCookie(cookieid, "Y", 1);
                    }
                });

                $(vmodal).click(function () {
                    vmodal.hide();
                    vmodalcontent.hide();
                });
            },
            fail: function (data) {
                vmodal.hide();
                vmodalcontent.hide();
                console.log("데이터 로드에 실패하였습니다.");
            }
        });
    }
}

function getDay(types, addMonth) {
    var gubunType = "-";
    if (types != "") {
        gubunType = types;
    }
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1 + addMonth; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + gubunType + mm + gubunType + dd;
    return today;
}

///*차량번호 입력시 밸리데이션체크 - 구버전 */
//function carNumChk(str) {
//    if (str.length > 3 && str.length < 10) {
//        return (/^[0-9]{2}[가-힣]{1}[0-9]{4}$|[가-힣]{2}[0-9]{2}[가-힣]{1}[0-9]{4}$/).test(str);
//    } else {
//        return false;
//    }
//}

/*차량번호 입력시 밸리데이션체크 - 신버전 : 2019-09-02 JEONG.INJIN*/
function carNumChk(str) {
    if (str.length > 3 && str.length < 10) {
        return (/^[0-9]{2,3}[가-힣]{1}[0-9]{4}$|[가-힣]{2}[0-9]{2}[가-힣]{1}[0-9]{4}$/).test(str);
    } else {
        return false;
    }
}

/*차대번호 밸리데이션체크*/
function isCarVinChk(vin) {
    // Reject based on bad pattern match
    var matcher = new RegExp(/^[A-HJ-NPR-Za-hj-npr-z\d]{8}[0-9a-zA-Z][A-HJ-NPR-Za-hj-npr-z\d]{2}[A-HJ-NPR-Za-hj-npr-z\d]{6}$/g);
    //console.log("vin.match(matcher) : ", vin.match(matcher));
    if (vin.match(matcher) == null)
        return false;

    // Reject base on bad check digit
    return true;
}
/*html-textArea tag문자 제거하기*/
function removeHtmlTag(text) {
    text = text.replace(/<br\/>/ig, "\n");
    text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
    return text;
}

function carNoChangeQnaPopup(no, plateno, what) {
    var carno = no;
    if ($(".modal_carbackground").html() == undefined) {
        $('<div class="modal_carbackground"></div><div class="modal_carcontent"></div>​').insertBefore('#modal');
    }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");

    var Url = "/Pop/CarNoChangePopup?carno=" + carno + "&CarPlateNumber=" + plateno + "&what=" + what;
    //alert(encodeURI(Url));
    //return;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: encodeURI(Url),
        success: function (arrData) {
            //console.log(arrData);
            var vHeight = 450;
            var vWidth = 510;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2 - 50;

            if (vTop < 10) {
                vTop = 10
            }

            $(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

            // 이벤트를 등록한다.
            $("#ui_popup .uc_cancel").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $(vmodal).click(function () {
                vmodal.hide();
                vmodalcontent.hide();
            });
            // 설정을 완료 하후 오픈한다.
            vmodal.show();
            vmodalcontent.show();

            // 스크롤 이벤트를 먼저 등록
            //$("#ui_popup .scrollbar").scroller();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}

function carNoChangeQnaPopupV2(no, plateno, what) {
    $("#confirmdiv").hide();
    var carno = no;
    //if ($(".modal_carbackground").html() == undefined) {
    //       $('<div class="modal_carbackground"></div><div class="modal_carcontent" style="width:"15px;"></div>​').insertBefore('#modal');
    //   }
    var vmodal = $(".modal_carbackground");
    var vmodalcontent = $(".modal_carcontent");
    var Url = "/Pop/CarNoChangePopup?carno=" + carno + "&CarPlateNumber=" + plateno + "&what=" + what;
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: encodeURI(Url),
        success: function (arrData) {
            //console.log(arrData);
            var vHeight = 450;
            var vWidth = 510;
            var vLeft = $(window).width() / 2 - vWidth / 2;
            var vTop = $(window).height() / 2 - vHeight / 2 - 50;

            if (vTop < 10) {
                vTop = 10
            }

            //$(".modal_carbackground").show();
            $(".modal_carcontent").html(arrData);
            $(".modal_carcontent").css({ "width": vWidth, "height": vHeight, "left": vLeft, "top": vTop });

            // 이벤트를 등록한다.
            $("#ui_popup .uc_cancel").click(function () {
                // 값을 초기화 한다.
                vmodal.hide();
                vmodalcontent.hide();
            });

            $(vmodal).click(function () {
                vmodal.hide();
                vmodalcontent.hide();
            });
            // 설정을 완료 하후 오픈한다.


            // 스크롤 이벤트를 먼저 등록
            //$("#ui_popup .scrollbar").scroller();
        },
        fail: function (data) {
            alert("데이터 로드에 실패하였습니다.");
        }
        // 데이터를 로드 해서 입력한다.
    });
}


