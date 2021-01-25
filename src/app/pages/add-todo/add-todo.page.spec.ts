import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTodoPage } from './add-todo.page';

describe('AddTodoPage', () => {
  let component: AddTodoPage;
  let fixture: ComponentFixture<AddTodoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTodoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTodoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
