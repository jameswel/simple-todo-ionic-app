import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirebaseService, Todo } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  todos: Observable<Todo[]>;

  constructor(public navCtrl: NavController,private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.todos = this.firebaseService.getTodos(this.activatedRoute.snapshot.paramMap.get('projectId'));
  }
  addTodo(event) {
    this.navCtrl.navigateForward(`add-todo/${this.activatedRoute.snapshot.paramMap.get('projectId')}`)
    event.target.complete()
  }

  backToProjects() {
    this.navCtrl.navigateBack('projects')
  }
  
  async todoChangeState(todo) {
    if(todo.archived === true) {
      todo.archived = false
    } else {
      todo.archived = true
    }
    await this.firebaseService.updateTodo(this.activatedRoute.snapshot.paramMap.get('projectId'), todo)
  }

  todoDelete(todo) {
    this.firebaseService.deleteTodo(this.activatedRoute.snapshot.paramMap.get('projectId'), todo.uid);
  }
}
