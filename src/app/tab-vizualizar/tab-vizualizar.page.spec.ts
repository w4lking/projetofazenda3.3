import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabVizualizarPage } from './tab-vizualizar.page';

describe('TabVizualizarPage', () => {
  let component: TabVizualizarPage;
  let fixture: ComponentFixture<TabVizualizarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabVizualizarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
