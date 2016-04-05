HeyCommunity

// tab.user
.controller('UserIndexCtrl', ['$scope', 'UserService', function($scope, UserService) {
    if ($scope.stateParams.id) {
        $scope.userInfo = {};
        $scope.isOwnInfo = false;

        UserService.userInfo($scope.stateParams.id).then(function(response) {
            if (response.status === 200) {
                $scope.userInfo = response.data;
            }
        });
    } else {
        $scope.isOwnInfo = true;
    }
}])



//
.controller('UserTimelineCtrl', ['$scope', 'TimelineService', function($scope, TimelineService) {
    var params = {
        user_id: $scope.stateParams.user_id,
    }
    TimelineService.index(params).then(function(response) {
        if (response.status == 200) {
            $scope.timelines = response.data.timelines.data;
            $scope.timelineCurrentPage = response.data.timelines.current_page;

            $scope.timelineLikes = response.data.likes;
        }
    });
}])



//
.controller('UserTopicCtrl', ['$scope', 'TopicService', function($scope, TopicService) {
    var params = {
        user_id: $scope.stateParams.user_id,
    }
    TopicService.index(params).then(function(response) {
        if (response.status == 200) {
            $scope.topics = response.data.data;
            $scope.currentPage = response.data.current_page;
        }
    });
}])



// tab.user-signOut
.controller('UserSignOutCtrl', ['$scope', 'UserService', '$ionicHistory', function($scope, UserService, $ionicHistory) {
    UserService.signOut().then(function(response) {
        if (response.status === 200) {
            $ionicHistory.clearCache();
            $scope.state.go('hey.user');
        } else {
            $scope.state.go('hey-user-setup');
        }
    });
}])



// tab.user-signIn
.controller('UserSignInCtrl', ['$scope', 'UserService', '$ionicHistory', function($scope, UserService, $ionicHistory) {
    $scope.user = {};
    if (localStorage.tenantInfo) {
        $scope.tenantInfo = JSON.parse(localStorage.tenantInfo);
    }

    $scope.signIn = function() {
        var params = {
            phone: $scope.user.phone,
            password: $scope.user.password,
        }
        UserService.signIn(params).then(function(response) {
            if (response.status === 200) {
                $ionicHistory.clearCache();
                $scope.$root.userInfo = response.data;

                if ($scope.jumpRoute) {
                    $scope.state.go($scope.jumpRoute);
                } else {
                    $scope.state.go('hey.user');
                }
            } else {
                var content = $scope.filter('translate')('PHONE_OR_PASSWORD_ERROR');
                $scope.showAlert({title: $scope.filter('translate')('ERROR'), content: content});
            }
        });
    }
}])



// tab.user-signUp
.controller('UserSignUpCtrl', ['$scope', 'UserService', '$timeout', function($scope, UserService, $timeout) {
    $scope.user = {};
    $scope.signUpStep = 1;
    $scope.getCaptchaBtnDefaultText = 'GET_CAPTCHA';
    $scope.getCaptchaBtnText = 'GET_CAPTCHA';
    $scope.getCaptchaValid = true;
    if (localStorage.tenantInfo) {
        $scope.tenantInfo = JSON.parse(localStorage.tenantInfo);
    }

    $scope.setVal = function(key, val) {
        $scope[key] = val;
    }

    // get captcha
    $scope.getCaptcha = function() {
        if ($scope.getCaptchaValid) {
            var params = {
                phone: $scope.user.phone,
            }
            UserService.signUpGetCaptcha(params).then(function(response) {
                if (response.status === 200) {
                    $scope.getCaptchaValid = false;
                    getCaptchaTimeout(60);
                } else {
                    var content = typeof response.data === 'string' ? response.data : response.data.phone[0];
                    $scope.showAlert({title: $scope.filter('translate')('ERROR'), content: content});
                }
            });
        }
    }

    var getCaptchaTimeout = function(second) {
        if (second > 0) {
            $scope.getCaptchaBtnText = second + 's';
            $timeout(function() {
                getCaptchaTimeout(second - 1)
            }, 1000);
        } else {
            $scope.getCaptchaBtnText = $scope.getCaptchaBtnDefaultText;
            $scope.getCaptchaValid = true;
        }
    }

    // sign up verify
    $scope.signUpVerifyCaptcha = function() {
        params = {
            phone: $scope.user.phone,
            captcha: $scope.user.captcha,
        }
        UserService.signUpVerifyCaptcha(params).then(function(response) {
            if (response.status === 200) {
                $scope.signUpStep = 2;
            } else {
                var content = typeof response.data === 'string' ? response.data : response.data.phone[0];
                $scope.showAlert({title: $scope.filter('translate')('ERROR'), content: content});
                $scope.user.captcha = '';
            }
        });
    }

    // sign up
    $scope.signUp = function () {
        var params = {
            nickname: $scope.user.nickname,
            phone: $scope.user.phone,
            password: $scope.user.password,
        }
        UserService.signUp(params).then(function(response) {
            if (response.status === 200) {
                $scope.state.go('hey.timeline');
            } else {
                for (item in response.data) {
                    var content = response.data[item][0];
                }
                $scope.showAlert({title: $scope.filter('translate')('ERROR'), content: content});
            }
        });
    }
}])



