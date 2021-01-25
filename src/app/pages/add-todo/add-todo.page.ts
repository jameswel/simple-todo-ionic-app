import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.page.html',
  styleUrls: ['./add-todo.page.scss'],
})
export class AddTodoPage implements OnInit {
  todoForm: FormGroup
  projectId: string

  constructor(
    private fb: FormBuilder,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.projectId = this.activatedRoute.snapshot.paramMap.get('projectId')
    this.todoForm = this.fb.group({
      content: [''],
      date: [''],
      archived: ['']
    });
  }
  async save() {
    const loading = await this.loadingController.create();
    await loading.present();
    if (this.todoForm.value.content.length !== 0) {
      this.firebaseService.addTodo(this.todoForm.value, this.projectId).then(res => {
        loading.dismiss();
        this.todoForm.reset(this.todoForm.value)
        this.navCtrl.navigateForward(`notes/${this.projectId}`, {replaceUrl: true})
      })
    } else {
      loading.dismiss();
      this.navCtrl.navigateForward(`notes/${this.projectId}`, {replaceUrl: true})
    }

  }

  get content() {
    return this.todoForm.get('content');
  }

  get date() {
    return this.todoForm.get('date');
  }

  get archived() {
    return false;
  }
}
