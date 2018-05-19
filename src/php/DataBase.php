<?php 
    class BD {
        protected $host;
        protected $port;
        protected $dataBaseName;
        protected $user;
        protected $password;
        private $dbType = 'oci';

        protected $charset = 'utf8';

        public function __construct ($host, $port, $dbName, $user, $password) {
            $this->host = $host; 
            $this->port = $port; 
            $this->dataBaseName = $dbName; 
            $this->user = $user; 
            $this->password = $password;
        }

        /**
         *  @return dbConnect
         */
        public function connect() {
            $tns = "(DESCRIPTION =
                        (ADDRESS = (PROTOCOL = TCP)(HOST = $this->host)(PORT = $this->port))
                        (CONNECT_DATA =
                            (SERVER = DEPRICATED)
                            (SERVICE_NAME = $this->dataBaseName)
                        )
                    )";
            $sdn = "$this->dbType:dbname=$tns;charset=$this->charset;";
            try {
                $dbConnect = new PDO($sdn, $this->user, $this->password) or die('Could not connect to mysql server.' ); ;
                
                return $dbConnect;
            } catch(PDOException $e) {
                print "Подключение не удалось: " . $e->getMessage() . "<br/>";
                die();
            } 
        }
    }
?>