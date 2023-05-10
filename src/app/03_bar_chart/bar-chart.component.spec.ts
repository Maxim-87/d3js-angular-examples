import {ComponentFixture, TestBed} from '@angular/core/testing';
import * as d3 from 'd3';
import {BarChartComponent} from './bar-chart.component';
import {STATISTICS} from '../shared';

let data = null;

const setData = function (d) {
    data = d;
};

const getData = function () {
    return data;
};

describe('Test bar-chart component', () => {
    let fixture: ComponentFixture<BarChartComponent>;
    let component: BarChartComponent;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            declarations: [BarChartComponent],
            providers: [BarChartComponent, ]
        }).compileComponents();

        fixture = TestBed.createComponent(BarChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('should create the barChart component', () => {
        expect(component).toBeTruthy();
    });

    it('should render the correct title', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Bar Chart');
    });

    afterEach(function () {
        d3.selectAll('svg').remove();
    });

    describe('test svg', () => {

        const testData = [
            {letter: 'A', frequency: .08167},
            {letter: 'B', frequency: .01492},
            {letter: 'C', frequency: .02782}
        ];

        it('should be null with no data', function () {
            expect(getData()).toBeNull();
        });

        it('should render the correct length ', function () {
            setData(testData);
            expect(getData().length).toBe(3);
        });

        it('should be able to update the data', function () {
            expect(getData()).toBe(testData);
        });

        it('should be created', () => {
            expect(getSvg()).not.toBeNull();
            expect(getSvg().attr('height')).toBe('500');
            expect(getSvg().attr('width')).toBe('960');
        });

        function getSvg() {
            return d3.select('svg');
        }
    });

    describe('test bar chart', () => {
        it('should render a bar chart', () => {
            const bars = fixture.nativeElement.querySelectorAll('.bar');
            console.log(STATISTICS.length);
            expect(bars.length).toEqual(STATISTICS.length);
        });

        it('should render correct amount of bar charts', () => {
            const bars = fixture.nativeElement.querySelectorAll('rect');
            console.log(STATISTICS.length, bars);
            expect(bars.length).toEqual(STATISTICS.length);
        });

        it('should have correct x-axis labels', () => {
            const xAxisTicks = d3.select('.axis--x').selectAll('.tick').nodes();
            expect(xAxisTicks.length).toEqual(STATISTICS.length);
            for (let i = 0; i < STATISTICS.length; i++) {
                expect(xAxisTicks[i].textContent).toEqual(STATISTICS[i].letter);
            }
        });

        it('should have correct y-axis labels', () => {
            const yAxisLabels = d3.select('.axis--y').selectAll('.tick').nodes();
            expect(yAxisLabels.length).toEqual(13);
            expect(yAxisLabels[0].textContent).toEqual('0%');
            expect(yAxisLabels[yAxisLabels.length - 1].textContent).toEqual('12%');
        });
    });

    describe('test tooltips', () => {
        it('should show tooltip on mouseover', () => {
            const bar = fixture.nativeElement.querySelector('.bar');
            const event = new MouseEvent('mouseover');
            bar.dispatchEvent(event);
            fixture.detectChanges();
            const tooltip = fixture.nativeElement.querySelector('.tooltip');
            expect(tooltip.style.opacity).toEqual('1');
        });

        it('should hide tooltip on mouseout', () => {
            const bar = fixture.nativeElement.querySelector('.bar');
            const event1 = new MouseEvent('mouseover');
            const event2 = new MouseEvent('mouseout');
            bar.dispatchEvent(event1);
            fixture.detectChanges();
            bar.dispatchEvent(event2);
            fixture.detectChanges();
            const tooltip = fixture.nativeElement.querySelector('.tooltip');
            expect(tooltip.style.opacity).toEqual('0');
        });
    });
});



