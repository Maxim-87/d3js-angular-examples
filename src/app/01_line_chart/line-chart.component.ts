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

    private margin = {top: 20, right: 20, bottom: 30, left: 50};
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
        this.drawAxis(STOCKS);
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
        this.x.domain(d3Array.extent(STOCKS, (d) => d.date )); // add data in scale
        this.y.domain(d3Array.extent(STOCKS, (d) => d.value )); // add data in scale
    }

    private drawAxis(data: any) {

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

        const tooltipGroup = this.svg.append('g').attr('class', 'tooltip');

        tooltipGroup
            .selectAll('.tooltip-item')
            .data(data)
            .enter()
            .append('g')
            .attr('id', (d, i) => `tooltip-${i}`);
    }

    private drawLine(data: any) {
        this.line = d3Shape.line()
            .x( (d: any) => this.x(d.date) )
            .y( (d: any) => this.y(d.value) );

        this.svg.append('path')
            .datum(STOCKS)
            .attr('d', this.line)
            .attr('aria-describedby', (d, i) => `tooltip-${i}`)
            .on('mousemove', (d, i) => {
                const { clientX, clientY } = d3.event;
                d3.select(`#tooltip-${i}`)
                    .attr('transform', `translate(${clientX} ${clientY})`);
            })
            .on('mouseenter', (d, i) => {
                d3.select(`#tooltip-${i}`)
                    .append('text')
                    .text(`${d.value}`);
            })
            .on('focus', function(d, i) {
                d3.select(this)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2);

                const { top, right, bottom, left } = d3.event
                    .target.getBoundingClientRect();
                d3.select(`#tooltip-${i}`)
                    .append('text')
                    .text(`${d.value}`)
                    .attr('transform',
                        `translate(${(left + right) / 2} ${(top + bottom) / 2})`
                    );
            })
            .attr('class', 'line');
}

}
