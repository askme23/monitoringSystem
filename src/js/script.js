'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//подклю
var $ = require('jquery');
var Chart = require('chart.js');
var moment = require('moment');
var noUiSlider = require('nouislider');

var Diseaseases = new Set();
var Sex = void 0;
var Age = ['', ''];
var Time = [];
var selectedYear = void 0;

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

    slider.noUiSlider.on('set', function () {
        for (var i = 0, n = Time.length; i < n; ++i) {
            if (Time[i][0] == selectedYear) {
                Time[i][1] = slider.noUiSlider.get();
                getInformationForDiagnosis();
            }
        }
    });

    var ctx = $(".draw-area")[0];
    // var myChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //         datasets: [{
    //             label: '# of Votes',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         },
    //         {
    //             label: '# of asdf',
    //             data: [5, 3, 7, 13, 8, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }]
    //         }
    //     }
    // })
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: []
            // ,
            // options: {
            //     scales: {
            //         xAxes: [{
            //             type: 'time',
            //             time: {
            //                 unit: 'month'
            //             }
            //         }]
            //     }
            // }
        } });

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

        $(".filter .btn-search").click(function (e) {
            e.preventDefault();
            var filterData = $('.filter .input-search')[0].value;

            if (filterData.length >= 3 || filterData == '') {
                searchDiagnosis(filterData);
            }
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
    }

    function addEventOnYears() {
        $(".graph .years button").click(function (e) {
            e.preventDefault();

            $(".current-year").removeClass("current-year");

            if ($(this).hasClass("selected-year")) {
                for (var i = 0; i < Time.length; ++i) {
                    if (Time[i][0] == e.target.innerHTML) {
                        Time.splice(i, 1);
                    }
                }
            } else {
                var arrOfTime = [];
                selectedYear = e.target.innerHTML;
                arrOfTime.push(selectedYear);
                Time.push(arrOfTime);
                Time.sort(function (a, b) {
                    return a[0] - b[0];
                });
            }

            $(this).toggleClass("selected-year");
            $(this).toggleClass("current-year");
            slider.noUiSlider.set(['1', '12']);
            getInformationForDiagnosis();
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
        $.ajax({
            type: "POST",
            url: "/Diplom/src/php/getInformationForDiagnosis.php",
            data: { Diseaseases: Array.from(Diseaseases), Age: Age, Sex: Sex, Time: Time },
            success: function success(responseData) {
                if (responseData.length > 0) {
                    showStatistic(responseData);
                }
            },
            dataType: 'json'
        });
    }

    function showStatistic(jsonData) {
        var _myChart$data$labels;

        // console.log(jsonData);
        var _document$getElements = document.getElementsByClassName('draw-area'),
            _document$getElements2 = _slicedToArray(_document$getElements, 2),
            firstCanvas = _document$getElements2[0],
            secondCanvas = _document$getElements2[1];

        var minMonth = void 0,
            maxMonth = void 0;
        var minYear = void 0,
            maxYear = void 0;
        var mkbName = [];
        var statData = [];
        // let dataSets = [];

        if (Time.length > 0) {
            minYear = Time[0][0];
            maxYear = Time[0][0];

            for (var i = 0, n = Time.length; i < n; ++i) {
                if (Time[i][0] <= minYear) {
                    minYear = Time[i][0];
                    minMonth = Time[i][1][0];
                }

                if (Time[i][0] >= maxYear) {
                    maxYear = Time[i][0];
                    maxMonth = Time[i][1][1];
                }
            }
        }

        statData = createLabelesAndDatasets(jsonData, minMonth, maxMonth, minYear, maxYear);
        // for(let i = 0; i < formatDateLabels.length; i++) {
        //     dataSets.push(Math.floor(Math.random() * 100));
        // }

        //TODO: вынести в отдельную функцию обновление графиков
        myChart.data.labels.length = 0;
        myChart.data.datasets.length = 0;
        myChart.update();
        (_myChart$data$labels = myChart.data.labels).push.apply(_myChart$data$labels, _toConsumableArray(statData.labels));
        statData.datasets.forEach(function (item) {
            myChart.data.datasets.push(item);
        });
        myChart.update();

        // console.log(myChart);
    }

    // функция формирования лэйблов и данных для графиков
    function createLabelesAndDatasets(json, minMonth, maxMonth, minYear, maxYear) {
        //объект с лэйблами и графиками
        var labelsAndDatasets = {
            labels: [],
            datasets: []
        };

        Diseaseases.forEach(function (item) {
            labelsAndDatasets.datasets.push({ label: $('[data-id=\"' + item + '\"]')[0].innerHTML, data: [] });
        });
        json.sort(function (a, b) {
            return a['MKB_NAME'] - b['MKB_NAME'];
        });

        if (Time.length > 0) {
            var j = 0,
                monthCount = 0;
            for (var i = 0, n = Time.length; i < n; ++i) {
                // в минимальном году берем минимальный месяц
                if (Time[i][0] == minYear) {
                    j = minMonth - 1; // TODO: неизвестно почему тут приходиться вычитать один месяц )
                    monthCount = 12;
                } else if (Time[i][0] == maxYear) {
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
                    for (var k = 0; k < labelsAndDatasets.datasets.length; ++k) {
                        for (var l = 0; l < json.length; ++l) {
                            if (json[l]['MKB_NAME'] == labelsAndDatasets.datasets[k]['label'] && +json[l]['CLOSE_MONTH'] == j + 1 && json[l]['CLOSE_YEAR'] == Time[i][0]) {
                                isFound = json[l]['CNT'];
                            }
                        }
                        labelsAndDatasets.datasets[k].data.push(+isFound || undefined);
                        isFound = false;
                    }
                    labelsAndDatasets.labels.push(moment([Time[i][0], j]).format('MMM YYYY'));
                }
                // console.log(labelsAndDatasets);
            }
        }

        return labelsAndDatasets;
    }
});
