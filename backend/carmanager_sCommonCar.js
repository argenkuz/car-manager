//////////////////////////////////////////////////////////////////
/* 차량관련 공용함수 */
// 
//////////////////////////////////////////////////////////////////

//// 기초 정보  ////
// 색상 정보
function reLoadCarColor() {
    // 차량 데이터 구성
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarBase/JsonBaseCarColor",
        contentType: "application/json; charset=utf-8",
        success: function (arrData) {
            var innerHtml = "<option value='' selected>선택하세요</option>";
            if (arrData.length > 0) {
                for (var iRow = 0; iRow < arrData.length; iRow++) {
                    innerHtml += "    <option value='" + arrData[iRow].CKeyNo + "'>" + arrData[iRow].ColorName + "</option>";
                }
                $("#sbxCarColor").selectbox('detach');
                $("#sbxCarColor").html(innerHtml);
                $("#sbxCarColor").selectbox('attach');
            }
        },
        fail: function (data) {
            alert(data);
        }
    });
}
// 연료 정보
function reLoadCarFuel() {
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarBase/JsonBaseCarFuel",
        contentType: "application/json; charset=utf-8",
        success: function (arrData) {
            var innerHtml = "<option value='' selected>선택하세요</option>";
            if (arrData.length > 0) {
                for (var iRow = 0; iRow < arrData.length; iRow++) {
                    innerHtml += "    <option value='" + arrData[iRow].FKeyNo + "'>" + arrData[iRow].FuelName + "</option>";
                }
                $("#sbxCarFuel").selectbox('detach');
                $("#sbxCarFuel").html(innerHtml);
                $("#sbxCarFuel").selectbox('attach');
            }
        },
        fail: function (data) {
            alert(data);
        }
    });
}
// 미션 정보
function reLoadCarMission() {
    // 차량 데이터 구성
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarBase/JsonBaseCarMission",
        contentType: "application/json; charset=utf-8",
        success: function (arrData) {
            var innerHtml = "<option value='' selected>선택하세요</option>";
            if (arrData.length > 0) {
                for (var iRow = 0; iRow < arrData.length; iRow++) {
                    innerHtml += "    <option value='" + arrData[iRow].MKeyNo + "'>" + arrData[iRow].MissionName + "</option>";
                }
                $("#sbxCarMission").selectbox('detach');
                $("#sbxCarMission").html(innerHtml);
                $("#sbxCarMission").selectbox('attach');
            }
        },
        fail: function (data) {
            alert(data);
        }
    });
}

// 옵션 기본 정보 페이지 구성
function reLoadCarOptionBase() {
    // 차량 데이터 구성
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarBase/JsonBaseCarOptionBase",
        contentType: "application/json; charset=utf-8",
        success: function (arrData) {
            //console.log(arrData);
            var innerHtml01 = "";
            var innerHtml02 = "";
            var innerHtml03 = "";

            if (arrData.length > 0) {
                innerHtml01 += "<ul class='uc_detail'>";
                innerHtml02 += "<ul class='uc_detail'>";
                innerHtml03 += "<ul class='uc_detail'>";

                for (var iRow = 0; iRow < arrData.length; iRow++) {
                    var vKeyNo = "cbxcaroption" + arrData[iRow].CarOptionNo;
                    var innerHtml = "";
                    innerHtml += "    <li>";
                    innerHtml += "        <input type='checkbox' class='uc_checkbox' id='" + vKeyNo + "' name='" + vKeyNo + "' value='" + arrData[iRow].CarOptionNo + "' />" + arrData[iRow].CarOptionName;
                    innerHtml += "    </li>";

                    switch (arrData[iRow].CarOptionGroupNo) {
                        case 5:
                            innerHtml01 += innerHtml;
                            break;
                        case 6:
                            innerHtml02 += innerHtml;
                            break;
                        case 7:
                            innerHtml03 += innerHtml;
                            break;
                    }
                }
                innerHtml01 += "</ul>";
                innerHtml02 += "</ul>";
                innerHtml03 += "</ul>";
                console.log("옵션1");

                $("#ui_caroptionbase1").html(innerHtml01);
                $("#ui_caroptionbase2").html(innerHtml02);
                $("#ui_caroptionbase3").html(innerHtml03);
            }
        },
        fail: function (data) {
            alert(data);
        }
    });
}

