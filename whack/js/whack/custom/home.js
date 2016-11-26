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
var selectedText = "";
var url;
$(document).ready(function () {
    url = $("#url").val();

    getNewRawLeadStats();
    getSQLStats();
    getBantStats();
    getNewUserStats();
    getCompanyList();

    var typeaheadElem = $('#scrollable-dropdown-menu .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 0
    }, {
        name: 'states',
        limit: 10,
        source: substringMatcher(sortedCompanyList)
    }).on('typeahead:selected', function (e, company, companies) {
        selectedText = company;
    }).on('typeahead:autocomplete', function (e, company) {
    });

    var setWidth = $(typeaheadElem).parent().parent().parent().parent().width();
    $(typeaheadElem).width(setWidth - 110);

    $(".btn-go").on("click", function (e) {
        var text = selectedText ? selectedText : $("#scrollable-dropdown-menu").find("pre").text();
        window.location = url + "profile/" + text;
    });
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
        success: function (data) {
            data.responses.response.sort(function (a, b) {
                return b.Prediction - a.Prediction;
            });

            for (var i = 0; i < data.responses.response.length; i++) {
                sortedCompanyList.push(data.responses.response[i].AccountName);
            }
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getTheQuarter = function () {
    debugger;
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var timeStamp = 0;
    var setTime = 0;
    if (currentMonth >= 0 && currentMonth < 3) {
        setTime = currentMonth - 0;
        timeStamp = currentDate.setMonth(currentMonth - setTime);
    } else if (currentMonth >= 3 && currentMonth < 6) {
        setTime = currentMonth - 3;
        timeStamp = currentDate.setMonth(currentMonth - setTime);
    } else if (currentMonth >= 6 && currentMonth < 9) {
        setTime = currentMonth - 6;
        timeStamp = currentDate.setMonth(currentMonth - setTime);
    } else {
        setTime = currentMonth - 9;
        timeStamp = currentDate.setMonth(currentMonth - setTime);
    }
    return timeStamp;
};

var getNewRawLeadStats = function () {
    $.ajax({
        url: "/whack/apis/new-raw-leads.jag",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "before": getTheQuarter(),
            "now": new Date()
        }),
        success: function (data) {
            $("#txtNRL").text(data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getSQLStats = function () {
    $.ajax({
        url: "/whack/apis/sql.jag",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "before": getTheQuarter(),
            "now": $.now()
        }),
        success: function (data) {
            $("#txtSQL").text(data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getBantStats = function () {
    $.ajax({
        url: "/whack/apis/bant.jag",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "before": getTheQuarter(),
            "now": $.now()
        }),
        success: function (data) {
            $("#txtBanted").text("" + data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getNewUserStats = function () {
    $.ajax({
        url: "/whack/apis/user-activity.jag",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "before": getTheQuarter(),
            "now": $.now()
        }),
        success: function (data) {
            $("#txtUsers").text(data.response.count);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};
