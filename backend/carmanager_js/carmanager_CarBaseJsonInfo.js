var Bizjs = {};
//Ʈ���ڵ� ���� ��ü
var _CheckTruckCode = {};
/**
 * ���� �����ڵ� �� ��Ī ����Ʈ ��ȸ
 * Created by Biz info Co., Ltd
 *
 * require module
 *   - jQuery.js
 *
 * @version 0.0.1
 * @history
 * jy-jang     2016.10.31.
 *
 *
 * @discription ������ json ���Ϸ� ���� data�� ��ȸ�Ѵ�.
 * ��� �� 1) ���������� ��ȸ : Bizjs.GetMakerBase();
 *         2) ������ ��ȸ : Bizjs.GetModelBase(string maker number);
 *         3) �����𵨻� ��ȸ : Bizjs.GetModelDetailBase(string model number);
 *         4) ������� ��ȸ : Bizjs.GetGradeBase(string model detail number);
 *         5) ������޻� ��ȸ : Bizjs.GetGradeDetailBase(string grade number);
 */
Bizjs.GetMakerBase = function (_countryno) {
    /**
     * ���������� ����Ʈ ��ȸ
     * @return : Json
     */
    if (_countryno !== "undefined" && _countryno !== undefined && _countryno !== "") {
        var _result = new Array();
        $.each(CarBaseMaker, function (key, value) {
            if (_countryno == "1") {
                if (value.CountryNo == "1004") {
                    _result.push(value);
                }
            } else {
                if (value.CountryNo != "1004") {
                    _result.push(value);
                }
            }
        });
        return _result;
    } else {
        return CarBaseMaker;
    }
};

Bizjs.GetModelBase = function (_MakerNo) {
    /**
     * ���� �� ����Ʈ ��ȸ
     * @Param : ������ no
     * @return : Json
     */
    var _modelJson = CarBaseModel;
    var _result = undefined;
    $.each(_modelJson, function (key, value) {
        if (key === _MakerNo) {
            _result = value;
            return false;
        }
    });
    if (_result === undefined) {
        _result = new Array();
    } else {
        //���� ��ü �迭�� ���� (���������� �� ���Ĺ�ȣ)
        _result = _result.sort(function (a, b) {
             /*return a.KindCode < b.KindCode ? -1 : a.KindCode > b.KindCode ? 1 : a.ModelSortNo < b.ModelSortNo ? -1 : a.ModelSortNo > b.ModelSortNo ? 1 : 0;*/
            return a.ModelSortNo - b.ModelSortNo;
        });
    }


    return _result;


};

Bizjs.GetModelDetailBase = function (_ModelNo) {
    /**
     * ���� �𵨻� ����Ʈ ��ȸ
     * @Param : �� no
     * @return : Json
     */
    var _mDetailJson = CarBaseModelDetail;
    var _result = undefined;
    $.each(_mDetailJson, function (key, value) {
        if (key === _ModelNo) {
            _result = value;
            return false;
        }
    });
    if (_result === undefined) {
        _result = new Array();
    } else {
        //���� ��ü �迭�� ����
        _result = _result.sort(function (a, b) {
            return a.MDetailSortNo < b.MDetailSortNo ? -1 : a.MDetailSortNo > b.MDetailSortNo ? 1 : 0;
        });
    }
    return _result;
};
//Ʈ���ڵ����
Bizjs.GetModelDetailBaseTruck = function () {
    /**
     * ���� �𵨻� ����Ʈ ��ȸ
     * @Param : �� no
     * @return : Json
    */
    var _mDetailJson = CarBaseModelDetail;
    var _result = undefined;
    var _resultArray = new Array();
    //console.log(_mDetailJson);

    $.each(_mDetailJson, function (key, value) {
        _result = [];
        if (key == "100216" || key == "100311" || key == "100321" || key == "100337" || key == "100269" || key == "100285" || key == "100299" || key == "100330" || key == "100344" || key == "100351" || key == "100357") {
            _result = value;
        }

        if (_result.length > 0) {

            _result.forEach(function (key, value) {
                var resultObj = new Object();
                resultObj.ModelNo = key.ModelNo;
                resultObj.ModelName = key.ModelName;
                resultObj.MDetailNo = key.MDetailNo;
                resultObj.MDetailName = key.MDetailName;
                _resultArray.push(resultObj);
            });

        }


    });
    //console.log(_resultArray);

    if (_resultArray.length <= 0) {
        _result = new Array();
        _CheckTruckCode = {};
    } else {
        _CheckTruckCode = _resultArray;
    }
    return _resultArray;
};

Bizjs.GetGradeBase = function (_ModelDetailNo) {
    /**
     * ���� ��� ����Ʈ ��ȸ
     * @Param : �𵨻� no
     * @return : Json
     */
    var _gradeJson = CarBaseGrade;
    var _result = undefined;
    $.each(_gradeJson, function (key, value) {
        if (key === _ModelDetailNo) {
            _result = value;
            return false;
        }
    });
    if (_result === undefined) {
        _result = new Array();
    }
    return _result;
};

Bizjs.GetGradeDetailBase = function (_GradeNo) {
    /**
     * ���� ��޻� ����Ʈ ��ȸ
     * @Param : ��� no
     * @return : Json
     */
    var _gDetailJson = CarBaseGradeDetail;
    var _result = undefined;
    $.each(_gDetailJson, function (key, value) {
        if (key === _GradeNo) {
            _result = value;
            return false;
        }
    });
    if (_result === undefined) {
        _result = new Array();
    }
    return _result;
};