import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirebaseService, Project } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {

  projects: Observable<Project[]>;
  constructor(
    public navCtrl: NavController,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertController: AlertController,
  ) { }

  async ngOnInit() {
    this.projects = await this.firebaseService.getProjects();
    this.projects.subscribe(res => console.log(res));
  }

  async deleteProject(project) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: `Möchtest du das Projekt "${project.name}" wirklich löschen ?`,
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ja',
          handler: async () => {
            await this.firebaseService.deleteProjects(project.uid);
          }
        }
      ]
    });

    await alert.present();
   }

  gotoNotesPage(projectId) {
    this.navCtrl.navigateForward(`notes/${projectId}`)
  }

  signOut() {
    this.firebaseService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    })
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Projekt anlegen',
      inputs: [
        {
          name: 'createProject',
          type: 'text',
          placeholder: 'Mein Projekt heißt...'
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Erstellen',
          handler: async (res) => {
            await this.firebaseService.addProject(res.createProject)
          }
        }
      ]
    });

    await alert.present();
  }

}
