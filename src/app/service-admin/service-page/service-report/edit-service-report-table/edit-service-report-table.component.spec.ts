import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServiceReportTableComponent } from './edit-service-report-table.component';

describe('EditServiceReportTableComponent', () => {
  let component: EditServiceReportTableComponent;
  let fixture: ComponentFixture<EditServiceReportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditServiceReportTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServiceReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
