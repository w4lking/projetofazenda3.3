import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabUnidadesPage } from './tab-unidades.page';

describe('TabUnidadesPage', () => {
  let component: TabUnidadesPage;
  let fixture: ComponentFixture<TabUnidadesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabUnidadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