// 옵션 기타 정보 페이지 구성
function reLoadCarOptionEtc() {
    // 차량 데이터 구성
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarBase/JsonBaseCarOptionEtc",
        contentType: "application/json; charset=utf-8",
        success: function (arrData) {
            var innerHtml = "";
            if (arrData.length > 0) {
                innerHtml += "<ul class='uc_detail'>";
                for (var iRow = 0; iRow < arrData.length; iRow++) {
                    var vKeyNo = "cbxcaroption" + arrData[iRow].CarOptionNo; 

                    innerHtml += "    <li>";
                    innerHtml += "        <input type='checkbox' class='uc_checkbox' id='" + vKeyNo + "' name='" + vKeyNo + "' value='" + arrData[iRow].CarOptionNo + "' />" + arrData[iRow].CarOptionName;
                    innerHtml += "    </li>";
                }

                innerHtml += "<ul>";
                $("#ui_caroptionetc").html(innerHtml);
            }
        },
        fail: function (data) {
            alert(data);
        }
    });
}
// 옵션 기본 정보 페이지 구성 - 매물조회
function reLoadCarOptionBaseSearch() {
    // 차량 데이터 구성
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarBase/JsonBaseCarOptionBase",
        contentType: "application/json; charset=utf-8",
        success: function (arrData) {
            //var innerHtml01 = "";
            //var innerHtml02 = "";
            //var innerHtml03 = "";

            //if (arrData.length > 0) {
            //    innerHtml01 += "<ul class='uc_detail' id='optulid'>";
            //    innerHtml02 += "<ul class='uc_detail' id=''>";
            //    innerHtml03 += "<ul class='uc_detail' id=''>";

            //    for (var iRow = 0; iRow < arrData.length; iRow++) {
            //        var vKeyNo = "cbxcaroption" + arrData[iRow].CarOptionNo;
            //        var innerHtml = "";
            //        innerHtml += "    <li>";
            //        innerHtml += "        <input type='checkbox' id='" + vKeyNo + "' name='" + vKeyNo + "' value='" + arrData[iRow].CarOptionNo + "' /><label for='" + vKeyNo + "'>" + arrData[iRow].CarOptionName + "</label>";
            //        innerHtml += "    </li>";

            //        switch (arrData[iRow].CarOptionGroupNo) {
            //            case 1:
            //                innerHtml01 += innerHtml;
            //                break;
            //            case 2:
            //                innerHtml02 += innerHtml;
            //                break;
            //            case 3:
            //                innerHtml03 += innerHtml;
            //                break;
            //        }
            //    }
            //    innerHtml01 += "</ul>";
            //    innerHtml02 += "</ul>";
            //    innerHtml03 += "</ul>";

            //    $("#ui_caroptionbase1").html(innerHtml01);
            //    $("#ui_caroptionbase2").html(innerHtml02);
            //    $("#ui_caroptionbase3").html(innerHtml03);
            //}
        },        
        fail: function (data) {
            alert(data);
        },
        complete: function (jqXHR, textStatus) {
            console.log(jqXHR);
            console.log(textStatus);
            var innerHtml01 = "";
            var innerHtml02 = "";
            var innerHtml03 = "";
            if (jqXHR.responseJSON.length > 0) {
                innerHtml01 += "<ul class='uc_detail' id='optulid1'>";
                innerHtml02 += "<ul class='uc_detail' id='optulid2'>";
                innerHtml03 += "<ul class='uc_detail' id='optulid3'>";

                for (var iRow = 0; iRow < jqXHR.responseJSON.length; iRow++) {
                    var vKeyNo = "cbxcaroption" + jqXHR.responseJSON[iRow].CarOptionNo;
                    var innerHtml = "";
                    innerHtml += "    <li>";
                    innerHtml += "        <input type='checkbox' id='" + vKeyNo + "' name='" + vKeyNo + "' value='" + jqXHR.responseJSON[iRow].CarOptionNo + "' onchange='onChangeHandler(this)' /><label for='" + vKeyNo + "'>" + jqXHR.responseJSON[iRow].CarOptionName + "</label>";
                    innerHtml += "    </li>";

                    switch (jqXHR.responseJSON[iRow].CarOptionGroupNo) {
                        case 5:
                            innerHtml01 += innerHtml;
                            break;
                        case 6:
                            innerHtml02 += innerHtml;
                            break;
                        case 7:
                            innerHtml03 += innerHtml;
                            break;
                    }
                }
                innerHtml01 += "</ul>";
                innerHtml02 += "</ul>";
                innerHtml03 += "</ul>"; 
                $("#ui_caroptionbase1").html(innerHtml01);
                $("#ui_caroptionbase2").html(innerHtml02);
                $("#ui_caroptionbase3").html(innerHtml03);

                //console.log($("#ui_caroptionbase1").html());
                //console.log($("#ui_caroptionbase2").html());
                //console.log($("#ui_caroptionbase3").html());

                var __$optulid1 = $("#optulid1 li");

                __$optulid1.unbind('click').click(function () {
                    $(this).children('input').trigger('click');
                });

                __$optulid1.children().unbind('click').click(function (event) {
                    event.stopPropagation();
                });

                var __$optulid2 = $("#optulid2 li");

                __$optulid2.unbind('click').click(function () {
                    $(this).children('input').trigger('click');
                });

                __$optulid2.children().unbind('click').click(function (event) {
                    event.stopPropagation();
                });

                var __$optulid3 = $("#optulid3 li");

                __$optulid3.unbind('click').click(function () {
                    $(this).children('input').trigger('click');
                });

                __$optulid3.children().unbind('click').click(function (event) {
                    event.stopPropagation();
                });


         

            }
        },

    });
}
// 옵션 기타 정보 페이지 구성 - 매물조회
function reLoadCarOptionEtcSearch() {
    // 차량 데이터 구성
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarBase/JsonBaseCarOptionEtc",
        contentType: "application/json; charset=utf-8",
        success: function (arrData) {
            //var innerHtml = "";
            //if (arrData.length > 0) {
            //    innerHtml += "<ul class='uc_detail' id='optulid'>";
            //    for (var iRow = 0; iRow < arrData.length; iRow++) {
            //        var vKeyNo = "" + arrData[iRow].CarOptionNo;

            //        innerHtml += "    <li>";
            //        innerHtml += "        <input type='checkbox' id='" + vKeyNo + "' name='" + vKeyNo + "' value='" + arrData[iRow].CarOptionNo + "' /><label for='" + vKeyNo + "'>" + arrData[iRow].CarOptionName + "</label>";
            //        innerHtml += "    </li>";
            //    }

            //    innerHtml += "<ul>";
            //    $("#ui_caroptionetc").html(innerHtml);
            //}
        },
        fail: function (data) {
            alert(data);
        },
        complete: function (jqXHR, textStatus) {
            var innerHtml = "";
            if (jqXHR.responseJSON.length > 0) {
                innerHtml += "<ul class='uc_detail' id='optulid4'>";
                for (var iRow = 0; iRow < jqXHR.responseJSON.length; iRow++) {
                    var vKeyNo = "cbxcaroption" + jqXHR.responseJSON[iRow].CarOptionNo;
                    innerHtml += "    <li>";
                    innerHtml += "        <input type='checkbox' id='" + vKeyNo + "' name='" + vKeyNo + "' value='" + jqXHR.responseJSON[iRow].CarOptionNo + "' onchange='onChangeHandler(this)'/><label for='" + vKeyNo + "'>" + jqXHR.responseJSON[iRow].CarOptionName + "</label>";
                    innerHtml += "    </li>";
                }

                innerHtml += "<ul>";
                $("#ui_caroptionetc").html(innerHtml);
            }
            var __$optulid4 = $("#optulid4 li");

            __$optulid4.unbind('click').click(function () {
                $(this).children('input').trigger('click');
            });

            __$optulid4.children().unbind('click').click(function (event) {
                event.stopPropagation();
            });


        }
    });
}
// 옵션 기본 정보 페이지 구성
function reLoadCarOptionAuctionBase() {
    // 차량 데이터 구성
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarBase/JsonBaseCarOptionBase",
        contentType: "application/json; charset=utf-8",
        success: function (arrData) {
            var innerHtml01 = "";
            var innerHtml02 = "";
            var innerHtml03 = "";

            if (arrData.length > 0) {
                innerHtml01 += "<ul class='b_option'>";
                innerHtml02 += "<ul class='b_option'>";
                innerHtml03 += "<ul class='b_option'>";

                for (var iRow = 0; iRow < arrData.length; iRow++) {
                    var vKeyNo = "cbxcaroption" + arrData[iRow].CarOptionNo;
                    var innerHtml = "";
                    innerHtml += "    <li>";
                    innerHtml += "        <input type='checkbox' class='checkbox' id='" + vKeyNo + "' name='" + vKeyNo + "' value='" + arrData[iRow].CarOptionNo + "' /><label for='" + vKeyNo + "'>" + arrData[iRow].CarOptionName + "</label>";
                    innerHtml += "    </li>";

                    switch (arrData[iRow].CarOptionGroupNo) {
                        case 5:
                            innerHtml01 += innerHtml;
                            break;
                        case 6:
                            innerHtml02 += innerHtml;
                            break;
                        case 7:
                            innerHtml03 += innerHtml;
                            break;
                    }
                }
                innerHtml01 += "</ul>";
                innerHtml02 += "</ul>";
                innerHtml03 += "</ul>";

                console.log("옵션3");

                $("#ui_caroptionbase1").html(innerHtml01);
                $("#ui_caroptionbase2").html(innerHtml02);
                $("#ui_caroptionbase3").html(innerHtml03);
            }
        },
        fail: function (data) {
            alert(data);
        }
    });
}

