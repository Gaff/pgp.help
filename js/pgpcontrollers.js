var pgpApp = angular.module('pgpApp', []);

pgpApp.controller('KeyListCtrl', function ($scope) {
  $scope.keys = [
    {'name': 'New Key...'},
    {'name': 'help@pgp.help', 'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'test1@whoisit.com', 'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'blah@silly.com', 'snippet': 'The Next, Next Generation tablet.'}
  ];
  $scope.selectit = {index: 0, dummy: "foo"};

});



var myKey = [
'-----BEGIN PGP PUBLIC KEY BLOCK-----',
'Version: BCPG C# v1.6.1.0',
'',
'mQENBFWip3EBCADWJcyGfxOTWyW2inpYwqKKwyWGvz+/ypqxt7QSLlqgpUgNLznH',
'5PnuTuO9LO+QGMt2xYr5hxmv75/Xhj1OgpFB3ejh4B5dedFli1MBQ1fASHnqGIAY',
'hf8CHnrRsCpG9xsU4aAVoFyc4c/FbmLq8NlAz8yqHGx5zR2II0p3I9kYnQOywveD',
'zMhSmJiaH1hNbaBDiuzvWGX4Uya2KMZnTb5yhRcOLvgj5R6m1knq/fJVyqmrBoGZ',
'hiQ2UQOz5OmoPciu61pDiYBUjke4enUjJjOOfKsxy/hSanfjsDBLizNkjDJ6GTmt',
'qxg38ZCoTfle+B7OockT9M4exkt1FfDa1rbhABEBAAG0FnBncC5oZWxwQHNoYXls',
'b3IuY28udWuJARwEEAECAAYFAlWip3EACgkQ4cuI9adKJZkkewgAlybUl5vwtKaQ',
'fQnq079DIKp303NtfTp4zZpfk/rbnyewOYeS+GmKj7pbxJGwit9b4u2OLFUQtzjL',
'dcJPb41u5ACy89E8NIGyjlD8betiCnXnS6QT+4K+RZ7wmEKtOVToGQU6i8jy3W47',
'4sBWP6+WGTvbxmTAJlZG/0JlQ9lDXvRYTnFaNbhiYvQfA5uuLkqbmKdC4GR5RbIU',
'hqXWDAt/eIx+nr6tBjJ/zcz2yRiSMNayTSg4qk0Y/+eq6eIC+3sbf5Sv4Na+j1Q0',
'RfPOO22INIz7vY0ycd740lRhDrVoEQilkTWhQT0JtWD0gFQIeFARqqvDjghr/yBX',
'Uq0XqerlKg==',
'=n31g',
'-----END PGP PUBLIC KEY BLOCK-----',
].join('\n');
