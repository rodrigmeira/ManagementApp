import { User } from 'src/app/models/user.model';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        await this.firebaseSvc.sendRecoveryEmail(this.form.value.email);

        this.utilsSvc.presentToast({
          message:
            'Se o email estiver registrado, você receberá uma mensagem para recuperação de senha.',
          color: 'primary',
          duration: 1500,
          position: 'bottom',
          icon: 'mail-outline',
        });

        this.utilsSvc.routerLink('/auth');
        this.form.reset();
      } catch (error) {
        console.log(error);

        this.utilsSvc.presentToast({
          message:
            'Erro ao enviar o email. Verifique se o endereço está correto.',
          color: 'danger',
          duration: 2500,
          position: 'bottom',
          icon: 'alert-circle-outline',
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