// 옵션 기타 정보 페이지 구성
function reLoadCarOptionAuctionEtc() {
    // 차량 데이터 구성
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarBase/JsonBaseCarOptionEtc",
        contentType: "application/json; charset=utf-8",
        success: function (arrData) {
            var innerHtml = "";
            if (arrData.length > 0) {
                innerHtml += "<ul class='b_option'>";
                for (var iRow = 0; iRow < arrData.length; iRow++) {
                    var vKeyNo = "" + arrData[iRow].CarOptionNo;

                    innerHtml += "    <li>";
                    innerHtml += "        <input type='checkbox' class='checkbox' id='" + vKeyNo + "' name='" + vKeyNo + "' value='" + arrData[iRow].CarOptionNo + "' /><label for='" + vKeyNo + "'>" + arrData[iRow].CarOptionName + "</label>";
                    innerHtml += "    </li>";
                }

                innerHtml += "<ul>";
                $("#ui_caroptionetc").html(innerHtml);
            }
        },
        fail: function (data) {
            alert(data);
        }
    });
}


// 옵션 데이터 가지고 오기
function reLoadCarOption() {
    var Url = "/CarBase/JsonBaseCarOption";
    $.ajax({
        type: 'POST',
        cache: false,
        contentType: "application/json; charset=utf-8",
        url: Url,
        dataType: "json",
        success: function (data) {
            // 데이터 등록
            reSetCarOptionList(data);
            // 이벤트 등록
            reSetCarOptionScrollEvent();
        },
        fail: function (data) {
            alert("제조사 데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });
}
//멀티 옵션 초기화
function reLoadCarMultiOption() {
    $("#tbxOptionArr").val("");
    var $select = $('#defaultMultiSelect');
    //$("#defaultMultiSelect").next().children().find('span').text('선택');
    //$(".ms-choice span").text("선택");
    $("#defaultMultiSelect").multipleSelect('uncheckAll');
}
function reSetCarOptionScrollEvent() {
    $('#cbxSearchOption').each(function () {
        $(this).selectbox('detach');
        $(this).val('');
        $(this).selectbox('attach');
    });
}
function reSetCarOptionList(arrData) {
    $('#cbxSearchOption').html("");  // 초기화
    var innerHtml = "<option value=''>선택</option>\r\n";
    var iGroupNo = 0;
    for (var row = 0; row < arrData.length; row++) {
        if (arrData[row].CarOptionName) {
            if (iGroupNo != arrData[row].CarOptionGroupNo) {
                if (iGroupNo != 0) {
                    innerHtml += "</optgroup>\r\n";
                }
                innerHtml += "<optgroup label='" + arrData[row].CarOptionName + "'>\r\n";
                iGroupNo = arrData[row].CarOptionGroupNo;
            }
            var vno = arrData[row].CarOptionNo;
            var vname = arrData[row].CarOptionName;

            innerHtml += "<option value='" + vno + "'>" + vname + "</option>\r\n";
        }
    }
    innerHtml += "</optgroup>\r\n";
    if (innerHtml.length == 0)
        innerHtml = "<option value=''>전체</option>\r\n";

    $('#cbxSearchOption').html(innerHtml)
}

//// 차량 기능 ////
// 오늘 본 차량 로그
function reLoadCarConfig() {
    /* 차량 설정 정보 */
    var configList = new cookieList("USERCONFIG");
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
                        case "PHOTOYN":
                            break;
                        case "AMOUNT":
                            cookieCarAmount = parseInt(arrItemInfo[1]);
                            break;
                        case "AMOUNTPER":
                            cookieCarAmountPer = parseInt(arrItemInfo[1]);
                            break;
                        case "AMOUNTYN":
                            cookieIsCarAmountH = arrItemInfo[1].toLowerCase() === "true";
                            break;
                        case "DEALERYN":                            
                            cookieIsCarDealerH = arrItemInfo[1].toLowerCase() === "true";
                            break;
                        case "SHOPYN":
                            cookieIsCarShopH = arrItemInfo[1].toLowerCase() === "true";
                            break;
                        case "UPDATEDATEYN":
                            cookieIsCarLastUpdateH = arrItemInfo[1].toLowerCase() === "true";
                            break;
                        case "NUMBERYN":
                            cookieIsCarNumberH = arrItemInfo[1].toLowerCase() === "true";
                            break;
                        case "LEASEMARKERYN":
                            cookieIsLeaseMarkerView = arrItemInfo[1];
                            break;

                    }
                }
            }
        }
    }
    var configList = new cookieList("MODE_PHOTO_VIEW");
    var itemconfigList = configList.items();
    if (itemconfigList) {
        if (itemconfigList[0] == "1") {
            cookieIsCarImageView = false;
        }
    }
}

