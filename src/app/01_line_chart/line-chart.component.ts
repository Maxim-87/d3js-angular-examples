import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { STOCKS } from '../shared';

@Component({
    selector: 'app-line-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

    title = 'Line Chart';

    private margin = { top: 20, right: 20, bottom: 30, left: 50 };
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    private svg: any;
    private line: d3Shape.Line<[number, number]>;

    constructor() {
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
    }

    ngOnInit() {
        this.initSvg();
        this.initAxis();
        this.drawAxis();
        this.drawLine(STOCKS);
    }

    private initSvg() {
        this.svg = d3.select('svg')
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    private initAxis() {
        this.x = d3Scale.scaleTime().range([0, this.width]); // create timer scale
        this.y = d3Scale.scaleLinear().range([this.height, 0]); // create numbers scale
        this.x.domain(d3Array.extent(STOCKS, (d) => d.date)); // add data in scale
        this.y.domain(d3Array.extent(STOCKS, (d) => d.value)); // add data in scale
    } // initialize axis

    private drawAxis() {
        this.svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3Axis.axisBottom(this.x));

        this.svg.append('g')
            .attr('class', 'axis axis--y')
            .call(d3Axis.axisLeft(this.y))
            .append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Price ($)');
    } // draw axis

    private drawLine(data: any) {
        this.line = d3Shape.line()
            .x((d: any) => this.x(d.date))
            .y((d: any) => this.y(d.value));
        const tooltip = d3.select('#lineChart').append('div').attr('class', 'tooltip').style('opacity', '0');

        this.svg.selectAll('.dot')
            .data(STOCKS)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 3.5)
            .attr('cx', (d: any) => this.x(d.date))
            .attr('cy', (d: any) => this.y(d.value))
            .attr('tabindex', 0)
            .attr('role', 'graphics-symbol')
            .attr('aria-label', (d: any) => d.value)
            .on('mouseover focus', function (d: any) {
                tooltip.style('opacity', 1)
                    .html('Date: ' + d.date + ' Value: ' + d.value)
                    .style('left', (d3.event.pageX - 25) + 'px')
                    .style('top', (d3.event.pageY - 75) + 'px');
            })
            .on('mouseout blur', function (d: any) {
                tooltip.style('opacity', 0);
            });

        this.svg.append('path')
            .datum(STOCKS)
            .attr('d', this.line)
            .attr('class', 'line');
    }
}
