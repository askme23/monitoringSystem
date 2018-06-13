<?php  header('Content-Type: text/html; charset=utf-8'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Статистическая информация по заболеваниям</title>


    <link rel="stylesheet" href="../node_modules/jquery-ui/themes/base/all.css">
    <link rel="stylesheet" href="../node_modules/nouislider/distribute/nouislider.min.css">
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <header>
        <div class="header">
            <img src="img/loupe.png" alt="Graph" class="graph-icon"  width="40" height="40">
            <h2>Статистическая информация по заболеваниям</h2>
        </div>
    </header>
    
    <div class="container-main">
        <aside class="diseases">
            <div class="filter block">
                
                <div class="search-block">
                    <input type="text" class="input-search" placeholder="Введите заболевание">
                    <button class="btn-reset">&times;</button>
                    <button class="btn btn-search">Найти</button>
                </div>
                
                <button class="btn-help" data-help="filter"></button>
                <div class="back-disable">
                    <div class="message-box">
                        <p>
                            Для поиска нужного заболевания введите в поисковую строку его название, или 
                            последовательность символов, которая содержится в нем. Также вручную найти информацию в кликая на классы.<br>
                            При необходимости отфильтровать данные по полу, возрасту, а также изменить вид отображения информации, необходимо
                            нажать на кнопку Доп.фильтры, а затем выбрать нужный из них.
                        </p>
                        <button></button>
                    </div>
                </div>


                <button class="btn btn-filter">Доп.фильтры</button>
                <button class="btn reset-mkb">Сбросить выбранные диагнозы</button>
                <div class="additional-filters">
                    <label>
                        Пол
                        <input type="checkbox" class="sex">
                    </label>    
                    <span>Возраст: </span>
                    <label>
                        с
                        <input type="text" class="age from">
                    </label>
                    <label>
                        до
                        <input type="text" class="age to">
                    </label>
                
                    <div>
                        Вид отображения:
                        <select name="view" class="view">
                            <option selected value="graphic">График</option>
                            <option value="diagram">Диаграмма</option>
                            <option value="table">Таблица</option>
                        </select>
                    </div>  
                </div>
            </div>

            <div class="list block">
                <div class="main-list">
                    <?php 
                        require_once 'php/DataBase.php';
                        require_once 'php/showContents.php';
                        
                        $diplom = fopen('/home/askme/askii/pass69.txt', 'r');
                        $autData = explode(' ', trim(fgetss($diplom)));
                        
                        $DB = new BD($autData[0], $autData[1], $autData[2], $autData[3], $autData[4]);
                        $connect = $DB->connect();
                        showDiagnosis($connect);
                    ?>
                </div>
            </div>
        </aside>
        
        <div class="graph block">
            <div class="years">
                <?php 
                    require_once 'php/DataBase.php';
                    require_once 'php/showContents.php';

                    $diplom = fopen('/home/askme/askii/pass69.txt', 'r');
                    $autData = explode(' ', trim(fgetss($diplom)));
                        
                    $DB = new BD($autData[0], $autData[1], $autData[2], $autData[3], $autData[4]);
                    $connect = $DB->connect();
                
                    showYears($connect);    
                ?>
                
            </div>
            <div id="slider-range"></div>

            <canvas class="draw-area" style="display: block;"></canvas>
            <canvas class="draw-area" style="display: none;"></canvas>
            <table class="stat-table" border="1" height="550px" style="display: none;"></table>
            
            <button class="btn-help" data-help="graph"></button>
            <div class="back-disable">
                <div class="message-box">
                    <p>
                        Для того, чтобы график, диаграмма или таблица отобразилась 
                        в белом блоке ниже, необходимо выбрать временной
                        период, а также в дополнительных фильтрах вид отображения.<br>
                        Щелкните мышкой по нужному году и с 
                        помощью ползунков уберите ненужные месяцы в выбранном
                        году.<br>
                        Если не трогать ползунки, то по-умолчанию в году
                        будут выбраны все 12 месяцев.
                    </p>
                    <button></button>
                </div>
            </div>
        </div>
    </div>
    <footer>
        All rights reserved &copy; Gorelov Ruslan.
    </footer>             

    <!-- Подключение скриптов -->
    <script src="js/finish.js"></script>
</body>
</html>