//오늘 본차량 특정차량 삭제
function carLogRemove(carno) {
    // 차량 데이터 구성
    var vJsonData = '{"carno":' + carno + '}';
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarOption/CarLogItemRemove",
        data: vJsonData,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data == "OK") {
                $("#cardetail_list_li_" + carno).remove();
                $("#cardetail_" + carno).remove();
                $(".latest-car-list").find("li").eq(0).click();
                document.cookie = "CARLOGCOUNT=" + (parseInt(getCookie("CARLOGCOUNT"))-1);
                reLoadCarLog();
            }
            else if (data == "LOCK") {
                if (parseInt(getCookie('LOCKCOUNT')) != 5) {
                    alert("Lock 상태이므로 삭제할 수 없습니다.")
                }
            }

        },
        fail: function (data) {
            alert(data);
        }
    });
}

//function allselect(e) {
//    var imgSrc = $(e).attr("src");
//    if (imgSrc.indexOf("_on") > 0) {
//        $(".uc_btncheck.btn_closeoverlay").find("img").attr("src", "/include/image/btn/check_off.png");
//        $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_off.png");
//    } else {
//        $(".uc_btncheck.btn_closeoverlay").find("img").attr("src", "/include/image/btn/check_on.png");
//        $(".uc_btncheck.all").find("img").attr("src", "/include/image/btn/check_on.png");
//    }
//}


