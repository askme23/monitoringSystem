//подклю
const $ = require('jquery'); 
const Chart = require('chart.js');
const moment = require('moment');
const noUiSlider = require('nouislider');

let Diseaseases = new Set();
let Sex = 0;
let Age = ['', ''];
let Time = [];
let selectedYear;
let CHARTS = [];

$(document).ready(function() {    
    // создаем слайдер
    const slider = $("#slider-range")[0];
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
            getInformationForDiagnosis();
        });
    }
    
    function addEventOnFilters() {
        $(".filter .btn-filter").click(function() {
            const addFilter = $(".filter .additional-filters");
            addFilter.toggleClass("show");
            addFilter.toggleClass("hide");
        });
    
        $(".filter .reset-mkb").click(function(e) {
            Diseaseases.clear();
            searchDiagnosis(); 
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
    
        $(".filter .btn-reset").click(function(e) {
            $(".filter .input-search")[0].value = "";
        });

        $(".filter .btn-search").click(function(e) { 
            e.preventDefault(); 
            let filterData = $('.filter .input-search')[0].value;
            
            if (filterData.length >= 3 || filterData == '') {
                searchDiagnosis(filterData); 
            }
        });
    
        // события для всплывающих подсказок
        $(".btn-help").each(function(index) {
            $(this).click(function(e) {
                const scrollHeight = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );
                $(".back-disable").css("height", scrollHeight).toggleClass("show-back");
                e.target.nextElementSibling.classList.toggle("message-box-show");
            });
        });

        $(".message-box-hide button").each(function(index) {
            $(this).click(function(e) {
                e.target.parentNode.classList.toggle("message-box-show");
                $(".back-disable").toggleClass("show-back");
            });
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
    
        $(".filter .from").change(function(e) {
            if (!$(this).hasClass("wrong-age")) {
                Age[0] = e.target.value;
                getInformationForDiagnosis();
            } else {
                Age[0] = null;
            }
        });
    
        $(".filter .to").change(function(e) {
            if (!$(this).hasClass("wrong-age")) {
                Age[1] = e.target.value;
                getInformationForDiagnosis();
            } else {
                Age[1] = null;
            }
        });
    
        $(".filter .sex").change(function(e) {
            Sex = +(e.target.checked);
            getInformationForDiagnosis();
        });

        $(".view").on("change", function(e) {
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

        $(".graph .years button").click(function(e) {
            e.preventDefault();

            // $(".current-year").removeClass("current-year");
            // slider.noUiSlider.reset();
            let sliderValue = slider.noUiSlider.get();
            if ($(this).hasClass("selected-year")) {
                for(let i = 0; i < Time.length; ++i) {
                    if (Time[i][0] == e.target.innerHTML) {
                        if ($(this).hasClass("current-year")) {
                            Time.splice(i, 1);
                            $(this).toggleClass("selected-year");
                        } else {
                            // slider.noUiSlider.reset();
                            slider.noUiSlider.set(Time[i][1]);
                            $(".current-year").removeClass("current-year");
                            $(this).addClass("current-year");
                        }
                    }
                }
            } else {
                let arrOfTime = [];

                slider.noUiSlider.reset();
                selectedYear = e.target.innerHTML;
                (function(val) {
                    arrOfTime.push(selectedYear, val);
                })(slider.noUiSlider.get());
                Time.push(arrOfTime);
                Time.sort(function(a, b) {
                    return a[0] - b[0];
                });
                $(this).toggleClass("selected-year");
                $(".current-year").removeClass("current-year");
                $(this).toggleClass("current-year");
            }
    
            getInformationForDiagnosis();
        });

        slider.noUiSlider.on('update', function() {
            for(let i = 0, n = Time.length; i < n; ++i) {
                if (Time[i][0] == selectedYear) {
                    let sliderValue = slider.noUiSlider.get();
                    (function(val) {
                        Time[i][1] = val;
                    })(sliderValue);
                    
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
        $.post("/Diplom/src/php/filterDiagnosis.php", {search_term : data}, function(responseData) {
            if (responseData.length > 0) { 
                $(".main-list").html(responseData); 
                addEventOnList();
            } 
        }); 
    }
    
    function getInformationForDiagnosis() {
        let view = '';
        Array.prototype.forEach.call($(".view")[0].options, function(item) {
            if (item.selected) {
                view = item.value;
            }
        });

        $.ajax({
            type: "POST",
            url: "/Diplom/src/php/getInformationForDiagnosis.php",
            data: {Diseaseases: Array.from(Diseaseases), Age: Age, Sex: Sex, Time: Time, View: view},
            success: function(responseData) {
                if (responseData.length > 0) {
                    showStatistic(responseData);
                } 
            },
            dataType: 'json'
        });
    }

    function generateRandomColor() {
        return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`;
    }

    function findPeriodTime(time) {
        let minYear, maxYear, minMonth, maxMonth;
        minYear = maxYear = minMonth = maxMonth = 0;
        let periodTime = [];

        if (time.length > 0) {
            minYear = time[0][0];
            maxYear = time[0][0];

            for(let i = 0, n = time.length; i < n; ++i) {
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
        let [minYear, maxYear, minMonth, maxMonth] = findPeriodTime(Time);
        let statData = [];
        let view = '';

        Array.prototype.forEach.call($(".view")[0].options, function(item) {
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
        const canvas = $(".draw-area");
        let existsInfoForDiseases = [];
        let dataForGraphics = [{ labels: [], datasets: [] }, { labels: [], datasets: [] }];
        // let optionForGraphics = [{}, {}];

        for(let i = 0; i < json.length; ++i) {
            if (existsInfoForDiseases.indexOf(json[i]['MKB_NAME']) == -1) {
                existsInfoForDiseases.push(json[i]['MKB_NAME']);
            }
        }

        existsInfoForDiseases.forEach(function(item) {
            for(let i = 0; i <= Sex; ++i) {
                dataForGraphics[i].datasets.push({
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
            let j = 0, monthCount = 0;
            for (let i = 0, n = Time.length; i < n; ++i) {
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
    
                let isFound = false;
                for (j; j < monthCount; ++j) {
                    // цикл по полу
                    for(let t = 0; t <= Sex; ++t) {
                        for(let k = 0; k < dataForGraphics[t].datasets.length; ++k) {
                            for(let l = 0; l < json.length; ++l) {
                                if (json[l]['MKB_NAME'] == dataForGraphics[t].datasets[k]['label'] && +json[l]['CLOSE_MONTH'] == j+1 && json[l]['CLOSE_YEAR'] == Time[i][0]) {
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
                            isFound = false
                        }
                        dataForGraphics[t].labels.push(moment([Time[i][0], j]).format('MMM YYYY'));
                    }
                }
            }
        }
        
        // если имеется разделение по полу, то используем 2 области для рисования
        canvas[1].style.display = (Sex) ? 'block' : 'none';
        // Chart.defaults.global.defaultFontSize = 10;
        for(let i = 0; i <= Sex; i++) {
            try {
                CHARTS[i].destroy();
            } catch(e) {}
    
            CHARTS[i] = new Chart(canvas[i], {
                type: 'line',
                data: {
                    labels: dataForGraphics[i].labels,
                    datasets: dataForGraphics[i].datasets
                },
                options: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                          boxWidth: 30,
                          fontColor: 'black',
                        }
                    },
                    title: {
                        display: true,
                        text: `Статистика заболеваемости ${(Sex) ? ((i) ? ' по мужскому полу' : ' по женскому полу') : ''}` 
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
                                labelString: "Количество заболеваний",
                            }
                        }]
                    }
                }
            });
        }
    }

    function prepareDataForDiagram(json) {
        const canvas = $(".draw-area")[0];
        let existsInfoForDiseases = [];
        let dataForDiagram = {datasets: []};

        for(let i = 0; i < json.length; ++i) {
            if (existsInfoForDiseases.indexOf(json[i]['MKB_NAME']) == -1) {
                existsInfoForDiseases.push(json[i]['MKB_NAME']);
            }
        }
        let colorOfParts = [];
        let tempArray = [];
        for(let j = 0; j < existsInfoForDiseases.length; ++j) {
            colorOfParts.push(`${generateRandomColor()}`);
        }


        for(let i = 0; i <= Sex; ++i) {
            dataForDiagram.datasets.push({
                data: new Array(existsInfoForDiseases.length),
                backgroundColor: colorOfParts,
            });
        }

        json.sort(function(a, b) {
            return a['MKB_NAME'] - b['MKB_NAME'];
        });

        // console.log(json);
        if (Time.length > 0) {
            for(let k = 0; k <= Sex; ++k) {
                for(let i = 0; i < existsInfoForDiseases.length; ++i) {
                    let temp = 0;
                    for(let j = 0; j < json.length; ++j) {
                        if (json[j]['MKB_NAME'] == existsInfoForDiseases[i]) {
                            if (Sex) {
                                if (json[j]['SEX'] == k) {
                                    temp += +json[j]['CNT'];
                                }
                            } else {
                                temp += +json[j]['CNT'];
                            }
                        }
                    }
                    dataForDiagram.datasets[k].data[i] = temp;
                }
            }
        }

        Chart.defaults.global.defaultFontSize = 15;
        try {
            CHARTS[0].destroy();
        } catch(e) {}

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
                    text: `Статистика заболеваемости ${(Sex) ? "(внешний круг - женский пол, внутренний - мужской)" : ""}` 
                }
            }
        });
    }

    function prepareDataForTable(json) {
        let finishMarkup = "";
        let month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        json.sort(function(a, b) {
            if (a['MKB_NAME'] > b['MKB_NAME']) {
                return 1;
            }
            if (a['MKB_NAME'] < b['MKB_NAME']) {
                return -1;
            }

            if (month[+a['CLOSE_MONTH']-1] > month[+b['CLOSE_MONTH']-1]) {
                return 1;
            }

            if (month[+a['CLOSE_MONTH']-1] < month[+b['CLOSE_MONTH']-1]) {
                return -1;
            }
        });
        $(".draw-area").each(function(index, value) {
            value.style.display = "none";
        });

        finishMarkup += "<caption style=\"margin-bottom: 10px; font-size: 17px;\">Статистика заболеваемости</caption>";
        finishMarkup += "<tr>";
        finishMarkup += `<th style="color: rgb(255, 255, 255); background-color: rgb(0, 122, 170); font-size: 18px; padding: 7px;">№</th>`;

        let fieldName = '';
        for(let key in json[0]) {
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
                finishMarkup += `<th style="color: rgb(255, 255, 255); background-color: rgb(0, 122, 170); font-size: 18px; padding: 7px;">${fieldName}</th>`;
            }
        }
        finishMarkup += "</tr>";
        
        let tempMkb = json[0]['MKB_NAME'];
        let count = 1;
        finishMarkup += `<tr><td style="background-color: rgb(221, 219, 221); font-size: 18px; padding: 7px;" colspan="${Object.keys(json[0]).length}">${tempMkb}</td></tr>`;
        for(let i = 0; i < json.length; ++i) {
            if (json[i]['MKB_NAME'] != tempMkb) {
                tempMkb = json[i]['MKB_NAME'];
                finishMarkup += `<tr><td style="background-color: rgb(221, 219, 221); font-size: 18px; padding: 7px;" colspan="${Object.keys(json[i]).length}">${tempMkb}</td></tr>`;
                count = 1;
            }

            finishMarkup += "<tr>";
            finishMarkup += `<td>${count++}</td>`;
            for(let key in json[i]) {
                if (key != 'MKB_NAME') {
                    if (key == 'SEX') {
                        finishMarkup += `<td>${+json[i][key] ? 'Мужчина' : 'Женщина'}</td>`;
                    } else if (key == 'CLOSE_MONTH') {
                        finishMarkup += `<td>${month[ json[i][key]-1 ]}</td>`;    
                    } else {
                finishMarkup += `<td>${json[i][key]}</td>`;
            }
                }
            }
            finishMarkup += "</tr>";
        }

        $(".stat-table").append(finishMarkup);
    }
});
