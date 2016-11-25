/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var sortedCompanyList = [];
var companyList = [];

$(document).ready(function () {

    //viewerRoles.initialize();
    getCompanyList();

    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
        'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
        'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
        'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
        'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    var typeaheadElem = $('#scrollable-dropdown-menu .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 0
    }, {
        name: 'states',
        limit: 10,
        source: substringMatcher(sortedCompanyList)
    }).on('typeahead:selected', function (e, company, companies) {
        //addViewers($(this), role.name);
    }).on('typeahead:autocomplete', function (e, company) {
        //addViewers($(this), role.name);
    });
    var setWidth = $(typeaheadElem).parent().parent().parent().parent().width();
    console.log();
    $(typeaheadElem).width(setWidth - 110);
});

var substringMatcher = function (strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

        matches = [];

        substrRegex = new RegExp(q, 'i');

        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};

var getCompanyList = function () {
    $.ajax({
        url: "/whack/apis/company-summary.jag",
        type: "POST",
        dataType: "json",
        async: false,
        contentType: "application/json",
        data: JSON.stringify({
            "start": 0,
            "length": 1000000
        }),
        success: function (data) {
            debugger;
            for (var i in data) {
                sortedCompanyList.push(data[i].values.AccountName);
            }
        },
        error: function (error) {
        }
    });
};

