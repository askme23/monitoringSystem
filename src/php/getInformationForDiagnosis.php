<?php
    require_once './DataBase.php';

    $diplom = fopen('/home/askme/askii/pass69.txt', 'r');
    $autData = explode(' ', trim(fgetss($diplom)));

    $host   = $autData[0];
    $port   = $autData[1];
    $dbName = $autData[2];
    $user   = $autData[3];
    $pass   = $autData[4];

    $DB = new BD($host, $port, $dbName, $user, $pass);
    $connect = $DB->connect();

    $Diseaseases = $_POST['Diseaseases'];
    $Sex = strip_tags($_POST['Sex']);
    // TODO: позже надо будет добавить еще и обрабокту возраста
    // $Age = $_POST['Age'];
    $Time = $_POST['Time'];
    $whatSelect = "select count(*),
                          extract(year from d.CLOSEDATE) CLOSE_YEAR";
    $fromSelect = "from DISEASECASE d \n";
    $whereSelect = "";

    if (count($Diseaseases) > 0) {
        
    }
?>