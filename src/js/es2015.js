//подклю
const $ = require('jquery');
const Chart = require('chart.js');

let Diseaseases = new Set();
let Sex;
let Age = new Array(2);
let Time = [];

$(document).ready(function() {
    addEventOnFilters();
    addEventOnList();
    addEventOnYears();
    // Отображение найденных заболеваний

    var ctx = $(".svg")[0];
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
});

function addEventOnList() {
    $(".main-list .classes").click(function(e) {
        $(this)[0].nextElementSibling.classList.toggle("show-list");
        $(this).toggleClass("selected-class");
    });

    $(".main-list .list-item").click(function(e) {

        if ( $(this).hasClass("selected-item") ) {
            Diseaseases.delete(e.target.dataset.id);
        } else {
            Diseaseases.add(e.target.dataset.id);
        }
        $(this).toggleClass("selected-item");

    });
}

function addEventOnFilters() {
    $(".filter .btn-filter").click(function() {
        const addFilter = $(".filter .additional-filters");
        addFilter.toggleClass("show");
        addFilter.toggleClass("hide");
    });

    $(".filter .input-search").keyup(function(e) { 
        e.preventDefault(); 
        let filterData = e.target.value;
        
        if (filterData.length >= 3 || filterData == '') {
            if (e.keyCode == 13) {
                searchDiagnosis(filterData); 
            }
        }
    });

    $(".filter .btn-search").click(function(e) { 
        e.preventDefault(); 
        let filterData = $('.filter .input-search')[0].value;
        
        if (filterData.length >= 3 || filterData == '') {
            searchDiagnosis(filterData); 
        }
    });

    function handlerForAge(context) {
        let lastSymbol = context.value.substr(-1, 1);        

        if (!$.isNumeric(lastSymbol) || (lastSymbol == '0' && context.value.length == 1)) {
            context.value = context.value.substr(0, context.value.length - 1);
        }
    }

    $(".additional-filters .from").on('keyup keydown', function(e) {
        const target = e.target;
        const inputAgeTo = $(".additional-filters .to")[0];
        const self = $(this);

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

    $(".additional-filters .to").on('keyup keydown', function(e) {
        const target = e.target;
        const inputAgeTo = $(".additional-filters .from")[0];
        const self = $(this);

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

    $(".filter .sex").change(function(e) {
        Sex = +(e.target.checked);
    });
}

function addEventOnYears() {
    $(".graph .years button").click(function(e) {
        e.preventDefault();
        if ( $(this).hasClass("selected-year") ) {
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
    $.post("/Diplom/src/php/filterDiagnosis.php", {search_term : data}, function(responseData) {
        if (responseData.length > 0) { 
            $(".main-list").html(responseData); 
            addEventOnList();
        } 
    }); 
}

function getInformationForDiagnosis() {
    $.post("/Diplom/src/php/getInformationForDiagnosis.php", {Diseaseases: Array.from(Diseaseases), Age: Age, Sex: Sex, Time: Time}, function(responseData) {
        if (responseData.length > 0) {
            console.log(responseData);
        }
    }).fail(function() {
        console.log('Something gona wrong');
    });
}