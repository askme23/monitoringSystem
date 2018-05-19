<?php
    require_once './DataBase.php';

    $nso = file_get_contents('/home/askme/askii/pass67.txt');
    $diplom = file_get_contents('/home/askme/askii/pass69.txt');
    $nso = explode(' ', trim($nso));
    $diplom = explode(' ', trim($diplom));

    $DB1 = new BD($nso[0], $nso[1], $nso[2], $nso[3], $nso[4]);
    $DB2 = new BD($diplom[0], $diplom[1], $diplom[2], $diplom[3], $diplom[4]);
    
    $connect1 = $DB1->connect();
    $connect2 = $DB2->connect();
    
    // Для отладки
    // $connect1->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    // $connect2->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    $sql = "select MKB_NAME, MKB_CODE from D_MKB10 where REGEXP_LIKE(MKB_CODE, '^\w{1}\d{2}(\.\d{1})?$')";
    $stmt = $connect1->query($sql);

     try {
        while ($row = $stmt->fetch()) {
            $MKB_CODE = $row['MKB_CODE'];
            $sql = "select PKG_MKB10.FIND_CLASS_BY_CODE('" . $MKB_CODE . "') as CLASS from dual";
            $findClassQuery = $connect2->query($sql);
            $class_id = $findClassQuery->fetch(PDO::FETCH_ASSOC);

            if ($class_id['CLASS']) {
                $insertQuery = "insert into MKB10(ID, CLASS_ID, MKB_CODE, MKB_NAME) 
                                values(GEN_MKB_ID.NEXTVAL, :class, :code, :name)";
                $stm1 = $connect2->prepare($insertQuery);
                $stm1->bindParam(':code',  $code);
                $stm1->bindParam(':name',  $name);
                $stm1->bindParam(':class', $class_id['CLASS']);
    
                $code = $row['MKB_CODE'];
                $name = $row['MKB_NAME'];
    
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