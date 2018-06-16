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
    $View = isset($_POST['View']) ? $_POST['View'] : null;

    //Переменные для каждой составления выборки
    $whatSelect  = "select count(*) CNT, m.MKB_NAME"; 
    if ($View != "diagram") {
        $whatSelect .= ", extract(month from d.CLOSEDATE) CLOSE_MONTH, extract(year from d.CLOSEDATE) CLOSE_YEAR";
    }

    $fromSelect  = " from DISEASECASE d join MKB10 m on d.MKB_ID = m.ID\n";
    $whereSelect = " where ";
    $whatGroup   = " group by m.MKB_NAME";
    $whatOrder   = " order by ";
    if ($View != "diagram") {
        $whatGroup .= ", extract(month from d.CLOSEDATE), extract(year from d.CLOSEDATE)";
    }


    // var_dump($Time);
    function setDisease() {
        global $Diseaseases, $whereSelect;
        $diseaseCnt = count($Diseaseases);
        if ($diseaseCnt > 0) {
            if ($diseaseCnt == 1) {
                $whereSelect .= " d.MKB_ID = " . $Diseaseases[0];
            } else {
                $mkb = "(" . $Diseaseases[0];
                for($i = 1; $i < $diseaseCnt; ++$i) {
                    $mkb .= ", " . $Diseaseases[$i];
                }
                $mkb .= ")";

                $whereSelect .= " d.MKB_ID in " . $mkb . "\n";
            }
        }
    }

    function setAgeAndSex() {
        global $Age, $Sex, $whereSelect, $whatSelect, $whatGroup, $whatOrder, $View;
        $ageCnt = count($Age);
        if (!($Age[0] == '' && $Age[1] == '')) {

            if ($Age[0] == '' || $Age[1] == '') {
                $whereSelect .= " and d.AGE " . ($Age[0] != '' ? ">= " . $Age[0] : "<= " . $Age[1]);
            } else {
                $whereSelect .= " and d.AGE BETWEEN " . $Age[0] . " and " . $Age[1];
            }
        }

        if ($Sex) {
            $whatSelect .= ", d.SEX";
            $whatGroup .= ", d.SEX";
            $whatOrder .= "SEX";
            if ($View != 'diagram') {
                $whatOrder .= ", CLOSE_YEAR, CLOSE_MONTH";
            } else {
                $whatOrder .= ", MKB_NAME";
            }
        } else {
            if ($View != 'diagram') {
                $whatOrder .= "CLOSE_YEAR, CLOSE_MONTH";
            } else {
                $whatOrder .= "MKB_NAME";
            }
        }
    }

    $timeCnt = count($Time);
    if ($timeCnt > 0) {
        // есдли выбран год только один
        if ($timeCnt == 1) {
            setDisease();
            $whereSelect .= " and extract(year from d.CLOSEDATE) = " . $Time[0][0] . " and (extract(month from d.CLOSEDATE) >= " . (int)$Time[0][1][0] . " and extract(month from d.CLOSEDATE) <= " . (int)$Time[0][1][1] . ")";
            setAgeAndSex();

            $query = $whatSelect . $fromSelect . $whereSelect . $whatGroup . $whatOrder;
        } else {
            $query = "";
            
            for($i = 0, $n = count($Time); $i < $n; ++$i) {
                setDisease();
                setAgeAndSex();
                $whereSelect .= " and extract(year from d.CLOSEDATE) = " . $Time[$i][0] . " and (extract(month from d.CLOSEDATE) >= " . (int)$Time[$i][1][0] . " and extract(month from d.CLOSEDATE) <= " . (int)$Time[$i][1][1] . ")";
                
                if ($i != $n - 1) {
                    $query .= $whatSelect . $fromSelect . $whereSelect . $whatGroup . " \n union all \n";
                } else {
                    $query .= $whatSelect . $fromSelect . $whereSelect . $whatGroup . $whatOrder;
                }

                $whatSelect  = "select count(*) CNT, m.MKB_NAME";
                if ($View != "diagram") {
                    $whatSelect .= ", extract(month from d.CLOSEDATE) CLOSE_MONTH, extract(year from d.CLOSEDATE) CLOSE_YEAR";
                }
                
                $fromSelect  = " from DISEASECASE d join MKB10 m on d.MKB_ID = m.ID\n";
                $whereSelect = " where ";
                $whatGroup   = " group by m.MKB_NAME";
                $whatOrder = " order by ";
                if ($View != "diagram") {
                    $whatGroup .= ", extract(month from d.CLOSEDATE), extract(year from d.CLOSEDATE)";
                }
            }
        }
    } else {
        setDisease();
        setAgeAndSex();
        $query = $whatSelect . $fromSelect . $whereSelect . $whatGroup . $whatOrder;
    }

    // var_dump($query);
    $stmt = $connect->prepare($query);
    $stmt->execute();

    try {
        $disease = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $JSON_object = json_encode($disease, JSON_UNESCAPED_UNICODE);
        
        echo $JSON_object;
    } catch(Exception $e) {
        echo "Ошибка: " . $e->getMessage();
    }
?>