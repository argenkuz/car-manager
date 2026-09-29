var Bizssd = {};

/**
 * �õ�, ����, ���� ��Ī �� �ڵ���ȸ
 * Created by AtonMobility info Co., Ltd
 *
 * require module
 *   - jQuery.js
 *
 * @version 0.0.1
 * @history
 * jeong     2020.12.26
 *
 *
 * @discription ������ json ���Ϸ� ���� data�� ��ȸ�Ѵ�.
 * ��� �� 1)�õ� ��ȸ : Bizssd.GetSido();
 * 
 * 1) ���������� ��ȸ : Bizjs.GetMakerBase();
 *         2) ������ ��ȸ : Bizjs.GetModelBase(string maker number);
 *         3) �����𵨻� ��ȸ : Bizjs.GetModelDetailBase(string model number);
 *         4) ������� ��ȸ : Bizjs.GetGradeBase(string model detail number);
 *         5) ������޻� ��ȸ : Bizjs.GetGradeDetailBase(string grade number);
 */
Bizssd.GetSido = function () {
    /**
     * �õ� ����Ʈ ��ȸ
     * @return : Json
     */
    return BaseSido;
};

Bizssd.GetSidoArea = function (_sidoNo) {
    /**
     * ���� ����Ʈ ��ȸ
     * @Param : ������ no
     * @return : Json
     */
    var _areaJson = BaseSidoArea;
    var _result = undefined;
    $.each(_areaJson, function (key, value) {
        if (key === _sidoNo) {
            _result = value;
            return false;
        }
    });
    if (_result === undefined) {
        _result = new Array();
    } else {
        //���� ��ü �迭�� ���� 
        var sortingField = "AreaSort";
        _result = _result.sort(function (a, b) {
            return a[sortingField] - b[sortingField];
        });
    }

    return _result;
};

Bizssd.GetDanji = function (_AreaNo) {
    /**
     * ���� ����Ʈ ��ȸ
     * @Param : �� no
     * @return : Json
     */
    var _danJiJson = BaseDanji;
    var _result = undefined;
    $.each(_danJiJson, function (key, value) {
        if (key === _AreaNo) {
            _result = value;
            return false;
        }
    });
    if (_result === undefined) {
        _result = new Array();
    } else {
        //���� ��ü �迭�� ����
        var sortingField = "DanjiNo";
        _result = _result.sort(function (a, b) {
            return a[sortingField] - b[sortingField];
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