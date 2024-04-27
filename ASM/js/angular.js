var app = angular.module("myApp", ["ngRoute"]);
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "root/home.html",
      controller: "myctrl",
    })
    .when("/home", {
      templateUrl: "root/home.html",
      controller: "myctrl",
    })
    .when("/about", {
      templateUrl: "root/about.html",
      controller: "myctrl",
    })
    .when("/contact", {
      templateUrl: "root/contact.html",
      controller: "myctrl",
    })
    .when("/feedback", {
      templateUrl: "root/feedback.html",
      controller: "myctrl",
    })
    .when("/Q&A", {
      templateUrl: "root/Q&A.html",
      controller: "myctrl",
    })
    .when("/baithi", {
      templateUrl: "root/baithi.html",
      controller: "myctrl",
    })
    .when("/tracnghiem/:idMH/:tenMH", {
      templateUrl: "root/question.html",
      controller: "quizctrl",
    });
});

app.controller("myctrl", function ($scope, $rootScope, $http, $location) {
  // code trong controller myctrl
  $scope.Subjects = [];
  $http.get("db/Subjects.js").then(
    function (res) {
      $scope.Subjects = res.data;
      console.log(res.data);
    },
    function (res) {
      alert("Lỗi khi request môn học");
      console.log(res);
    }
  );

  $scope.showAlert = function () {
    Swal.fire({
      title: "Xin chào!",
      text: "Vui lòng đăng nhập",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        // Nếu người dùng bấm nút "OK", load lại trang
        location.reload();
      }
    });
  };
});
app.controller(
  "quizctrl",
  function ($scope, $http, $routeParams, $interval, $location) {
    $scope.idMH = $routeParams.idMH;
    $scope.tenMH = $routeParams.tenMH;
    $scope.caccauhoi = [];

    $http.get("db/Quizs/" + $scope.idMH + ".js").then(
      function (res) {
        $scope.caccauhoi = res.data;
        console.log(res.data);
        // Chọn ngẫu nhiên 10 câu hỏi
        var randomQuestions = [];
        var numQuestions = 10; // Số lượng câu hỏi muốn lấy ra
        var totalQuestions = $scope.caccauhoi.length;

        for (var i = 0; i < numQuestions; i++) {
          var randomIndex = Math.floor(Math.random() * totalQuestions);
          randomQuestions.push($scope.caccauhoi.splice(randomIndex, 1)[0]);
          totalQuestions--;
        }
        $scope.caccauhoi = randomQuestions;
      },
      function (res) {
        console.log(res);
      }
    );

    $scope.selectedAnswers = {}; // Đối tượng để lưu trữ đáp án được chọn cho mỗi câu hỏi

    // Hàm để chọn đáp án
    $scope.selectAnswer = function (questionId, answerId) {
      $scope.selectedAnswers[questionId] = answerId;
    };

    // Kiểm tra xem câu hiện tại đã được trả lời chưa
    $scope.isAnswered = function (questionId) {
      return $scope.selectedAnswers.hasOwnProperty(questionId);
    };

    $scope.start = 0;
    $scope.pageSize = 1;

    $scope.next = function () {
      if ($scope.start < $scope.caccauhoi.length - $scope.pageSize) {
        $scope.start += $scope.pageSize;
      }
    };

    $scope.prev = function () {
      if ($scope.start > 0) {
        $scope.start -= $scope.pageSize;
      }
    };

    $scope.first = function () {
      $scope.start = 0;
    };

    $scope.last = function () {
      var sotrang = Math.ceil($scope.caccauhoi.length / $scope.pageSize);
      $scope.start = (sotrang - 1) * $scope.pageSize;
    };

    // Hàm đếm ngược
    $scope.countdown = 900;

    var countdownInterval = $interval(function () {
      if ($scope.countdown > 0) {
        $scope.countdown--;
      } else {
        // Hủy interval khi đếm ngược đạt 0
        $interval.cancel(countdownInterval);
        // Tự động kết thúc bài thi khi thời gian đếm ngược đạt 0
        $location.path("");

        $scope.showAlertdiem();
      }
    }, 1000);

    // Hiển thị thời gian đếm ngược lên button
    $scope.updateTimer = function () {
      var minutes = Math.floor($scope.countdown / 60);
      var seconds = $scope.countdown % 60;
      $scope.timeDisplay =
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");
    };
    // Gọi hàm cập nhật thời gian đếm ngược
    $scope.updateTimer();

    // Lắng nghe sự thay đổi của biến countdown và cập nhật hiển thị
    $scope.$watch("countdown", function () {
      $scope.updateTimer();
    });
    // Đảm bảo hủy interval khi scope bị xóa
    $scope.$on("$destroy", function () {
      $interval.cancel(countdownInterval);
    });

    $scope.diem = 0;
    $scope.kiemtraPA = function (idPA, idPADung, diem) {
      if (idPA === idPADung) {
        $scope.diem += diem;
      }
    };

    $scope.showAlert = function () {
      Swal.fire({
        title: "Thông Báo",
        text: "Bạn có muốn kết thúc bài thi?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đúng, Tôi Muốn Kết Thúc",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            "Kết Thúc!",
            "Bài thi đã kết thúc. Điểm của bạn là: " + $scope.diem,
            "success"
          ).then(() => {
            // Điều hướng người dùng về trang chủ
            $location.path("");
          });
        }
      });
    };
    $scope.showAlertdiem = function () {
      Swal.fire({
        title: "Kết Thúc!",
        text: "Bài thi đã kết thúc. Điểm của bạn là: " + $scope.diem,
        icon: "success",
      }).then((result) => {
        // if (result.isConfirmed) {
        //     // Điều hướng người dùng về trang chủ
        //     $location.path('');
        // }
      });
    };
  }
);
app.controller(
  "thoat",
  function ($scope, $rootScope, $http, $location, $window) {
    $scope.thoat = function () {
      // Xóa giá trị của biến $rootScope.username
      $rootScope.username = "";

      // Xóa giá trị của khóa "username" trong sessionStorage
      sessionStorage.removeItem("username");

      // Chuyển hướng người dùng về trang chính
      window.location.href = "";
    };
  }
);
app.controller(
  "myctrldk",
  function ($scope, $rootScope, $http, $location, $window) {
    // code trong controller myctrldn
    $scope.checkPasswordMatch = function () {
      return $scope.Student.password === $scope.repassword;
    };

    $scope.isFormValid = function () {
      return $scope.frmdk.$valid; // Kiểm tra xem form có hợp lệ không
    };
    //đăng ký
    $scope.Students = [];
    $scope.Students = JSON.parse(localStorage.getItem("students"));
    if ($scope.Students == null) {
      $http.get("db/Students.js").then(
        function (res) {
          $scope.Students = res.data;
          localStorage.setItem("students", JSON.stringify(res.data));
        },
        function (res) {
          alert("Lỗi khi lấy students");
        }
      );
    }
    // // Xóa toàn bộ dữ liệu từ localStorage
    // localStorage.clear();

    // // Hoặc nếu bạn chỉ muốn xóa một phần cụ thể từ localStorage
    // localStorage.removeItem('students');

    console.log("Students", $scope.Students);

    $scope.dangky = function () {
      if ($scope.Student && $scope.Student.username) {
        // Kiểm tra xem tên đăng nhập đã tồn tại trong danh sách sinh viên hay không
        var isUsernameExists = $scope.Students.some(function (student) {
          return student.username === $scope.Student.username;
        });

        if (isUsernameExists) {
          alert("Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.");
        } else {
          $scope.Students.push($scope.Student);
          localStorage.setItem("students", JSON.stringify($scope.Students));
          $scope.showAlertdk();
        }
      } else {
        alert("Vui lòng điền đầy đủ thông tin đăng ký.");
      }
    };

    $scope.showAlertdk = function () {
      Swal.fire({
        title: "Thông Báo",
        text: "Đăng ký thành công! Vui lòng đăng nhập",
        icon: "success",
      }).then((result) => {
        // Chuyển hướng trang
        window.location.href = "";
        // Hiển thị modal đăng nhập sau khi chuyển hướng trang
      });
    };

    //dang nhap
    $scope.isFormValiddn = function () {
      return $scope.frmdn.$valid; // Kiểm tra xem form có hợp lệ không
    };

    $rootScope.username = sessionStorage.getItem("username");
    $scope.dangnhap = function () {
      $rootScope.username = "";
      var u = $scope.u;
      var p = $scope.p;
      if ($scope.Students && $scope.Students.length > 0) {
        var index = $scope.Students.findIndex(function (st) {
          return st.username === u && st.password === p;
        });
        if (index >= 0) {
          $rootScope.username = u;
          sessionStorage.setItem("username", u);
          window.location.href = "";
          // $location.path('');
        } else {
          alert("Đăng nhập không thành công vui lòng kiểm tra lại.");
          //    // Xóa giá trị của biến $rootScope.username
          //    $rootScope.username = "";
          //    // Xóa giá trị của khóa "username" trong sessionStorage
          window.location.href = "";
        }
      } else {
        console.log("Không có dữ liệu sinh viên.");
      }
    };
  }
);
