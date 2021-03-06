import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  btnDisabled = false;
  currentSettings: any;

  constructor(private data: DataService, private rest: RestApiService) { }


  async ngOnInit() {
    try {
      if (!this.data.user) {
        await this.data.getProfile();
      }
      this.currentSettings = Object.assign({
        newPwd: '',
        pwdConfirm: ''
      }, this.data.user);
    } catch (error) {
      this.data.error(error);
    }
  }

  validate(settings) {
    if (settings['name']) {
      if (settings['email']) {
        if (settings['newPwd']) {
          if (settings['pwdConfirm']) {
            if (settings['newPwd'] === settings['pwdConfirm']) {
              return true;
            } else {
              this.data.error('Mot de passe non similaire.');
            }
          } else {
            this.data.error('Veuillez entrer un mot de passe de confirmation.');
          }
        } else {
          if (!settings['pwdConfirm']) {
            return true;
          } else {
            this.data.error('Veuillez entrer un nouveau mot de passe.');
          }
        }
      } else {
        this.data.error('Veuillez entrer votre email.');
      }
    } else {
      this.data.error('Veuillez entrer votre nom.');
    }
  }

  async update() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.currentSettings)) {
        const data = await this.rest.post(
          'http://localhost:3030/api/accounts/profile',
          {
            name: this.currentSettings['name'],
            email: this.currentSettings['email'],
            password: this.currentSettings['newPwd'],
            isRestorer: this.currentSettings['isRestorer']
          }
        );

        data['success']
        ? (this.data.getProfile(), this.data.success(data['message']))
        : this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
