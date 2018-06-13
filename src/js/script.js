'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

//подклю
var $ = require('jquery');
var Chart = require('chart.js');
var moment = require('moment');
var noUiSlider = require('nouislider');

var Diseaseases = new Set();
var Sex = 0;
var Age = ['', ''];
var Time = [];
var selectedYear = void 0;
var CHARTS = [];

$(document).ready(function () {
    // создаем слайдер
    var slider = $("#slider-range")[0];
    noUiSlider.create(slider, {
        start: [1, 12],
        step: 1,
        pips: {
            mode: 'values',
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            density: 10
        },
        connect: true,
        range: {
            min: 1,
            max: 12
        }
    });

    // slider.noUiSlider.on('set', function() {
    //     for(let i = 0, n = Time.length; i < n; ++i) {
    //         if (Time[i][0] == selectedYear) {
    //             Time[i][1] = slider.noUiSlider.get();
    //             getInformationForDiagnosis();
    //         }
    //     }
    // });

    // навеешиваем события
    addEventOnFilters();
    addEventOnList();
    addEventOnYears();

    function addEventOnList() {
        $(".main-list .classes").click(function (e) {
            $(this)[0].nextElementSibling.classList.toggle("show-list");
            $(this).toggleClass("selected-class");
        });

        $(".main-list .list-item").click(function (e) {

            if ($(this).hasClass("selected-item")) {
                Diseaseases.delete(e.target.dataset.id);
            } else {
                Diseaseases.add(e.target.dataset.id);
            }
            $(this).toggleClass("selected-item");
            getInformationForDiagnosis();
        });
    }

    function addEventOnFilters() {
        $(".filter .btn-filter").click(function () {
            var addFilter = $(".filter .additional-filters");
            addFilter.toggleClass("show");
            addFilter.toggleClass("hide");
        });

        $(".filter .reset-mkb").click(function (e) {
            Diseaseases.clear();
            searchDiagnosis();
        });

        $(".filter .input-search").keyup(function (e) {
            e.preventDefault();
            var filterData = e.target.value;

            if (filterData.length >= 3 || filterData == '') {
                if (e.keyCode == 13) {
                    searchDiagnosis(filterData);
                }
            }
        });

        $(".filter .btn-reset").click(function (e) {
            $(".filter .input-search")[0].value = "";
        });

        $(".filter .btn-search").click(function (e) {
            e.preventDefault();
            var filterData = $('.filter .input-search')[0].value;

            if (filterData.length >= 3 || filterData == '') {
                searchDiagnosis(filterData);
            }
        });

        // события для всплывающих подсказок
        $(".btn-help").each(function (index) {
            $(this).click(function (e) {
                var scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
                $(".back-disable").css("height", scrollHeight).toggleClass("show-back");
                e.target.nextElementSibling.classList.toggle("message-box-show");
            });
        });

        $(".message-box-hide button").each(function (index) {
            $(this).click(function (e) {
                e.target.parentNode.classList.toggle("message-box-show");
                $(".back-disable").toggleClass("show-back");
            });
        });

        function handlerForAge(context) {
            var lastSymbol = context.value.substr(-1, 1);

            if (!$.isNumeric(lastSymbol) || lastSymbol == '0' && context.value.length == 1) {
                context.value = context.value.substr(0, context.value.length - 1);
            }
        }

        $(".additional-filters .from").on('keyup keydown', function (e) {
            var target = e.target;
            var inputAgeTo = $(".additional-filters .to")[0];
            var self = $(this);

            handlerForAge(target);
            if (+this.value > +inputAgeTo.value && inputAgeTo.value.length > 0 && this.value != '') {
                if (!$(this).hasClass('wrong-age')) {
                    $(this).addClass('wrong-age');
                }
            } else {
                if ($(this).hasClass('wrong-age')) {
                    $(this).removeClass('wrong-age');
                }
            }
        });

        $(".additional-filters .to").on('keyup keydown', function (e) {
            var target = e.target;
            var inputAgeTo = $(".additional-filters .from")[0];
            var self = $(this);

            handlerForAge(target);
            if (+this.value < +inputAgeTo.value && inputAgeTo.value.length > 0 && this.value != '') {
                if (!$(this).hasClass('wrong-age')) {
                    $(this).addClass('wrong-age');
                }
            } else {
                if ($(this).hasClass('wrong-age')) {
                    $(this).removeClass('wrong-age');
                }
            }
        });

        $(".filter .from").change(function (e) {
            if (!$(this).hasClass("wrong-age")) {
                Age[0] = e.target.value;
                getInformationForDiagnosis();
            } else {
                Age[0] = null;
            }
        });

        $(".filter .to").change(function (e) {
            if (!$(this).hasClass("wrong-age")) {
                Age[1] = e.target.value;
                getInformationForDiagnosis();
            } else {
                Age[1] = null;
            }
        });

        $(".filter .sex").change(function (e) {
            Sex = +e.target.checked;
            getInformationForDiagnosis();
        });

        $(".view").on("change", function (e) {
            getInformationForDiagnosis();
        });
    }

    function addEventOnYears() {
        // if ($(this).hasClass("selected-year") && $(this).hasClass('current-year')) {
        //     for(let i = 0; i < Time.length; ++i) {
        //         if (Time[i][0] == e.target.innerHTML) {
        //             Time.splice(i, 1);
        //         }
        //     }
        //     $(this).removeClass('selected-year');
        //     // slider.noUiSlider.set(['1', '12']);
        //     getInformationForDiagnosis();
        // } else if ($(this).hasClass("selected-year")) {
        //     $(".current-year").removeClass("current-year");
        //     $(this).addClass('current-year');

        //     Time.forEach(function(item) {
        //         if (item[0] == e.target.innerHTML) {
        //             slider.noUiSlider.set([item[1][0], item[1][1]]);
        //         }
        //     });
        // } else {
        //     let arrOfTime = [];

        //     slider.noUiSlider.set(['1', '12']);
        //     selectedYear = e.target.innerHTML;
        //     arrOfTime.push(selectedYear, slider.noUiSlider.get());
        //     console.log(arrOfTime);
        //     Time.push(arrOfTime);
        //     Time.sort(function(a, b) {
        //         return a[0] - b[0];
        //     });
        //     console.log(Time);
        //     $(".current-year").removeClass("current-year");
        //     $(this).addClass('selected-year current-year');
        //     getInformationForDiagnosis();
        // }

        $(".graph .years button").click(function (e) {
            e.preventDefault();

            // $(".current-year").removeClass("current-year");
            slider.noUiSlider.reset();
            if ($(this).hasClass("selected-year")) {
                for (var i = 0; i < Time.length; ++i) {
                    if (Time[i][0] == e.target.innerHTML) {
                        if ($(this).hasClass("current-year")) {
                            Time.splice(i, 1);
                            $(this).toggleClass("selected-year");
                        } else {
                            slider.noUiSlider.set(Time[i][1]);
                            $(".current-year").removeClass("current-year");
                            $(this).addClass("current-year");
                        }
                    }
                }
            } else {
                var arrOfTime = [];

                slider.noUiSlider.set(['1', '12']);
                selectedYear = e.target.innerHTML;
                arrOfTime.push(selectedYear, slider.noUiSlider.get());
                Time.push(arrOfTime);
                Time.sort(function (a, b) {
                    return a[0] - b[0];
                });
                $(this).toggleClass("selected-year");
                $(".current-year").removeClass("current-year");
                $(this).toggleClass("current-year");
            }
            console.log(Time);

            getInformationForDiagnosis();
        });

        slider.noUiSlider.on('update', function () {
            for (var i = 0, n = Time.length; i < n; ++i) {
                if (Time[i][0] == selectedYear) {
                    Time[i][1] = slider.noUiSlider.get();
                    getInformationForDiagnosis();
                }
            }
        });
    }

    /**
     * 
     * AJAX запрос на получение диагноза
     */
    function searchDiagnosis(data) {
        //$(".main-list").show(); 

        //let searchValue = $(".filter .search").val();
        $.post("/Diplom/src/php/filterDiagnosis.php", { search_term: data }, function (responseData) {
            if (responseData.length > 0) {
                $(".main-list").html(responseData);
                addEventOnList();
            }
        });
    }

    function getInformationForDiagnosis() {
        var view = '';
        Array.prototype.forEach.call($(".view")[0].options, function (item) {
            if (item.selected) {
                view = item.value;
            }
        });

        $.ajax({
            type: "POST",
            url: "/Diplom/src/php/getInformationForDiagnosis.php",
            data: { Diseaseases: Array.from(Diseaseases), Age: Age, Sex: Sex, Time: Time, View: view },
            success: function success(responseData) {
                if (responseData.length > 0) {
                    showStatistic(responseData);
                }
            },
            dataType: 'json'
        });
    }

    function generateRandomColor() {
        return 'rgba(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', 0.8)';
    }

    function findPeriodTime(time) {
        var minYear = void 0,
            maxYear = void 0,
            minMonth = void 0,
            maxMonth = void 0;
        minYear = maxYear = minMonth = maxMonth = 0;
        var periodTime = [];

        if (time.length > 0) {
            minYear = time[0][0];
            maxYear = time[0][0];

            for (var i = 0, n = time.length; i < n; ++i) {
                if (time[i][0] <= minYear) {
                    minYear = time[i][0];
                    minMonth = time[i][1][0];
                }

                if (time[i][0] >= maxYear) {
                    maxYear = time[i][0];
                    maxMonth = time[i][1][1];
                }
            }
        }

        periodTime.push(minYear, maxYear, minMonth, maxMonth);
        return periodTime;
    }

    function showStatistic(jsonData) {
        // console.log(jsonData);
        var _findPeriodTime = findPeriodTime(Time),
            _findPeriodTime2 = _slicedToArray(_findPeriodTime, 4),
            minYear = _findPeriodTime2[0],
            maxYear = _findPeriodTime2[1],
            minMonth = _findPeriodTime2[2],
            maxMonth = _findPeriodTime2[3];

        var statData = [];
        var view = '';

        Array.prototype.forEach.call($(".view")[0].options, function (item) {
            if (item.selected) {
                view = item.value;
            }
        });

        if (view == 'graphic') {
            $(".stat-table").empty();
            $(".stat-table")[0].style.display = "none";
            $(".draw-area")[0].style.display = "block";
            $(".draw-area")[1].style.display = "none";

            prepareDataForGraphics(jsonData, minMonth, maxMonth, minYear, maxYear);
        } else if (view == 'diagram') {
            $(".stat-table").empty();
            $(".stat-table")[0].style.display = "none";
            $(".draw-area")[0].style.display = "block";
            $(".draw-area")[1].style.display = "none";

            prepareDataForDiagram(jsonData);
        } else if (view == 'table') {
            $(".stat-table").empty();
            $(".stat-table")[0].style.display = "";
            prepareDataForTable(jsonData);
        }
    }

    // функция формирования лэйблов и данных для графиков
    function prepareDataForGraphics(json, minMonth, maxMonth, minYear, maxYear) {
        var canvas = $(".draw-area");
        var existsInfoForDiseases = [];
        var dataForGraphics = [{ labels: [], datasets: [] }, { labels: [], datasets: [] }];
        // let optionForGraphics = [{}, {}];

        for (var i = 0; i < json.length; ++i) {
            if (existsInfoForDiseases.indexOf(json[i]['MKB_NAME']) == -1) {
                existsInfoForDiseases.push(json[i]['MKB_NAME']);
            }
        }

        existsInfoForDiseases.forEach(function (item) {
            for (var _i = 0; _i <= Sex; ++_i) {
                dataForGraphics[_i].datasets.push({
                    label: item,
                    data: [],
                    fill: false,
                    borderColor: generateRandomColor(),
                    pointBorderColor: 'rgb(107, 107, 107)',
                    pointBackgroundColor: 'rgb(178, 221, 230)',
                    backgroundColor: 'transparent',
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderWidth: 1
                });
            }
        });

        // json.sort(function(a, b) {
        //     return a['MKB_NAME'] - b['MKB_NAME'];
        // });

        if (Time.length > 0) {
            var j = 0,
                monthCount = 0;
            for (var _i2 = 0, n = Time.length; _i2 < n; ++_i2) {
                // в минимальном году берем минимальный месяц
                if (Time[_i2][0] == minYear) {
                    j = minMonth - 1; // TODO: неизвестно почему тут приходиться вычитать один месяц )
                    monthCount = 12;
                } else if (Time[_i2][0] == maxYear) {
                    // в максимальном году берем максимальный месяц
                    j = 0;
                    monthCount = maxMonth;
                } else {
                    // в других годах просто проходим по всем месяцам
                    j = 0;
                    monthCount = 12;
                }

                var isFound = false;
                for (j; j < monthCount; ++j) {
                    // цикл по полу
                    for (var t = 0; t <= Sex; ++t) {
                        for (var k = 0; k < dataForGraphics[t].datasets.length; ++k) {
                            for (var l = 0; l < json.length; ++l) {
                                if (json[l]['MKB_NAME'] == dataForGraphics[t].datasets[k]['label'] && +json[l]['CLOSE_MONTH'] == j + 1 && json[l]['CLOSE_YEAR'] == Time[_i2][0]) {
                                    if (Sex) {
                                        if (json[l]['SEX'] == t) {
                                            isFound = json[l]['CNT'];
                                        }
                                    } else {
                                        isFound = json[l]['CNT'];
                                    }
                                }
                            }
                            dataForGraphics[t].datasets[k].data.push(+isFound || undefined);
                            isFound = false;
                        }
                        dataForGraphics[t].labels.push(moment([Time[_i2][0], j]).format('MMM YYYY'));
                    }
                }
            }
        }

        // если имеется разделение по полу, то используем 2 области для рисования
        canvas[1].style.display = Sex ? 'block' : 'none';
        // Chart.defaults.global.defaultFontSize = 10;
        for (var _i3 = 0; _i3 <= Sex; _i3++) {
            try {
                CHARTS[_i3].destroy();
            } catch (e) {}

            CHARTS[_i3] = new Chart(canvas[_i3], {
                type: 'line',
                data: {
                    labels: dataForGraphics[_i3].labels,
                    datasets: dataForGraphics[_i3].datasets
                },
                options: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            boxWidth: 30,
                            fontColor: 'black'
                        }
                    },
                    title: {
                        display: true,
                        text: '\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0437\u0430\u0431\u043E\u043B\u0435\u0432\u0430\u0435\u043C\u043E\u0441\u0442\u0438 ' + (Sex ? _i3 ? ' по мужскому полу' : ' по женскому полу' : '')
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'month'
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Количество заболеваний"
                            }
                        }]
                    }
                }
            });
        }
    }

    function prepareDataForDiagram(json) {
        var canvas = $(".draw-area")[0];
        var existsInfoForDiseases = [];
        var dataForDiagram = { datasets: [] };

        for (var i = 0; i < json.length; ++i) {
            if (existsInfoForDiseases.indexOf(json[i]['MKB_NAME']) == -1) {
                existsInfoForDiseases.push(json[i]['MKB_NAME']);
            }
        }
        var colorOfParts = [];
        var tempArray = [];
        for (var j = 0; j < existsInfoForDiseases.length; ++j) {
            colorOfParts.push('' + generateRandomColor());
        }

        for (var _i4 = 0; _i4 <= Sex; ++_i4) {
            dataForDiagram.datasets.push({
                data: new Array(existsInfoForDiseases.length),
                backgroundColor: colorOfParts
            });
        }

        json.sort(function (a, b) {
            return a['MKB_NAME'] - b['MKB_NAME'];
        });

        // console.log(json);
        if (Time.length > 0) {
            for (var k = 0; k <= Sex; ++k) {
                for (var _i5 = 0; _i5 < existsInfoForDiseases.length; ++_i5) {
                    var temp = 0;
                    for (var _j = 0; _j < json.length; ++_j) {
                        if (json[_j]['MKB_NAME'] == existsInfoForDiseases[_i5]) {
                            if (Sex) {
                                if (json[_j]['SEX'] == k) {
                                    temp += +json[_j]['CNT'];
                                }
                            } else {
                                temp += +json[_j]['CNT'];
                            }
                        }
                    }
                    dataForDiagram.datasets[k].data[_i5] = temp;
                }
            }
        }

        Chart.defaults.global.defaultFontSize = 15;
        try {
            CHARTS[0].destroy();
        } catch (e) {}

        CHARTS[0] = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: existsInfoForDiseases,
                datasets: dataForDiagram.datasets
            },
            options: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 30,
                        fontColor: 'black',
                        fontSize: 12
                    }
                },
                title: {
                    display: true,
                    text: '\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0437\u0430\u0431\u043E\u043B\u0435\u0432\u0430\u0435\u043C\u043E\u0441\u0442\u0438 ' + (Sex ? "(внешний круг - женский пол, внутренний - мужской)" : "")
                }
            }
        });
    }

    function prepareDataForTable(json) {
        var finishMarkup = "";
        var month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        json.sort(function (a, b) {
            if (a['MKB_NAME'] > b['MKB_NAME']) {
                return 1;
            }
            if (a['MKB_NAME'] < b['MKB_NAME']) {
                return -1;
            }

            if (month[+a['CLOSE_MONTH'] - 1] > month[+b['CLOSE_MONTH'] - 1]) {
                return 1;
            }

            if (month[+a['CLOSE_MONTH'] - 1] < month[+b['CLOSE_MONTH'] - 1]) {
                return -1;
            }
        });
        $(".draw-area").each(function (index, value) {
            value.style.display = "none";
        });

        finishMarkup += "<caption style=\"margin-bottom: 10px; font-size: 17px;\">Статистика заболеваемости</caption>";
        finishMarkup += "<tr>";
        finishMarkup += '<th style="color: rgb(255, 255, 255); background-color: rgb(0, 122, 170); font-size: 18px; padding: 7px;">\u2116</th>';

        var fieldName = '';
        for (var key in json[0]) {
            switch (key) {
                case 'CNT':
                    fieldName = 'Количество заболевших';
                    break;
                case 'CLOSE_MONTH':
                    fieldName = 'Месяц установления диагноза';
                    break;
                case 'CLOSE_YEAR':
                    fieldName = 'Год установления диагноза';
                    break;
                case 'SEX':
                    fieldName = 'Пол';
                    break;
            }

            if (key != 'MKB_NAME') {
                finishMarkup += '<th style="color: rgb(255, 255, 255); background-color: rgb(0, 122, 170); font-size: 18px; padding: 7px;">' + fieldName + '</th>';
            }
        }
        finishMarkup += "</tr>";

        var tempMkb = json[0]['MKB_NAME'];
        var count = 1;
        finishMarkup += '<tr><td style="background-color: rgb(221, 219, 221); font-size: 18px; padding: 7px;" colspan="' + Object.keys(json[0]).length + '">' + tempMkb + '</td></tr>';
        for (var i = 0; i < json.length; ++i) {
            if (json[i]['MKB_NAME'] != tempMkb) {
                tempMkb = json[i]['MKB_NAME'];
                finishMarkup += '<tr><td style="background-color: rgb(221, 219, 221); font-size: 18px; padding: 7px;" colspan="' + Object.keys(json[i]).length + '">' + tempMkb + '</td></tr>';
                count = 1;
            }

            finishMarkup += "<tr>";
            finishMarkup += '<td>' + count++ + '</td>';
            for (var _key in json[i]) {
                if (_key != 'MKB_NAME') {
                    if (_key == 'SEX') {
                        finishMarkup += '<td>' + (+json[i][_key] ? 'Мужчина' : 'Женщина') + '</td>';
                    } else if (_key == 'CLOSE_MONTH') {
                        finishMarkup += '<td>' + month[json[i][_key] - 1] + '</td>';
                    } else {
                        finishMarkup += '<td>' + json[i][_key] + '</td>';
                    }
                }
            }
            finishMarkup += "</tr>";
        }

        $(".stat-table").append(finishMarkup);
    }
});
