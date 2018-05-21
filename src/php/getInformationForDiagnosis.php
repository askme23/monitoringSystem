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
    $Sex  = isset($_POST['Sex']) ? strip_tags($_POST['Sex']) : null;
    $Age  = isset($_POST['Age']) ? $_POST['Age'] : null;
    $Time = isset($_POST['Time']) ? $_POST['Time'] : null;

    //Переменные для каждой составления выборки
    $whatSelect  = "select count(*) CNT, extract(year from d.CLOSEDATE) CLOSE_YEAR";
    $fromSelect  = " from DISEASECASE d \n";
    $whereSelect = " where ";
    $whatGroup   = " group by ";
    $whatHaving  = " having ";
    $whatOrder   = " order by ";

    // Добавляем к запросу МКБ-ки
    $diseaseCnt = count($Diseaseases);
    if ($diseaseCnt > 0) {
        if ($diseaseCnt == 1) {
            $whereSelect .= "d.MKB_ID = " . $Diseaseases[0];
        } else {
            $mkb = "(" . $Diseaseases[0];
            for($i = 1; $i < $diseaseCnt; ++$i) {
                $mkb .= ", " . $Diseaseases[$i];
            }
            $mkb .= ")";

            $whereSelect .= "d.MKB_ID in " . $mkb . "\n";
        }
    }

    $timeCnt = count($Time);
    if ($timeCnt > 0) {
        if ($timeCnt == 1) {
            $whatHaving .= "extract(year from d.CLOSEDATE) = " . $Time[0];
        } else {
            $years = "(" . $Time[0];
            for($i = 1; $i < $timeCnt; ++$i) {
                $years .= ", " . $Time[$i];
            }
            $years .= ")";

            $whatHaving .= "extract(year from d.CLOSEDATE) in " . $years ."\n";
        }
        $whatGroup .= "extract(year from d.CLOSEDATE)";
        $whatOrder .= "CLOSE_YEAR";
    }

    $ageCnt = count($Age);
    if (!($Age[0] == '' && $Age[1] == '')) {

        if ($Age[0] == '' || $Age[1] == '') {
            $whereSelect .= "and d.AGE " . ($Age[0] != '' ? ">= " . $Age[0] : "<= " . $Age[1]);
        } else {
            $whereSelect .= "and d.AGE >= " . $Age[0] . " and d.AGE <= " . $Age[1];
        }
    }

    if ($Sex) {
        $whatSelect .= ", d.SEX";
        $whatGroup .= ", d.SEX";
    }

    /* Часть */
    $query = $whatSelect . $fromSelect . $whereSelect . $whatGroup . $whatHaving . $whatOrder;

    $stmt = $connect->prepare($query);
    $stmt->execute();

    try {
        $disease = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $JSON_object = json_encode($disease);
        
        echo $JSON_object;
    } catch(Exception $e) {
        echo "Ошибка: " . $e->getMessage();
    }
?>