function reSetCarCompareClick() {
    $(".uc_btncompare").click(function () {
        var vCarCompareKey = "";
        var all = $(".uc_btncheck.all").find("img").attr("src");
        $(".uc_visititem").each(function () {
            var vSrc = $(this).find(".uc_btncheck > img").attr("src");
            if (vSrc.indexOf("_on") > 0) {
                vCarCompareKey += $(this).attr("data-no") + ",";
            }
        });

        if (vCarCompareKey.indexOf(",") > 0) {
            vCarCompareKey = vCarCompareKey.substr(0, vCarCompareKey.length - 1);
        } 
        // 차량 검색을 시작합니다.
        recheckCarCompare(vCarCompareKey);
    });
}

// 차량비교 레이어
function reSetCompareCloseOverLayer() {
    $('body').css({ overflow: 'visible' });
    $("#modal-comparecontent").fadeOut();
    $("#modal-comparebackground").fadeOut("slow");
}
function reSetCarCompareBind() {
    $("#ui_carlog .uc_btncheck:not(.all)").click(function () {
        var vSrc = $(this).find("img").attr("src");
        if (vSrc.indexOf("_on") > 0) {
            $(this).find("img").attr("src", vSrc.replace("_on", "_off"));
        } else {
            $(this).find("img").attr("src", vSrc.replace("_off", "_on"));
        }
    });
}

// 로그인 영역 개인 상사 선택
function reSetLoginViewShop() {
    var vSelectBox = $("#sbxgubun").val();
    $("#ui_loginshop ul").hide();
    $("#ui_loginshop ul").eq(vSelectBox).show();
}

