import {ComponentFixture, TestBed} from '@angular/core/testing';
import * as d3 from 'd3';
import {BarChartComponent} from './bar-chart.component';
import {STATISTICS} from '../shared';

describe('Test bar-chart', () => {
    let fixture: ComponentFixture<BarChartComponent>;
    let component: BarChartComponent;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            declarations: [BarChartComponent],
            providers: [BarChartComponent, ]
        }).compileComponents();

    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BarChartComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should create the barChart component', () => {
        expect(component).toBeTruthy();
    });

    afterEach(function () {
        // d3.selectAll('svg').remove();
    });

    describe('the initialize svg element', () => {
        it('should be created', () => {
            expect(getSvg()).not.toBeNull();
            expect(getSvg().attr('height')).toBe('500');
            expect(getSvg().attr('width')).toBe('960');
        });

        function getSvg() {
            return d3.select('svg');
        }
    });

    it('should render the correct title', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Bar Chart');
    });

    // it('should render a bar chart', () => {
    //     const bars = fixture.nativeElement.querySelectorAll('.bar');
    //     console.log(STATISTICS.length);
    //     expect(bars.length).toEqual(STATISTICS.length);
    // });

    it('should have correct x-axis labels', () => {
        const xAxisTicks = d3.select('.axis--x').selectAll('.tick').nodes();
        expect(xAxisTicks.length).toEqual(STATISTICS.length);
        for (let i = 0; i < STATISTICS.length; i++) {
            expect(xAxisTicks[i].textContent).toEqual(STATISTICS[i].letter);
        }
    });

    // it('should have correct y-axis labels', () => {
    //     const yAxisLabels = fixture.nativeElement.querySelectorAll('.axis--y');
    //     const maxFrequency = Math.max(...STATISTICS.map((statistic) => statistic.frequency));
    //     console.log(yAxisLabels);
    //     expect(yAxisLabels.length).toBeGreaterThan(1);
    //     expect(yAxisLabels[0].textContent).toEqual('0%');
    //     expect(yAxisLabels[yAxisLabels.length - 1].textContent).toEqual(`${maxFrequency * 100}%`);
    // });

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



