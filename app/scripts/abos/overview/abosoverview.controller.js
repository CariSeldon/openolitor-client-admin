'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosOverviewController', ['$scope', '$filter',
    'AbosOverviewModel', 'ngTableParams', 'AbotypenOverviewModel',
    function($scope, $filter, AbosOverviewModel, ngTableParams, AbotypenOverviewModel) {

      $scope.entries = [];
      $scope.loading = false;

      $scope.search = {
        query: ''
      };

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      $scope.abotypL = [];
      AbotypenOverviewModel.query({
        q: ''
      }, function(list) {
        angular.forEach(list, function(abotyp) {
          $scope.abotypL.push({
            'id': abotyp.id,
            'title': abotyp.name
          });
        });
      });

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new ngTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            kunde: 'asc'
          },
          filter: { abotypId: '' }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function($defer, params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries, $scope
              .search.query);
            var orderedData = params.sorting ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              filteredData;
            orderedData = $filter('filter')($scope.entries, params.filter());

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;
        $scope.entries = AbosOverviewModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      search();

      $scope.$watch('search.query', function() {
        search();
      }, true);

    }
  ]);