// 비교할 차량을 확인 하고 구성
function recheckCarCompare(comparekey) { 
    if (comparekey.length == 0) {
        alert("비교할 차량을 선택하세요.");
        return;
    }
    if (comparekey.indexOf(",") < 1) {
        alert("차량이 2대 이상 선택되어야 비교하기가 가능합니다.");
        return;
    }

    reLoadCarConfig();

    $("#ui_carcompare .uc_contents tr > td").hide();

    // 차량 데이터 및 옵션 로드
    var vJsonData = '{"comparekeyenc":[' + comparekey + ']}';

    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarOption/Compare",
        data: vJsonData,
        contentType: "application/json; charset=utf-8",
        success: function (arrData) { 
            arrCarData = arrData.CarCompare;
            arrOptionData = arrData.CarCompareOption;

            if (arrCarData != null) {
                var vcol = 1;
                var arrcompare;
                if (comparekey.indexOf(",") > 0) {
                    arrCompare = comparekey.split(",");
                    vcol = arrCompare.length;
                }

                // 데이터를 등록 한다.
                $("#ui_carcomparedata").attr("class", "column" + arrCarData.length);
                for (var icol = 0; icol < arrCarData.length; icol++) {
                    var arrCompareCarData = arrCarData[icol];
                    var index;
                    for (var ipos = 0; ipos < arrCompare.length; ipos++) {
                        if (arrCompare[ipos].toString().replaceAll("'","") == arrCompareCarData.EnCarNo.toString()) {
                            index = ipos;
                            break;
                        }
                    }
                    
                    var vThumb = arrCompareCarData.CarThumb;
                    
                    var vCarAmountSale = arrCompareCarData.CarAmountSale.length > 0 ? arrCompareCarData.CarAmountSale : "0";
               
                    if (vCarAmountSale) { 
                        if (arrCompareCarData.DanjiNo == "93082") { 
                            vCarAmountSale = parseInt(vCarAmountSale) + 30;
                        }
                        if (cookieCarAmount != 0) {
                            vCarAmountSale = parseInt(vCarAmountSale) + cookieCarAmount;
                        } else {
                            if (cookieCarAmountPer != 0) {
                                vCarAmountSale = parseInt(vCarAmountSale) + (parseInt(vCarAmountSale) * cookieCarAmountPer / 100);
                            }
                        }
                        vCarAmountSale = $.number(vCarAmountSale) + "만원";
                    } else {
                        vCarAmountSale = "상담";
                    } 
                    $("#ui_carcomparedata tr").eq(0).find("td").eq(index).html("<div class='swiper-container'><div class='swiper-wrapper'><div class='swiper-slide'><button type='button' class='delete-btn publishing-hidden'><img src='/include/image/common/icon_popup_close.png' /></button><img src='" + vThumb + "' onerror=\"this.src = '/include/image/car/car_noimage_big.jpg'\"  /></div></div></div><span class='car-model'>" + arrCompareCarData.CarModelName + "</span><span class='car-grade'>" + arrCompareCarData.CarGradeName + " " + arrCompareCarData.CarGradeDetailName + "</span><span class='full-name'>" + arrCompareCarData.CarModelName + "<br>" + arrCompareCarData.CarGradeName + " " + arrCompareCarData.CarGradeDetailName + "</span><button type='button' class='btn more' onclick=carmangerDetailWindowPopUp_CHECK('" + arrCarData[icol].EnCarNo + "');>상세보기</button>");
                    $("#ui_carcomparedata tr").eq(1).find("td").eq(index).html((arrCompareCarData.CarSagoYn == "False" ? "무사고" : "") );
                    $("#ui_carcomparedata tr").eq(2).find("td").eq(index).html(arrCompareCarData.CarMission + " / " + arrCompareCarData.CarFuel);
                    $("#ui_carcomparedata tr").eq(3).find("td").eq(index).html(arrCompareCarData.CarRegYear + " / " + arrCompareCarData.CarRegDay.substr(0, 4)+"."+arrCompareCarData.CarRegDay.substr(4, 2));
                    $("#ui_carcomparedata tr").eq(4).find("td").eq(index).html($.number(arrCompareCarData.CarUseKm) +" km");
                    $("#ui_carcomparedata tr").eq(5).find("td").eq(index).html(vCarAmountSale);
                    
                    
                    var optionData = arrCompareCarData.CarOption;
                    var option = "";
                    option += "<input type='checkbox' onclick='return false;'><label class=' " + ((optionData.indexOf("네비게이션") != -1) ?"checked":""  )+"'>네비게이션</label>";
                    option += "<input type='checkbox' onclick='return false;'><label class=' " + ((optionData.indexOf("썬루프") != -1) ?"checked":""      )+"'>썬루프</label>";
                    option += "<input type='checkbox' onclick='return false;'><label class=' " + ((optionData.indexOf("전후방감지기") != -1) ?"checked":"")+"'>전후방감지기</label>";
                    option += "<input type='checkbox' onclick='return false;'><label class=' " + ((optionData.indexOf("열선시트") != -1) ? "checked" : "") + "'>열선시트</label>";
                    option += "<input type='checkbox' onclick='return false;'><label class='more " + ((optionData.trim() != "") ? "active" : "") + "'>더보기</label>";
                    option += "<div class='option-more'>" + optionData + "</div>";
                    $("#ui_carcomparedata tr").eq(6).find("td").eq(index).html(option);
                    $("#ui_carcomparedata tr").eq(7).find("td").eq(index).html(arrCompareCarData.CarPlateNumber);
                    $("#ui_carcomparedata tr").eq(8).find("td").eq(index).html(arrCompareCarData.CarSiDo + "/" + arrCompareCarData.CarSiDoArea);
                    $("#ui_carcomparedata tr").eq(9).find("td").eq(index).html(arrCompareCarData.UserName + " / " + arrCompareCarData.UserHP);

                }  
                
                if (cookieIsCarDealerH) {
                    $("#ui_carcomparedata tr").eq(9).remove();
                } 
                if (cookieIsCarShopH) {
                    $("#ui_carcomparedata tr").eq(8).remove();
                } 
                if (cookieIsCarAmountH) {
                    $("#ui_carcomparedata tr").eq(5).remove();
                } 
                
			}
            // 성공하면 히든 할 것을 지정한다.
            $("#ui_carcompare .uc_contents tr").each(function () {
                $(this).find("td").each(function (index) {
                    if (index < vcol) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
			});
			$(".option .more").unbind("mousemove").mousemove(function () {
				if ($(this).hasClass("active")) {
					$(this).siblings(".option-more").css({ "display": "block" });
				}
			});
			$(".option .more").unbind("mouseleave").mouseleave(function () {
				$(this).siblings(".option-more").css({ "display": "none" });
			});
        },
        fail: function (data) {
            alert("데이터 로드에 오류가 발생하였습니다. 계속 될 경우 관리자에게 문의하세요.");
        }
    });

    // 레이어 생성
    $("#modal-comparebackground").click(function () {
        $('body').css({ overflow: 'visible' });
        reSetCompareCloseOverLayer();
    });
    // 레이어 활성화
    $("#modal-comparebackground").show();
    $("#modal-comparecontent").fadeIn("slow");
}

