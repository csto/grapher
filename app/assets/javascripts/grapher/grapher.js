//= require grapher/d3.v2
//= require grapher/strftime

var Graph = {};

Graph.LineGraph = function(data, labels, options) {
  this.options = options
  this.div = "." + this.options.class;

  this.data = data;
  this.labels = labels;
  this.labelHeight = data.length * 18 + 22;
  this.labelWidth = 160;

  this.colors = d3.scale.category10();

  this.w = $(this.div).parent().width();
  if($(this.div).parent().height() > $(this.div).parent().css('line-height').replace(/[A-Za-z$-]/g, "")){
    this.h = $(this.div).parent().height();
  }else{
    this.h = Math.round($(this.div).width() / 3);
  }
  this.margin = 30;

  this.spark = (this.w < 300 || this.h < 50) ? true : false;

  this.maxY = 0;
  for(var i=0; i<this.data.length; i++){
    d = d3.max(this.data[i], function(d){return d.y;});
    if(d > this.maxY){
      this.maxY = d;
    }
  }

  this.minDate = new Date(this.data[0][0].x)
  this.maxDate = new Date(this.data[0][this.data[0].length-1].x)
  this.timeDiff = (this.maxDate - this.minDate) /1000;

  this.strf = "%I:%M %p";
  this.strfLabel = "%b %d, %I:%M %p"
  if(this.timeDiff > 100000){
    this.strf = "%b %d";
    this.strfLabel = "%b %d, %Y"
  }
  if(this.timeDiff > 10000000){
    this.strf = "%b %Y";
  }

  this.y = d3.scale.linear().domain([0, this.maxY]).range([0, this.h - (this.spark ? 0 : this.margin) -10]);
  this.x = d3.time.scale().domain([this.minDate, this.maxDate]).range([0, this.w]);
  this.realx = d3.scale.linear().domain([0,this.data[0].length]).range([0,this.w]);

  var self = this;

  var svg = d3.selectAll(this.div)
    .append("svg")
    .attr("width", this.w)
    .attr("height", this.h);

  var g = svg.append("svg:g")
      .attr("transform", "translate(0," + (this.h - (this.spark ? 0 : this.margin)) + ")")
      .attr("class", "g");

  if(!self.spark){
    g.selectAll(".bgLine")
      .data(self.y.ticks(self.options.yinterval || 4))
      .enter()
      .append("svg:line")
      .attr("class", "bgLine")
      .attr("y1", function(d) { return -self.y(d); })
      .attr("x1", 0)
      .attr("y2", function(d) { return -self.y(d); })
      .attr("x2", self.w);
  }

  var line = d3.svg.line().interpolate(self.options.interpolate || "linear")
      .x(function(d,i) { return self.x(new Date(d.x)); })
      .y(function(d) { return -self.y(d.y); });

  for(var i=0; i < data.length; i++){
    g.append("svg:path")
      .attr("d", line(data[i]))
      .attr("class", "line-" + i)
      .attr("style", "stroke:" + this.colors(i));
  }

  if(!self.spark){
    var axisGroup = g.append("svg:g")
      .attr("class", "axisGroup");

    axisGroup.append("svg:line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", self.w)
      .attr("y2", 0)
      .attr("class", "axis");

    axisGroup.selectAll(".xLabel")
      .data(self.x.ticks(self.options.xinterval || 3))
      .enter()
      .append("svg:text")
      .attr("class", "xLabel")
      .text(function(d) { return new Date(d).strftime(self.strf) })
      .attr("x", function(d) { return self.x(new Date(d))})
      .attr("y", 18)
      .attr("text-anchor", "middle");

    axisGroup.selectAll(".yLabel")
      .data(self.y.ticks(self.options.yinterval || 4))
      .enter()
      .append("svg:text")
      .attr("class", "yLabel")
      .text(function(d){return (d == 0 ? null : d);})
      .attr("x", 5)
      .attr("y", function(d) { return -self.y(d) })
      .attr("dy", 14)

    axisGroup.selectAll(".xTicks")
      .data(self.x.ticks(self.options.xinterval || 3))
      .enter()
      .append("svg:line")
      .attr("class", "xTicks")
      .attr("x1", function(d) { return self.x(new Date(d)); })
      .attr("y1", 0)
      .attr("x2", function(d) { return self.x(new Date(d)); })
      .attr("y2", 5)

    axisGroup.selectAll(".yTicks")
      .data(self.y.ticks(self.options.yinterval || 4))
      .enter()
      .append("svg:line")
      .attr("class", "yTicks")
      .attr("y1", function(d) { return -self.y(d); })
      .attr("x1", -5)
      .attr("y2", function(d) { return -self.y(d); })
      .attr("x2", 0)

    g.append("rect")
      .attr("x", 0)
      .attr("y", -(this.h - this.margin))
      .attr("height", (this.h - this.margin))
      .attr("width", (this.w - this.margin))
      .attr("opacity", 0);

    var labelGroup = g.append("svg:g")
      .attr("class", "labelGroup")
      .attr("opacity", 0);

    labelGroup.append("rect") //shadow 2
      .attr("class", "shadow")
      .attr("x", 2)
      .attr("y", 2)
      .attr("width", self.labelWidth)
      .attr("height", self.labelHeight)
      .attr("rx", 2)
      .attr("ry", 2);

    labelGroup.append("rect") // shadow 1
      .attr("class", "shadow")
      .attr("x", 1)
      .attr("y", 1)
      .attr("width", self.labelWidth)
      .attr("height", self.labelHeight)
      .attr("rx", 2)
      .attr("ry", 2);

    labelGroup.append("rect")
      .attr("class", "labelBox")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", self.labelWidth)
      .attr("height", self.labelHeight)
      .attr("rx", 2)
      .attr("ry", 2);

    labelGroup.append("text")
      .attr("class", "grapherTime")
      .attr("x", 8)
      .attr("y", 17);

    for(var i=0; i<self.data.length; i++){
      labelGroup.append("rect")
        .attr("class", "grapherLabel-" + i)
        .attr("x", 8)
        .attr("y", (i+1) * 18 + 8)
        .attr("width", 5)
        .attr("height", 5)
        .attr("style", "fill:" + self.colors(i))
      labelGroup.append("text")
        .attr("class", "grapherText-" + i)
        .attr("x", 16)
        .attr("y", (i+1) * 18 + 15);
      g.append("circle")
        .attr("class", "grapherLargeCircle grapherLargeCircle-" + i)
        .attr("r", 5)
        .attr("opacity", 0);
    }

    self.paused = null

    $(self.div).mousemove(function(e){
      if (!self.paused){
        self.xPos = e.pageX - this.offsetLeft;

        for(var i=0; i<self.data[0].length; i++){
          if(self.xPos >= self.x(new Date(data[0][i].x)) - self.realx(1/2) && (self.data[0].length == i+1 || self.xPos < self.x(new Date(data[0][(i+1)].x)) - self.realx(1/2))){

            labelGroup
              .attr("transform", "translate(" + self.dataX(self.x(new Date(data[0][i].x))) + "," + -self.dataY(self.y(self.data[0][i].y)) +")")

            for(var k=0; k<self.data.length; k++){
              d3.selectAll(self.div + " .grapherTime")
                .text(new Date(self.data[k][i].x).strftime(self.strfLabel))
              d3.selectAll(self.div + " .grapherText-" + k)
                .text(self.labels[k] + ": " + self.data[k][i].y)
              d3.selectAll(self.div + " .grapherLargeCircle-" + k)
                .attr("r", 5)
                .attr("cx", self.x(new Date(self.data[k][i].x)))
                .attr("cy", -self.y(self.data[k][i].y))
                .attr("style", "fill:" + self.colors(k));
            }
          }
        }

        self.paused = setTimeout(function(){self.paused=null}, 50);
      }
    });
  }
};


Graph.LineGraph.prototype = {

  dataX: function(x){
    if(x < this.w/3){
      return x +20;
    }else{
      return x -this.labelWidth -20;
    }
  },

  dataY: function(y){
  	if(y > this.h/2){
  		return this.h/2 + (y/15);
  	}else{
  		return this.h/2 - ((y + this.labelHeight)/15);
  	}
  }
}