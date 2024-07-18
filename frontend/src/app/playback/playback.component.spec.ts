import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybackComponent } from './playback.component';

describe('PlaybackComponent', () => {
  let component: PlaybackComponent;
  let fixture: ComponentFixture<PlaybackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaybackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaybackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
