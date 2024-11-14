import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminGraficoPage } from './admin-grafico.page';

describe('AdminGraficoPage', () => {
  let component: AdminGraficoPage;
  let fixture: ComponentFixture<AdminGraficoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGraficoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
