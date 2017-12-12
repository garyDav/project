/*
//phantomjs
https://www.youtube.com/watch?v=_IKh1IvIjZo
//casperjs
https://www.youtube.com/watch?v=ahPRsjQiii0

https://www.ereach.net/exposed-seo-solutions-angular-js-presented-clarity-16-video/
http://marcosdice.es/principios-seo-tecnico-webs-javascript
https://sargue.net/2015/10/22/angularjs-y-seo/
*/

var page = require('webpage').create();
var system = require('system');

/*page.open("https://www.google.com/",function(status) {
	console.log('page content: '+page.content);
	console.log('page title: ' + page.title);
	console.log('page url: ' + page.url);
	console.log('page Text: '+page.plainText);
	phantom.exit();
});*/
//Parámetros en phantom
page.open(system.args[1], function(status) {
	console.log(system.args[2] + page.title);
	console.log(system.args[3] + page.url);
	phantom.exit();
});
/*
phantomjs
>google.js "https://www.google.com/" "page title: " "page url: "
*/
//Screenshot de paginas web
page.open(system.args[1], function(status) {
	page.render(system.args[2] + ".png");
	phantom.exit();
});
/*
phantomjs
>google.js "https://www.google.com/" "google"
*/
//forms con phantomjs
page.open("https://www.w3schools.com/php/demo_form_validation_complete.php", function(status) {
	page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',function() {
		
		page.onLoadFinished = function() {
			page.render("after_submit.png");
			phantom.exit();
		};

		page.evaluate(function() {
			$('body > form > input[type="text"]:nth-child(1)').val('Name');
			$('body > form > input[type="text"]:nth-child(5)').val('example@gmail.com');
			$('body > form > input[type="text"]:nth-child(9)').val('page.com');
			$('body > form > textarea').val('Todo write content');
			$('body > form > input[type="radio"]:nth-child(17)').prop('checked',true);
			$('body > form > input[type="submit"]:nth-child(21)').click();
		});
		page.render("before_submit.png");

	});
});





//CasperJS
casper = require('casper').create();
casper = start('https://www.google.com/');
casper.viewport(1200,720);

casper.then(function() {
	//casper.echo('Pagina cargada con exito');
	//casper.capture('google.png',{top:0,left:0,width:1200,height:720});
	casper.fill('form[action]');
});

casper.run();