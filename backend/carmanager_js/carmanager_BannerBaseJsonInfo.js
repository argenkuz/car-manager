var BizBannerJs = {};

/**
 * ���ι�� , ���̵��� ����Ʈ ��ȸ
 * Created by Biz info Co., Ltd
 *
 * require module
 *   - jQuery.js
 *
 * @version 0.0.1
 * @history
 * hw-lee     2017.06.21.
 *
 *
 * @discription ������ json ���Ϸ� ���� data�� ��ȸ�Ѵ�.
 * ��� �� 1) ���ι�� ��ȸ : Bizjs.GetMainBanner();
 *         2) ���̵��� ��ȸ : Bizjs.GetSideBanner(int posNo);
 */
BizBannerJs.GetMainBanner = function () {
    /**
     * ���ι�� �׷캰 ����Ʈ ��ȸ
     * @return : Json
     */
        var dictObject = {}
        var _mg1 = new Array();
        var _mg2 = new Array();
        var _mg3 = new Array();
        var _mg4 = new Array();
        $.each(MainBanner, function (key, value) {
            switch (value.PosNo) {
                case 100006: _mg1.push(value); break;
                case 100009: _mg2.push(value); break;
                case 100018: _mg3.push(value); break;
                case 100020: _mg4.push(value); break;
            }
        });
        dictObject['mg1'] = _mg1;
        dictObject['mg2'] = _mg2;
        dictObject['mg3'] = _mg3;
        dictObject['mg4'] = _mg4;
        return dictObject;
};

BizBannerJs.GetSideBanner = function (_PosNo) {
    /**
     * ���̵� ��� ����Ʈ ��ȸ
     * @Param : ��ʱ׷� no 
     * @return : Json
     */
    try {
        var _modelJson = SideBanner;
        var _result = new Array();
        $.each(_modelJson, function (key, value) {
            $.each(value, function (key, value) {
                if (value.PosNo === _PosNo) {
                    _result.push(value);
                }
            })
        });
        return _result;
    }
    catch (e)
    {
        return null;
    }
};

BizBannerJs.SideGroupNo = {
    "MainSide":100013, //���� ����Ʈ ��� 
    "SearchSide" :100014 //�Ź���ȸ , ������ȸ , Ȯ�μ��� ���
}

BizBannerJs.MainBannerDraw = function (dictObject,target) {

}

BizBannerJs.windowOpen = function (url) {
    var newWindow = open(url, "");
}

BizBannerJs.SideBannerDraw = function (arryObject, target, posNo) { 
    //������ ��� ������Ʈ�� �����ϰ� �ٽ� �����Ѵ�.
    var MainBannerCheck = (posNo == 100013 ? true : false);
    var MainBannerCnt = 2;
    var SideBannerCnt = 4;
    if (arryObject != null && arryObject.length > 0) {
        if (arryObject[0]["RandomYn"]) {
            arryObject = arryObject.sort(function () {
                return Math.round(Math.random()) - 0.5;
            });
        }
        $.each(arryObject, function (ui, vl) {
            var _$elLi = $("<li/>").css("padding-bottom", "1px");
            var _$elA = $("<a/>");
            var _$elImg =  $("<img/>").css("width", "126").css("height", "200").css("margin-left", "-35px");
            _$elImg.attr("onerror", "this.src = '/temp/banner/wing banner/l_banner_noimg.jpg'");
            var filePathName = "https://images.carmanager.co.kr" + vl.BImageFullName;
            _$elImg.attr("src", filePathName);

            //���������� Ȯ���Ѵ�.
            if (vl.ExceptSiDoArea.indexOf(userSidoAreaNo) > -1) {
                _$elLi.append(_$elImg.attr("src", '/temp/banner/wing banner/l_banner_otherad.jpg'));
            } else {
                if (vl.BPopupState) {
                    if (vl.BGoPageUri.indexOf(".exe") > -1) _$elA.attr("href", vl.BGoPageUri);
                    else _$elA.attr("href", "javascript:BizBannerJs.windowOpen(\'" + vl.BGoPageUri + "\')");
                    
                    _$elA.append(_$elImg);
                    _$elLi.append(_$elA);
                } else {
                    _$elLi.append(_$elImg);
                }
            }
            target.append(_$elLi);
        });
        var cnt = (MainBannerCheck ? MainBannerCnt : SideBannerCnt); 
        if (arryObject.length < cnt) {
            for (var i = 0 ; i < (cnt - arryObject.length); i++) {
                var _$elLi = $("<li/>").css("padding-bottom", "1px"); 
                var _$elImg = $("<img/>").css("width", "126").css("height", "200").css("margin-left", "-35px");

                if (MainBannerCheck) {
                    _$elImg.attr({ src: '/temp/banner/wing banner/l_banner_recruitad.jpg', onerror: "this.src = '/temp/banner/wing banner/l_banner_recruitad.jpg'" });
                }
                else {
                    _$elImg.attr({ src: '/temp/banner/wing banner/rl_bannerad.jpg', onerror: "this.src = '/temp/banner/wing banner/rl_bannerad.jpg'" });
                }
                
				_$elLi.append(_$elImg);
				target.append(_$elLi);
            }
        }

    } else {
        var cnt = (MainBannerCheck ? MainBannerCnt : SideBannerCnt); 
        for (var i = 0 ; i < cnt; i++) {
            var _$elLi = $("<li/>").css("padding-bottom", "1px");
            var _$elImg = (MainBannerCheck) ? $("<img/>").css("width", "126").css("height", "200").css("margin-left", "-35px") : $("<img/>").css("width", "126").css("height", "200").css("margin-left", "-35px");
            
            if (MainBannerCheck) {
                _$elImg.attr({ src: '/temp/banner/wing banner/l_banner_recruitad.jpg', onerror: "this.src = '/temp/banner/wing banner/l_banner_recruitad.jpg'" });
            }
            else {
                _$elImg.attr({ src: '/temp/banner/wing banner/rl_bannerad.jpg', onerror: "this.src = '/temp/banner/wing banner/rl_bannerad.jpg'" });
            }
            _$elLi.append(_$elImg);
            target.append(_$elLi);
        }
    }
    
}