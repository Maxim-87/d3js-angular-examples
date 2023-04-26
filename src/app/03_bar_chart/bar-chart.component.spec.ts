import {ComponentFixture, TestBed} from '@angular/core/testing';
import * as d3 from 'd3';
import {BarChartComponent} from './bar-chart.component';

describe('Test bar-chart', () => {
    let fixture: ComponentFixture<BarChartComponent>;
    let component: BarChartComponent;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
            ],
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

    afterEach(function() {
        d3.selectAll('svg').remove();
    });

    describe('the svg' , () => {
        it('should be created', () => {
            expect(getSvg()).not.toBeNull();
        });

        it('should have the correct height', () => {
            expect(getSvg().attr('height')).toBe('500');
        });

        it('should have the correct width', () => {
            expect(getSvg().attr('width')).toBe('960');
        });
        function getSvg() {
            return d3.select('svg');
        }
    });
});
