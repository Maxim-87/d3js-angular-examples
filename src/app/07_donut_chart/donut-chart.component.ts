import {Component, ViewEncapsulation, OnInit} from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

import {POPULATION} from '../shared';

@Component({
    selector: 'app-donut-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './donut-chart.component.html',
    styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {

    title = 'Donut Chart';

    private width: number;
    private height: number;

    private svg: any;     // TODO replace all `any` by the right type

    private radius: number;

    private arc: any;
    private pie: any;
    private color: any;

    private g: any;

    constructor() {
    }

    ngOnInit() {
        this.initSvg();
        this.drawChart(POPULATION);
    }

    private initSvg() {
        this.svg = d3.select('svg');

        this.width = +this.svg.attr('width');
        this.height = +this.svg.attr('height');
        this.radius = Math.min(this.width, this.height) / 2;

        this.color = d3Scale.scaleOrdinal()
            .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

        this.arc = d3Shape.arc()
            .outerRadius(this.radius - 10)
            .innerRadius(this.radius - 70);

        this.pie = d3Shape.pie()
            .sort(null)
            .value((d: any) => d.population); // order

        this.svg = d3.select('svg')
            .append('g')
            .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
    }

    private drawChart(data: any[]) {

        const g = this.svg.selectAll('.arc')
            .data(this.pie(data))
            .enter().append('g')
            .attr('aria-label', (d, i) => `age-${d.data.age}`)
            .attr('class', 'g');
        g.append('path')
            .attr('d', this.arc)
            .attr('tabindex', 0)
            .style('fill', d => this.color(d.data.age))
            .on('focus', function (d, i) {
                d3.select(this)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 3);

                const {top, right, bottom, left} = d3.event
                    .target.getBoundingClientRect();
                d3.select(`#tooltip-${d}`);
                g.append('text')
                    .text(`${d.data.age} - $${d.data.population}`)
                    .attr('transform',
                        `translate(${(left + right) / 2} ${(top + bottom) / 2})`
                    );
            })
            // .on('mousemove', (d, i) => {
            //     const {clientX, clientY} = d3.event;
            //     d3.select(`#tooltip-${i}`)
            //         .attr('transform', `translate(${clientX} ${clientY})`);
            // })
            // .on('mouseenter', (d, i) => {
            //     d3.select(`#tooltip-${i}`);
            //     g.append('text')
            //         .attr('transform', d => 'translate(' + this.arc.centroid(d) + ')')
            //         .text(`${d.data.age} - $${d.data.population}`);
            // })
            // .on('mouseleave', (d, i) => {
            //     d3.select(`#tooltip-${i} text`).remove();
            // })
            .on('blur', function (d, i) {
                d3.select(this).attr('stroke', null); // delete border after move
                d3.select(`#tooltip-${i} text`).remove();
            });
        g.append('text')
            .attr('transform', d => 'translate(' + this.arc.centroid(d) + ')')
            .attr('dy', '.35em')
            .text(d => d.data.age);

        // const tooltipGroup = this.svg.append('g').attr('class', 'tooltip');
        //
        // tooltipGroup
        //     .selectAll('.tooltip-item')
        //     .data(data)
        //     .enter()
        //     .append('g')
        //     .attr('id', (d, i) => `tooltip-${i}`);
    }
}
