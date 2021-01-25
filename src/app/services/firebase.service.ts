import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {
  uid: string
  email: string
}

export interface Project {
  uid: string,
  name: string,
  owner: string,
}

export interface Todo {
  content: string,
  date: Date,
  archived: boolean,
  uid: string
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  currentUser: User = null;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.onAuthStateChanged(user => {
      this.currentUser = user;
    })
  }

  async signUp({ email, password }) {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );

    console.log('result: ', credential)
    const uid = credential.user.uid

    return this.afs.doc(
      `users/${uid}`
    ).set({
      uid,
      email: credential.user.email
    })
  }

  signIn({ email, password }) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.afAuth.signOut();
  } 

  addProject(name) {
    return this.afs.collection('projects').add({
      name:name,
      owner: this.currentUser.uid
    }).then(async doc => {
      await this.afs.collection('projects').doc(doc.id).set({uid: doc.id}, {merge: true})
    })
  }

  async getProjects() {
    const currentUser = await this.afAuth.currentUser
    return this.afs.collection("projects", ref => ref.where('owner', '==', currentUser.uid )).valueChanges() as Observable<Project[]>
  }

  async deleteProjects(uid) {
    return await this.afs.collection("projects").doc(uid).delete();
  }

  getTodos(projectId) {
    return this.afs.collection("projects").doc(projectId).collection("todos").valueChanges() as Observable<Todo[]>
  }

  addTodo({content, date, archived}, projectId) { 
    return this.afs.collection(
      `projects/${projectId}/todos`
    ).add({
      content: content,
      date: date,
      archived: false
    }).then(async doc => {
      await this.afs.collection(`projects/${projectId}/todos`).doc(doc.id).set({uid: doc.id}, {merge: true})
    })
  }

  async updateTodo(projectId, todo) {
    return await this.afs.collection(`projects/${projectId}/todos`).doc(todo.uid).update(todo)
  }

  async deleteTodo(projectId, todoId) {
    return await this.afs.collection(`projects/${projectId}/todos`).doc(todoId).delete();
  }

}
