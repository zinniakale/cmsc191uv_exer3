/**
* Javascript file for the AJAX Post request
* for the coursecode searching. I did not modularize
* the code (ie. separated into more readable functions and shit)
* because this is just a very small exercise
*/

$(document).ready(function(){
	var request;

	//Bind to the submit event of our form
	$("#search_form").submit(function(event){
		event.preventDefault();
		//Abort any pending request
		if (request) {
			request.abort();
		}
		
		// setup some local variables
		var $form = $(this);

		//serialize form data to send as input
		var serializedData = $form.serialize();
		
		//post request
		$.post("search.php", serializedData, function(result){
			var data = JSON.parse(result);
			
			//get a reference for the table
			$table = $("#search_result_table");
			//clear previous results
			$table.empty();
			
			//create table rows with the data fetched from the model
			for(var i = 0; i < data.length; i++){
				var $tr = $("<tr>");
				
				var $td = $("<td>");
				$td.html(data[i]);
				$tr.append($td);
				
				$table.append($tr);
			}
			
			//log the result to console
			console.log($table.html());
		});
		
		
	});
	
});

