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
var userActivityCount = 0;
$(document).ready(function () {
    var title = $("#company-name-text").text();
    accountName = $("#accountName").val();

    //var companyName = $("#account-profile").data("company-name");
    //var accountName = $("#account-profile").data("account-name");
    //var domain = $("#account-profile").data("account-domain");

    //getCaseStudyStats();
    getConsStats();
    //getDownloadStats();
    //getWebinarStats();
    //getWhitePapersStats();
    //getWorkshopsStats();

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
    getTopFiveUsers();
    getPrediction();
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

var randomColorGen = function () {
    return Math.floor(Math.random() * 256)
};

var getPrediction = function () {
    $.ajax({
        url: "/whack/apis/prediction.jag",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "accountName": accountName
        }),
        success: function (data) {
            var pie = '<div class="easypiechart" id="easypiechart-bant-probability" data-percent="' + data.responses.Prediction * 100
                + '%" ><span class="percent">' + data.responses.Prediction * 100 + '%</span></div>';

            $("#probability").append(pie);

            $('#easypiechart-bant-probability').easyPieChart({
                size: 120,
                scaleColor: false,
                barColor: '#fff',
                trackColor: '#FF4D4D',
                lineWidth: 5,
                scaleColor: '#f2f2f2'
            });
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var prepareProductSpecificDataSet = function (data) {
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
    equalheight('.panel-bant-prob-same-height');
});

$(window).resize(function () {
    equalheight('.panel-same-height');
    equalheight('.panel-bant-prob-same-height');
});

var getProductSpecificActivity = function () {
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
            preparePieChart(data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var preparePieChart = function (data) {
    var products = [];
    var datasets = [];

    var doughnutData = [
        {
            value: 300,
            color: "#30a5ff",
            highlight: "#62b9fb",
            label: "Blue"
        },
        {
            value: 50,
            color: "#ffb53e",
            highlight: "#fac878",
            label: "Orange"
        },
        {
            value: 100,
            color: "#1ebfae",
            highlight: "#3cdfce",
            label: "Teal"
        },
        {
            value: 120,
            color: "#f9243f",
            highlight: "#f6495f",
            label: "Red"
        }

    ];

    for (var i = 0; i < data.length; i++) {
        if (!checkDataExistance(data[i].values.ProductName, products)) {
            products.push(data[i].values.ProductName);
            var r = randomColorGen();
            var g = randomColorGen();
            var b = randomColorGen();

            var product = {
                value: data[i].values.count,
                color: "rgba(" + r + "," + g + "," + b + ",0.2)",
                highlight: "#62b9fb",
                label: data[i].values.ProductName
            };

            datasets.push(product);
        } else {
            for (var j = 0; j < datasets.length; j++) {
                if (datasets[j].label == data[i].values.ProductName) {
                    datasets[j].value += data[i].values.count;
                    break;
                }
            }
        }
    }

    var chart3 = document.getElementById("doughnut-chart").getContext("2d");
    window.myDoughnut = new Chart(chart3).Doughnut(datasets, {
        responsive: true,
        options: {
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        }
    });
    document.getElementById('js-pie-legend').innerHTML = window.myDoughnut.generateLegend();
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

var getDownloadStats = function () {
    $.ajax({
        url: "",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            $("#txtdownloads").text("" + data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getWebinarStats = function () {
    $.ajax({
        url: "",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            $("#txtwebinars").text("" + data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getCaseStudyStats = function () {
    $.ajax({
        url: "",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            $("#txtcs").text("" + data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getWhitePapersStats = function () {
    $.ajax({
        url: "/whack/apis/user-activity.jag",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            $("#txtwhitep").text("" + data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getWorkshopsStats = function () {
    $.ajax({
        url: $("#dssUrl").val() + "services/whackdb/getActivities?AccountName=" + accountName,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            $("#txtWorkshops").text("" + data);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getConsStats = function () {
    $.ajax({
        url: "/whack/apis/getActivityStats.jag",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
            "accountName": accountName
        }),
        success: function (data) {
            $("#txtCons").text("" + data.response.wso2con);
            $("#txtWorkshops").text("" + data.response.Workshop);
            $("#txtwhitep").text("" + data.response.Whitepaper);
            $("#txtcs").text("" + data.response.Casestudy);
            $("#txtwebinars").text("" + data.response.Webinar);
            $("#txtdownloads").text("" + data.response.Download);

            userActivityCount = parseInt(data.response.wso2con) + parseInt(data.response.Workshop)
                + parseInt(data.response.Whitepaper) + parseInt(data.response.Casestudy) + parseInt(data.response.Webinar) + parseInt(data.response.Download);
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};

var getTopFiveUsers = function () {
    $.ajax({
        url: "/whack/apis/user-activities.jag",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "accountName": accountName
        }),
        success: function (data) {
            if (data.responses) {
                data.responses.response.sort(function (a, b) {
                    return b.ActivityCount - a.ActivityCount;
                });
                if (data.responses.response.length == 0) {
                    $("#custotable").empty();
                    $("#custotable").append("<p>No Data Available</p>");
                } else {
                    for (var i = 0; i < data.responses.response.length; i++) {
                        var tr = '<tr>' +
                            '<td class="t-left">' + data.responses.response[i].Title + '</td>' +
                            '<td class="t-left">' + data.responses.response[i].FirstName + '</td>' +
                            '<td class="t-left">' + data.responses.response[i].Email + '</td>' +
                            '<td><div class="easypiechart" id="easypiechart-' + i + '" data-percent="' + Math.round((data.responses.response[i].ActivityCount / userActivityCount) * 100) + '" ><span class="percent">' + Math.round((data.responses.response[i].ActivityCount / userActivityCount) * 100) + '%</span></div></td>' +
                            '</tr>';
                        $("#contacttbody").append(tr);
                        var r = randomColorGen();
                        var g = randomColorGen();
                        var b = randomColorGen();
                        $('#easypiechart-' + i).easyPieChart({
                            size: 60,
                            scaleColor: false,
                            barColor: "rgb(" + r + "," + g + "," + b + ")",
                            lineWidth: 4
                        });
                    }
                }
            } else {
                $("#custotable").empty();
                $("#custotable").append("<p>No Data Available</p>");
            }
        },
        error: function (error) {
            console.log(error.message);
        }
    });
};