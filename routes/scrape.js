var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');

/* GET users listing. */
router.get('/', function(req, res, next) {

	var alamat = 'https://www.basketball-reference.com/boxscores/';	

	//?month=12&day=20&year=2017
	var query = {
		month: 12,
		day: 20,
		year: 2017
	} 

	superagent
	.get(alamat)
	.query(query)
	.end(function(err, response){
		if(err){
			res.json({
				confirmation: 'fail',
				message: err
			})
			return
		}

		/*<tr class="winner">
			<td><a href="/teams/IND/2018.html">Indiana</a></td>
			<td class="right">105</td>
			<td class="right gamelink">
				<a href="/boxscores/201712200ATL.html">Final</a>
				
			</td>
		</tr>
		*/

		
		$ = cheerio.load(response.text)
		var scores = []
		var game = {}
		$('tr').each(function(i, element){
			
			var className = element.attribs.class
			
			if(className == 'winner' || className == 'loser'){

				var td = element.children[1]

				if(td.children != null){

					var anchor = td.children[0]
					var team = anchor.children[0].data

					var tdScore = element.children[3]
					var score = tdScore.children[0].data

					console.log(team + " : "+score)

					game[team] = score
					if(Object.keys(game).length > 2){
						scores.push(game)
						game = {}
					}

				}

			}

			
		})

		// console.log("SCORES : "+JSON.stringify(scores))

		// var tr = $('tr');
		// console.log(tr[0]);

		res.json(scores)
	})
});

module.exports = router;