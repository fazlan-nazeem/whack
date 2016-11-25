$(function() {
    $('#easypiechart-teal').easyPieChart({
        size:60,
        animate: 1000,
        scaleColor: false,
        barColor: '#1ebfae'
    });
    $('#easypiechart-orange').easyPieChart({
        size:60,
        scaleColor: false,
        barColor: '#ffb53e'
    });
    $('#easypiechart-red').easyPieChart({
        size:60,
        scaleColor: false,
        barColor: '#f9243f'
    });
   $('#easypiechart-blue').easyPieChart({
       size:60,
       scaleColor: false,
       barColor: '#30a5ff',
       lineWidth:   4,
       //scaleColor:	'#30a5ff',
       onStep: function(value) {
        //console.log(this.el);
        //var elem = this;
        //$(elem).children('span').text(~~value);
       }
   });
});

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}