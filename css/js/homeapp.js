// app.js
	// create angular app


   //load the google chart & table library
google.load('visualization', '1', {
    packages: ['corechart', 'table','geochart']
});
google.setOnLoadCallback(drawRegionsMap);

 function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable([
          ['Country', 'Housing Forecast 2014 - Percent growth'],
          ['United Kingdom', 9],
          ['United States', 7],
            
        ]);

        var options = {};

        var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    };


       


//declare our chartWrapModule, in write up we had this in a separate file called googleChartWrap.js.
angular.module('googleChartWrap', [])
    .directive('googleChart', function () {
    return {
        restrict: 'A',
        link: function ($scope, $elm, $attr) {
            //watch the actual property since haveWantStats will point to a resource and 
            //exist almost immediately even prior to pulling the data. $attr.data
            
            $scope.$watch($attr.data, function (value) {
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'name');
              
               
                if ($attr.type == 'AreaChart')
                {
                    data.addColumn('number', 'eqAmount');
                    data.addColumn('number', 'EquityPlusRent');
                    data.addColumn('number', 'accRent');

                    angular.forEach(value, function (row) {
                    data.addRow([row.name, row.amount, row.EquityPlusRent,row.rent]);
                    });

                } else
                {
                   data.addColumn('number', 'Value');
              
                    angular.forEach(value, function (row) {
                    data.addRow([row.name, row.amount]);
                    });
                    
                }
                    
                var options = {
                    title: $attr.title,
                    height: $attr.height,
                    width: $attr.width,
                    legend: 'bottom'
                };

                //render the desired chart based on the type attribute provided
                var chart;
                switch ($attr.type) {
                     case ('LineChart'):
                        chart = new google.visualization.LineChart($elm[0]);
                        break;
                
                 
                    case ('AreaChart'):
                        chart = new google.visualization.AreaChart($elm[0]);
                        break;
                
                    case ('PieChart'):
                        chart = new google.visualization.PieChart($elm[0]);
                        break;
                    case ('ColumnChart'):
                        chart = new google.visualization.ColumnChart($elm[0]);
                        break;
                    case ('BarChart'):
                        chart = new google.visualization.BarChart($elm[0]);
                        break;
                    case ('Table'):
                        chart = new google.visualization.Table($elm[0]);
                        break;
                }
                chart.draw(data, options);
            });
        }
    }
});


//declare our angular module, injecting the 'googleChartWrap' module as a dependency
homeApp = angular.module('homeApp', ['googleChartWrap']);


homeApp.controller('SlideController', function ($scope) {
    $scope.changes = 0;
    $scope.change = function () {
        $scope.changes += 1;
    };
}).directive('watchChange', function() {
    return {
        scope: {
            onchange: '&watchChange'
        },
        link: function(scope, element, attrs) {
            element.on('input', function() {
                scope.onchange();
            });
        }
    };
});

