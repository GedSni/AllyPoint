

//Error handling sample
					
/*function (err, res) {
	console.log('Error=' + err); 
	if (err){
		console.log('Error in fetching games for a specific category' + err);
		return (err);
	}
	console.log('Success in fetching data' + JSON.stringify(res)); 
	response.send(JSON.stringify(res));
}*/
					
//Aggregate sample	
	
/*
db.mycollection.aggregate(
    { $group: { 
        // Group by fields to match on (a,b)
        _id: { a: "$a", b: "$b" },

        // Count number of matching docs for the group
        count: { $sum:  1 },

        // Save the _id for matching docs
        docs: { $push: "$_id" }
    }},

    // Limit results to duplicates (more than 1 match) 
    { $match: {
        count: { $gt : 1 }
    }}
)*/

//Pyramid sample
/*var findRoute = router.route("/find");
var json = {};

findRoute.get(function(req, res) {
  Box.find(function(err, boxes) {
    json.boxes = boxes;

    Collection2.find(function (error, coll2) {
      json.coll2 = coll2;

      Collection3.find(function (error, coll3) {
        json.coll3 = coll3;

        res.json(json);
      }).sort("-size");
    }).sort("-name");
  }).sort("-itemCount");
});*/