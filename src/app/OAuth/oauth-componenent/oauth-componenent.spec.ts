import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthComponenent } from './oauth-componenent';

describe('OauthComponenent', () => {
  let component: OauthComponenent;
  let fixture: ComponentFixture<OauthComponenent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthComponenent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OauthComponenent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
