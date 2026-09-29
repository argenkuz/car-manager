$(document).ready(function () {
    $(".sub").hide();
    $obj = null;
    $("#ui_menu").find("a").each(function (index) {
        if ($(this).hasClass("on")) {
            $obj = $(this);
        }
    });
    $(".uc_menu.uc_btnmode").children("a").bind("mouseenter focusin", function () {
        $("#ui_menu").find("a").removeClass("on");
        if ($obj != null) {
            $obj.addClass("on");
        }
        $(".sub").hide();
        if ($(this).attr("href").indexOf("준비중") <= 0) {
            $(this).addClass("on");
            $(this).find(".sub").show();
            $(this).next().fadeIn(200);
        }
    });
    if (common.getcookie("top_banner_Close") == "Y") {
        $(".top_banner").hide();
        $('#ui_explorer,#ui_explorer_sub,#ui_overcarlog').css('top', '112px');
        $(window).scroll(function () {
            var sclTop = $(this).scrollTop();
            if (sclTop > 112) {
                $('#ui_explorer').css('position', 'fixed').css('top', '10px');
            }
            else if (sclTop < 112) { $('#ui_explorer').css('position', 'absolute').css('top', '112px'); }
        });
    }
    else {
        $(".top_banner").show();
        $('#ui_explorer,#ui_explorer_sub,#ui_overcarlog').css('top', '192px');
        $(window).scroll(function () {
            var sclTop = $(this).scrollTop();
            if (sclTop > 192) {
                $('#ui_explorer').css('position', 'fixed').css('top', '10px');
            }
            else if (sclTop < 192) { $('#ui_explorer').css('position', 'absolute').css('top', '192px'); }
        });
    }
    topbar.oneday();
    common.menusetting();
    user.readcount();
    user.actioncheck();
});

var topbar = {
    oneday: function () {
        $("#top_banner").click(function () {
            if ($("#top_banner_Close_ChkBox").is(":checked")) {
                common.setcookie("top_banner_Close", "Y", 1);
                $(".top_banner").hide();
                $('#ui_explorer,#ui_explorer_sub,#ui_overcarlog').css('top', '112px');
                $(window).scroll(function () {
                    var sclTop = $(this).scrollTop();
                    if (sclTop > 112) {
                        $('#ui_explorer').css('position', 'fixed').css('top', '10px');
                    }
                    else if (sclTop < 112) { $('#ui_explorer').css('position', 'absolute').css('top', '112px'); }
                });
            }
            $(".top_banner").hide();
            $('#ui_explorer,#ui_explorer_sub,#ui_overcarlog').css('top', '112px');
            $(window).scroll(function () {
                var sclTop = $(this).scrollTop();
                if (sclTop > 112) {
                    $('#ui_explorer').css('position', 'fixed').css('top', '10px');
                }
                else if (sclTop < 112) { $('#ui_explorer').css('position', 'absolute').css('top', '112px'); }
            });
        });
    }
}
var common = {
    getcookie: function (cName) {
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
    },
    setcookie : function (cName, cValue, cDay) {
        var expire = new Date();
        expire.setDate(expire.getDate() + cDay);
        cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
        if (typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
        document.cookie = cookies;
    },
    menusetting: function () {
        $(".sub_menu, .bg_menu, .main_left_img").css('display', 'none');
        $("#gnb li, .bg_menu").bind("click mouseover focusin", function () {
            $(".sub_menu, .bg_menu,  .main_left_img").stop().slideDown();
            $('#ui_left').stop().animate({
                marginTop: 160,
            }, 400)
        });
        $("#gnb li, .bg_menu").bind("mouseout focusout", function () {
            $(".sub_menu, .bg_menu, .main_left_img").stop().slideUp();
            $('#ui_left').stop().animate({
                marginTop: 0
            }, 400)
        });
    }
}
var user = {
    readcount: function () {
        if (common.getcookie('READINGWAITCOUNT') != "" && common.getcookie('READINGWAITCOUNT') != "0") {
            $("#HeadLi_MyPage").addClass("alarm");
            $("#HeadLi_MyPage_Inquire").addClass("alarm");
        }
    },
    actioncheck: function () {
        jQuery(function ($) {
            var tickCount = 0;
            $("#ui_timerview").flipcountdown({
                size: "xs",
                time: function () {

                },
                tick: function () {
                    console.log("tick1");
                    if (tickCount > 60 && tickAction) {
                        // 여기 세션을 갱신 하는 부분 추가
                        tickCount = 0;
                        var Url = "/JsonUser/JsonSetSession";
                        var vAjax = $.ajax({
                            type: 'POST',
                            cache: false,
                            contentType: "application/json; charset=utf-8",
                            url: Url,
                            dataType: "json",
                            success: function (arrData) {
                                if (!IscheckLogin(arrData)) {
                                    tickAction = false;
                                    return;
                                }
                            },
                            error: function (request, status, error) {
                                if (status != "parsererror") {
                                    location.href = "/User/Login";
                                }
                            }
                        });
                    }
                    tickCount++;
                    return new Date();
                }
            });
        })
    }
}