homeApp.directive('input', function ($parse) {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function (scope, element, attrs) {
      if (attrs.ngModel && attrs.value) {
        $parse(attrs.ngModel).assign(scope, attrs.value);
      }
    }
  };
});

    homeApp.controller('coffeeController', function ($scope,$window) {
    /**
     *  provide some data to use in our charts. On a real project you'd usually
     *  use an angular service to retrieve data from a web service endpoint somewhere.
     */
     
    
       $scope.houseData = [{
        "name": "12 Mts",
            "amount": 40000
    }, {
        "name": "Bills",
            "amount": 6000
    }, {
        "name": "Net",
            "amount": 36000
    }];

    
    $scope.keyfacts = [];
    
    $scope.keyfacts.income = 42000;
    $scope.keyfacts.rent = 3000;
     $scope.keyfacts.occupancy = 100;
    
    $scope.keyfacts.property = 400000;
     $scope.keyfacts.bills = 3000;
     $scope.keyfacts.investment = 10;
    
        
        
        
     $scope.$watchCollection("[keyfacts.rent,keyfacts.occupancy,keyfacts.bills,keyfacts.investment,keyfacts.income,keyfacts.property]", function (value) {
   
               
         //----- Rental income
           var r = [
            ['name', 'amount']
        ];
        
         //-- Increase rent 10% evert year, deduct bills
     var baseRent = value[0]*12*(value[1]/100);
        var baseRent2 = (value[0]*12*(value[1]/100)) * 1.1;
      
      var Y1rent = (-value[2]*12) + baseRent;
      var Y2rent = (-value[2]*12) +baseRent2;
      var Y3rent = (-value[2]*12) +baseRent2*1.1;
         
         
    r.push({
        "name": "12 Mts",
            "amount": Y1rent
    });
            
    r.push({
        "name": "2 Yr",
            "amount": Y2rent
    });
    
    r.push({
        "name": "3 Yr",
            "amount": Y3rent
    });
        
        $scope.houseData = r;
   
         
        //------ RENT + Equity 
          var xp = [
            ['name', 'EquityPlusRent', 'amount','rent']
        ];
        
         var Y0plus = value[5];
         var Y1plus = Y0plus + (Y0plus* value[4] / 100);
         var Y2plus = Y1plus + (Y1plus* (value[4] / 100));
         var Y3plus = Y2plus + (Y2plus* (value[4] / 100));
         
   
         //--- Add Rent Last to avoid mis calculations
         
    xp.push({
        "name": "0 Mts",
            "EquityPlusRent": Y0plus,
            "amount" : Y0plus,
        "rent" : 0
    });
         
    xp.push({
        "name": "12 Mts",
            "EquityPlusRent": Y1plus+Y1rent,
            "amount" : Y1plus,
        "rent" : Y1rent
    });
            
    xp.push({
        "name": "2 Yr",
            "EquityPlusRent": Y2plus+Y1rent+Y2rent,
            "amount" : Y2plus,
        "rent" : Y1rent+Y2rent
    });
    
    xp.push({
        "name": "3 Yr",
            "EquityPlusRent": Y3plus+Y1rent+Y2rent+Y3rent,
            "amount" : Y3plus,
        "rent" : Y1rent+Y2rent+Y3rent
    });
       
         
         
   
        $scope.houseLineDataPlus = xp;
        //-------------
        
        
        
        
        
         
         
         
        //-- 
   
    });
      //-------------------- RENT
         
         
        //--keyfacts.income*2
     $scope.$watchCollection("[keyfacts.income,keyfacts.property]", function (value) {
   
   //-- Redraw graph
   //-- Row 1
 
	  var x = [
            ['name', 'amount']
        ];
        
         var Y0 = value[1];
         var Y1 = Y0 + (Y0* value[0] / 100);
         var Y2 = Y1 + (Y1* (value[0] / 100));
         var Y3 = Y2 + (Y2* (value[0] / 100));
         
   
    x.push({
        "name": "0 Mts",
            "amount": Y0
    });
         
    x.push({
        "name": "12 Mts",
            "amount": Y1
    });
            
    x.push({
        "name": "2 Yr",
            "amount": Y2
    });
    
    x.push({
        "name": "3 Yr",
            "amount": Y3
    });
       
         
         
   
        //-------------
        
        
        
        
        
        $scope.houseLineData = x;
        
        
        
        //-----
  
	
        $scope.total = value;
   
   
    });
    
    
    
 




     $scope.eqDataY1 = [ {
        "name": "Your Investment",
            "amount": 100
    }, {
        "name": "CrowdBank",
            "amount": 300
    }];


     $scope.eqDataROI = [ {
        "name": "Income",
            "amount": 36
    }, {
        "name": "Equity+",
            "amount": 40
    },
    , {
        "name": "Purchase Price-Gain",
            "amount": 400-76
    }];





});




    // create angular controller
	homeApp.controller('homeController', function($scope) {



  //$.backstretch([
  //    "http://dl.dropbox.com/u/515046/www/outside.jpg"
  //  , "http://dl.dropbox.com/u/515046/www/garfield-interior.jpg"
  //  , "http://dl.dropbox.com/u/515046/www/cheers.jpg"
  //], {duration: 3000, fade: 750});


//  alert('done');

  // $scope.photos = [{id: 'p1', 'title': 'A nice day!', src: "hsbc1.jpg"},
   // {id: 'p2', 'title': 'Puh', src: "banks1.jpg"},
   // {id: 'p3', 'title': 'What a club', src: "docklands.jpg"}];


		//$('.carousel').carousel({
     //   interval: 5000 //changes the speed
   	// 	})


		// function to submit the form after all validation has occurred
		$scope.submitForm = function(isValid) {

			// check to make sure the form is completely valid
			if (isValid) {
			//	alert('our form is amazing '+$scope.submitForm);

   var dataString = {
		                    p1: $scope.user.name,
		                    p2: $scope.user.username,
		                    p3: '',
		                    p4: '',
		                    p5: '',
		                    p6: '',
		                    p7: '',
		                    p8: '',
		                    p9: $scope.user.email

		                };





		                $.ajax({
		                    type: "POST",
		                    url: "/AxonMailer.asmx/Mailer",
		                    data: JSON.stringify(dataString),
		                    contentType: "application/json; charset=utf-8",
		                    dataType: "json",
		                    success: function (data) {

                                //$scope.userForm

		                        $('#userForm').html("<div id='message'></div>");
		                        $('#message').html("<h2>PropertyCake team wants to thank you for your interest. </h2>")
		                        .append("<p>We'll email you within 24 hours!</p>")
		                        .hide()
		                        .fadeIn(1500, function () {
		                            $('#message').append("<img id='checkmark' src='jonaxel/thankyou.jpg' />");
		                        });

		                    },
		                    failure: function (errMsg) {
		                        alert(errMsg);
		                    }
		                });



			}

		};

	}).filter("customCurrency", function (numberFilter)
  {
    function isNumeric(value)
    {
      return (!isNaN(parseFloat(value)) && isFinite(value));
    }

    return function (inputNumber, currencySymbol, decimalSeparator, thousandsSeparator, decimalDigits) {
      if (isNumeric(inputNumber))
      {
        // Default values for the optional arguments
        currencySymbol = (typeof currencySymbol === "undefined") ? "$" : currencySymbol;
        decimalSeparator = (typeof decimalSeparator === "undefined") ? "." : decimalSeparator;
        thousandsSeparator = (typeof thousandsSeparator === "undefined") ? "," : thousandsSeparator;
        decimalDigits = (typeof decimalDigits === "undefined" || !isNumeric(decimalDigits)) ? 2 : decimalDigits;

        if (decimalDigits < 0) decimalDigits = 0;

        // Format the input number through the number filter
        // The resulting number will have "," as a thousands separator
        // and "." as a decimal separator.
        var formattedNumber = numberFilter(inputNumber, decimalDigits);

        // Extract the integral and the decimal parts
        var numberParts = formattedNumber.split(".");

        // Replace the "," symbol in the integral part
        // with the specified thousands separator.
        numberParts[0] = numberParts[0].split(",").join(thousandsSeparator);

        // Compose the final result
        var result = currencySymbol + numberParts[0];

        if (numberParts.length == 2)
        {
          result += decimalSeparator + numberParts[1];
        }

        return result;
      }
      else
      {
        return inputNumber;
      }
    };
  });
