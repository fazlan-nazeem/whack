$(function() {
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
    $('#easypiechart-teal').easyPieChart({
        size:60,
        animate: 1000,
        scaleColor: false,
        barColor: '#1ebfae',
        lineWidth:   4

    });
    $('#easypiechart-orange').easyPieChart({
        size:60,
        scaleColor: false,
        barColor: '#ffb53e',
        lineWidth:   4
    });
    $('#easypiechart-red').easyPieChart({
        size:60,
        scaleColor: false,
        barColor: '#f9243f',
        lineWidth:   4
    });

   $('#easypiechart-1').easyPieChart({
       size:60,
       scaleColor: false,
       barColor: '#30a5ff',
       lineWidth:   4
   });
   $('#easypiechart-2').easyPieChart({
      size:60,
      scaleColor: false,
      barColor: '#1ebfae',
      lineWidth:   4
  });
});

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}