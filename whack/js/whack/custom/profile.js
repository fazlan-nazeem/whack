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
    accountName = $("#accountName").val();

    //var companyName = $("#account-profile").data("company-name");
    //var accountName = $("#account-profile").data("account-name");
    //var domain = $("#account-profile").data("account-domain");

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

    getProductSpecificActivity();
});

var checkDataExistance = function (data, array) {

    for (var i = 0; i < array.length; i++) {
        if (data == array[i]) {
            return true;
            break;
        }
    }

    return false;
};

var getdataforproduct = function (productName, productArray, product) {
    for (var i = 0; i < productArray.length; i++) {
        if (productName == productArray[i].values.ProductName) {
            product.data.push(productArray[i].values.count);
        }
    }
};

var randomColorGen = function () {
    return Math.floor(Math.random() * 256)
};

var prepareProductSpecificDataSet = function (data) {
    debugger;
    var timeLines = [];
    var products = [];
    var datasets = [];
    for (var i = 0; i < data.length; i++) {
        if (!checkDataExistance(data[i].values.Timestamp, timeLines)) {
            timeLines.push(data[i].values.Timestamp);
        }
    }

    timeLines.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a) - new Date(b);
    });

    for (var i = 0; i < data.length; i++) {
        if (!checkDataExistance(data[i].values.ProductName, products)) {
            products.push(data[i].values.ProductName);
            var r = randomColorGen();
            var g = randomColorGen();
            var b = randomColorGen();
            var product = {
                label: data[i].values.ProductName,
                fillColor: "rgba(" + r + "," + g + "," + b + ",0.2)",
                strokeColor: "rgba(" + r + "," + g + "," + b + ",1)",
                pointColor: "rgba(" + r + "," + g + "," + b + ",1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(" + r + "," + g + "," + b + ",1)",
                data: []
            };

            for (var j = 0; j < timeLines.length; j++) {
                product.data.push(0);
            }

            product.data[timeLines.indexOf(data[i].values.Timestamp)] = data[i].values.count;
            datasets.push(product);
        } else {
            for (var j = 0; j < datasets.length; j++) {
                if (datasets[j].label == data[i].values.ProductName) {
                    datasets[j].data[timeLines.indexOf(data[i].values.Timestamp)] = data[i].values.count;
                    break;
                }
            }
        }
    }

    var lineChartData = {
        labels: timeLines,
        datasets: datasets
    };

    var chart1 = document.getElementById("line-chart").getContext("2d");
    if (datasets.length == 1 && datasets[0].data.length == 1) {
        $("#line").empty();
        $("#js-legend").empty();
        $("#line").append("<p>Not Enough Historical Data Available</p>")
    } else {
        window.myLine = new Chart(chart1).Line(lineChartData, {
            responsive: true
        });
        document.getElementById('js-legend').innerHTML = window.myLine.generateLegend();
    }
};

var viewData = function (data) {
    $("#account-profile").html(data);
    $(".references").remove();
    $(".ambox-Cleanup").remove();
};

var equalheight = function (container) {
    var currentTallest = 500,
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

var getProductSpecificActivity = function () {
    debugger;
    $.ajax({
        url: "/whack/apis/product-activities.jag",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "accountName": accountName,
            "start": 0,
            "length": 1000000
        }),
        success: function (data) {
            prepareProductSpecificDataSet(data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

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