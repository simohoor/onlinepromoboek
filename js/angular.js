; (function () {
    // Routing
    var myapp = angular.module('myapp', []).config(function ($routeProvider, $interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
        $routeProvider.when('/home', {
            templateUrl: '/list.html',
            controller: 'ListCtrl'
        }).when('/info', {
            templateUrl: '/info.html'
        }).when('/student/:id/', {
            templateUrl: '/detail.html',
            controller: 'DetailCtrl',
            resolve: {
                load: function ($route, dataService) {
                    return dataService.load($route.current.params.id);
                }
            }
        }).otherwise({
            redirectTo: '/home'
        });

    });

    // List controller display students
    myapp.controller('ListCtrl', function ($scope, $location, dataService) {
        $scope.originalitems = dataService.items;
        $scope.items = dataService.items;
        $scope.showform = false;
        $scope.toggleForm = function () {
            $scope.showform = !$scope.showform;
        };
        // Filtering items voornaam vs achternaam
        $scope.sort = [{
            id: 1,
            name: 'Voornaam',
            classname: 'isActiveFirst'
        }, {
            id: 2,
            name: 'Achternaam',
            classname: 'isActiveLast'

        }];
        // Toggleclasses
        $scope.isActiveFirst = false;
        $scope.isActiveLast = false;
        $scope.isMmp = false;
        $scope.isCmo = false;
        $scope.isGmb = false;
    
        // Functie voor het filteren van array waar voor & achternaam zich in bevinden
        $scope.setSelectedClient = function ($id) {
            var id = $id;
            if (id == 1) {
                $scope.isActiveFirst = !$scope.isActiveFirst;
                var student = $scope.items;
                var data = _.orderBy(student, 'name', 'asc');
                $scope.items = data;


            } else if (id == 2) {
                $scope.isActiveLast = !$scope.isActiveLast;
                var student = $scope.items;
                var data = _.orderBy(student, 'lastname', 'asc');
                $scope.items = data;
            } else {
                return null
            }
        };
        // Filtering op afstudeerrichting
        $scope.setSorting = function ($field_of_study) {
            var field_of_study = $field_of_study;
            if (field_of_study == 'Multimediaproductie') {
                $scope.isMmp = !$scope.isMmp;
                sortWithClasses();

            } if (field_of_study == 'Crossmedia-ontwerp') {
                $scope.isCmo = !$scope.isCmo;
                sortWithClasses();

            } if (field_of_study == 'Grafimediabeleid') {
                $scope.isGmb = !$scope.isGmb;
                sortWithClasses();
            }
        }
        function sortWithClasses() {
            if (!$scope.isMmp && !$scope.isCmo && !$scope.isGmb) {
                $scope.items = $scope.originalitems;
            } else {
                $scope.items = _.filter($scope.originalitems, function (o) {
                    return (($scope.isMmp) ? o.field_of_study == "Multimediaproductie" : false) || (($scope.isCmo) ? o.field_of_study == "Crossmedia-ontwerp" : false) || (($scope.isGmb) ? o.field_of_study == "Grafimediabeleid" : false);
                });
            }
        }
    });

    // Detail controller
    myapp.controller('DetailCtrl', function ($scope, $location, dataService, $anchorScroll) {
        $scope.data = dataService.data;

        $scope.back = function () {
            var id = $scope.data.id;
            $location.hash("student" + id);
            $location.path('/home');
            window.history.back();
            $anchorScroll();
        };
    });

    myapp.factory('dataService', function ($q, $timeout) {

        var studentlist = (function () {
            var json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': "data/students.json",
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            });
            return json;
        })();
        return {
            data: {},
            items: studentlist,
            load: function (id) {
                var defer = $q.defer();
                var data = this.data;
                var items = this.items;

                $timeout(function () {
                    data.id = items[id - 1].id;
                    data.name = items[id - 1].name;
                    data.lastname = items[id - 1].lastname;
                    data.field_of_study = items[id - 1].field_of_study;
                    data.section = items[id - 1].section;
                    data.residence = items[id - 1].residence;
                    data.workplace = items[id - 1].workplace;
                    data.link = items[id - 1].link;
                    data.url = items[id - 1].url;
                    data.tag1 = items[id - 1].tag1;
                    data.tag2 = items[id - 1].tag2;
                    data.tag3 = items[id - 1].tag3;
                    data.mail = items[id - 1].mail;
                    data.studentnr = items[id - 1].studentnr;

                    defer.resolve(data);
                }, 10);
                return defer.promise;
            }
        };
    })
})();