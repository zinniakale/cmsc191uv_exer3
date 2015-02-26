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
		$dbname = "unindexed";
		
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

/*
	We're gonna put the Search Ranking algorithm here
	
	@output: final $sql string
*/

//sample query output
$sql = "SELECT coursedesc FROM course";
$result = $db->query($sql);

//fetch all result rows and store them in an array;
while($row = $result->fetch_row()){
	$rows[] = $row[0];
}

//encode first to json for easier parsing on the javascript side
echo json_encode($rows);

?>