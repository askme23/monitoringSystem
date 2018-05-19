const $ = require('jquery');

$(document).ready(function() { 
    $(".filter .btn").click(function() {
        const addFilter = $(".filter .additional-filters");
        addFilter.toggleClass("show");
        addFilter.toggleClass("hide");
    });

    addEventOnList();
    // Отображение найденных заболеваний
    $(".filter .search").keyup(function(e) { 
        e.preventDefault(); 
        let filterData = e.target.value;
        
        if (filterData.length >= 3 || filterData == '') {
            if (e.keyCode == 13) {
                searchDiagnosis(filterData); 
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
        $(this).toggleClass("selected-item");
    });
}

function searchDiagnosis(data) { 
    $(".main-list").show(); 
      
    //let searchValue = $(".filter .search").val();
    $.post("/Diplom/src/php/filterDiagnosis.php", {search_term : data}, function(responseData) {
        if (responseData.length > 0) { 
            $(".main-list").html(responseData); 
            addEventOnList();
        } 
    }); 
}