<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Статистическая информация по заболеваниям</title>


    <link rel="stylesheet" shref="../node_modules/jquery-ui/themes/base/all.css">
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <header>
        <div class="header">
            <img src="img/stock-earnings.png" alt="Graph" class="graph-icon"  width="40" height="40">
            <h3>Статистическая информация по заболеваниям</h3>
        </div>
    </header>
    
    <div class="container-main">
        <aside class="diseases">
            <div class="filter block">
                
            <div>
                <input type="text" class="input-search" placeholder="Введите заболевание">
                <button class="btn btn-search">Найти</button>
            </div>

                <button class="btn btn-filter">Доп.фильтры</button>
                <div class="additional-filters">
                    <span>Возраст: </span>
                    <label>
                        с
                        <input type="text" class="age from">
                    </label>
                    <label>
                        до
                        <input type="text" class="age to">
                    </label>
                    <label>
                        Пол
                        <input type="checkbox" class="sex">
                    </label>
                
                    <ul>
                        Вид отображения:
                        <li>
                            <label>
                                <input type="radio" name="view" class="view">
                                График
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="radio" name="view" class="view">
                                Таблицы
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="radio" name="view" class="view">
                                Диаграмма
                            </label>
                        </li>    
                    </ul>
                </div>
            </div>

            <div class="list block">
                <div class="main-list">
                    <?php 
                        //TODO: сделать нормальное разделения php и html
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
            <div class="month" id="slider-range"></div>

            <canvas class="svg">

            </canvas>
        </div>
    </div>
    <footer>
        All rights reserved &copy; Gorelov Ruslan.
    </footer>             

    <script src="js/finish.js"></script>
</body>
</html>