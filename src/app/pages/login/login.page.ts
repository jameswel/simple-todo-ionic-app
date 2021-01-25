import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm: FormGroup

  constructor(private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private firebaseService: FirebaseService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.firebaseService.signUp(this.credentialForm.value).then(user => {
      loading.dismiss();
      this.navCtrl.navigateForward('/projects', { replaceUrl: true });
    }, async err => {
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Sign up failed',
        message: err.message,
        buttons: ['OK'],
      });

      await alert.present();
    })
  }

  async signIn() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.firebaseService.signIn(this.credentialForm.value).then(res => {
      loading.dismiss();
      this.router.navigateByUrl('/projects', { replaceUrl: true });
    }, async (err) => {
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Login failed',
        message: err.message,
        buttons: ['OK'],
      });

      await alert.present();
    })
  }

  get email() {
    return this.credentialForm.get('email');
  }

  get password() {
    return this.credentialForm.get('password');
  }

}
