import {Component, ViewEncapsulation, OnInit} from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

import {POPULATION} from '../shared';

@Component({
    selector: 'app-pie-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

    title = 'Pie Chart';

    private margin = {top: 20, right: 20, bottom: 30, left: 50};
    private width: number;
    private height: number;
    private radius: number;

    private arc: any;
    private labelArc: any;
    private pie: any;
    private color: any;
    private svg: any;

    constructor() {
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.radius = Math.min(this.width, this.height) / 2;
    }

    ngOnInit() {
        this.initSvg();
        this.drawPie(POPULATION);
    }

    private initSvg() {
        this.color = d3Scale.scaleOrdinal()
            .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);
        this.arc = d3Shape.arc()
            .outerRadius(this.radius - 10)
            .innerRadius(0);
        this.labelArc = d3Shape.arc()
            .outerRadius(this.radius - 40)
            .innerRadius(this.radius - 40);
        this.pie = d3Shape.pie()
            .sort(null)
            .value((d: any) => d.population);
        this.svg = d3.select('svg')
            .append('g')
            .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
    }

    private drawPie(data: any) {
        const keys = Object.getOwnPropertyNames(data[0]).slice(1);

        data = data.map(v => {
            v.total = keys.map(key => v[key]).reduce((a, b) => a + b, 0);
            return v;
        });
        data.sort((a: any, b: any) => b.total - a.total);


        const g = this.svg.selectAll('.arc')
            .data(this.pie(POPULATION))
            .attr('tabindex', 0)
            .on('focus', function (d) {
                d3.select(this)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2);
            })
            .attr('aria-describedby', (d, i) => `tooltip-${i}`)
            .enter().append('g')
            .attr('class', 'arc');
        g.append('path').attr('d', this.arc)
            .style('fill', (d: any) => this.color(d.data.age))
            .attr('tabindex', 0)
            .attr('aria-describedby', (d, i) => `tooltip-${i}`);
        g.append('text').attr('transform', (d: any) => 'translate(' + this.labelArc.centroid(d) + ')')
            .attr('dy', '.35em')
            .text((d: any) => d.data.age);
       // const legend =  g.append('g')
       //     .attr('font-family', 'sans-serif')
       //     .attr('font-size', 10)
       //     .attr('text-anchor', 'end')
       //     .selectAll('g')
       //     .data(keys.slice().reverse())
       //     .enter().append('g')
       //     .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')');
       //
       //  legend.append('rect')
       //      .attr('x', this.width - 19)
       //      .attr('width', 19)
       //      .attr('height', 19);
       //      // .attr('fill', this.z);
       //
       //  legend.append('text')
       //      .attr('x', this.width - 24)
       //      .attr('y', 9.5)
       //      .attr('dy', '0.32em')
       //      .text(d => d);

    }

}
