import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniverseView } from './universe-view';

describe('UniverseView', () => {
  let component: UniverseView;
  let fixture: ComponentFixture<UniverseView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniverseView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniverseView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
