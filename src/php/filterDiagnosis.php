<?php 
    require_once './DataBase.php';
    require_once './showContents.php';

    $diplom = fopen('/home/askme/askii/pass69.txt', 'r');
    $autData = explode(' ', trim(fgetss($diplom)));

    $host   = $autData[0];
    $port   = $autData[1];
    $dbName = $autData[2];
    $user   = $autData[3];
    $pass   = $autData[4];

    $DB = new BD($host, $port, $dbName, $user, $pass);
    $connect = $DB->connect();
    $term = trim(strip_tags(substr($_POST['search_term'], 0, 100)));
    
    if ($term == '') {
        showDiagnosis($connect);
    } else {
        $query = "select MKB_NAME 
                    from MKB10 
                   where MKB_NAME like '%$term%' 
                order by MKB_NAME";
                
        $stmt = $connect->prepare($query);
        $stmt->execute();
    
        try {
            $MKB = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            $str = '';
            for($i = 0; $i < count($MKB); ++$i) {
                $str .= "<div class=\"list-item\">" .  $MKB[$i] . "</div> \n";
            }
            
            echo $str;
        } catch(Exception $e) {
            echo "Ошибка: " . $e->getMessage();
        }
    }
?>