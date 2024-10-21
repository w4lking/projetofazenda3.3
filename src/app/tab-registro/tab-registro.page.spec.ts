import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabRegistroPage } from './tab-registro.page';

describe('TabRegistroPage', () => {
  let component: TabRegistroPage;
  let fixture: ComponentFixture<TabRegistroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabRegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
