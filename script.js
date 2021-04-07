 const width=800;
  const height=400;

var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var overlay = d3
  .select('.visHolder')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

const svg =d3.select(".visHolder")
.append("svg")
.attr("width",width+100)
.attr("height",height+130);


 svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -300)
      .attr('y', 90)
      .attr('class' , 'info-text')
      .text('Gross Domestic Product');


svg
      .append('text')
      .attr('x', width /3 - 30 )
      .attr('y', height +120)
      
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('class', 'info-text');

const Data=d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
(data)=>{
   
   
  const year=data.data.map(item=>new Date (item[0]));
  const GDP= data.data.map(item=>parseInt(item[1]));
  
    var yearsDate = data.data.map(function (item) {
      var quarter;
      var temp = item[0].substring(5, 7);

      if (temp === '01') {
        quarter = 'Q1';
      } else if (temp === '04') {
        quarter = 'Q2';
      } else if (temp === '07') {
        quarter = 'Q3';
      } else if (temp === '10') {
        quarter = 'Q4';
      }

      return item[0].substring(0, 4) + ' ' + quarter;
    });

 
  
 

  const xScale=d3.scaleTime()
  .domain([d3.min(year),d3.max(year)])
  .range([0,width])
 
  const yScale=d3.scaleLinear()
  .domain([0,d3.max(GDP)])
  .range([height,0]);

  var linearScale = d3.scaleLinear().domain([0, d3.max(GDP)]).range([0, height]);
  
 let scaledGDP=function (item) {
      return linearScale(item);
    };

    
  var xAxis = d3.axisBottom().scale(xScale);

   svg
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60, 480)');
      
  
  var yAxis = d3.axisLeft().scale(yScale);
  
    
     svg
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60,80)');
    
  d3.select("svg")
 
  .selectAll("rect").data(GDP).enter()
  .append('rect')
  .attr("class","bar")
  .attr("x",(d,i)=>xScale(year[i]))
  .attr('y',(d,i)=>yScale(GDP[i]))
  .attr("width",width/275)
  .attr("height",scaledGDP) 

  .attr('data-date',(d,i)=>data.data[i][0].substring(0,11))
  .attr('data-gdp',(d,i)=>data.data[i][1])
  .style('fill', '#33adff')
      .attr('transform', 'translate(60, 80)')
  
  .on('mouseover', function (d, i) {
        overlay
          .transition()
          .duration(0)
          .style('height', d + 'px')
          .style('width',width/275 + 'px')
          .style('opacity', 0.9)
          .style('left', i * width/275 + 0 + 'px')
          .style('top', height - d + 'px')
          .style('transform', 'translate(62px,80px)');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
           yearsDate[i]+
              '<br>' +
              '$' +
              GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
              ' Billion'
          )
          .attr('data-date', data.data[i][0])
          .style('left', i * width/275 + 30 + 'px')
          .style('top', height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })
   .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
        overlay.transition().duration(200).style('opacity', 0);
      });
  })