//차량 상세보기 매물비교용
function carCompareCardetail(carno) {
    vLoading.show();
    $(".uc_floatright ").click();
    setTimeout(function () {
        reLoadPopupCarDetail(carno);
        vLoading.hide();
    }, 1000);
    
}

// 차량 로그 정보를 기록한다.
function reSetCarLog(carno, carnumber, carmakername, carmodelname, carmodeldetailname, cargradename, cargradedetailname, carimage, carsale, regdate, usekm) {
    if (!$.isNumeric(carno)) {
        alert("차량고유번호가 정확하지 않습니다.");
        return;
    }
    // 차량 데이터 구성
    var vJsonData = '{"item":["' + carno + '","' + encodeURI(carnumber) + '","' + encodeURI(carmakername) + '","' + encodeURI(carmodelname) + '","' + encodeURI(carmodeldetailname) + '","' + encodeURI(cargradename) + '","' + encodeURI(cargradedetailname) + '","' + carimage + '","' + carsale + '","' + regdate+ '","' + usekm + '"]}';
    $.ajax({
        type: "POST",
        traditional: true,
        url: "/CarOption/CarLogCreate",
        data: vJsonData,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data == "OK")
                reLoadCarLog();
        },
        fail: function (data) {
            alert(data);
        }
    });
}


//// 차량 정보 인쇄 ////
/* 프린트 관련 페이지 */
function goPrintCarCheckData() {

}
function goPrintCarData() {

}
function goPrintTransferCost() {

}
