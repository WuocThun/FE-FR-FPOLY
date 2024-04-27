var app = angular.module("myApp", []);

app.controller("QuizStar",function($scope, elem, attrs){
$scope.start() = function(){
  $scope.inProgess = true;
}
$scope.reset() = function(){
  $scope.inProgess = false;

}
$scope.reset(); 
})
// });
// app.config(function ($routeProvider) {
//   $routeProvider.when("/home", { templateUrl: "../thi.html" });
// });