// tab.user-info
.controller('UserInfoCtrl', ['$scope', 'UserService', function($scope, UserService) {
    if ($scope.stateParams.id != $scope.$root.userInfo.id) {
        $scope.userInfo = {};
        $scope.isOwnInfo = false;

        UserService.userInfo($scope.stateParams.id).then(function(response) {
            if (response.status === 200) {
                $scope.userInfo = response.data;
            }
        });
    } else {
        $scope.isOwnInfo = true;
    }
}])



// tab.user-info-avatar
.controller('UserInfoAvatarCtrl', ['$scope', 'UserService', '$ionicActionSheet', 'Upload', '$ionicHistory', function($scope, UserService, $ionicActionSheet, Upload, $ionicHistory) {
    $scope.userInfo.newAvatar = false;

    //
    $scope.selectAvatar = function() {
        angular.element('form input').click();
    }

    //
    $scope.submitAvatar = function() {
        var params = {
            avatar: $scope.userInfo.newAvatar,
        }

        console.debug('### UserService.updateAvatar params', params);
        UserService.updateAvatar(Upload, params).then(function(response) {
            console.debug('### UserService.updateAvatar response', response);
            if (response.status == 200) {
                $scope.$root.userInfo = response.data;
                localStorage.userInfo = JSON.stringify(response.data);
                $ionicHistory.clearCache();
                $scope.$root.goBack();
            } else {
                $scope.showAlert({title: $scope.filter('translate')('ERROR'), content: response.data});
            }
        });
    }
}])



// tab.user-setup
.controller('UserSetupCtrl', ['$scope', 'UserService', function($scope, UserService) {
}])


// tab.user-setup-general-language
.controller('UserSetupGeneralLanguageCtrl', ['$scope', 'UserService', '$translate', function($scope, UserService, $translate) {
    $scope.language = localStorage.appLanguage;

    $scope.changeLanguage = function(language) {
        localStorage.appLanguage = language;
        $translate.use(language);
    }
}])



//
.controller('UserNoticeCtrl', ['$scope', 'NoticeService', '$ionicActionSheet', '$ionicListDelegate', '$cordovaBadge', function($scope, NoticeService, $ionicActionSheet, $ionicListDelegate, $cordovaBadge) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true

    NoticeService.index().then(function(response) {
        if (response.status === 200) {
            $scope.notices = response.data.data;
            angular.forEach(response.data.data, function(item, $index) {
                var badgeNum = 0;
                if (item.is_checked != 1) {
                    badgeNum += 1;
                }

                $cordovaBadge.hasPermission().then(function(yes) {
                    $cordovaBadge.set(badgeNum).then(function() {
                        $scope.showNoticeText('show badge success');
                    }, function(err) {
                        $scope.showNoticeText('show badge error');
                    });
                }, function(no) {
                    $scope.showNoticeText(no);
                });
            })
        }
    });

    //
    $scope.showActionSheet = function() {
        var hideSheet = $ionicActionSheet.show({
            destructiveText: $scope.filter('translate')('DESTROY_ALL'),
            titleText: $scope.filter('translate')('MANAGEMENT_OPERATIONS'),
            cancelText: $scope.filter('translate')('CANCEL'),
            buttons: [
                {text: $scope.filter('translate')('MARK_CHECKED_ALL')},
            ],
            cancel: function() {
            },
            buttonClicked: function(index) {
                if (index === 0) {
                    angular.forEach($scope.notices, function(item, $index) {
                        if (item.is_checked != 1) {
                            $scope.check(item, $index);
                        }
                    })
                }
            },
            destructiveButtonClicked: function(index) {
                angular.forEach($scope.notices, function(item, $index) {
                    $scope.destroy(item, $index);
                })
            },
        });

        $scope.timeout(function() {
            hideSheet();
        }, 2000);
    };

    //
    $scope.check = function(item, $index) {
        var params = {
            id: item.id,
        }
        NoticeService.check(params).then(function(response) {
            if (response.status === 200) {
                $scope.notices[$index].is_checked = true;
            } else {
                $scope.showNoticeFail();
            }
        })
        $ionicListDelegate.closeOptionButtons();
    }

    //
    $scope.destroy = function(item, $index) {
        var params = {
            id: item.id,
        }
        NoticeService.destroy(params).then(function(response) {
            if (response.status === 200) {
                $scope.notices.splice($index, 1);
            } else {
                $scope.showNoticeFail();
            }
        })
        $ionicListDelegate.closeOptionButtons();
    }
}])
