<?php
    require_once './DataBase.php';

    // test nso
    $nso = file_get_contents('/home/askme/askii/pass67.txt');
    $diplom = file_get_contents('/home/askme/askii/pass69.txt');
    $nso = explode(' ', trim($nso));
    $diplom = explode(' ', trim($diplom));

    $DB1 = new BD($nso[0], $nso[1], $nso[2], $nso[3], $nso[4]);
    $DB2 = new BD($diplom[0], $diplom[1], $diplom[2], $diplom[3], $diplom[4]);
    
    $connect1 = $DB1->connect();
    $connect2 = $DB2->connect();
    
    // Для отладки
    $connect1->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    $connect2->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );


    $connect1->query("alter session set NLS_DATE_FORMAT='dd.mm.yyyy'");
    $connect2->query("alter session set NLS_DATE_FORMAT='dd.mm.yyyy'");
    
    $query = "select (select MKB_NAME from D_MKB10 where ID = d.MKB) MKB_NAME,
                     d.DC_OPENDATE,
                     d.DC_CLOSEDATE,
                     floor((sysdate - a.BIRTHDATE) / 365) as AGE,
                     a.SEX
                from D_DISEASECASES d
                     join D_PERSMEDCARD pm on d.PATIENT = pm.ID
                     join D_AGENTS a on pm.AGENT = a.ID
               where MKB is not null";
    $stmt = $connect1->query($query);

    try {
        $count = 0; 
        while ($row = $stmt->fetch()) {
            $query = "select m.ID from MKB10 m where m.MKB_NAME = ?";
            $stmt1 = $connect2->prepare($query);
            $stmt1->bindParam(1, $row['MKB_NAME']);
            $stmt1->execute();
            //$MKBIdQuery = $connect2->query($query);
            $result = $stmt1->fetch(PDO::FETCH_ASSOC);

            if ($result['ID']) {
                // echo $result['ID'] . " = " . $row['MKB_NAME'];
                // echo "<br>";
                // echo $row['DC_OPENDATE'] . " " . $row['DC_CLOSEDATE'];
                $insertQuery = "insert into DISEASECASE(ID, MKB_ID, MKB, OPENDATE, CLOSEDATE, SEX, AGE) 
                                values(GEN_DC_ID.NEXTVAL, :mkb_id, :mkb_name, to_date(:opendate), to_date(:closedate), :sex, :age)";
                $stm1 = $connect2->prepare($insertQuery);
                
                $stm1->bindParam(':mkb_id',    $result['ID']);
                $stm1->bindParam(':mkb_name',  $row['MKB_NAME']);
                $stm1->bindParam(':opendate',  $row['DC_OPENDATE']);
                $stm1->bindParam(':closedate', $row['DC_CLOSEDATE']);
                $stm1->bindParam(':sex',       $row['SEX']);
                $stm1->bindParam(':age',       $row['AGE']);
                $stm1->execute();
            } 
        }

        echo "Копирование данных завершено";
        $connect1 = null;
        $connect2 = null;
    } catch(Exception $e) {
        echo "Ошибка: " . $e->getMessage();
    }
?>  