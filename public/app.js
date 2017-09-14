(function(angular) {

	'use strict';
	var app = angular.module('projectModule',[
		'ngResource',
		'ngRoute',
		'angular-loading-bar',
		'jcs-autoValidate',
		'graphicModule',
		'userModule'
	], ["$provide", function($provide) {
		var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
		$provide.value("$locale", {
		  "DATETIME_FORMATS": {
		    "AMPMS": [
		      "a.m.",
		      "p.m."
		    ],
		    "DAY": [
		      "domingo",
		      "lunes",
		      "martes",
		      "mi\u00e9rcoles",
		      "jueves",
		      "viernes",
		      "s\u00e1bado"
		    ],
		    "MONTH": [
		      "enero",
		      "febrero",
		      "marzo",
		      "abril",
		      "mayo",
		      "junio",
		      "julio",
		      "agosto",
		      "septiembre",
		      "octubre",
		      "noviembre",
		      "diciembre"
		    ],
		    "SHORTDAY": [
		      "dom",
		      "lun",
		      "mar",
		      "mi\u00e9",
		      "jue",
		      "vie",
		      "s\u00e1b"
		    ],
		    "SHORTMONTH": [
		      "ene",
		      "feb",
		      "mar",
		      "abr",
		      "may",
		      "jun",
		      "jul",
		      "ago",
		      "sep",
		      "oct",
		      "nov",
		      "dic"
		    ],
		    "fullDate": "EEEE, d 'de' MMMM 'de' y",
		    "longDate": "d 'de' MMMM 'de' y",
		    "medium": "dd/MM/yyyy HH:mm:ss",
		    "mediumDate": "dd/MM/yyyy",
		    "mediumTime": "HH:mm:ss",
		    "short": "dd/MM/yy HH:mm",
		    "shortDate": "dd/MM/yy",
		    "shortTime": "HH:mm"
		  },
		  "NUMBER_FORMATS": {
		    "CURRENCY_SYM": "\u20ac",
		    "DECIMAL_SEP": ",",
		    "GROUP_SEP": ".",
		    "PATTERNS": [
		      {
		        "gSize": 3,
		        "lgSize": 3,
		        "macFrac": 0,
		        "maxFrac": 3,
		        "minFrac": 0,
		        "minInt": 1,
		        "negPre": "-",
		        "negSuf": "",
		        "posPre": "",
		        "posSuf": ""
		      },
		      {
		        "gSize": 3,
		        "lgSize": 3,
		        "macFrac": 0,
		        "maxFrac": 2,
		        "minFrac": 2,
		        "minInt": 1,
		        "negPre": "-",
		        "negSuf": "\u00a0\u00a4",
		        "posPre": "",
		        "posSuf": "\u00a0\u00a4"
		      }
		    ]
		  },
		  "id": "es-es",
		  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
		});
		}]);



	angular.module('jcs-autoValidate')
	.run([
	    'defaultErrorMessageResolver',
	    function (defaultErrorMessageResolver) {
	        // To change the root resource file path
	        defaultErrorMessageResolver.setI18nFileRootPath('app/lib');
	        defaultErrorMessageResolver.setCulture('es-co');
	    }
	]);

	app.config(['$locationProvider',function($locationProvider) {
		$locationProvider.html5Mode(true);
	}]);
	app.config(['cfpLoadingBarProvider',function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = true;
	}]);

	app.config(['$routeProvider',function($routeProvider) {
		$routeProvider.
			when('/',{
				templateUrl: 'public/give/views/main.view.html',
				controller: 'principalCtrl'
			}).
			when('/404',{
				templateUrl: 'public/main/views/404.view.html'
			}).
			otherwise({
				redirectTo: '/404'
			});
	}]);

	app.factory('mainService', ['$http','$location','$q', function( $http,$location,$q){
		var self = {
			logout: function() {
				$http.post('php/destroy_session.php');
				//$location.path('/login/#/ingresar');
				window.location="http://localhost/project/login/";
			},
			config:{},
			cargar: function(){
				var d = $q.defer();
				$http.get('configuracion.json')
					.success(function(data){
						self.config = data;
						d.resolve();
					})
					.error(function(){
						d.reject();
						console.error("No se pudo cargar el archivo de configuración");
					});

				return d.promise;
			}
		};
		return self;
	}]);


	app.controller('mainCtrl', ['$scope', 'mainService', function($scope,mainService){
		$scope.config = {};
		$scope.titulo    = "";
		$scope.subtitulo = "";
		mainService.cargar().then( function(){
			$scope.config = mainService.config;
			//console.log($scope.config);
		});


		// ================================================
		//   Funciones Globales del Scope
		// ================================================
		$scope.activar = function( menu, submenu, titulo, subtitulo ){

			$scope.titulo = "";
			$scope.subtitulo = "";

			$scope.titulo = titulo;
			$scope.subtitulo = subtitulo;
			//console.log($scope.titulo);

			$scope.mPrincipal = "";
			$scope.mUsers = "";
			$scope.mClients = "";
			$scope.mGives = "";
			$scope.mReport = "";
			$scope.mGraphic = "";

			$scope[menu] = 'active';

		};
		$scope.salir = function() {
			mainService.logout();
			//console.log('Mierda');
		};

	}]);

	// ================================================
	//   Controlador de principal
	// ================================================
	app.controller('principalCtrl', ['$scope', function($scope){
		$scope.activar('mPrincipal','','Principal','información');
	}]);

	// ================================================
	//   Filtros
	// ================================================
	app.filter( 'quitarletra', function(){

		return function(palabra){
			if( palabra ){
				if( palabra.length > 1)
					return palabra.substr(1);
				else
					return palabra;
			}
		}
	});


})(window.angular);