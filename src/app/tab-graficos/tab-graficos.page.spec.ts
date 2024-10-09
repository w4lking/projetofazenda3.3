import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabGraficosPage } from './tab-graficos.page';

describe('TabGraficosPage', () => {
  let component: TabGraficosPage;
  let fixture: ComponentFixture<TabGraficosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabGraficosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
