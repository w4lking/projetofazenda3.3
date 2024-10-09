import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabFazendasPage } from './tab-fazendas.page';

describe('TabFazendasPage', () => {
  let component: TabFazendasPage;
  let fixture: ComponentFixture<TabFazendasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabFazendasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
