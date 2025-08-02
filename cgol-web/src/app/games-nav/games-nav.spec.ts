import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesNav } from './games-nav';

describe('GamesNav', () => {
  let component: GamesNav;
  let fixture: ComponentFixture<GamesNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
