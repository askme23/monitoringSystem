'use strict';

//подклю
var $ = require('jquery');
var Chart = require('chart.js');
var noUiSlider = require('nouislider');

var Diseaseases = new Set();
var Sex = void 0;
var Age = ['', ''];
var Time = [];

$(document).ready(function () {
    addEventOnFilters();
    addEventOnList();
    addEventOnYears();

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

    var ctx = $(".svg")[0];
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                borderColor: ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});

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
    });
}

function addEventOnFilters() {
    $(".filter .btn-filter").click(function () {
        var addFilter = $(".filter .additional-filters");
        addFilter.toggleClass("show");
        addFilter.toggleClass("hide");
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
        } else {
            Age[0] = null;
        }
    });

    $(".filter .to").change(function (e) {
        if (!$(this).hasClass("wrong-age")) {
            Age[1] = e.target.value;
        } else {
            Age[1] = null;
        }
    });

    $(".filter .sex").change(function (e) {
        Sex = +e.target.checked;
    });
}

function addEventOnYears() {
    $(".graph .years button").click(function (e) {
        e.preventDefault();
        if ($(this).hasClass("selected-year")) {
            Time.splice(Time.indexOf(e.target.innerHTML), 1);
        } else {
            Time.push(e.target.innerHTML);
        }
        $(this).toggleClass("selected-year");
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
                console.log(responseData);
            }
        },
        dataType: 'json'
    });
}
