<?php
/**
* Allan: Database class for object-oriented database connection. 
* Change $dbname to whatever you have named your schema, in
* my case I re-used the unindexed schema from the first exercise
*/
class Database{
	public function connect(){
		$username = "root";
		$password = "";
		$hostname = "localhost";
		$dbname = "cmsc191uv_exer3";
		
		$this->connection = mysqli_connect($hostname, $username, $password, $dbname);
		
		if(mysqli_connect_errno()){
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
	}
	
	//encapsulation for any query (if we use mysqli_query everytime we have to specify the connection every time,
	//but we are only using a single connection)
	public function query($query){
		return mysqli_query($this->connection, $query);
	}
	
	//close connection on page close
	public function __destruct(){
		mysqli_close($this->connection);
	}
}

$db = new Database;
$db->connect();

$query = $_POST['query'];
$sql = "SELECT *, MATCH(coursedesc) AGAINST('".$query."') AS score FROM course WHERE MATCH(coursedesc) AGAINST('".$query."') ORDER BY score DESC";
$result = $db->query($sql);
$rows = array();

//fetch all result rows and store them in an array;
while($row = mysqli_fetch_assoc($result)){
	array_push($rows, $row);
}

//encode first to json for easier parsing on the javascript side
echo json_encode($rows);
?>