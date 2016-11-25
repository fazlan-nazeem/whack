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
var accountName = "";
$(document).ready(function () {
    var title = $("#company-name-text").text();
    var companyName = $("#account-profile").data("company-name");
    var accountName = $("#account-profile").data("account-name");
    var domain = $("#account-profile").data("account-domain");

    $.ajax({
        dataType: 'jsonp', // no CORS
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            prop: 'revisions',
            rvprop: 'content',
            format: 'json',
            rvsection: '0', // infobox
            rvparse: '', // convert to HTML
            redirects: '', // follow title redirects
            titles: title
        },
        success: function (data) {
            if (data.query) {
                var keys = Object.keys(data.query.pages);
                var content = data.query.pages[keys[0]].revisions[0]['*'];
                var data = $('.infobox', content).get(0);
                viewData(content);
            } else {
                viewData("<div class='alert alert-danger text-center' role='alert'><strong>Oops! </strong>AuntieSocial couldn't find information related to '<b>" + title + "</b>' at the moment...</div>");
            }
        }
    });

});


var viewData = function (data) {
    $("#account-profile").html(data);
    $(".references").remove();
    $(".ambox-Cleanup").remove();
};

var equalheight = function (container) {
    var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = new Array(),
        $el,
        topPosition = 0;
    $(container).each(function () {

        $el = $(this);
        $($el).height('auto')
        topPostion = $el.position().top;

        if (currentRowStart != topPostion) {
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0; // empty the array
            currentRowStart = topPostion;
            currentTallest = $el.height();
            rowDivs.push($el);
        } else {
            rowDivs.push($el);
            currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
        }
        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
    });
};

$(window).load(function () {
    equalheight('.panel-same-height');
});

$(window).resize(function () {
    equalheight('.panel-same-height');
});

var getTheQuarter = function () {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var timeStamp = 0;
    if (currentMonth >= 0 && currentMonth < 3) {
        timeStamp = currentDate.setMonth(currentMonth);
    } else if (currentMonth >= 3 && currentMonth < 6) {
        timeStamp = currentDate.setMonth(currentMonth - 3);
    } else if (currentMonth >= 6 && currentMonth < 9) {
        timeStamp = currentDate.setMonth(currentMonth - 6);
    } else {
        timeStamp = currentDate.setMonth(currentMonth - 9);
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
            "accountName": accountName,
            "before": getTheQuarter(),
            "now": $.now()
        }),
        success: function (data) {
            $("#txtNRL").text("" + 60);
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
            "accountName": accountName,
            "before": getTheQuarter(),
            "now": $.now()
        }),
        success: function (data) {
            $("#txtSQL").text("" + 60);
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
            "accountName": accountName,
            "before": getTheQuarter(),
            "now": $.now()
        }),
        success: function (data) {
            $("#txtBanted").text("" + 60);
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
            "accountName": accountName,
            "before": getTheQuarter(),
            "now": $.now()
        }),
        success: function (data) {
            $("#txtUsers").text("" + 60);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};