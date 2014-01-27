'use strict';

/* Directives */
angular.module('Directive', ['ngResource', 'ngCookies', 'ui.bootstrap','ui.date','google-maps','localization', 'ui.event'])
.run(function ($rootScope) {
  
  })

.directive('stopEvent', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.bind(attr.stopEvent, function (e) {
        e.stopPropagation();
      });
    }
  };
})


.directive('chart', function () {
  
  return {
    restrict: 'E',
    template: '<div></div>',
    scope: {
        chartData: "=series",
        chart: "=chart"
    },
    transclude:true,
    replace: true,


    link: function (scope, element, attrs) {
      
      var chartsDefaults = {
        chart: {
          zoomType: 'x',
          renderTo: element[0],
          type: attrs.type || null,
          height: attrs.height || null,
          width: attrs.width || null,
          
        },
        subtitle: {
          text: attrs.subtitle || null
        },

        legend: {
          enabled: true
        },
        navigator: {
          enabled: true,
          series: {
            id: 'navigator'
          }
        },
        // tooltip: {
        //   formatter: function() {
        //     return this.x , Highcharts.numberFormat(this.y, 2);
        //   }
        // },
        xAxis : {
          events : {
            afterSetExtremes : function(e) {
              var currentExtremes = this.getExtremes();
              if (scope.chart) {
                scope.chart.showLoading("Gegevens inladen...");
                angular.forEach(scope.chart.series, function(serie, serieKey) {
                  if (serie.visible == true && serie.name != 'Navigator') {
                    console.log(new Date(e.min).toISOString());
                    console.log(serie);
                  }
                });
                scope.chart.hideLoading();
              }
            }
          },
          minRange: 3600 * 1000 // one hour
        },
        series: []
      };

      scope.$watch(function() { return scope.chartData; }, function(value) {
        // console.log("yow", scope.chartData)
        if(!value) {
          return;
        }
        if (!scope.chart) {
          // console.log("maak een nieuwe chart en begin met:::::  " + scope.chartData.name);
          //scope.chartData.visible = false;

          //console.log(scope.chartData);
          
          //angular.copy(scope.chartData, chartsDefaults["series"]);
          //chartDefaults = scope.chartData
          //chartsDefaults["series"] = scope.chartData;
          //chartsDefaults.series = scope.chartData;
          Highcharts.StockChart(chartsDefaults, function(newchart) {
            newchart.showLoading("Gegevens aan het inladen");
            newchart.addSeries(scope.chartData, false);
            newchart.get('navigator').setData(scope.chartData.data);
            newchart.xAxis[0].setExtremes();
            scope.chart = newchart;
          });
        } else {
          //scope.chartData.visible = false;
          scope.chart.showLoading("Gegevens aan het inladen");
          scope.chartData.visible = false;
          scope.chart.addSeries(scope.chartData);
          scope.chart.hideLoading();
        }

        //scope.chart.addSeries(scope.chartData);
        //scope.chart.redraw();
      })

      //Update when charts data changes
      /*scope.$watch(function() { return scope.chartData; }, function(value) {
        if(!value) return;
          // We need deep copy in order to NOT override original chart object.
          // This allows us to override chart data member and still the keep
          // our original renderTo will be the same
          console.log(scope.chartData);
          var deepCopy = true;
          var newSettings = {};
          $.extend(deepCopy, newSettings, chartsDefaults, scope.chartData);
          var chart = new Highcharts.StockChart(chartsDefaults);
      });*/
    }
  };
})


;
