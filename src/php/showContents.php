<?php
    function showDiagnosis($connect) {
        $query = "select m.MKB_NAME,
                         mc.description
                    from MKB10 m
                         join MKB_CLASSES mc on m.CLASS_ID = mc.ID 
                order by mc.description";
        $stmt = $connect->prepare($query);
        $stmt->execute();

        try {
            $MKB = $stmt->fetchAll();
            $class = $MKB[0]['DESCRIPTION'];
            
            $str = "<button class=\"btn classes\">$class</button>\n";
            $str .= "<div class=\"list\"> \n";

            for($i = 0; $i < count($MKB); ++$i) {
                if ($MKB[$i]['DESCRIPTION'] != $class) {
                    $str .= "</div> \n";
                    $str .= "<button class=\"btn classes\">$class</button>\n";
                    $class = $MKB[$i]['DESCRIPTION'];
                    $str .= "<div class=\"list\"> \n";
                }
                $str .= "<div class=\"list-item\">" .  $MKB[$i]['MKB_NAME'] . "</div> \n";
            }
            $str .= "</div> \n";

            echo $str;
        } catch(Exception $e) {
            echo "Ошибка: " . $e->getMessage();
        }
    }

    function showYears($connect) {
        $query = "select extract(YEAR from d.CLOSEDATE) as YEAR
                         from DISEASECASE d
                   where d.CLOSEDATE is not null
                group by extract(YEAR from d.CLOSEDATE)
                order by YEAR";
        
        $stmt = $connect->prepare($query);
        $stmt->execute();

        try {
            $years = $stmt->fetchAll();

            $str = "";
            for($i = 0; $i < count($years); ++$i) {
                $str .= "<button type=\"button\" class=\"btn\">" . $years[$i]['YEAR'] . "</button> \n";         
            }

            echo $str;
        } catch(Exception $e) {
            echo "Ошибка: " . $e->getMessage();
        }
    }
?>